/* Interactive simulations for the module on sampling, the LLN, the CLT, and the math of regression.
 * Each widget is registered in window.Widgets and built the first time its slide is shown:
 *   <div class="widget" data-widget="clt"></div>
 * Charts are plain SVG (no library); colours come from CSS classes in player.css, so they follow
 * light/dark mode. Data: window.BOSTON = [[MEDV, RM, LSTAT], ...] from assets/boston.js.
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
  const phi = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

  // seeded generator (mulberry32) so fixed "populations" look the same for every student
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

  /* An SVG chart with linear (or log-x) scales and layered groups. */
  class Plot {
    constructor(host, o) {
      this.o = Object.assign({ w: 480, h: 290, m: { t: 16, r: 16, b: 44, l: 56 }, x: [0, 1], y: [0, 1], xlog: false }, o);
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
    sx(v) {
      const m = this.o.m;
      if (this.o.xlog) return m.l + ((Math.log10(v) - Math.log10(this.x0)) / (Math.log10(this.x1) - Math.log10(this.x0))) * this.iw;
      return m.l + ((v - this.x0) / (this.x1 - this.x0)) * this.iw;
    }
    sy(v) { const m = this.o.m; return m.t + this.ih - ((v - this.y0) / (this.y1 - this.y0)) * this.ih; }
    clear(k) { const g = this.g[k]; while (g.firstChild) g.removeChild(g.firstChild); return g; }
    axes(o) {
      o = Object.assign({ xt: null, yt: null, xf: (v) => v, yf: (v) => v, grid: true, xlab: "", ylab: "", noY: false }, o);
      const ax = this.clear("axis"), gr = this.clear("grid"), m = this.o.m;
      const xb = m.t + this.ih;
      el("line", { x1: m.l, x2: m.l + this.iw, y1: xb, y2: xb }, ax);
      const xt = o.xt || (this.o.xlog ? [1, 10, 100, 1000, 10000].filter((v) => v >= this.x0 && v <= this.x1) : niceTicks(this.x0, this.x1, 6));
      xt.forEach((v) => {
        const x = this.sx(v);
        el("line", { x1: x, x2: x, y1: xb, y2: xb + 5 }, ax);
        el("text", { x, y: xb + 18, "text-anchor": "middle" }, ax).textContent = o.xf(v);
      });
      if (o.xlab) el("text", { x: m.l + this.iw / 2, y: this.o.h - 4, "text-anchor": "middle", class: "lbl" }, ax).textContent = o.xlab;
      if (!o.noY) {
        const yt = o.yt || niceTicks(this.y0, this.y1, 5);
        el("line", { x1: m.l, x2: m.l, y1: m.t, y2: xb }, ax);
        yt.forEach((v) => {
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
        const right = X < this.o.m.l + this.iw * 0.75;
        el("text", { x: X + (right ? 5 : -5), y: this.o.m.t + 12 + (dy || 0), "text-anchor": right ? "start" : "end", class: cls === "est" ? "est-label" : "truth-label" }, g).textContent = label;
      }
    }
    path(pts, cls, layer) {
      const d = pts.filter((p) => Number.isFinite(p[1])).map((p, k) => `${k ? "L" : "M"}${this.sx(p[0]).toFixed(1)},${this.sy(p[1]).toFixed(1)}`).join("");
      return el("path", { d, class: cls }, this.g[layer || "main"]);
    }
    area(lo, hi, cls, layer) { // lo, hi: arrays of [x, y]
      const pts = lo.concat(hi.slice().reverse());
      const d = pts.map((p, k) => `${k ? "L" : "M"}${this.sx(p[0]).toFixed(1)},${this.sy(p[1]).toFixed(1)}`).join("") + "Z";
      return el("path", { d, class: cls }, this.g[layer || "back"]);
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
  function histogram(values, lo, hi, nb, drop) {   // values above hi go in the last bin unless drop
    const w = (hi - lo) / nb, c = new Array(nb).fill(0);
    values.forEach((v) => { const k = Math.floor((v - lo) / w); if (k >= 0 && k < nb) c[k]++; else if (k >= nb && !drop) c[nb - 1]++; });
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

  /* populations used across widgets */
  const SPEND = { mu: 3.4, s: 0.9 };
  SPEND.mean = Math.exp(SPEND.mu + SPEND.s * SPEND.s / 2);
  SPEND.sd = SPEND.mean * Math.sqrt(Math.exp(SPEND.s * SPEND.s) - 1);
  const drawSpend = (g) => Math.exp(SPEND.mu + SPEND.s * g.norm());

  /* ============ 1. One population, many samples ============ */
  W.sampler = function (root) {
    const g0 = rng(2024), NPOP = 2000;
    const pop = Array.from({ length: NPOP }, () => drawSpend(g0));
    const mu = mean(pop), sigma = Math.sqrt(pop.reduce((s, v) => s + (v - mu) ** 2, 0) / NPOP);
    let n = 25, means = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Sample size <i>n</i>:</span>`), seg([[5, "5"], [25, "25"], [100, "100"]], n, (v) => { n = v; means = []; last = null; draw(); }));
    ctr.append(button("Draw one sample", "primary", () => { sample(1); }), button("Draw 100 samples", "", () => sample(100)), button("Reset", "", () => { means = []; last = null; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["The population: monthly spend of 2,000 customers", "The sample means you have drawn"]);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { x: [0, 250], y: [0, 0.032], h: 280, m: { t: 18, r: 12, b: 44, l: 16 } });
    const B = new Plot(hosts[1], { x: [0, 120], y: [0, 1], h: 280, m: { t: 18, r: 12, b: 44, l: 16 } });
    const ph = histogram(pop, 0, 250, 50);
    function sample(times) {
      for (let t = 0; t < times; t++) {
        const idx = Array.from({ length: n }, () => R.int(NPOP));
        last = idx;
        means.push(mean(idx.map((i) => pop[i])));
      }
      draw();
    }
    function draw() {
      A.axes({ xf: (v) => "$" + v, xlab: "Spend per month", noY: true });
      A.clear("main"); A.clear("front"); A.clear("top");
      A.bars(ph.edges, ph.counts.map((c) => c / NPOP / ph.w), "bar-pop");
      A.vline(mu, "truth", `μ = $${fmt(mu, 1)}`, "front");
      if (last) {
        last.forEach((i) => A.dot(Math.min(pop[i], 249), 0.0245 - R.u() * 0.003, n > 50 ? 2.6 : 3.8, "dot-sample", "top"));
        A.vline(means[means.length - 1], "est", `X̄ = $${fmt(means[means.length - 1], 1)}`, "front", 16);
      }
      B.axes({ xf: (v) => "$" + v, xlab: "Sample mean X̄", noY: true });
      B.clear("main"); B.clear("front");
      if (means.length) {
        const bh = histogram(means, 0, 120, 60);
        const top = Math.max(...bh.counts);
        B.setY(0, Math.max(top * 1.15, 3));
        B.bars(bh.edges, bh.counts, "bar-est");
      }
      B.vline(mu, "truth", "μ", "front");
      ro.innerHTML = means.length
        ? `<span>Samples drawn: <b>${means.length}</b></span><span>Average of your X̄'s: <b>$${fmt(mean(means), 1)}</b></span>` +
          (means.length > 2 ? `<span>SD of your X̄'s: <b>$${fmt(sd(means), 1)}</b></span>` : "") + `<span>σ/√n = <b>$${fmt(sigma / Math.sqrt(n), 1)}</b></span>`
        : `<span>The population mean is <b>μ = $${fmt(mu, 1)}</b> and its SD is <b>σ = $${fmt(sigma, 1)}</b>. Pretend you can't see them: draw a sample.</span>`;
    }
    draw();
  };

  /* ============ 2. Exact distribution of the share of heads ============ */
  function lgamma(x) { // Lanczos
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  const binom = (n, k, p) => Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  W.coinExact = function (root) {
    const p = 0.66;
    let n = 2, z = false;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Number of flips <i>n</i>:</span>`), seg([1, 2, 3, 5, 10, 30, 100, 400].map((v) => [v, String(v)]), n, (v) => { n = v; draw(); }));
    const zb = h(`<label><input type="checkbox"> Standardize: plot (X̄ − μ)/SE</label>`);
    zb.querySelector("input").addEventListener("change", (e) => { z = e.target.checked; draw(); });
    ctr.append(zb);
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Probability of each possible share of heads, X̄ (p = 0.66)"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 280, x: [0, 1], y: [0, 1] });
    function draw() {
      const se = Math.sqrt(p * (1 - p) / n);
      const ks = Array.from({ length: n + 1 }, (_, k) => k), pm = ks.map((k) => binom(n, k, p));
      P.clear("main"); P.clear("front"); P.clear("top");
      if (!z) {
        const top = Math.max(...pm);
        P.setX(0, 1); P.setY(0, Math.min(1, top * 1.2));
        const w = Math.min(0.08, 0.8 / n);
        P.axes({ xlab: "Share of heads X̄", ylab: "Probability", xf: (v) => fmt(v, 1), yf: (v) => fmt(v, 2) });
        ks.forEach((k) => {
          const x = k / n;
          el("rect", { x: P.sx(x - w / 2), y: P.sy(pm[k]), width: Math.max(1, P.sx(w) - P.sx(0)), height: P.sy(0) - P.sy(pm[k]), class: "bar-sample" }, P.g.main);
          if (n <= 5) P.text(x, pm[k], fmt(pm[k], 3), { "text-anchor": "middle", dy: -6, class: "lbl" });
        });
        P.vline(p, "truth", "μ = 0.66", "front");
      } else {
        P.setX(-4, 4); P.setY(0, 0.6);
        P.axes({ xlab: "Standardized share of heads (X̄ − 0.66)/SE", ylab: "Density", yf: (v) => fmt(v, 1), xf: (v) => v });
        const step = 1 / (n * se), w = Math.min(0.5, step * 0.8);
        ks.forEach((k) => {
          const zz = (k / n - p) / se, d = pm[k] / step;
          if (zz < -4 || zz > 4) return;
          el("rect", { x: P.sx(zz - w / 2), y: P.sy(Math.min(d, 0.6)), width: Math.max(1, P.sx(w) - P.sx(0)), height: P.sy(0) - P.sy(Math.min(d, 0.6)), class: "bar-sample" }, P.g.main);
        });
        P.path(Array.from({ length: 161 }, (_, j) => { const x = -4 + j * 0.05; return [x, phi(x)]; }), "curve", "front");
        P.text(1.6, 0.36, "standard normal", { class: "lbl" });
      }
      ro.innerHTML = `<span>Mean of X̄: <b>0.66</b></span><span>SD of X̄ (the standard error): √(0.66 × 0.34 / ${n}) = <b>${fmt(se, 3)}</b></span>` +
        `<span>P(X̄ within 0.05 of 0.66): <b>${fmt(ks.filter((k) => Math.abs(k / n - p) <= 0.05 + 1e-12).reduce((s, k) => s + pm[k], 0), 3)}</b></span>`;
    }
    draw();
  };

  /* ============ 3. Law of large numbers: running averages ============ */
  W.lln = function (root) {
    const p = 0.66, NMAX = 10000, COLORS = ["#2563eb", "#ea580c", "#16a34a", "#9333ea", "#db2777"];
    let paths = [];
    const newPath = (n) => { const q = { sum: 0, n: 0, pts: [] }; flip(q, n); return q; };
    function flip(q, k) {
      const stop = Math.min(NMAX, q.n + k);
      while (q.n < stop) {
        q.sum += R.u() < p ? 1 : 0; q.n++;
        if (q.n < 50 || q.n % Math.max(1, Math.floor(q.n / 60)) === 0 || q.n === stop) q.pts.push([q.n, q.sum / q.n]);
      }
    }
    const ctr = h(`<div class="controls"></div>`);
    const add = (k) => { if (!paths.length) paths.push(newPath(0)); paths.forEach((q) => flip(q, k)); draw(); };
    ctr.append(button("Flip 1", "", () => add(1)), button("Flip 10", "", () => add(10)), button("Flip 100", "primary", () => add(100)),
      button("Flip to 10,000", "", () => add(NMAX)),
      button("Add a classmate", "", () => { if (paths.length < 5) { const n0 = paths.length ? paths[0].n : 0; paths.push(newPath(n0)); draw(); } }),
      button("Reset", "", () => { paths = []; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Share of heads so far, after n flips (log scale)"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 560, h: 340, x: [1, NMAX], y: [0, 1], xlog: true });
    function draw() {
      P.axes({ xlab: "Number of flips n", ylab: "Share of heads", yf: (v) => fmt(v, 1), xf: (v) => v.toLocaleString() });
      P.clear("back"); P.clear("main"); P.clear("front");
      const ns = Array.from({ length: 120 }, (_, j) => Math.pow(10, (4 * j) / 119));
      const half = (n) => 1.96 * Math.sqrt(p * (1 - p) / n);
      P.area(ns.map((n) => [n, Math.max(0, p - half(n))]), ns.map((n) => [n, Math.min(1, p + half(n))]), "band");
      P.line(1, p, NMAX, p, "truth", "front");
      P.text(9500, p + 0.05, "true chance of heads = 0.66", { class: "truth-label", "text-anchor": "end" });
      paths.forEach((q, k) => { const pa = P.path(q.pts, "path"); pa.style.stroke = COLORS[k]; });
      ro.innerHTML = paths.length
        ? paths.map((q, k) => `<span style="color:${COLORS[k]}">${k ? "Classmate " + k : "You"}: <b style="color:inherit">${fmt(q.sum / q.n, 3)}</b> after ${q.n.toLocaleString()}</span>`).join("")
        : `<span>The shaded funnel is where 95% of running averages should be: 0.66 ± 1.96·√(0.66·0.34/n). Start flipping.</span>`;
    }
    draw();
  };

  /* ============ 3b. Small samples produce the extremes ============ */
  W.smallSamples = function (root) {
    const g0 = rng(77), K = 200, rate = 0.1;
    const sizes = Array.from({ length: K }, () => Math.round(Math.exp(Math.log(20) + g0.u() * (Math.log(5000) - Math.log(20)))));
    let obs = [];
    const month = () => { obs = sizes.map((n) => { let c = 0; for (let j = 0; j < n; j++) if (R.u() < rate) c++; return c / n; }); draw(); };
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("Next month", "primary", month));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Conversion rate of 200 stores. Every store's true rate is 10%."]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 300, x: [15, 6000], y: [0, 0.32], xlog: true });
    function draw() {
      P.axes({ xlab: "Visitors this month (log scale)", ylab: "Share who bought", yf: (v) => Math.round(v * 100) + "%", xt: [20, 50, 100, 200, 500, 1000, 2000, 5000], xf: (v) => v.toLocaleString() });
      P.clear("back"); P.clear("main"); P.clear("front");
      const ns = Array.from({ length: 80 }, (_, j) => 15 * Math.pow(400, j / 79));
      P.area(ns.map((n) => [n, Math.max(0, rate - 1.96 * Math.sqrt(rate * (1 - rate) / n))]), ns.map((n) => [n, rate + 1.96 * Math.sqrt(rate * (1 - rate) / n)]), "band");
      P.line(15, rate, 6000, rate, "truth", "front");
      const order = obs.map((v, k) => k).sort((a, b) => obs[b] - obs[a]);
      const top = new Set(order.slice(0, 10)), bot = new Set(order.slice(-10));
      obs.forEach((v, k) => {
        const c = P.dot(sizes[k], Math.min(v, 0.32), top.has(k) || bot.has(k) ? 5 : 3.2, "dot-pop");
        if (top.has(k)) c.style.fill = "var(--good)";
        if (bot.has(k)) c.style.fill = "var(--bad)";
      });
      const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
      ro.innerHTML = `<span style="color:var(--good)">Top 10 stores: median <b style="color:inherit">${med(order.slice(0, 10).map((k) => sizes[k]))}</b> visitors</span>` +
        `<span style="color:var(--bad)">Bottom 10: median <b style="color:inherit">${med(order.slice(-10).map((k) => sizes[k]))}</b> visitors</span>` +
        `<span>All 200 stores: median <b>${med(sizes)}</b> visitors</span>`;
    }
    month();
  };

  /* ============ 4. The CLT machine ============ */
  const POPS = {
    coin: { label: "Coin flip (p = 0.66)", mean: 0.66, sd: Math.sqrt(0.66 * 0.34), draw: (g) => (g.u() < 0.66 ? 1 : 0), show: { type: "disc", xs: [0, 1], ps: [0.34, 0.66], xlab: "Outcome (1 = heads)" } },
    die: { label: "Die roll", mean: 3.5, sd: Math.sqrt(35 / 12), draw: (g) => 1 + g.int(6), show: { type: "disc", xs: [1, 2, 3, 4, 5, 6], ps: [1, 1, 1, 1, 1, 1].map((v) => v / 6), xlab: "Outcome" } },
    spend: { label: "Customer spend (skewed)", mean: SPEND.mean, sd: SPEND.sd, draw: drawSpend, show: { type: "cont", lo: 0, hi: 250, xlab: "Spend ($)" } },
    lottery: { label: "Rare big win (very skewed)", mean: 1, sd: Math.sqrt(0.01 * 0.99) * 100, draw: (g) => (g.u() < 0.01 ? 100 : 0), show: { type: "disc", xs: [0, 100], ps: [0.99, 0.01], xlab: "Payoff ($): 1% chance of $100" } },
  };
  W.clt = function (root) {
    let key = root.dataset.pop || "spend", n = 1, zs = [], raw = [];
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Population:</span>`), seg(Object.keys(POPS).map((k) => [k, POPS[k].label]), key, (v) => { key = v; reset(); }));
    const ctr2 = h(`<div class="controls"></div>`);
    ctr2.append(h(`<span>Sample size <i>n</i>:</span>`), seg([1, 2, 5, 10, 30, 100, 500].map((v) => [v, String(v)]), n, (v) => { n = v; reset(); }),
      button("Draw 2,000 more samples", "", () => drawMany(2000)));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["What one draw looks like (the population)", "Standardized sample means, (X̄ − μ)/(σ/√n)"]);
    root.append(ctr, ctr2, charts, ro);
    const A = new Plot(hosts[0], { x: [0, 1], y: [0, 1], h: 270, m: { t: 16, r: 12, b: 44, l: 16 } });
    const B = new Plot(hosts[1], { x: [-4, 4], y: [0, 0.65], h: 270, m: { t: 16, r: 12, b: 44, l: 16 } });
    function reset() { zs = []; raw = []; drawMany(2000); }
    function drawMany(times) {
      const P = POPS[key], se = P.sd / Math.sqrt(n);
      for (let t = 0; t < times; t++) {
        let s = 0; for (let j = 0; j < n; j++) s += P.draw(R);
        const m = s / n; raw.push(m); zs.push((m - P.mean) / se);
      }
      draw();
    }
    function draw() {
      const P = POPS[key];
      A.clear("main"); A.clear("front"); A.clear("top");
      if (P.show.type === "disc") {
        const xs = P.show.xs, lo = Math.min(...xs) - 0.5, hi = Math.max(...xs) + 0.5;
        const pad = key === "lottery" ? 8 : 0;
        A.setX(lo - pad, hi + pad); A.setY(0, Math.max(...P.show.ps) * 1.15);
        A.axes({ xt: xs, xlab: P.show.xlab, noY: true });
        const w = key === "lottery" ? 6 : 0.6;
        xs.forEach((x, k) => el("rect", { x: A.sx(x - w / 2), y: A.sy(P.show.ps[k]), width: A.sx(w) - A.sx(0), height: A.sy(0) - A.sy(P.show.ps[k]), class: "bar-pop" }, A.g.main));
      } else {
        const g0 = rng(5), vals = Array.from({ length: 20000 }, () => P.draw(g0));
        const hh = histogram(vals, P.show.lo, P.show.hi, 50);
        const d = hh.counts.map((c) => c / vals.length / hh.w);
        A.setX(P.show.lo, P.show.hi); A.setY(0, Math.max(...d) * 1.15);
        A.axes({ xlab: P.show.xlab, noY: true, xf: (v) => "$" + v });
        A.bars(hh.edges, d, "bar-pop");
      }
      A.vline(P.mean, "truth", "μ", "front");
      B.axes({ xlab: "z", noY: true, xt: [-4, -3, -2, -1, 0, 1, 2, 3, 4] });
      B.clear("main"); B.clear("front"); B.clear("top");
      const bh = histogram(zs, -4, 4, 64, true);
      const dens = bh.counts.map((c) => c / zs.length / bh.w);
      B.setY(0, Math.max(0.6, Math.min(2.5, Math.max(...dens) * 1.1)));
      B.bars(bh.edges, dens, "bar-sample");
      B.path(Array.from({ length: 161 }, (_, j) => { const x = -4 + j * 0.05; return [x, phi(x)]; }), "curve", "front");
      const share = zs.filter((v) => Math.abs(v) <= 1.96).length / zs.length;
      ro.innerHTML = `<span>Samples: <b>${zs.length.toLocaleString()}</b></span><span>Mean of X̄: <b>${fmt(mean(raw), 3)}</b> (μ = ${fmt(P.mean, 3)})</span>` +
        `<span>SD of X̄: <b>${fmt(sd(raw), 3)}</b> (σ/√n = ${fmt(P.sd / Math.sqrt(n), 3)})</span><span>Share within ±1.96: <b>${fmt(100 * share, 1)}%</b> (normal: 95%)</span>`;
    }
    reset();
  };

  /* ============ 5. Standard normal: the middle 90 / 95 / 99% ============ */
  W.normal95 = function (root) {
    let level = 0.95;
    const Z = { 0.9: 1.645, 0.95: 1.96, 0.99: 2.576 };
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Middle area:</span>`), seg([[0.9, "90%"], [0.95, "95%"], [0.99, "99%"]], level, (v) => { level = v; draw(); }));
    const { charts, hosts } = frame(root, ["Standard normal Z"]);
    root.append(ctr, charts);
    const P = new Plot(hosts[0], { w: 640, h: 230, x: [-4, 4], y: [0, 0.45] });
    function draw() {
      const z = Z[level];
      P.axes({ noY: true, xt: [-3, -2, -1, 0, 1, 2, 3] });
      P.clear("back"); P.clear("main"); P.clear("front"); P.clear("top");
      const xs = Array.from({ length: 161 }, (_, j) => -4 + j * 0.05);
      const mid = xs.filter((x) => Math.abs(x) <= z);
      P.area(mid.map((x) => [x, 0]), mid.map((x) => [x, phi(x)]), "band");
      P.path(xs.map((x) => [x, phi(x)]), "curve");
      [-z, z].forEach((v) => { P.line(v, 0, v, phi(v) + 0.06, "est", "front"); P.text(v, phi(v) + 0.075, (v < 0 ? "−" : "") + fmt(Math.abs(v), z === 1.96 ? 2 : 3), { "text-anchor": "middle", class: "est-label" }); });
      P.text(0, 0.16, `${Math.round(level * 100)}%`, { "text-anchor": "middle", class: "lbl", "font-size": 20 });
      P.text(-3.2, 0.05, `${fmt((1 - level) * 50, 1)}%`, { "text-anchor": "middle", class: "lbl" });
      P.text(3.2, 0.05, `${fmt((1 - level) * 50, 1)}%`, { "text-anchor": "middle", class: "lbl" });
    }
    draw();
  };

  /* ============ 6. What "95% confidence" means ============ */
  const RATING = { ps: [0.1, 0.15, 0.25, 0.3, 0.2] };
  RATING.mean = RATING.ps.reduce((s, p, k) => s + p * (k + 1), 0);
  RATING.sd = Math.sqrt(RATING.ps.reduce((s, p, k) => s + p * (k + 1 - RATING.mean) ** 2, 0));
  const drawRating = (g) => { let u = g.u(), k = 0; while (k < 4 && u > RATING.ps[k]) { u -= RATING.ps[k]; k++; } return k + 1; };
  const CI_POPS = {
    rating: { label: "Star rating, 1–5", mean: RATING.mean, sd: RATING.sd, draw: drawRating, xlab: "Average rating", xf: (v) => fmt(v, 1), mu: (v) => fmt(v, 2) },
    spend: { label: "Monthly spend (skewed)", mean: SPEND.mean, sd: SPEND.sd, draw: drawSpend, xlab: "Monthly spend ($)", xf: (v) => "$" + fmt(v, 0), mu: (v) => "$" + fmt(v, 2) },
  };
  W.ciCoverage = function (root) {
    let n = 100, level = 0.95, key = "rating", ivs = [], hits = 0, total = 0;
    const Z = { 0.9: 1.645, 0.95: 1.96, 0.99: 2.576 }, SHOW = 40;
    const ctr0 = h(`<div class="controls"></div>`);
    ctr0.append(h(`<span>Population:</span>`), seg(Object.keys(CI_POPS).map((k) => [k, CI_POPS[k].label]), key, (v) => { key = v; reset(); }));
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span><i>n</i>:</span>`), seg([[10, "10"], [30, "30"], [100, "100"], [400, "400"]], n, (v) => { n = v; reset(); }),
      h(`<span>Level:</span>`), seg([[0.9, "90%"], [0.95, "95%"], [0.99, "99%"]], level, (v) => { level = v; reset(); }));
    root.append(ctr0);
    const ctr2 = h(`<div class="controls"></div>`);
    ctr2.append(button("Draw 1 sample", "", () => draw(1)), button("Draw 40", "primary", () => draw(40)), button("Draw 1,000", "", () => draw(1000)), button("Reset", "", reset));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Each line is one sample's interval X̄ ± z·s/√n (newest at the top)"]);
    root.append(ctr, ctr2, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 330, m: { t: 16, r: 16, b: 44, l: 16 }, x: [0, 100], y: [0, SHOW + 1] });
    function reset() { ivs = []; hits = 0; total = 0; render(); }
    function draw(times) {
      const z = Z[level], P0 = CI_POPS[key], mu = P0.mean;
      for (let t = 0; t < times; t++) {
        const xs = Array.from({ length: n }, () => P0.draw(R));
        const m = mean(xs), s = sd(xs), half = (z * s) / Math.sqrt(n);
        const hit = m - half <= mu && mu <= m + half;
        hits += hit; total++;
        ivs.push([m - half, m + half, hit, m]);
        if (ivs.length > SHOW) ivs.shift();
      }
      render();
    }
    function render() {
      const P0 = CI_POPS[key], mu = P0.mean, span = 4.2 * P0.sd / Math.sqrt(n);
      P.setX(mu - span, mu + span);
      P.axes({ noY: true, xlab: P0.xlab, xf: P0.xf });
      P.clear("main"); P.clear("front");
      ivs.forEach((iv, k) => {
        const y = k + 1;
        P.line(Math.max(iv[0], mu - span), y, Math.min(iv[1], mu + span), y, iv[2] ? "ci-hit" : "ci-miss");
        P.dot(iv[3], y, 2.4, iv[2] ? "dot-sample" : "dot-pop").style.fill = iv[2] ? "" : "var(--bad)";
      });
      P.vline(mu, "truth", `true μ = ${P0.mu(mu)}`, "front");
      ro.innerHTML = total
        ? `<span>Intervals that contain μ: <b>${hits.toLocaleString()} of ${total.toLocaleString()}</b> (<b>${fmt((100 * hits) / total, 1)}%</b>; target ${Math.round(level * 100)}%)</span><span style="color:var(--bad)">Misses: <b style="color:inherit">${(total - hits).toLocaleString()}</b></span>`
        : `<span>Each sample gives a different interval. Draw some and count how many cover the true mean.</span>`;
    }
    reset();
  };

  /* ============ Boston data ============ */
  function boston() { return (window.BOSTON || []).map((r) => ({ y: r[0], x: r[1], l: r[2] })); }
  function ols(xs, ys) {
    const mx = mean(xs), my = mean(ys);
    let sxy = 0, sxx = 0;
    for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
    const b = sxy / sxx, a = my - b * mx;
    let ssr = 0; for (let i = 0; i < xs.length; i++) ssr += (ys[i] - a - b * xs[i]) ** 2;
    const n = xs.length, ser = Math.sqrt(ssr / (n - 2));
    return { a, b, mx, my, sxx, ssr, se: ser / Math.sqrt(sxx), ser };
  }

  /* ============ 7. Fit the line yourself ============ */
  W.fitLine = function (root) {
    const idx = (root.dataset.idx || "").split(",").map(Number).filter((v) => !Number.isNaN(v));
    const all = boston(), pts = idx.length ? idx.map((i) => all[i]) : all.slice(0, 40);
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), fit = ols(xs, ys);
    const ssrAt = (hgt, b) => pts.reduce((s, p) => s + (p.y - hgt - b * (p.x - fit.mx)) ** 2, 0);
    let b = 0, hgt = 15, showOLS = false, showSq = false;
    const ctr = h(`<div class="controls"></div>`);
    const sl = h(`<label>Slope <input type="range" min="-5" max="25" step="0.1" value="${b}"><output></output></label>`);
    const hl = h(`<label>Height at ${fmt(fit.mx, 1)} rooms <input type="range" min="5" max="40" step="0.1" value="${hgt}"><output></output></label>`);
    sl.querySelector("input").addEventListener("input", (e) => { b = +e.target.value; draw(); });
    hl.querySelector("input").addEventListener("input", (e) => { hgt = +e.target.value; draw(); });
    const sq = h(`<label><input type="checkbox"> Show the squared errors</label>`);
    sq.querySelector("input").addEventListener("change", (e) => { showSq = e.target.checked; draw(); });
    ctr.append(sl, hl, sq, button("Show the least-squares line", "primary", () => { showOLS = !showOLS; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["40 Boston tracts: median home value vs. average rooms", "Sum of squared errors for each slope (best height)"]);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { x: [4.5, 8.8], y: [0, 52], h: 300 });
    const curveB = Array.from({ length: 121 }, (_, j) => -5 + j * 0.25);
    const ssrCurve = curveB.map((bb) => [bb, ssrAt(fit.my, bb) / 1000]);
    const B = new Plot(hosts[1], { x: [-5, 25], y: [0, Math.max(...ssrCurve.map((p) => p[1])) * 1.05], h: 300 });
    function draw() {
      sl.querySelector("output").textContent = fmt(b, 1);
      hl.querySelector("output").textContent = fmt(hgt, 1);
      A.axes({ xlab: "Average rooms per home (RM)", ylab: "Median value, $1,000s (MEDV)" });
      A.clear("back"); A.clear("main"); A.clear("front");
      const yhat = (x) => hgt + b * (x - fit.mx);
      pts.forEach((p) => {
        const yh = yhat(p.x);
        if (showSq) {
          const side = Math.abs(A.sy(p.y) - A.sy(yh));
          const xpx = A.sx(p.x);
          el("rect", { x: p.y > yh ? xpx : xpx - side, y: Math.min(A.sy(p.y), A.sy(yh)), width: side, height: side, class: "sq" }, A.g.back);
        }
        A.line(p.x, p.y, p.x, yh, "resid", "back");
      });
      pts.forEach((p) => A.dot(p.x, p.y, 4, "dot-sample"));
      A.line(4.5, yhat(4.5), 8.8, yhat(8.8), "fit", "front");
      if (showOLS) A.line(4.5, fit.a + fit.b * 4.5, 8.8, fit.a + fit.b * 8.8, "ols", "front");
      const mine = ssrAt(hgt, b);
      B.axes({ xlab: "Slope", ylab: "SSR (thousands)", yf: (v) => fmt(v, 0) });
      B.clear("main"); B.clear("front"); B.clear("top");
      B.path(ssrCurve, "curve");
      B.dot(b, Math.min(mine / 1000, B.y1), 6, "handle", "front");
      if (showOLS) { B.vline(fit.b, "est", `OLS slope ${fmt(fit.b, 2)}`, "front"); }
      const ratio = mine / fit.ssr;
      ro.innerHTML = `<span>Your sum of squared errors: <b>${fmt(mine, 0)}</b></span><span>Smallest possible: <b>${showOLS || ratio < 1.01 ? fmt(fit.ssr, 0) : "?"}</b></span>` +
        (ratio < 1.01 ? `<span style="color:var(--good)"><b style="color:inherit">You found the least-squares line.</b></span>` : `<span>Yours is <b>${fmt(ratio, ratio < 10 ? 2 : 0)}×</b> the minimum</span>`) +
        (showOLS ? `<span>OLS: height <b>${fmt(fit.my, 2)}</b> (= Ȳ), slope <b>${fmt(fit.b, 2)}</b></span>` : "");
    }
    draw();
  };

  /* ============ 8. The slope is a random variable (tracts as the population) ============ */
  W.slopeSampling = function (root) {
    const all = boston(), X = all.map((p) => p.x), Y = all.map((p) => p.y), popfit = ols(X, Y);
    let n = 25, slopes = [], lines = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Tracts per sample <i>n</i>:</span>`), seg([[10, "10"], [25, "25"], [100, "100"], [400, "400"]], n, (v) => { n = v; slopes = []; lines = []; last = null; draw(); }),
      button("Draw one sample", "primary", () => sample(1)), button("Draw 200 samples", "", () => sample(200)), button("Reset", "", () => { slopes = []; lines = []; last = null; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["All 506 tracts (grey) and your samples' fitted lines", "The slopes you have estimated"]);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { x: [3.5, 9], y: [0, 52], h: 290 });
    const B = new Plot(hosts[1], { x: [0, 20], y: [0, 1], h: 290, m: { t: 16, r: 12, b: 44, l: 16 } });
    function sample(times) {
      for (let t = 0; t < times; t++) {
        const idx = Array.from({ length: n }, () => R.int(all.length));
        const f = ols(idx.map((i) => X[i]), idx.map((i) => Y[i]));
        slopes.push(f.b); lines.push(f); last = { idx, f };
        if (lines.length > 25) lines.shift();
      }
      draw();
    }
    function draw() {
      A.axes({ xlab: "Average rooms (RM)", ylab: "MEDV ($1,000s)" });
      A.clear("back"); A.clear("main"); A.clear("front");
      all.forEach((p) => A.dot(p.x, p.y, 2, "dot-pop", "back"));
      lines.forEach((f, k) => { const l = A.line(3.5, f.a + f.b * 3.5, 9, f.a + f.b * 9, "fit"); l.style.opacity = k === lines.length - 1 ? 1 : 0.18; l.style.strokeWidth = k === lines.length - 1 ? 3 : 1.5; });
      if (last) last.idx.forEach((i) => A.dot(X[i], Y[i], 3.6, "dot-sample"));
      A.line(3.5, popfit.a + popfit.b * 3.5, 9, popfit.a + popfit.b * 9, "ols", "front");
      B.axes({ xlab: "Estimated slope β̂₁", noY: true });
      B.clear("main"); B.clear("front");
      if (slopes.length) { const bh = histogram(slopes, 0, 20, 50); B.setY(0, Math.max(3, Math.max(...bh.counts) * 1.15)); B.bars(bh.edges, bh.counts, "bar-est"); }
      B.vline(popfit.b, "truth", `all 506 tracts: ${fmt(popfit.b, 2)}`, "front");
      ro.innerHTML = slopes.length
        ? `<span>Samples: <b>${slopes.length}</b></span><span>Latest slope: <b>${fmt(last.f.b, 2)}</b> (SE reported: ${fmt(last.f.se, 2)})</span><span>Average slope: <b>${fmt(mean(slopes), 2)}</b></span>` +
          (slopes.length > 2 ? `<span>SD of the slopes: <b>${fmt(sd(slopes), 2)}</b></span>` : "")
        : `<span>Treat the 506 tracts as the population: its regression slope is <b>${fmt(popfit.b, 2)}</b> ($1,000s per room). Draw samples and estimate it.</span>`;
    }
    draw();
  };

  /* ============ 9. What makes the standard error small ============ */
  W.seFormula = function (root) {
    let n = 50, su = 2, sx = 1;
    const B1 = 2, REPS = 500;
    const ctr = h(`<div class="controls"></div>`);
    const mk = (label, min, max, step, val, f, show) => {
      const l = h(`<label>${label} <input type="range" min="${min}" max="${max}" step="${step}" value="${val}"><output></output></label>`);
      const inp = l.querySelector("input"), o = l.querySelector("output");
      const upd = () => { f(+inp.value); o.textContent = show(+inp.value); };
      inp.addEventListener("input", () => { upd(); schedule(); });
      o.textContent = show(val);
      return l;
    };
    ctr.append(
      mk("Sample size <i>n</i>", 1, 3, 0.01, Math.log10(n), (v) => (n = Math.round(Math.pow(10, v))), (v) => Math.round(Math.pow(10, v))),
      mk("Noise σ<sub>u</sub>", 0.5, 6, 0.1, su, (v) => (su = v), (v) => fmt(v, 1)),
      mk("Spread of X, σ<sub>X</sub>", 0.25, 3, 0.05, sx, (v) => (sx = v), (v) => fmt(v, 2)));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["One sample (true line Y = 1 + 2X, dashed)", `Slopes from ${REPS} samples like it`]);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { x: [-6, 6], y: [-16, 18], h: 280 });
    const B = new Plot(hosts[1], { x: [0, 4], y: [0, 1], h: 280, m: { t: 16, r: 12, b: 44, l: 16 } });
    let timer = null;
    const schedule = () => { clearTimeout(timer); timer = setTimeout(draw, 30); };
    function simulate() {
      const out = [];
      let one = null;
      for (let r = 0; r < REPS; r++) {
        const xs = new Array(n), ys = new Array(n);
        for (let i = 0; i < n; i++) { xs[i] = sx * R.norm(); ys[i] = 1 + B1 * xs[i] + su * R.norm(); }
        const f = ols(xs, ys);
        out.push(f.b);
        if (!r) one = { xs, ys, f };
      }
      return { out, one };
    }
    function draw() {
      const { out, one } = simulate();
      A.axes({ xlab: "X", ylab: "Y" });
      A.clear("main"); A.clear("front");
      const show = Math.min(n, 400);
      for (let i = 0; i < show; i++) A.dot(Math.max(-6, Math.min(6, one.xs[i])), Math.max(-16, Math.min(18, one.ys[i])), n > 200 ? 2 : 3, "dot-sample");
      A.line(-6, 1 - 12, 6, 1 + 12, "truth", "front");
      A.line(-6, one.f.a - 6 * one.f.b, 6, one.f.a + 6 * one.f.b, "fit", "front");
      B.axes({ xlab: "Estimated slope β̂₁", noY: true, xt: [0, 1, 2, 3, 4] });
      B.clear("main"); B.clear("front");
      const bh = histogram(out, 0, 4, 80);
      B.setY(0, Math.max(...bh.counts) * 1.15);
      B.bars(bh.edges, bh.counts, "bar-est");
      B.vline(B1, "truth", "true slope 2", "front");
      ro.innerHTML = `<span>SD of the ${REPS} slopes: <b>${fmt(sd(out), 3)}</b></span><span>Formula σ<sub>u</sub> / (√n · σ<sub>X</sub>) = ${fmt(su, 1)} / (√${n} × ${fmt(sx, 2)}) = <b>${fmt(su / (Math.sqrt(n) * sx), 3)}</b></span>`;
    }
    draw();
  };

  /* ============ 10. Regression anatomy (Frisch–Waugh–Lovell) ============ */
  W.anatomy = function (root) {
    const all = boston(), Y = all.map((p) => p.y), X = all.map((p) => p.x), L = all.map((p) => p.l);
    const aux = ols(L, X);                                  // RM on LSTAT
    const xt = X.map((x, i) => x - aux.a - aux.b * L[i]);   // RM purged of LSTAT
    const f1 = ols(X, Y), f2 = ols(xt, Y);
    const { charts, hosts } = frame(root, ["MEDV vs. rooms", "MEDV vs. the part of rooms not explained by LSTAT"]);
    root.append(charts);
    const A = new Plot(hosts[0], { x: [3.5, 9], y: [0, 52], h: 280 });
    const B = new Plot(hosts[1], { x: [-2.75, 2.75], y: [0, 52], h: 280 });
    A.axes({ xlab: "Average rooms (RM)", ylab: "MEDV ($1,000s)" });
    B.axes({ xlab: "RM residual after regressing RM on LSTAT", ylab: "MEDV ($1,000s)" });
    all.forEach((p, i) => { A.dot(X[i], Y[i], 2.4, "dot-sample"); B.dot(Math.max(-2.75, Math.min(2.75, xt[i])), Y[i], 2.4, "dot-sample"); });
    A.line(3.5, f1.a + f1.b * 3.5, 9, f1.a + f1.b * 9, "est", "front");
    B.line(-2.75, f2.a - 2.75 * f2.b, 2.75, f2.a + 2.75 * f2.b, "est", "front");
    A.text(3.7, 48, `slope ${fmt(f1.b, 2)}`, { class: "est-label halo" });
    B.text(-2.55, 48, `slope ${fmt(f2.b, 2)}`, { class: "est-label halo" });
  };

  /* ============ 12. Population, sample, inference (diagram) ============ */
  W.popDiagram = function (root) {
    const g0 = rng(3), NP = 260, NS = 16;
    const pts = Array.from({ length: NP }, () => [16 + g0.u() * 184, 54 + g0.u() * 156]);
    const svg = el("svg", { viewBox: "0 0 440 262", class: "plot", role: "img", "aria-label": "A population of dots, a random sample of them, and inference back to the population" }, root);
    const box = (x, y, w, hh, label, sub) => {
      el("rect", { x, y, width: w, height: hh, rx: 12, fill: "none", stroke: "var(--brand)", "stroke-width": 2 }, svg);
      const t = el("text", { x: x + 10, y: y + 20, class: "lbl", "font-weight": 650 }, svg); t.textContent = label;
      const t2 = el("text", { x: x + 10, y: y + 34, "font-size": 11 }, svg); t2.textContent = sub;
    };
    box(6, 10, 204, 210, "Population", "what we want to learn about");
    box(306, 60, 128, 120, "Sample", "what we actually see");
    const arrow = (d, label, ly) => {
      el("path", { d, fill: "none", stroke: "var(--faint)", "stroke-width": 2, "marker-end": "url(#ah)" }, svg);
      const t = el("text", { x: 258, y: ly, "text-anchor": "middle", class: "lbl", "font-size": 12 }, svg); t.textContent = label;
    };
    const defs = el("defs", {}, svg);
    const mk = el("marker", { id: "ah", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 z", fill: "var(--faint)" }, mk);
    arrow("M214,92 C240,82 278,82 302,92", "random", 76);
    arrow("M302,150 C278,160 240,160 214,150", "inference", 176);
    const gDots = el("g", {}, svg), gS = el("g", {}, svg);
    function draw() {
      while (gDots.firstChild) gDots.removeChild(gDots.firstChild);
      while (gS.firstChild) gS.removeChild(gS.firstChild);
      const pick = new Set();
      while (pick.size < NS) pick.add(R.int(NP));
      pts.forEach((p, k) => el("circle", { cx: p[0], cy: p[1], r: pick.has(k) ? 4.2 : 3, class: pick.has(k) ? "dot-sample" : "dot-pop" }, gDots));
      Array.from(pick).forEach((k, j) => el("circle", { cx: 326 + (j % 6) * 18, cy: 112 + Math.floor(j / 6) * 20, r: 5, class: "dot-sample" }, gS));
    }
    root.appendChild(h(`<div class="btn-row"></div>`)).append(button("Draw another sample", "", draw));
    draw();
  };

  /* ============ 13. CLT for the coin: four standardized panels (exact) ============ */
  W.cltCoins = function (root) {
    const p = 0.66, grid = h(`<div class="charts"></div>`);
    root.appendChild(grid);
    [2, 5, 25, 100].forEach((n) => {
      const d = h(`<div><div class="chart-title">n = ${n}</div></div>`);
      grid.appendChild(d);
      const P = new Plot(d, { w: 320, h: 170, x: [-2.6, 2.6], y: [0, 0.6], m: { t: 8, r: 8, b: 26, l: 10 } });
      P.axes({ noY: true, xt: [-2, -1, 0, 1, 2] });
      const se = Math.sqrt(p * (1 - p) / n), step = 1 / (n * se);
      for (let k = 0; k <= n; k++) {
        const z = (k / n - p) / se, dens = binom(n, k, p) / step;
        if (z < -2.6 || z > 2.6) continue;
        const w = Math.min(0.12, step * 0.5);
        el("rect", { x: P.sx(z - w / 2), y: P.sy(Math.min(dens, 0.6)), width: P.sx(w) - P.sx(0), height: P.sy(0) - P.sy(Math.min(dens, 0.6)), class: "bar-sample" }, P.g.main);
      }
      P.path(Array.from({ length: 105 }, (_, j) => { const x = -2.6 + j * 0.05; return [x, phi(x)]; }), "curve", "front");
    });
  };

  /* ============ 11. Population regression line and one error ============ */
  W.regLine = function (root) {
    const g = rng(11), pts = Array.from({ length: 60 }, () => { const x = 1 + g.u() * 9; return [x, 10 + 3 * x + 4 * g.norm()]; });
    const { charts, hosts } = frame(root, [""]);
    root.append(charts);
    const P = new Plot(hosts[0], { w: 520, h: 300, x: [0, 11], y: [0, 50] });
    P.axes({ xlab: "X", ylab: "Y", xt: [0, 2, 4, 6, 8, 10], yt: [0, 10, 20, 30, 40, 50] });
    pts.forEach((p) => P.dot(p[0], p[1], 3.2, "dot-pop"));
    P.line(0, 10, 11, 43, "est", "front");
    P.text(9.2, 45.5, "E(Y | X) = β₀ + β₁X", { class: "est-label", "text-anchor": "middle" });
    const k = pts.reduce((best, p, j) => (p[1] - 10 - 3 * p[0] > pts[best][1] - 10 - 3 * pts[best][0] && p[0] > 4 && p[0] < 8 ? j : best), 0);
    const [x, y] = pts[k];
    P.dot(x, y, 5.5, "dot-sample", "front");
    P.line(x, y, x, 10 + 3 * x, "resid", "front").style.strokeWidth = 3;
    P.text(x - 0.25, (y + 10 + 3 * x) / 2, "eᵢ = Yᵢ − (β₀ + β₁Xᵢ)", { class: "lbl halo", "text-anchor": "end" });
    P.text(x + 0.2, y + 2.5, "(Xᵢ, Yᵢ)", { class: "lbl halo" });
  };
})();
