/* Interactive parts of the module on the OLS assumptions.
 * Each widget is registered in window.Widgets and built the first time its slide is shown:
 *   <div class="widget" data-widget="sampling"></div>
 * Charts are plain SVG (no library); colours come from CSS classes in player.css, so they follow
 * light/dark mode. Data: window.A4 from assets/a4data.js (written by code/A4_examples.py).
 * The helpers (Plot, histogram, seg, button, frame) are those of the earlier modules' widgets.js.
 *
 * Widgets: sampling (OLS in repeated samples), condDist (conditional distributions around the line; data-mode
 * "a1" or "a4"), epos (errors that are always positive), a1bias (education, ability and wages), gap (one house's
 * error), outlier (the 88 houses plus one house you place), clouds (three scatter plots; data-panels="2" for two),
 * precision (variation in X), het (default vs. robust standard errors).
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
  const normPdf = (z) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

  // seeded generator (mulberry32): fixed seeds give every student the same picture
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
    return { u, norm, exp: () => -Math.log(1 - u()), int: (n) => Math.floor(u() * n) };
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
    // data coordinates of a mouse event, or null outside the plot area
    at(ev) {
      const r = this.svg.getBoundingClientRect(), m = this.o.m;
      const px = (ev.clientX - r.left) * (this.o.w / r.width), py = (ev.clientY - r.top) * (this.o.h / r.height);
      if (px < m.l || px > m.l + this.iw || py < m.t || py > m.t + this.ih) return null;
      return [this.x0 + ((px - m.l) / this.iw) * (this.x1 - this.x0), this.y0 + ((m.t + this.ih - py) / this.ih) * (this.y1 - this.y0)];
    }
  }
  function histogram(values, lo, hi, nb) {
    const w = (hi - lo) / nb, c = new Array(nb).fill(0);
    values.forEach((v) => { const k = Math.floor((v - lo) / w); if (k >= 0 && k < nb) c[k]++; });
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
    const charts = h(`<div class="charts${titles.length === 1 ? " one" : titles.length === 3 ? " three" : ""}"></div>`);
    const hosts = titles.map((t) => { const d = h(`<div><div class="chart-title">${t}</div></div>`); charts.appendChild(d); return d; });
    return { charts, hosts };
  }

  /* OLS with one regressor: estimates, the usual (homoskedasticity-only) SE of the slope, and the robust (HC1) SE. */
  function olsFit(xs, ys) {
    const n = xs.length;
    let mx = 0, my = 0;
    for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    let sxx = 0, sxy = 0, tss = 0;
    for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxx += dx * dx; sxy += dx * dy; tss += dy * dy; }
    const b = sxy / sxx, a = my - b * mx;
    let ssr = 0, meat = 0;
    for (let i = 0; i < n; i++) { const e = ys[i] - a - b * xs[i], dx = xs[i] - mx; ssr += e * e; meat += dx * dx * e * e; }
    return { a, b, n, mx, my, se: Math.sqrt(ssr / (n - 2) / sxx), seR: Math.sqrt((n / (n - 2)) * meat) / sxx, r2: 1 - ssr / tss };
  }
  // histogram of the estimates as a density, with optional normal curves [{sd, cls}], on a fixed x-range
  function drawEstimates(Q, draws, lo, hi, nb, center, curves, opts) {
    Q.clear("main"); Q.clear("front"); Q.clear("top");
    Q.setX(lo, hi);
    const o = Object.assign({ xlab: "β̂₁ in each sample", xf: (v) => fmt(v, 2), truthLabel: "truth" }, opts);
    let top = 0;
    (curves || []).forEach((c) => { if (c.sd > 0) top = Math.max(top, normPdf(0) / c.sd); });
    let hs = null, dens = null;
    if (draws.length) {
      hs = histogram(draws, lo, hi, nb);
      dens = hs.counts.map((c) => c / (draws.length * hs.w));
      top = Math.max(top, ...dens);
    }
    Q.setY(0, (top || 1) * 1.15);
    Q.axes({ xlab: o.xlab, noY: true, xf: o.xf, xt: o.xt });
    if (hs) Q.bars(hs.edges, dens, "bar-sample");
    (curves || []).forEach((c) => {
      if (!(c.sd > 0)) return;
      const pts = [];
      for (let k = 0; k <= 240; k++) { const x = lo + ((hi - lo) * k) / 240; pts.push([x, normPdf((x - c.center) / c.sd) / c.sd]); }
      Q.path(pts, c.cls, "front");
    });
    Q.vline(center, "truth", o.truthLabel, "front");
  }

  /* ============ 1. OLS in repeated samples: unbiased, consistent, approximately normal ============ */
  W.sampling = function (root) {
    const B0 = 11, B1 = 0.14, SDU = 60, MX = 2000, SDX = 580, LO = 900, HI = 4100;
    const drawX = (g) => { let x; do { x = MX + SDX * g.norm(); } while (x < LO || x > HI); return x; };
    const g0 = rng(11), xs0 = Array.from({ length: 20000 }, () => drawX(g0)), SDXE = sd(xs0);      // SD of the truncated sizes
    let n = 100, skew = false, draws = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>Houses per sample</span>`), seg([[25, "25"], [100, "100"], [400, "400"], [1600, "1,600"]], n, (v) => { n = v; reset(); }));
    ctr.append(h(`<span>Errors</span>`), seg([[false, "bell-shaped"], [true, "skewed"]], skew, (v) => { skew = v; reset(); }));
    ctr.append(button("Draw one sample", "primary", () => { add(1); draw(); }), button("Draw 500 samples", "", () => { add(500); draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["One sample from the population", "The slope estimate in repeated samples"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 500, h: 330, m: { t: 16, r: 16, b: 46, l: 58 }, x: [800, 4200], y: [0, 800] });
    const Q = new Plot(hosts[1], { w: 440, h: 330, m: { t: 16, r: 16, b: 46, l: 20 }, x: [0.07, 0.21], y: [0, 1] });
    function sample() {
      const xs = new Array(n), ys = new Array(n);
      for (let i = 0; i < n; i++) { const x = drawX(R); xs[i] = x; ys[i] = B0 + B1 * x + SDU * (skew ? R.exp() - 1 : R.norm()); }
      return { xs, ys, f: olsFit(xs, ys) };
    }
    function add(k) { for (let i = 0; i < k; i++) { last = sample(); draws.push(last.f.b); } }
    function reset() { draws = []; last = sample(); draw(); }
    function draw() {
      P.axes({ xlab: "Size (square feet)", ylab: "Price ($1,000s)", xf: (v) => fmt(v, 0), yf: (v) => fmt(v, 0) });
      P.clear("main"); P.clear("front"); P.clear("top");
      const m = Math.min(n, 400), r = m > 150 ? 2.2 : 3.2;
      for (let i = 0; i < m; i++) P.dot(last.xs[i], Math.max(2, Math.min(798, last.ys[i])), r, "dot-sample");
      P.line(800, B0 + B1 * 800, 4200, B0 + B1 * 4200, "truth", "front");
      P.line(800, last.f.a + last.f.b * 800, 4200, last.f.a + last.f.b * 4200, "est", "front");
      P.text(900, 760, `this sample: price = ${fmt(last.f.a, 1)} + ${fmt(last.f.b, 3)} × size`, { class: "est-label" });
      P.text(900, 715, `population (dashed): price = 11 + 0.140 × size`, { class: "truth-label" });
      const theory = SDU / (Math.sqrt(n) * SDXE);
      drawEstimates(Q, draws, 0.07, 0.21, 56, B1, draws.length > 2 ? [{ center: B1, sd: theory, cls: "curve" }] : [], { truthLabel: "true slope 0.140", xt: [0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20] });
      ro.innerHTML = `<span>this sample: β̂₁ = <b>${fmt(last.f.b, 4)}</b>, SE <b>${fmt(last.f.se, 4)}</b></span>` +
        (draws.length > 2
          ? `<span><b>${draws.length.toLocaleString("en-US")}</b> samples of ${n.toLocaleString("en-US")} houses: average estimate <b>${fmt(mean(draws), 4)}</b> (truth 0.1400)</span>` +
            `<span>SD of the estimates <b>${fmt(sd(draws), 4)}</b> (the theory's normal curve: ${fmt(theory, 4)})</span>`
          : `<span>Press “Draw 500 samples” to see how the estimate varies from sample to sample.</span>`);
    }
    reset();
  };

  /* ============ 2. Conditional distributions of Y around the population regression line ============ */
  W.condDist = function (root) {
    const mode = root.dataset.mode || "a1";
    const A = 698.9, B = -2.28, XS = [15, 20, 25];
    const OPTS = mode === "a4"
      ? [["homo", "homoskedastic: same spread at every X"], ["het", "heteroskedastic: the spread depends on X"]]
      : [["ok", "Assumption 1 holds"], ["shift", "the error has mean 8 instead of 0"]];
    let state = OPTS[0][0];
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg(OPTS, state, (v) => { state = v; draw(); }));
    const { charts, hosts } = frame(root, ["Distribution of Y at X = 15, 20 and 25"]);
    root.append(ctr, charts);
    const P = new Plot(hosts[0], { w: 640, h: 330, m: { t: 14, r: 16, b: 46, l: 58 }, x: [11, 30], y: [600, 720] });
    function draw() {
      P.axes({ xlab: "Student–teacher ratio (X)", ylab: "Test score (Y)", xt: [15, 20, 25, 30], xf: (v) => v, yf: (v) => v });
      P.clear("main"); P.clear("front"); P.clear("top");
      const shift = state === "shift" ? 8 : 0, sds = state === "het" ? [5, 10, 16] : [9, 9, 9];
      P.line(12, A + B * 12, 30, A + B * 30, "fit", "front");
      P.text(11.4, A + B * 11.4 - 22, "population line", { class: "lbl halo" });
      XS.forEach((x, k) => {
        const c = A + B * x + shift, s = sds[k], pts = [];
        for (let z = -3; z <= 3.001; z += 0.1) pts.push([x + (normPdf(z) / normPdf(0)) * 2.4 * (9 / s) ** 0.5, c + z * s]);
        P.line(x, c - 3 * s, x, c + 3 * s, "truth", "main");
        P.path(pts, "curve", "main");
        P.dot(x, c, 4.5, "handle", "top");
        P.text(x + 0.3, Math.min(716, c + 3 * s + 3), `Y when X = ${x}`, { class: "lbl halo" });
      });
      if (state === "shift") {
        P.line(12, A + B * 12 + shift, 30, A + B * 30 + shift, "est", "front");
        P.text(11.3, 612, "orange: where OLS puts the line, 8 points above the true one", { class: "est-label" });
      }
    }
    draw();
  };

  /* ============ 3. Errors that are always positive: the fitted line is not the true line ============ */
  W.epos = function (root) {
    const B0 = 2, B1 = 0.8, N = 70;
    // seed chosen so that both fitted lines have the true slope: 3.16 + 0.80 X (positive errors), 2.05 + 0.80 X (mean zero)
    const g = rng(1463), base = Array.from({ length: N }, () => [1 + 8 * g.u(), g.norm()]);
    let positive = true;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>The error term</span>`), seg([[false, "has mean zero"], [true, "is always positive"]], positive, (v) => { positive = v; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["True line and fitted line"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 640, h: 330, m: { t: 14, r: 16, b: 44, l: 50 }, x: [0, 10], y: [0, 13] });
    function draw() {
      P.axes({ xlab: "X", ylab: "Y", xf: (v) => v, yf: (v) => v });
      P.clear("main"); P.clear("front"); P.clear("top");
      const xs = base.map((p) => p[0]), ys = base.map((p) => B0 + B1 * p[0] + (positive ? 1.6 * Math.abs(p[1]) : 0.9 * p[1]));
      xs.forEach((x, i) => P.dot(x, ys[i], 3.6, "dot-sample"));
      const f = olsFit(xs, ys);
      P.line(0, B0, 10, B0 + B1 * 10, "truth", "front");
      P.line(0, f.a, 10, f.a + f.b * 10, "est", "front");
      P.text(6.3, B0 + B1 * 6.3 - 1.5, "true line: β₀ + β₁X", { class: "truth-label" });
      P.text(0.4, 12, `OLS line: ${fmt(f.a, 2)} + ${fmt(f.b, 2)} X`, { class: "est-label" });
      ro.innerHTML = `<span>true line: <b>2.00 + 0.80 X</b></span><span>fitted line: <b>${fmt(f.a, 2)} + ${fmt(f.b, 2)} X</b></span>` +
        (positive ? `<span>No point lies below the true line, so the line that fits the points best sits above it.</span>`
          : `<span>Points fall on both sides of the true line, and OLS recovers it up to sampling noise.</span>`);
    }
    draw();
  };

  /* ============ 4. Assumption 1 fails: ability is in the error term and moves with education ============ */
  W.a1bias = function (root) {
    const B0 = 5, B1 = 2, G = 4, MX = 14, SDX = 2.5, SDE = 6;
    let rho = 0.6, n = 1000, draws = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    const sl = h(`<label>Correlation of education with ability <input type="range" min="-0.8" max="0.8" step="0.1" value="${rho}"><output>${fmt(rho, 1)}</output></label>`);
    sl.querySelector("input").addEventListener("input", (e) => { rho = +e.target.value; sl.querySelector("output").textContent = fmt(rho, 1); reset(); });
    ctr.append(sl, h(`<span>Workers per sample</span>`), seg([[100, "100"], [1000, "1,000"], [10000, "10,000"]], n, (v) => { n = v; reset(); }));
    ctr.append(button("Draw one sample", "primary", () => { add(1); draw(); }), button("Draw 200 samples", "", () => { add(200); draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Wage and education in one sample", "The coefficient on education in repeated samples"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 500, h: 330, m: { t: 16, r: 16, b: 46, l: 54 }, x: [6, 22], y: [0, 70] });
    const Q = new Plot(hosts[1], { w: 440, h: 330, m: { t: 16, r: 16, b: 46, l: 20 }, x: [0, 4], y: [0, 1] });
    function sample() {
      const xs = new Array(n), ys = new Array(n), ab = new Array(n), c = Math.sqrt(1 - rho * rho);
      for (let i = 0; i < n; i++) {
        const z = R.norm(), a = rho * z + c * R.norm();
        xs[i] = MX + SDX * z; ab[i] = a; ys[i] = B0 + B1 * xs[i] + G * a + SDE * R.norm();
      }
      return { xs, ys, ab, f: olsFit(xs, ys) };
    }
    function add(k) { for (let i = 0; i < k; i++) { last = sample(); draws.push(last.f.b); } }
    function reset() { draws = []; last = sample(); draw(); }
    function draw() {
      P.axes({ xlab: "Education (years)", ylab: "Hourly wage ($)", xt: [8, 10, 12, 14, 16, 18, 20], xf: (v) => v, yf: (v) => "$" + v });
      P.clear("main"); P.clear("front"); P.clear("top");
      const m = Math.min(n, 300);
      for (let i = 0; i < m; i++) {
        if (last.xs[i] < 6 || last.xs[i] > 22) continue;
        P.dot(last.xs[i], Math.max(1, Math.min(69, last.ys[i])), 3, last.ab[i] > 0 ? "dot-sample" : "dot-pop");
      }
      P.line(6, B0 + B1 * 6, 22, B0 + B1 * 22, "truth", "front");
      P.line(6, last.f.a + last.f.b * 6, 22, last.f.a + last.f.b * 22, "est", "front");
      P.text(6.4, 66, `OLS: wage = ${fmt(last.f.a, 1)} + ${fmt(last.f.b, 2)} × education`, { class: "est-label" });
      P.text(6.4, 61, `causal (dashed): 5 + 2.00 × education`, { class: "truth-label" });
      P.text(6.4, 56, `blue dots: above-average ability; grey: below`, { class: "lbl halo" });
      const plim = B1 + (G * rho) / SDX, theory = Math.sqrt(G * G * (1 - rho * rho) + SDE * SDE) / (Math.sqrt(n) * SDX);
      drawEstimates(Q, draws, 0, 4, 80, B1, draws.length > 2 ? [{ center: plim, sd: Math.max(theory, 0.012), cls: "curve" }] : [], { truthLabel: "true effect 2.00", xt: [0, 1, 2, 3, 4], xf: (v) => fmt(v, 0) });
      const bias = (draws.length > 2 ? mean(draws) : last.f.b) - B1;
      ro.innerHTML = `<span>this sample: β̂₁ = <b>${fmt(last.f.b, 2)}</b> (SE ${fmt(last.f.se, 2)})</span>` +
        (draws.length > 2 ? `<span><b>${draws.length}</b> samples: average estimate <b>${fmt(mean(draws), 2)}</b>, true effect <b>2.00</b></span>` : "") +
        `<span>bias <b>${bias >= 0 ? "+" : "−"}${fmt(Math.abs(bias), 2)}</b>; the formula: 4 × ${fmt(rho, 1)} × SD(ability) / SD(education) = 4 × ${fmt(rho, 1)} / 2.5 = <b>${plim - B1 >= 0 ? "+" : "−"}${fmt(Math.abs(plim - B1), 2)}</b></span>`;
    }
    reset();
  };

  /* ============ 5. One extreme observation: the 88 houses plus one house you place ============ */
  W.outlier = function (root) {
    const d = ((window.A4 && window.A4.houses) || []).map((r) => [r[0], r[1]]);
    const xs0 = d.map((r) => r[0]), ys0 = d.map((r) => r[1]), f0 = olsFit(xs0, ys0);
    let extra = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("A typo: 3,500 sq ft at $50K (meant $500K)", "primary", () => { extra = [3500, 50]; draw(); }),
      button("A big house on the line", "", () => { extra = [4800, f0.a + f0.b * 4800]; draw(); }),
      button("A small house at $900K", "", () => { extra = [1300, 900]; draw(); }),
      button("Remove it", "", () => { extra = null; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["88 houses, and one more: click in the chart to place it"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 340, m: { t: 14, r: 16, b: 46, l: 58 }, x: [1000, 5000], y: [0, 1000] });
    P.svg.style.cursor = "crosshair";
    P.svg.addEventListener("click", (ev) => { const p = P.at(ev); if (p) { extra = p; draw(); } });
    function draw() {
      P.axes({ xlab: "Size (square feet)", ylab: "Price ($1,000s)", xf: (v) => fmt(v, 0), yf: (v) => fmt(v, 0) });
      P.clear("main"); P.clear("front"); P.clear("top");
      d.forEach((p) => P.dot(p[0], p[1], 3.4, "dot-sample"));
      P.line(1000, f0.a + f0.b * 1000, 5000, f0.a + f0.b * 5000, "truth", "front");
      let html = `<span>88 houses (dashed): price = ${fmt(f0.a, 1)} + <b>${fmt(f0.b, 4)}</b> × size, SE ${fmt(f0.se, 4)}, R² ${fmt(f0.r2, 3)}</span>`;
      if (extra) {
        const f = olsFit(xs0.concat([extra[0]]), ys0.concat([extra[1]]));
        P.line(1000, f.a + f.b * 1000, 5000, f.a + f.b * 5000, "est", "front");
        P.dot(extra[0], extra[1], 7, "handle", "top");
        P.text(extra[0] + 60, extra[1] + 8, `the 89th house: ${fmt(extra[0], 0)} sq ft, $${fmt(extra[1], 0)}K`, { class: "est-label", "text-anchor": extra[0] > 3600 ? "end" : "start", dx: extra[0] > 3600 ? -18 : 0 });
        const ch = (100 * (f.b - f0.b)) / f0.b;
        html += `<span>with the 89th house (solid): price = ${fmt(f.a, 1)} + <b>${fmt(f.b, 4)}</b> × size, SE ${fmt(f.se, 4)}, R² ${fmt(f.r2, 3)}</span>` +
          `<span>one observation in 89 moved the slope by <b>${ch >= 0 ? "+" : "−"}${fmt(Math.abs(ch), 0)}%</b></span>`;
      } else html += `<span>Click anywhere in the chart, or use a button, to add one house.</span>`;
      ro.innerHTML = html;
    }
    draw();
  };

  /* ============ 5b. The error of one observation: its gap to the regression line ============ */
  W.gap = function (root) {
    const d = (window.A4 && window.A4.houses) || [];
    const xs = d.map((r) => r[0]), ys = d.map((r) => r[1]), f = olsFit(xs, ys);
    let k = d.findIndex((r) => r[0] === 1502 && Math.abs(r[1] - 425) < 0.6);
    if (k < 0) k = 0;
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["88 houses: click a house to see its error"]);
    root.append(charts, ro);
    const P = new Plot(hosts[0], { w: 560, h: 350, m: { t: 14, r: 16, b: 46, l: 58 }, x: [1000, 4000], y: [0, 800] });
    P.svg.style.cursor = "pointer";
    P.svg.addEventListener("click", (ev) => {
      const p = P.at(ev);
      if (!p) return;
      let best = 0, bd = Infinity;
      d.forEach((r, i) => { const dd = ((r[0] - p[0]) / 3000) ** 2 + ((r[1] - p[1]) / 800) ** 2; if (dd < bd) { bd = dd; best = i; } });
      k = best; draw();
    });
    function draw() {
      P.axes({ xlab: "Size (square feet)", ylab: "Price ($1,000s)", xf: (v) => fmt(v, 0), yf: (v) => fmt(v, 0) });
      P.clear("main"); P.clear("front"); P.clear("top");
      d.forEach((r) => P.dot(r[0], r[1], 3.4, "dot-sample"));
      P.line(1000, f.a + f.b * 1000, 4000, f.a + f.b * 4000, "est", "front");
      const x = d[k][0], y = d[k][1], yh = f.a + f.b * x, e = y - yh, left = x > 3300;
      P.line(x, yh, x, y, "resid", "front");
      P.dot(x, y, 6.5, "handle", "top");
      P.text(x + (left ? -45 : 45), (y + yh) / 2, `error: ${e >= 0 ? "+" : "−"}${fmt(Math.abs(e), 0)}`, { class: "lbl halo", "text-anchor": left ? "end" : "start" });
      P.text(1080, 760, "regression line", { class: "est-label" });
      ro.innerHTML = `<span>this house: <b>${fmt(x, 0)}</b> sq ft, price <b>$${fmt(y, 0)}K</b></span><span>the line at that size: <b>$${fmt(yh, 0)}K</b></span>` +
        `<span>its error (the gap): <b>${e >= 0 ? "+" : "−"}$${fmt(Math.abs(e), 0)}K</b></span>`;
    }
    draw();
  };

  /* ============ 6. Three scatter plots: the same line, three ways to scatter around it ============ */
  W.clouds = function (root) {
    let titles = ["Homoskedastic: the same scatter at every X", "Heteroskedastic: more scatter at large X", "Heteroskedastic: more scatter at small X"];
    if (root.dataset.panels === "2") titles = titles.slice(0, 2);          // the homoskedasticity slide shows the first two
    const { charts, hosts } = frame(root, titles);
    root.append(charts);
    const g = rng(4721);
    const pts = Array.from({ length: 150 }, () => [0.5 + 9 * g.u(), g.norm()]);
    const SDS = [() => 1.1, (t) => 0.25 + 2.1 * t, (t) => 0.25 + 2.1 * (1 - t)];
    hosts.forEach((host, k) => {
      const P = new Plot(host, { w: 320, h: 250, m: { t: 10, r: 10, b: 34, l: 34 }, x: [0, 10], y: [0, 16] });
      P.axes({ xlab: "X", xt: [0, 5, 10], yt: [0, 8, 16], xf: (v) => v, yf: (v) => v });
      pts.forEach((p) => P.dot(p[0], Math.max(0.2, Math.min(15.8, 2 + 1.2 * p[0] + SDS[k]((p[0] - 0.5) / 9) * p[1])), 2.6, "dot-sample"));
      P.line(0, 2, 10, 14, "est", "front");
    });
  };

  /* ============ 6b. Variation in X and the precision of the slope ============ */
  W.precision = function (root) {
    const B0 = 3, B1 = 1, S = 1.6, N = 30, K = 14;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("Draw new samples", "primary", () => draw()));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Little variation in X", "A lot of variation in X"]);
    root.append(ctr, charts, ro);
    const RANGES = [[4.4, 5.6], [0.5, 9.5]];
    const Ps = hosts.map((host) => new Plot(host, { w: 460, h: 300, m: { t: 12, r: 14, b: 40, l: 40 }, x: [0, 10], y: [0, 16] }));
    function sample(lo, hi) {
      const xs = new Array(N), ys = new Array(N);
      for (let i = 0; i < N; i++) { xs[i] = lo + (hi - lo) * R.u(); ys[i] = B0 + B1 * xs[i] + S * R.norm(); }
      return { xs, ys, f: olsFit(xs, ys) };
    }
    function draw() {
      const sds = [];
      Ps.forEach((P, k) => {
        P.axes({ xlab: "X", xf: (v) => v, yf: (v) => v });
        P.clear("main"); P.clear("front"); P.clear("top");
        const [lo, hi] = RANGES[k], first = sample(lo, hi), slopes = [first.f.b];
        first.xs.forEach((x, i) => P.dot(x, Math.max(0.2, Math.min(15.8, first.ys[i])), 3.2, "dot-sample"));
        for (let j = 0; j < K; j++) {
          const f = j ? sample(lo, hi).f : first.f;
          if (j) slopes.push(f.b);
          const y0 = f.a, y1 = f.a + f.b * 10;
          // clip the line to the plot area
          const pts = [[0, y0], [10, y1]].map(([x, y]) => (y < 0 ? [(0 - f.a) / f.b, 0] : y > 16 ? [(16 - f.a) / f.b, 16] : [x, y]));
          P.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1], j ? "faint" : "est", "front");
        }
        sds.push(sd(slopes));
        P.text(0.3, 14.8, `slopes of ${K} samples: SD ${fmt(sd(slopes), 2)}`, { class: "lbl halo" });
      });
      ro.innerHTML = `<span>Same true line (slope 1), same noise, 30 points per sample. Each thin line is the OLS line of another sample.</span>` +
        `<span>The slopes vary about <b>${fmt(sds[0] / sds[1], 0)} times</b> more when X hardly varies.</span>`;
    }
    draw();
  };

  /* ============ 7. Heteroskedasticity: the estimates are fine, the default standard error is not ============ */
  W.het = function (root) {
    const B0 = 5, B1 = 2, S = 3, N = 100;
    const SHAPES = {
      same: { label: "the same at every X", f: () => 1 },
      grows: { label: "grows with X", f: (t) => (0.15 + t) / 0.568 },
      shrinks: { label: "shrinks with X", f: (t) => (1.05 - t) / 0.776 },
    };
    let shape = "grows", sims = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span>The spread of the errors</span>`), seg(Object.keys(SHAPES).map((k) => [k, SHAPES[k].label]), shape, (v) => { shape = v; reset(); }));
    ctr.append(button("Draw one sample", "primary", () => { add(1); draw(); }), button("Draw 500 samples", "", () => { add(500); draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["One sample of 100 observations", "The slope estimate in repeated samples"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 500, h: 330, m: { t: 16, r: 16, b: 46, l: 46 }, x: [0, 10], y: [-5, 40] });
    const Q = new Plot(hosts[1], { w: 440, h: 330, m: { t: 16, r: 16, b: 46, l: 20 }, x: [1.4, 2.6], y: [0, 1] });
    function sample() {
      const xs = new Array(N), ys = new Array(N), f = SHAPES[shape].f;
      for (let i = 0; i < N; i++) { const u = R.u(), t = u * u; xs[i] = 10 * t; ys[i] = B0 + B1 * xs[i] + S * f(t) * R.norm(); }
      return { xs, ys, f: olsFit(xs, ys) };
    }
    function add(k) { for (let i = 0; i < k; i++) { last = sample(); sims.push(last.f); } }
    function reset() { sims = []; last = sample(); draw(); }
    function draw() {
      P.axes({ xlab: "X", ylab: "Y", xf: (v) => v, yf: (v) => v });
      P.clear("main"); P.clear("front"); P.clear("top");
      last.xs.forEach((x, i) => P.dot(x, Math.max(-4.6, Math.min(39.6, last.ys[i])), 3, "dot-sample"));
      P.line(0, B0, 10, B0 + B1 * 10, "truth", "front");
      P.line(0, last.f.a, 10, last.f.a + last.f.b * 10, "est", "front");
      P.text(0.3, 37, `OLS: ${fmt(last.f.a, 2)} + ${fmt(last.f.b, 2)} X   (truth, dashed: 5 + 2 X)`, { class: "est-label" });
      const bs = sims.map((s) => s.b), k = sims.length;
      const avgSe = k ? mean(sims.map((s) => s.se)) : last.f.se, avgR = k ? mean(sims.map((s) => s.seR)) : last.f.seR;
      drawEstimates(Q, bs, 1.4, 2.6, 60, B1, k > 2 ? [{ center: B1, sd: avgSe, cls: "path dflt" }, { center: B1, sd: avgR, cls: "curve" }] : [], { truthLabel: "true slope 2", xt: [1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6], xf: (v) => fmt(v, 1) });
      let html = `<span>this sample: β̂₁ = <b>${fmt(last.f.b, 3)}</b>, default SE <b>${fmt(last.f.se, 3)}</b>, robust SE <b>${fmt(last.f.seR, 3)}</b></span>`;
      if (k > 2) {
        const cov = (key) => (100 * sims.filter((s) => Math.abs(s.b - B1) <= 1.96 * s[key]).length) / k;
        html += `<span><b>${k}</b> samples: average estimate <b>${fmt(mean(bs), 3)}</b> (truth 2)</span>` +
          `<span>SD of the estimates <b>${fmt(sd(bs), 3)}</b>; average default SE <b>${fmt(avgSe, 3)}</b> (dashed curve); average robust SE <b>${fmt(avgR, 3)}</b> (solid curve)</span>` +
          `<span>95% intervals that contain the true slope: default <b>${fmt(cov("se"), 0)}%</b>, robust <b>${fmt(cov("seR"), 0)}%</b></span>`;
      } else html += `<span>Press “Draw 500 samples” to compare the two standard errors with the actual spread of the estimates.</span>`;
      ro.innerHTML = html;
    }
    reset();
  };
})();
