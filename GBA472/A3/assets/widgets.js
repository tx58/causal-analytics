/* Interactive parts of the module on a binary X and OLS in Python.
 * Each widget is registered in window.Widgets and built the first time its slide is shown:
 *   <div class="widget" data-widget="dummy"></div>
 * Charts are plain SVG (no library); colours come from CSS classes in player.css, so they follow
 * light/dark mode. Data: window.A3 from assets/a3data.js (written by code/A3_examples.py).
 * The helpers (Plot, histogram, seg, button, frame) are those of the earlier modules' widgets.js.
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

  // seeded generator (mulberry32) so fixed pictures look the same for every student
  function rng(seed) {
    let a = seed >>> 0;
    const u = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    return { u, int: (n) => Math.floor(u() * n) };
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
  const money = (v) => "$" + fmt(v, 2);
  const normPdf = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

  /* Regression of y on a 0/1 dummy: the two group means, the coefficient and its usual (homoskedastic) SE. */
  function dummyOLS(rows) {        // rows: [[d, y], ...]
    const y0 = [], y1 = [];
    rows.forEach(([d, y]) => (d ? y1 : y0).push(y));
    const m0 = mean(y0), m1 = mean(y1), n0 = y0.length, n1 = y1.length, n = n0 + n1;
    let ssr = 0;
    y0.forEach((v) => (ssr += (v - m0) ** 2));
    y1.forEach((v) => (ssr += (v - m1) ** 2));
    const s2 = ssr / (n - 2);
    const se1 = Math.sqrt(s2 * (1 / n0 + 1 / n1));
    const se0 = Math.sqrt(s2 / n0);
    const seW = Math.sqrt(sd(y0) ** 2 / n0 + sd(y1) ** 2 / n1);       // the difference-in-means formula
    return { b0: m0, b1: m1 - m0, m0, m1, n0, n1, se0, se1, seW, t: (m1 - m0) / se1 };
  }

  /* ============ 1. Regression on a dummy: a line through two group means ============ */
  W.dummy = function (root) {
    const all = ((window.A3 && window.A3.cps) || []).map((r, i) => ({ male: r[0], y: r[1], j: ((i * 7919) % 1000) / 1000 - 0.5 }));
    const SIZES = [40, 100, 200, 400, 1000, 2000, all.length];
    let coding = "male", k = SIZES.length - 1, sample = all, draws = [], seFull = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>D = 1 for</span>`), seg([["male", "men"], ["female", "women"]], coding, (v) => { coding = v; draws = []; draw(); }));
    const sl = h(`<label>Workers in the sample <input type="range" min="0" max="${SIZES.length - 1}" step="1" value="${k}"><output></output></label>`);
    const out = sl.querySelector("output");
    sl.querySelector("input").addEventListener("input", (e) => { k = +e.target.value; draws = []; newSample(); });
    const bNew = button("Draw a new sample", "primary", () => newSample(true));
    const b100 = button("Draw 100 samples", "", () => { for (let i = 0; i < 99; i++) newSample(true, true); newSample(true); });
    ctr.append(sl, bNew, b100);
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Hourly earnings by group, CPS 2012", "The coefficient on D in repeated samples"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 520, h: 340, m: { t: 16, r: 16, b: 48, l: 56 }, x: [-0.55, 1.55], y: [0, 80] });
    const Q = new Plot(hosts[1], { w: 420, h: 340, m: { t: 16, r: 16, b: 48, l: 44 }, x: [-1, 9], y: [0, 1] });

    function pick(n) {           // n workers at random, without replacement (partial Fisher-Yates on indices)
      if (n >= all.length) return all;
      const idx = all.map((_, i) => i);
      for (let i = 0; i < n; i++) { const j = i + R.int(idx.length - i); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      return idx.slice(0, n).map((i) => all[i]);
    }
    function rowsOf(s) { return s.map((r) => [coding === "male" ? r.male : 1 - r.male, r.y]); }
    function newSample(record, quiet) {
      sample = pick(SIZES[k]);
      if (record && SIZES[k] < all.length) {
        const f = dummyOLS(rowsOf(sample));
        draws.push(f.b1);
        seFull = f.se1;
      }
      if (!quiet) draw();
    }
    function draw() {
      const n = SIZES[k], full = n >= all.length;
      out.textContent = full ? `all ${all.length.toLocaleString("en-US")}` : n.toLocaleString("en-US");
      bNew.disabled = b100.disabled = full;
      const f = dummyOLS(rowsOf(sample));
      const lab0 = coding === "male" ? "women (D = 0)" : "men (D = 0)", lab1 = coding === "male" ? "men (D = 1)" : "women (D = 1)";
      // left: the strip plot, the two means and the line through them
      P.axes({ xt: [0, 1], xf: (v) => (v ? lab1 : lab0), ylab: "Hourly earnings ($)", yf: (v) => "$" + v, xlab: "D" });
      P.clear("main"); P.clear("front"); P.clear("top");
      const r = full ? 1.6 : n > 300 ? 2.2 : 3.2;
      sample.forEach((p) => {
        const d = coding === "male" ? p.male : 1 - p.male;
        P.dot(d + p.j * 0.4, Math.min(p.y, 79.5), r, "dot-sample");
      });
      P.line(-0.25, f.m0, 0.25, f.m0, "truth", "front");
      P.line(0.75, f.m1, 1.25, f.m1, "truth", "front");
      P.line(-0.45, f.b0 - 0.45 * f.b1, 1.45, f.b0 + 1.45 * f.b1, "est", "front");
      P.dot(0, f.m0, 6, "handle", "top"); P.dot(1, f.m1, 6, "handle", "top");
      // labels in the gap between the two clouds, one below and one above the line
      const lo0 = f.b1 > 0, mid = (f.m0 + f.m1) / 2;
      P.text(0.5, mid + (lo0 ? -13 : 10), `β̂₀ = ${money(f.b0)} (D = 0)`, { class: "lbl halo", "text-anchor": "middle" });
      P.text(0.5, mid + (lo0 ? 10 : -13), `β̂₀ + β̂₁ = ${money(f.m1)} (D = 1)`, { class: "lbl halo", "text-anchor": "middle" });
      P.text(-0.5, 76, `earnings = ${fmt(f.b0, 2)} ${f.b1 >= 0 ? "+" : "−"} ${fmt(Math.abs(f.b1), 2)} × D`, { class: "est-label halo" });
      // right: the estimates of β̂₁ from repeated samples
      Q.clear("main"); Q.clear("front"); Q.clear("top");
      const center = coding === "male" ? 3.8 : -3.8, hw = Math.max(1.5, 90 / Math.sqrt(n));   // about 4 SEs either side
      Q.setX(center - hw, center + hw);
      if (draws.length) {
        const hs = histogram(draws, center - hw, center + hw, 48);
        const dens = hs.counts.map((c) => c / (draws.length * hs.w));
        const peak = seFull ? normPdf(0) / seFull : 1;
        Q.setY(0, Math.max(peak, ...dens) * 1.15);
        Q.axes({ xlab: "β̂₁ in each sample", noY: true, xf: (v) => fmt(v, hw < 4 ? 1 : 0) });
        Q.bars(hs.edges, dens, "bar-sample");
        if (seFull) {
          const pts = [];
          for (let x = center - hw; x <= center + hw; x += hw / 120) pts.push([x, normPdf((x - center) / seFull) / seFull]);
          Q.path(pts, "curve", "front");
        }
        Q.vline(center, "truth", `all 3,955: ${fmt(center, 1)}`, "front");
      } else {
        Q.setY(0, 1);
        Q.axes({ xlab: "β̂₁ in each sample", noY: true, xf: (v) => fmt(v, hw < 4 ? 1 : 0) });
        Q.vline(center, "truth", `all 3,955: ${fmt(center, 1)}`, "front");
        Q.text(center - hw * 0.93, 0.55, full ? "Choose a smaller sample, then draw." : "Press “Draw a new sample”.", { class: "lbl" });
      }
      const sdDraws = draws.length > 2 ? sd(draws) : NaN;
      const lo = f.b1 - 1.96 * f.se1, hi = f.b1 + 1.96 * f.se1;
      ro.innerHTML =
        `<span>${lab0}: n = <b>${f.n0.toLocaleString("en-US")}</b>, mean <b>${money(f.m0)}</b> = β̂₀</span>` +
        `<span>${lab1}: n = <b>${f.n1.toLocaleString("en-US")}</b>, mean <b>${money(f.m1)}</b> = β̂₀ + β̂₁</span>` +
        `<span>β̂₁ = <b>${fmt(f.b1, 2)}</b>, SE <b>${fmt(f.se1, 2)}</b>, t = <b>${fmt(f.t, 1)}</b>, 95% CI (${fmt(lo, 2)}, ${fmt(hi, 2)})</span>` +
        (draws.length ? `<span>${draws.length} sample${draws.length > 1 ? "s" : ""} of ${n.toLocaleString("en-US")}: the estimates vary with SD <b>${fmt(sdDraws, 2)}</b>; the regression's SE says <b>${fmt(seFull, 2)}</b></span>` : "");
    }
    draw();
  };
})();
