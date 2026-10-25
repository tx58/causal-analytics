/* Shared helpers for the modules' simulations: SVG charts, controls, random numbers, OLS.
 * Same code as the helpers inside A1's widgets.js, exported as window.Charts so that every later
 * module can reuse it. Colours come from CSS classes in player.css (light/dark mode).
 */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";

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
      const xt = o.xt || (this.o.xlog ? [1, 10, 100, 1000, 10000, 100000].filter((v) => v >= this.x0 && v <= this.x1) : niceTicks(this.x0, this.x1, 6));
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
    hline(y, cls, label, layer) {
      const g = this.g[layer || "front"], Y = this.sy(y);
      el("line", { x1: this.o.m.l, x2: this.o.m.l + this.iw, y1: Y, y2: Y, class: cls }, g);
      if (label) el("text", { x: this.o.m.l + this.iw - 4, y: Y - 6, "text-anchor": "end", class: cls === "est" ? "est-label" : "truth-label" }, g).textContent = label;
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
    rect(x0, y0, x1, y1, cls, layer) {   // data coordinates, any order
      const X0 = this.sx(Math.min(x0, x1)), X1 = this.sx(Math.max(x0, x1)), Y0 = this.sy(Math.max(y0, y1)), Y1 = this.sy(Math.min(y0, y1));
      return el("rect", { x: X0, y: Y0, width: Math.max(0.5, X1 - X0), height: Math.max(0.5, Y1 - Y0), class: cls }, this.g[layer || "main"]);
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

  /* OLS of y on a constant and the columns in X (array of arrays); classical SEs. */
  function ols(y, X) {
    const n = y.length, k = X.length + 1;
    const col = (j, i) => (j === 0 ? 1 : X[j - 1][i]);
    const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
    for (let i = 0; i < n; i++) for (let p = 0; p < k; p++) { const xp = col(p, i); b[p] += xp * y[i]; for (let q = p; q < k; q++) A[p][q] += xp * col(q, i); }
    for (let p = 0; p < k; p++) for (let q = 0; q < p; q++) A[p][q] = A[q][p];
    const inv = invert(A), beta = inv.map((row) => row.reduce((s, v, j) => s + v * b[j], 0));
    let ssr = 0;
    for (let i = 0; i < n; i++) { let f = 0; for (let p = 0; p < k; p++) f += beta[p] * col(p, i); ssr += (y[i] - f) ** 2; }
    const s2 = ssr / (n - k);
    return { beta, se: inv.map((row, p) => Math.sqrt(s2 * row[p])) };
  }
  function invert(M) {   // Gauss-Jordan for small matrices
    const n = M.length, A = M.map((r, i) => r.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];
      const d = A[c][c]; for (let j = 0; j < 2 * n; j++) A[c][j] /= d;
      for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[c][j]; }
    }
    return A.map((r) => r.slice(n));
  }

  window.Charts = { el, h, fmt, mean, sd, phi, rng, R, niceTicks, Plot, histogram, seg, button, frame, ols };
})();
