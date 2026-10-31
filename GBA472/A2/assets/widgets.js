/* Interactive parts of the module on describing data, crosstabs and OLS.
 * Each widget is registered in window.Widgets and built the first time its slide is shown:
 *   <div class="widget" data-widget="histo"></div>
 * Charts are plain SVG (no library); colours come from CSS classes in player.css, so they follow
 * light/dark mode. Data: window.A2 from assets/a2data.js (written by code/A2_examples.py).
 * The helpers (Plot, histogram, seg, button, frame) are the ones of the first module's widgets.js.
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const NS = "http://www.w3.org/2000/svg";

  /* ---------------- small helpers ---------------- */
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function h(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "–");
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1)); };
  const median = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  function cov(xs, ys) { const mx = mean(xs), my = mean(ys); let s = 0; for (let i = 0; i < xs.length; i++) s += (xs[i] - mx) * (ys[i] - my); return s / (xs.length - 1); }
  const corr = (xs, ys) => cov(xs, ys) / (sd(xs) * sd(ys));
  function ols(xs, ys) {
    const b = cov(xs, ys) / (sd(xs) ** 2), a = mean(ys) - b * mean(xs);
    let ssr = 0; for (let i = 0; i < xs.length; i++) ssr += (ys[i] - a - b * xs[i]) ** 2;
    return { a, b, ssr, mx: mean(xs), my: mean(ys) };
  }

  // seeded generator (mulberry32) so fixed pictures look the same for every student
  function rng(seed) {
    let a = seed >>> 0;
    const u = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    let spare = null;
    const norm = () => {
      if (spare !== null) { const s = spare; spare = null; return s; }
      let x, y, r;
      do { x = 2 * u() - 1; y = 2 * u() - 1; r = x * x + y * y; } while (r >= 1 || r === 0);
      const f = Math.sqrt((-2 * Math.log(r)) / r);
      spare = y * f;
      return x * f;
    };
    return { u, norm, int: (n) => Math.floor(u() * n) };
  }
  const R = rng((Date.now() ^ (Math.random() * 1e9)) >>> 0);

  function niceTicks(lo, hi, n) {
    const span = hi - lo, raw = span / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= (n || 5) + 0.5) || 10 * mag;
    const out = [];
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }

  /* An SVG chart with linear scales and layered groups. */
  class Plot {
    constructor(host, o) {
      this.o = Object.assign({ w: 480, h: 290, m: { t: 16, r: 16, b: 44, l: 60 }, x: [0, 1], y: [0, 1] }, o);
      const { w, h: H } = this.o;
      this.svg = el("svg", { viewBox: `0 0 ${w} ${H}`, class: "plot", role: "img", "aria-label": o.label || "chart" }, host);
      this.g = {};
      ["grid", "back", "main", "front", "axis", "top"].forEach((k) => (this.g[k] = el("g", { class: k }, this.svg)));
      this.setX(...this.o.x);
      this.setY(...this.o.y);
    }
    get iw() { return this.o.w - this.o.m.l - this.o.m.r; }
    get ih() { return this.o.h - this.o.m.t - this.o.m.b; }
    setX(lo, hi) { this.x0 = lo; this.x1 = hi; }
    setY(lo, hi) { this.y0 = lo; this.y1 = hi; }
    sx(v) { return this.o.m.l + ((v - this.x0) / (this.x1 - this.x0)) * this.iw; }
    sy(v) { return this.o.m.t + this.ih - ((v - this.y0) / (this.y1 - this.y0)) * this.ih; }
    clear(k) { const g = this.g[k]; while (g.firstChild) g.removeChild(g.firstChild); return g; }
    axes(o) {
      o = Object.assign({ xt: null, yt: null, xf: (v) => v, yf: (v) => v, grid: true, xlab: "", ylab: "", noY: false }, o);
      const ax = this.clear("axis"), gr = this.clear("grid"), m = this.o.m;
      const xb = m.t + this.ih;
      el("line", { x1: m.l, x2: m.l + this.iw, y1: xb, y2: xb }, ax);
      (o.xt || niceTicks(this.x0, this.x1, 6)).forEach((v) => {
        const x = this.sx(v);
        el("line", { x1: x, x2: x, y1: xb, y2: xb + 5 }, ax);
        el("text", { x, y: xb + 18, "text-anchor": "middle" }, ax).textContent = o.xf(v);
      });
      if (o.xlab) el("text", { x: m.l + this.iw / 2, y: this.o.h - 4, "text-anchor": "middle", class: "lbl" }, ax).textContent = o.xlab;
      if (!o.noY) {
        el("line", { x1: m.l, x2: m.l, y1: m.t, y2: xb }, ax);
        (o.yt || niceTicks(this.y0, this.y1, 5)).forEach((v) => {
          const y = this.sy(v);
          el("line", { x1: m.l - 5, x2: m.l, y1: y, y2: y }, ax);
          el("text", { x: m.l - 8, y: y + 4, "text-anchor": "end" }, ax).textContent = o.yf(v);
          if (o.grid) el("line", { x1: m.l, x2: m.l + this.iw, y1: y, y2: y }, gr);
        });
        if (o.ylab) el("text", { x: 14, y: m.t + this.ih / 2, "text-anchor": "middle", class: "lbl", transform: `rotate(-90 14 ${m.t + this.ih / 2})` }, ax).textContent = o.ylab;
      }
    }
    line(x1, y1, x2, y2, cls, layer) { return el("line", { x1: this.sx(x1), y1: this.sy(y1), x2: this.sx(x2), y2: this.sy(y2), class: cls }, this.g[layer || "main"]); }
    vline(x, cls, label, layer, dy) {
      const g = this.g[layer || "front"], X = this.sx(x);
      el("line", { x1: X, x2: X, y1: this.o.m.t, y2: this.o.m.t + this.ih, class: cls }, g);
      if (label) {
        const right = X < this.o.m.l + this.iw * 0.7;
        el("text", { x: X + (right ? 5 : -5), y: this.o.m.t + 12 + (dy || 0), "text-anchor": right ? "start" : "end", class: cls === "est" ? "est-label" : "truth-label" }, g).textContent = label;
      }
    }
    path(pts, cls, layer) {
      const d = pts.filter((p) => Number.isFinite(p[1])).map((p, k) => `${k ? "L" : "M"}${this.sx(p[0]).toFixed(1)},${this.sy(p[1]).toFixed(1)}`).join("");
      return el("path", { d, class: cls }, this.g[layer || "main"]);
    }
    bars(edges, heights, cls, layer) {
      const g = this.g[layer || "main"];
      heights.forEach((v, k) => {
        if (!v) return;
        const x = this.sx(edges[k]), x2 = this.sx(edges[k + 1]), y = this.sy(Math.min(v, this.y1));
        el("rect", { x: x + 0.5, y, width: Math.max(0.5, x2 - x - 1), height: Math.max(0, this.sy(this.y0) - y), class: cls }, g);
      });
    }
    dot(x, y, r, cls, layer) { return el("circle", { cx: this.sx(x), cy: this.sy(y), r, class: cls }, this.g[layer || "main"]); }
    text(x, y, s, attrs, layer) { const t = el("text", Object.assign({ x: this.sx(x), y: this.sy(y) }, attrs || {}), this.g[layer || "top"]); t.textContent = s; return t; }
  }
  function histogram(values, lo, hi, nb) {
    const w = (hi - lo) / nb, c = new Array(nb).fill(0);
    values.forEach((v) => { let k = Math.floor((v - lo) / w); if (k >= nb) k = nb - 1; if (k >= 0) c[k]++; });
    return { edges: Array.from({ length: nb + 1 }, (_, k) => lo + k * w), counts: c, w };
  }
  function seg(options, value, onChange) {
    const box = h(`<span class="seg"></span>`);
    options.forEach(([v, label]) => {
      const b = h(`<button type="button">${label}</button>`);
      if (v === value) b.classList.add("on");
      b.addEventListener("click", () => { box.querySelectorAll("button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); onChange(v); });
      box.appendChild(b);
    });
    return box;
  }
  function button(label, cls, onClick) { const b = h(`<button type="button" class="btn small ${cls || ""}">${label}</button>`); b.addEventListener("click", onClick); return b; }
  function frame(root, titles) {
    const charts = h(`<div class="charts${titles.length === 1 ? " one" : ""}"></div>`);
    const hosts = titles.map((t) => { const d = h(`<div><div class="chart-title">${t}</div></div>`); charts.appendChild(d); return d; });
    return { charts, hosts };
  }
  const D = () => (window.A2 && window.A2.diamonds) || [];
  const money = (v) => "$" + fmt(v, 0);

  /* ============ 1. Histogram with the summary statistics ============ */
  W.histo = function (root) {
    const d = D();
    const vars = {
      price: { vals: d.map((r) => r[1]), lo: 1500, hi: 8000, lab: "Price ($)", f: (v) => money(v), d: 0 },
      carats: { vals: d.map((r) => r[0]), lo: 0.7, hi: 1.3, lab: "Carats", f: (v) => fmt(v, 2), d: 3 },
    };
    let v = "price", nb = 13, lines = true;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Variable:</span>`), seg([["price", "price"], ["carats", "carats"]], v, (x) => { v = x; draw(); }));
    const sl = h(`<label>Bins <input type="range" min="4" max="40" step="1" value="${nb}"><output>${nb}</output></label>`);
    sl.querySelector("input").addEventListener("input", (e) => { nb = +e.target.value; sl.querySelector("output").textContent = nb; draw(); });
    const cb = h(`<label><input type="checkbox" checked> Show the mean and the median</label>`);
    cb.querySelector("input").addEventListener("change", (e) => { lines = e.target.checked; draw(); });
    ctr.append(sl, cb);
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["380 diamonds"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 300, x: [0, 1], y: [0, 1] });
    function draw() {
      const V = vars[v], hs = histogram(V.vals, V.lo, V.hi, nb);
      P.setX(V.lo, V.hi); P.setY(0, Math.max(...hs.counts) * 1.12);
      P.axes({ xlab: V.lab, ylab: "Number of diamonds", xf: V.f, yf: (x) => fmt(x, 0) });
      P.clear("main"); P.clear("front");
      P.bars(hs.edges, hs.counts, "bar-sample");
      const m = mean(V.vals), md = median(V.vals), s = sd(V.vals);
      if (lines) { P.vline(m, "est", "mean " + V.f(m), "front"); P.vline(md, "truth", "median " + V.f(md), "front", 18); }
      ro.innerHTML = `<span>n = <b>${V.vals.length}</b></span><span>mean <b>${V.f(m)}</b></span><span>median <b>${V.f(md)}</b></span>` +
        `<span>standard deviation <b>${v === "price" ? money(s) : fmt(s, 3)}</b></span><span>min <b>${V.f(Math.min(...V.vals))}</b></span><span>max <b>${V.f(Math.max(...V.vals))}</b></span>`;
    }
    draw();
  };

  /* ============ 2. Scatter plot, correlation and the fitted line ============ */
  W.scatter = function (root) {
    const d = D(), xs = d.map((r) => r[0]), ys = d.map((r) => r[1]), fit = ols(xs, ys), r = corr(xs, ys);
    let showLine = false, showMeans = false;
    const ctr = h(`<div class="controls"></div>`);
    const c1 = h(`<label><input type="checkbox"> Show the point of means (X̄, Ȳ)</label>`);
    c1.querySelector("input").addEventListener("change", (e) => { showMeans = e.target.checked; draw(); });
    const c2 = h(`<label><input type="checkbox"> Show the least-squares line</label>`);
    c2.querySelector("input").addEventListener("change", (e) => { showLine = e.target.checked; draw(); });
    ctr.append(c1, c2);
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Price vs. carats, 380 diamonds"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 330, x: [0.65, 1.35], y: [1000, 8000] });
    function draw() {
      P.axes({ xlab: "Carats", ylab: "Price ($)", xf: (v) => fmt(v, 1), yf: (v) => fmt(v, 0) });
      P.clear("main"); P.clear("front"); P.clear("top");
      d.forEach((p) => P.dot(p[0], p[1], 3.2, "dot-sample"));
      if (showMeans) {
        P.line(fit.mx, 1000, fit.mx, 8000, "truth", "front"); P.line(0.65, fit.my, 1.35, fit.my, "truth", "front");
        P.dot(fit.mx, fit.my, 6, "handle", "top");
        P.text(fit.mx + 0.012, 7600, `X̄ = ${fmt(fit.mx, 3)}`, { class: "lbl halo" });
        P.text(0.66, fit.my + 180, `Ȳ = ${money(fit.my)}`, { class: "lbl halo" });
      }
      if (showLine) {
        P.line(0.65, fit.a + fit.b * 0.65, 1.35, fit.a + fit.b * 1.35, "est", "front");
        P.text(0.67, 7200, `price = ${fmt(fit.a, 0)} + ${fmt(fit.b, 0)} × carats`, { class: "est-label" });
      }
      ro.innerHTML = `<span>correlation r = <b>${fmt(r, 3)}</b></span><span>covariance = <b>${fmt(cov(xs, ys), 2)}</b></span>` +
        `<span>SD of carats <b>${fmt(sd(xs), 3)}</b>, SD of price <b>${money(sd(ys))}</b></span>` +
        (showLine ? `<span>slope = cov / var(carats) = ${fmt(cov(xs, ys), 2)} / ${fmt(sd(xs) ** 2, 5)} = <b>${fmt(fit.b, 1)}</b></span>` : "");
    }
    draw();
  };

  /* ============ 3. Guess the correlation ============ */
  W.guessCorr = function (root) {
    let truth = 0, guess = 0, revealed = false, rounds = 0, totalErr = 0, pts = [];
    const ctr = h(`<div class="controls"></div>`);
    const sl = h(`<label>Your guess for r: <input type="range" min="-1" max="1" step="0.05" value="0"><output>0.00</output></label>`);
    sl.querySelector("input").addEventListener("input", (e) => { guess = +e.target.value; sl.querySelector("output").textContent = fmt(guess, 2); });
    const reveal = button("Reveal", "primary", () => { if (!revealed) { revealed = true; rounds++; totalErr += Math.abs(guess - truth); draw(); } });
    const nxt = button("New cloud", "", () => newCloud());
    ctr.append(sl, reveal, nxt);
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["60 points: how strong is the linear association?"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 560, h: 320, x: [-3.2, 3.2], y: [-3.2, 3.2] });
    function newCloud() {
      const choices = [-0.95, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 0.9, 0.98];
      truth = choices[R.int(choices.length)];
      pts = Array.from({ length: 60 }, () => { const x = R.norm(), e = R.norm(); return [x, truth * x + Math.sqrt(1 - truth * truth) * e]; });
      revealed = false; guess = 0; sl.querySelector("input").value = 0; sl.querySelector("output").textContent = "0.00";
      draw();
    }
    function draw() {
      P.axes({ xlab: "X", ylab: "Y", xt: [-3, -2, -1, 0, 1, 2, 3], yt: [-3, -2, -1, 0, 1, 2, 3], xf: (v) => v, yf: (v) => v });
      P.clear("main"); P.clear("front"); P.clear("top");
      pts.forEach((p) => P.dot(p[0], p[1], 4, "dot-sample"));
      if (revealed) {
        const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), f = ols(xs, ys), rr = corr(xs, ys);
        P.line(-3.2, f.a - 3.2 * f.b, 3.2, f.a + 3.2 * f.b, "est", "front");
        ro.innerHTML = `<span>The correlation in these 60 points is <b>r = ${fmt(rr, 2)}</b> (drawn from a population with r = ${fmt(truth, 2)})</span>` +
          `<span>Your guess: <b>${fmt(guess, 2)}</b>, off by ${fmt(Math.abs(guess - rr), 2)}</span><span>Average miss over ${rounds} round${rounds > 1 ? "s" : ""}: <b>${fmt(totalErr / rounds, 2)}</b></span>`;
      } else {
        ro.innerHTML = `<span>Move the slider to your guess, then press Reveal. The sign is the direction; the size is how tightly the points hug a line.</span>`;
      }
    }
    newCloud();
  };

  /* ============ 4. Crosstab builder (Titanic) ============ */
  W.crosstab = function (root) {
    const cells = (window.A2 && window.A2.titanic) || [];          // [class, age, gender, survived, n]
    const VARS = { none: "(none)", class: "class", gender: "gender", age: "age" };
    const ORDER = { class: ["first class", "second class", "third class", "crew"], gender: ["female", "male"], age: ["adult", "young"] };
    const IDX = { class: 0, age: 1, gender: 2 };
    let rows = "class", cols = "gender", stat = "count";
    const ctr = h(`<div class="controls"></div>`);
    const mk = (label, cur, onc) => { const s = h(`<label>${label} <select></select></label>`); const sel = s.querySelector("select");
      for (const k in VARS) { const o = h(`<option value="${k}">${VARS[k]}</option>`); if (k === cur) o.selected = true; sel.appendChild(o); }
      sel.addEventListener("change", (e) => onc(e.target.value)); return s; };
    ctr.append(mk("Rows:", rows, (v) => { rows = v; draw(); }), mk("Columns:", cols, (v) => { cols = v; draw(); }),
      h(`<span>Show:</span>`), seg([["count", "number of people"], ["rate", "survival rate"], ["rowpct", "% of the row"]], stat, (v) => { stat = v; draw(); }));
    const out = h(`<div class="xtab"></div>`);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, out, ro);
    function draw() {
      const rk = rows === "none" ? ["All"] : ORDER[rows], ck = cols === "none" ? ["All"] : ORDER[cols];
      const key = (c, v) => (v === "none" ? "All" : c[IDX[v]]);
      const agg = {};
      const add = (r, c, n, s) => { const k = r + "|" + c; agg[k] = agg[k] || { n: 0, s: 0 }; agg[k].n += n; agg[k].s += s; };
      cells.forEach((c) => {
        const n = c[4], s = c[3] * c[4], r = key(c, rows), k = key(c, cols);
        add(r, k, n, s); add(r, "Total", n, s); add("Total", k, n, s); add("Total", "Total", n, s);
      });
      const show = (a, rowTotal) => {
        if (!a || !a.n) return "–";
        if (stat === "count") return fmt(a.n, 0);
        if (stat === "rate") return fmt(100 * a.s / a.n, 0) + "%";
        return fmt(100 * a.n / rowTotal.n, 0) + "%";
      };
      const head = stat === "count" ? "Number of people" : stat === "rate" ? "Share who survived" : "Share of the row";
      let html = `<table class="t"><tr><th class="l">${rows === "none" ? "" : VARS[rows]}${cols !== "none" ? ` \\ ${VARS[cols]}` : ""}</th>` +
        ck.map((c) => `<th>${c}</th>`).join("") + (cols === "none" ? "" : "<th>Total</th>") + "</tr>";
      const rlist = rows === "none" ? ["All"] : rk.concat(["Total"]);
      rlist.forEach((r) => {
        const rt = agg[(r === "All" ? "All" : r) + "|Total"] || agg["All|All"];
        html += `<tr${r === "Total" ? ' class="tot"' : ""}><td class="l">${r}</td>` +
          ck.map((c) => `<td>${show(agg[r + "|" + c], rt)}</td>`).join("") + (cols === "none" ? "" : `<td>${show(agg[r + "|Total"], rt)}</td>`) + "</tr>";
      });
      html += "</table>";
      out.innerHTML = `<div class="chart-title">${head}</div>` + html;
      const tot = agg["Total|Total"];
      ro.innerHTML = `<span>${fmt(tot.n, 0)} people on board, <b>${fmt(100 * tot.s / tot.n, 0)}%</b> survived.</span>` +
        (stat === "rate" ? `<span>Each cell is a <b>conditional mean</b>: the share who survived among the people in that cell.</span>` : "") +
        (stat === "rowpct" ? `<span>Each row adds up to 100%: the mix of the column variable within that row.</span>` : "");
    }
    draw();
  };

  /* ============ 5. Conditional means: earnings by education and gender (CPS 1999) ============ */
  W.cefBars = function (root) {
    const c = (window.A2 && window.A2.cps) || [];
    let mode = "level";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Show:</span>`), seg([["level", "mean earnings"], ["ratio", "women / men"]], mode, (v) => { mode = v; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Mean annual earnings by education, 6,050 workers (CPS 1999)"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 320, x: [0, 5], y: [0, 100000], m: { t: 16, r: 16, b: 56, l: 70 } });
    const short = ["< high school", "high school", "some college", "bachelor's", "graduate"];
    function draw() {
      P.clear("main"); P.clear("front"); P.clear("top");
      if (mode === "level") {
        P.setY(0, 100000);
        P.axes({ xt: [], ylab: "Mean earnings ($ per year)", yf: (v) => fmt(v / 1000, 0) + "K" });
        c.forEach((r, k) => {
          const w = 0.32;
          el("rect", { x: P.sx(k + 0.15), y: P.sy(r.men), width: P.sx(w) - P.sx(0), height: P.sy(0) - P.sy(r.men), class: "bar-sample" }, P.g.main);
          el("rect", { x: P.sx(k + 0.15 + w + 0.04), y: P.sy(r.women), width: P.sx(w) - P.sx(0), height: P.sy(0) - P.sy(r.women), class: "bar-est" }, P.g.main);
          P.text(k + 0.15 + w / 2, r.men + 2500, money(r.men), { class: "lbl", "text-anchor": "middle", "font-size": "11" });
          P.text(k + 0.19 + 1.5 * w, r.women + 2500, money(r.women), { class: "lbl", "text-anchor": "middle", "font-size": "11" });
          P.text(k + 0.5, -9000, short[k], { "text-anchor": "middle" });
        });
        P.text(0.1, 96000, "■ men", { class: "lbl", fill: "var(--c-sample)" });
        P.text(0.7, 96000, "■ women", { class: "lbl", fill: "var(--c-est)" });
        ro.innerHTML = `<span>Each bar is a <b>conditional mean</b>: E(earnings | education, gender). Earnings rise with education for both groups, and women earn less at every level.</span>`;
      } else {
        P.setY(0, 1);
        P.axes({ xt: [], ylab: "Women's mean / men's mean", yf: (v) => fmt(v, 1) });
        c.forEach((r, k) => {
          const v = r.women / r.men, w = 0.6;
          el("rect", { x: P.sx(k + 0.2), y: P.sy(v), width: P.sx(w) - P.sx(0), height: P.sy(0) - P.sy(v), class: "bar-est" }, P.g.main);
          P.text(k + 0.5, v + 0.03, fmt(v, 2), { class: "lbl", "text-anchor": "middle" });
          P.text(k + 0.5, -0.09, short[k], { "text-anchor": "middle" });
        });
        P.line(0, 1, 5, 1, "truth", "front");
        ro.innerHTML = `<span>The ratio is about <b>0.56–0.68 in every group</b>, so differences in education do not explain the gap. The crosstab cannot tell us why: occupation, experience and hours differ too.</span>`;
      }
    }
    draw();
  };

  /* ============ 6. The limits of a crosstab: one mean per carat value vs. a line ============ */
  W.cells = function (root) {
    const d = D(), xs = d.map((r) => r[0]), ys = d.map((r) => r[1]), fit = ols(xs, ys);
    const by = {};
    d.forEach((p) => { (by[p[0]] = by[p[0]] || []).push(p[1]); });
    const keys = Object.keys(by).map(Number).sort((a, b) => a - b);
    let showCells = true, showLine = false, showDots = true;
    const ctr = h(`<div class="controls"></div>`);
    const mk = (label, on, f) => { const c = h(`<label><input type="checkbox"${on ? " checked" : ""}> ${label}</label>`); c.querySelector("input").addEventListener("change", (e) => { f(e.target.checked); draw(); }); return c; };
    ctr.append(mk("The 380 diamonds", showDots, (v) => (showDots = v)), mk("Crosstab: mean price at each carat value", showCells, (v) => (showCells = v)), mk("Regression line", showLine, (v) => (showLine = v)));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Mean price by carat value (orange: size = number of diamonds) vs. one straight line"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 330, x: [0.65, 1.35], y: [1000, 8000] });
    function draw() {
      P.axes({ xlab: "Carats", ylab: "Price ($)", xf: (v) => fmt(v, 1), yf: (v) => fmt(v, 0) });
      P.clear("main"); P.clear("front"); P.clear("top");
      if (showDots) d.forEach((p) => P.dot(p[0], p[1], 2.6, "dot-pop"));
      if (showCells) {
        P.path(keys.map((k) => [k, mean(by[k])]), "path-cells", "front");
        keys.forEach((k) => P.dot(k, mean(by[k]), 2.5 + Math.sqrt(by[k].length) * 1.3, "dot-cell", "front"));
      }
      if (showLine) { P.line(0.65, fit.a + fit.b * 0.65, 1.35, fit.a + fit.b * 1.35, "est", "top"); }
      const small = keys.filter((k) => by[k].length <= 6).length;
      ro.innerHTML = `<span><b>${keys.length}</b> distinct carat values, so the crosstab has ${keys.length} cells; <b>${small}</b> of them hold 6 diamonds or fewer (their means jump around).</span>` +
        `<span>The line needs <b>two numbers</b>: price = ${fmt(fit.a, 0)} + ${fmt(fit.b, 0)} × carats.</span>`;
    }
    draw();
  };

  /* ============ 7. Fit the line yourself (what Solver does) ============ */
  W.fitLine = function (root) {
    const d = D(), xs = d.map((r) => r[0]), ys = d.map((r) => r[1]), fit = ols(xs, ys);
    const ssrAt = (a, b) => d.reduce((s, p) => s + (p[1] - a - b * p[0]) ** 2, 0);
    let a = 1000, b = 1000, showOLS = false;
    const ctr = h(`<div class="controls"></div>`);
    const ia = h(`<label>Intercept β₀ <input type="range" min="-4000" max="4000" step="10" value="${a}"><output></output></label>`);
    const ib = h(`<label>Slope β₁ <input type="range" min="0" max="9000" step="10" value="${b}"><output></output></label>`);
    ia.querySelector("input").addEventListener("input", (e) => { a = +e.target.value; draw(); });
    ib.querySelector("input").addEventListener("input", (e) => { b = +e.target.value; draw(); });
    ctr.append(ia, ib, button("Start where the video starts (1000, 1000)", "", () => { a = 1000; b = 1000; ia.querySelector("input").value = a; ib.querySelector("input").value = b; draw(); }),
      button("Show the least-squares answer", "primary", () => { showOLS = !showOLS; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Your line through the 380 diamonds (red: the residuals)", "Sum of squared residuals as the slope changes (intercept re-optimized)"]);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { x: [0.65, 1.35], y: [0, 9000], h: 300 });
    const bs = Array.from({ length: 91 }, (_, j) => j * 100);
    const curve = bs.map((bb) => [bb, ssrAt(fit.my - bb * fit.mx, bb) / 1e6]);
    const B = new Plot(hosts[1], { x: [0, 9000], y: [0, Math.max(...curve.map((p) => p[1])) * 1.05], h: 300, m: { t: 16, r: 16, b: 44, l: 64 } });
    function draw() {
      ia.querySelector("output").textContent = fmt(a, 0);
      ib.querySelector("output").textContent = fmt(b, 0);
      A.axes({ xlab: "Carats", ylab: "Price ($)", xf: (v) => fmt(v, 1), yf: (v) => fmt(v, 0) });
      A.clear("back"); A.clear("main"); A.clear("front");
      d.forEach((p) => A.line(p[0], p[1], p[0], Math.max(0, Math.min(9000, a + b * p[0])), "resid", "back"));
      d.forEach((p) => A.dot(p[0], p[1], 2.8, "dot-sample"));
      A.line(0.65, a + b * 0.65, 1.35, a + b * 1.35, "fit", "front");
      if (showOLS) A.line(0.65, fit.a + fit.b * 0.65, 1.35, fit.a + fit.b * 1.35, "ols", "front");
      const mine = ssrAt(a, b);
      B.axes({ xlab: "Slope β₁", ylab: "SSR (millions)", yf: (v) => fmt(v, 0), xf: (v) => fmt(v, 0) });
      B.clear("main"); B.clear("front"); B.clear("top");
      B.path(curve, "curve");
      B.dot(b, Math.min(mine / 1e6, B.y1), 6, "handle", "front");
      if (showOLS) B.vline(fit.b, "est", `OLS slope ${fmt(fit.b, 0)}`, "front");
      const ratio = mine / fit.ssr;
      ro.innerHTML = `<span>Your SSR: <b>${fmt(mine, 0)}</b></span><span>Smallest possible: <b>${showOLS || ratio < 1.002 ? fmt(fit.ssr, 0) : "?"}</b></span>` +
        (ratio < 1.002 ? `<span style="color:var(--good)"><b style="color:inherit">You found the least-squares line.</b></span>` : `<span>Yours is <b>${fmt(ratio, ratio < 10 ? 2 : 0)}×</b> the minimum</span>`) +
        (showOLS ? `<span>OLS: β₀ = <b>${fmt(fit.a, 1)}</b>, β₁ = <b>${fmt(fit.b, 1)}</b></span>` : "");
    }
    draw();
  };
})();
