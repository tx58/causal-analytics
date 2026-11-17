/* Interactive parts of the module on prediction, multiple regression and F-tests in Python.
 * Each widget is registered in window.Widgets and built the first time its slide is shown:
 *   <div class="widget" data-widget="bands"></div>
 * Charts are plain SVG (no library); colours come from CSS classes in player.css and in the page's own <style>,
 * so they follow light/dark mode. Data: window.A5 from assets/a5data.js (written by code/A5_examples.py).
 * The helpers (Plot, histogram, seg, button, frame, olsFit) are those of the earlier modules' widgets.js.
 *
 * Widgets: bands (the confidence band and the prediction band around the house-price line, with a house size to
 * pick and the sample multiplied by 1, 4, 25 or 100), collin (two correlated X's in repeated samples: the cloud
 * of the two estimates, t-tests and the joint F-test), ftest (an F-test calculator for the house regression,
 * with the F density, the 5% critical value and the p-value as an area).
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

  /* ---------------- the F distribution (for the collin and ftest widgets) ---------------- */
  function lgamma(x) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5, s = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (let j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log((2.5066282746310005 * s) / x);
  }
  function betacf(a, b, x) {
    const FPMIN = 1e-300;
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let hh = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; hh *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c;
      hh *= del;
      if (Math.abs(del - 1) < 3e-12) break;
    }
    return hh;
  }
  function betai(a, b, x) {            // regularized incomplete beta function I_x(a, b)
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }
  const fSf = (f, d1, d2) => (f <= 0 ? 1 : betai(d2 / 2, d1 / 2, d2 / (d2 + d1 * f)));          // P(F > f)
  const fPdf = (x, d1, d2) => (x <= 0 ? 0 : Math.exp(0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2))
    - Math.log(x) - (lgamma(d1 / 2) + lgamma(d2 / 2) - lgamma((d1 + d2) / 2))));
  function fCrit(alpha, d1, d2) { let lo = 0, hi = 200; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (fSf(m, d1, d2) > alpha) lo = m; else hi = m; } return (lo + hi) / 2; }
  const pFmt = (p) => (p < 0.0001 ? p.toExponential(1).replace("e", " × 10^") : fmt(p, p < 0.01 ? 4 : 3));

  /* ============ 1. The confidence band and the prediction band around the house-price line ============ */
  W.bands = function (root) {
    const d = window.A5.houses, xs = d.map((r) => r[0]), ys = d.map((r) => r[1]);
    const f = olsFit(xs, ys), n = f.n;
    let sxx = 0, ssr = 0;
    for (let i = 0; i < n; i++) { sxx += (xs[i] - f.mx) ** 2; ssr += (ys[i] - f.a - f.b * xs[i]) ** 2; }
    let k = 1, x0 = 2500;
    const ctr = h(`<div class="controls"></div>`);
    const sl = h(`<label>House size <input type="range" min="1200" max="3800" step="50" value="${x0}"><output>${fmt(x0, 0)}</output> sq ft</label>`);
    sl.querySelector("input").addEventListener("input", (e) => { x0 = +e.target.value; sl.querySelector("output").textContent = fmt(x0, 0); draw(); });
    ctr.append(sl, h(`<span>Each house stands for</span>`), seg([[1, "1"], [4, "4"], [25, "25"], [100, "100 houses"]], k, (v) => { k = v; draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Price and size of the 88 houses, with the two 95% bands"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 760, h: 340, m: { t: 14, r: 16, b: 46, l: 58 }, x: [1000, 4000], y: [0, 800] });
    function se(x) {
      const N = n * k, ser2 = (k * ssr) / (N - 2), m2 = ser2 * (1 / N + ((x - f.mx) ** 2) / (k * sxx));
      return { mean: Math.sqrt(m2), obs: Math.sqrt(ser2 + m2), t: window.A5.tcrit[String(k)] };
    }
    function draw() {
      P.axes({ xlab: "Size (square feet)", ylab: "Price ($1,000s)", xf: (v) => fmt(v, 0), yf: (v) => fmt(v, 0) });
      P.clear("back"); P.clear("main"); P.clear("front"); P.clear("top");
      const up = { ci: [], pi: [] }, lo = { ci: [], pi: [] };
      for (let x = 1000; x <= 4000; x += 50) {
        const s = se(x), y = f.a + f.b * x;
        up.ci.push([x, y + s.t * s.mean]); lo.ci.push([x, y - s.t * s.mean]);
        up.pi.push([x, Math.min(800, y + s.t * s.obs)]); lo.pi.push([x, Math.max(0, y - s.t * s.obs)]);
      }
      P.path(up.pi.concat(lo.pi.slice().reverse()), "band-pi", "back");
      P.path(up.ci.concat(lo.ci.slice().reverse()), "band-ci", "back");
      d.forEach((r) => P.dot(r[0], r[1], 3.2, "dot-sample"));
      P.line(1000, f.a + f.b * 1000, 4000, f.a + f.b * 4000, "est", "front");
      const s = se(x0), y0 = f.a + f.b * x0;
      P.line(x0, 0, x0, 800, "pick", "front");
      P.dot(x0, y0, 5, "handle", "top");
      P.text(1080, 760, "wide band: prediction interval for one house", { class: "lbl halo" });
      P.text(1080, 715, "narrow band: confidence interval for the average house", { class: "est-label" });
      const ci = [y0 - s.t * s.mean, y0 + s.t * s.mean], pi = [y0 - s.t * s.obs, y0 + s.t * s.obs];
      ro.innerHTML = `<span>${fmt(n * k, 0)} observations; a house of <b>${fmt(x0, 0)}</b> sq ft: prediction <b>$${fmt(y0, 1)}K</b></span>` +
        `<span>confidence interval <b>$${fmt(ci[0], 1)}K to $${fmt(ci[1], 1)}K</b> (width ${fmt(ci[1] - ci[0], 1)})</span>` +
        `<span>prediction interval <b>$${fmt(pi[0], 1)}K to $${fmt(pi[1], 1)}K</b> (width ${fmt(pi[1] - pi[0], 1)})</span>`;
    }
    draw();
  };

  /* ============ 2. Two correlated X's: each coefficient is imprecise, their sum is not ============ */
  W.collin = function (root) {
    const N = 100, SDU = 2, TC = 1.9847, FC = fCrit(0.05, 2, N - 3);
    let rho = 0, draws = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    const sl = h(`<label>Correlation of X₁ and X₂ <input type="range" min="0" max="0.99" step="0.01" value="${rho}"><output>${fmt(rho, 2)}</output></label>`);
    sl.querySelector("input").addEventListener("input", (e) => { rho = +e.target.value; sl.querySelector("output").textContent = fmt(rho, 2); reset(); });
    ctr.append(sl, button("Draw one sample", "primary", () => { add(1); draw(); }), button("Draw 200 samples", "", () => { add(200); draw(); }));
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["One sample: X₂ against X₁", "The two estimates in each sample (truth: 1 and 1)"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 440, h: 320, m: { t: 14, r: 14, b: 44, l: 46 }, x: [-3.2, 3.2], y: [-3.2, 3.2] });
    const Q = new Plot(hosts[1], { w: 440, h: 320, m: { t: 14, r: 14, b: 44, l: 46 }, x: [-3, 5], y: [-3, 5] });
    function sample() {
      const x1 = new Array(N), x2 = new Array(N), y = new Array(N), c = Math.sqrt(1 - rho * rho);
      let m1 = 0, m2 = 0, my = 0;
      for (let i = 0; i < N; i++) {
        const z1 = R.norm(), z2 = R.norm();
        x1[i] = z1; x2[i] = rho * z1 + c * z2; y[i] = 1 + x1[i] + x2[i] + SDU * R.norm();
        m1 += x1[i]; m2 += x2[i]; my += y[i];
      }
      m1 /= N; m2 /= N; my /= N;
      let s11 = 0, s22 = 0, s12 = 0, s1y = 0, s2y = 0, syy = 0;
      for (let i = 0; i < N; i++) {
        const a = x1[i] - m1, b = x2[i] - m2, e = y[i] - my;
        s11 += a * a; s22 += b * b; s12 += a * b; s1y += a * e; s2y += b * e; syy += e * e;
      }
      const det = s11 * s22 - s12 * s12, b1 = (s22 * s1y - s12 * s2y) / det, b2 = (s11 * s2y - s12 * s1y) / det;
      const ssr = syy - b1 * s1y - b2 * s2y, s2 = ssr / (N - 3), se1 = Math.sqrt((s2 * s22) / det), se2 = Math.sqrt((s2 * s11) / det);
      const r2 = 1 - ssr / syy, F = r2 / 2 / ((1 - r2) / (N - 3));
      return { x1, x2, b1, b2, se1, se2, F, r: s12 / Math.sqrt(s11 * s22) };
    }
    function add(kk) { for (let i = 0; i < kk; i++) { last = sample(); draws.push(last); } }
    function reset() { draws = []; last = sample(); draw(); }
    function draw() {
      P.axes({ xlab: "X₁", ylab: "X₂", xt: [-3, -2, -1, 0, 1, 2, 3], yt: [-3, -2, -1, 0, 1, 2, 3] });
      P.clear("main"); P.clear("top");
      for (let i = 0; i < N; i++) P.dot(Math.max(-3.1, Math.min(3.1, last.x1[i])), Math.max(-3.1, Math.min(3.1, last.x2[i])), 2.8, "dot-sample");
      P.text(-3, 2.75, `correlation in this sample: ${fmt(last.r, 3)}`, { class: "lbl halo" });
      Q.axes({ xlab: "estimate of β₁", ylab: "estimate of β₂", xt: [-2, 0, 2, 4], yt: [-2, 0, 2, 4] });
      Q.clear("main"); Q.clear("front"); Q.clear("top");
      Q.line(-3, 1, 5, 1, "truth", "front"); Q.line(1, -3, 1, 5, "truth", "front");
      const pts = draws.length ? draws : [last];
      pts.forEach((s) => Q.dot(Math.max(-2.9, Math.min(4.9, s.b1)), Math.max(-2.9, Math.min(4.9, s.b2)), 2.6, "dot-est"));
      Q.dot(1, 1, 5, "dot-truth", "top");
      let html = `<span>this sample: β̂₁ = <b>${fmt(last.b1, 2)}</b> (SE ${fmt(last.se1, 2)}), β̂₂ = <b>${fmt(last.b2, 2)}</b> (SE ${fmt(last.se2, 2)}), sum <b>${fmt(last.b1 + last.b2, 2)}</b></span>`;
      if (draws.length > 2) {
        const b1 = draws.map((s) => s.b1), sum = draws.map((s) => s.b1 + s.b2), sh = (g) => fmt((100 * draws.filter(g).length) / draws.length, 0) + "%";
        html += `<span><b>${draws.length}</b> samples: SD of β̂₁ <b>${fmt(sd(b1), 2)}</b>; SD of the sum β̂₁ + β̂₂ <b>${fmt(sd(sum), 2)}</b></span>` +
          `<span>significant at 5%: t-test on X₁ in <b>${sh((s) => Math.abs(s.b1 / s.se1) > TC)}</b> of the samples, on X₂ in <b>${sh((s) => Math.abs(s.b2 / s.se2) > TC)}</b>; ` +
          `the joint F-test (both zero) in <b>${sh((s) => s.F > FC)}</b></span>`;
      } else html += `<span>Press “Draw 200 samples” to see how the two estimates vary together.</span>`;
      ro.innerHTML = html;
    }
    reset();
  };

  /* ============ 3. An F-test calculator for the house-price regression ============ */
  W.ftest = function (root) {
    const A = window.A5, NAMES = ["sqrft", "lotsize", "bdrms"], DF2 = A.n - 4, r2u = A.r2["sqrft+lotsize+bdrms"];
    const on = { sqrft: false, lotsize: false, bdrms: true };
    const ctr = h(`<div class="controls"><span>The null sets to zero the coefficient on</span></div>`);
    NAMES.forEach((v) => {
      const c = h(`<label class="chk"><input type="checkbox" ${on[v] ? "checked" : ""}><code>${v}</code></label>`);
      c.querySelector("input").addEventListener("change", (e) => { on[v] = e.target.checked; draw(); });
      ctr.append(c);
    });
    const ro = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["The F distribution if the null is true, and the F-statistic of the data"]);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 760, h: 250, m: { t: 14, r: 16, b: 44, l: 20 }, x: [0, 10], y: [0, 1] });
    function draw() {
      const zero = NAMES.filter((v) => on[v]), keep = NAMES.filter((v) => !on[v]), q = zero.length;
      P.clear("main"); P.clear("front"); P.clear("top");
      if (!q) {
        P.axes({ xlab: "F", noY: true });
        ro.innerHTML = `<span>Tick at least one coefficient to state a null hypothesis.</span>`;
        return;
      }
      const r2r = Math.max(0, A.r2[keep.join("+") || "none"]), F = (r2u - r2r) / q / ((1 - r2u) / DF2), p = fSf(F, q, DF2), crit = fCrit(0.05, q, DF2);
      const pts = [];
      for (let k = 0; k <= 400; k++) { const x = 0.03 + (9.97 * k) / 400; pts.push([x, fPdf(x, q, DF2)]); }
      const top = Math.min(1.1, Math.max(...pts.map((pt) => pt[1])) * 1.1);
      P.setY(0, top);
      P.axes({ xlab: `F (with ${q} and ${DF2} degrees of freedom)`, noY: true, xt: [0, 2, 4, 6, 8, 10] });
      if (F < 10) {
        const tail = pts.filter((pt) => pt[0] >= F).map((pt) => [pt[0], Math.min(top, pt[1])]);
        P.path([[F, 0], [F, Math.min(top, fPdf(F, q, DF2))]].concat(tail, [[10, 0]]), "tail", "main");
      }
      P.path(pts.map((pt) => [pt[0], Math.min(top, pt[1])]), "curve", "front");
      P.vline(crit, "truth", `5% critical value ${fmt(crit, 2)}`, "front");
      if (F < 10) P.vline(F, "est", `F = ${fmt(F, 2)}`, "front", 18);
      else P.text(9.9, top * 0.55, `F = ${fmt(F, 1)} is far off the chart →`, { class: "est-label", "text-anchor": "end" });
      ro.innerHTML = `<span>H₀: ${zero.map((v) => `β<sub>${v}</sub> = 0`).join(", ")} (q = <b>${q}</b>)</span>` +
        `<span>restricted model: <b>price ~ ${keep.join(" + ") || "1 (no X)"}</b>, R² = <b>${fmt(r2r, 4)}</b>; unrestricted R² = <b>${fmt(r2u, 4)}</b></span>` +
        `<span>F = (${fmt(r2u, 4)} − ${fmt(r2r, 4)})/${q} ÷ (1 − ${fmt(r2u, 4)})/${DF2} = <b>${fmt(F, 2)}</b>; p-value <b>${pFmt(p)}</b>: ` +
        `${p < 0.05 ? "reject the null at 5%" : "cannot reject the null at 5%"}</span>`;
    }
    draw();
  };
})();
