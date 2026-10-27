/* Simulations for the module on synthetic control and IV in potential-outcomes terms (uses window.Charts
 * from charts.js and window.A6 from a6data.js, written by ../../code/A6_web_data.py).
 *   p99Paths      California vs. the other 38 states, vs. synthetic California, and the gap
 *   hullPicture   two predictors, eight donors: the synthetic is the closest point in the convex hull
 *   wBars         West Germany: synthetic vs. regression weights
 *   factorSim     a factor model where parallel trends fails: DiD vs. synthetic control
 *   lateSim       compliance types, defiers and exclusion violations: Wald vs. LATE, ATT, ATE
 *   typeShares    always-takers / compliers / never-takers in JTPA and the KIPP lottery
 *   jtpaBars      JTPA: ITT, LATE, as treated, per protocol
 *   compliersIll  Illinois wellness: compliers' and never-takers' potential outcomes
 *   latentIndex   a latent-index (Heckman) model: whose effect the instrument estimates
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const { el, h, fmt, Plot, seg, frame, rng } = window.Charts;
  const D = window.A6;
  const COL = { v: "var(--c-est)", u: "var(--c-sample)", g: "var(--good)", b: "var(--bad)", m: "var(--faint)" };
  function slider(label, min, max, step, value, show, onInput) {
    const l = h(`<label>${label} <input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${show(value)}</output></label>`);
    l.querySelector("input").addEventListener("input", (e) => { const v = +e.target.value; l.querySelector("output").textContent = show(v); onInput(v); });
    return l;
  }
  function legend(items) {   // [[colour, label, dashed?]]
    return h(`<div class="readout" style="margin-top:0">${items.map(([c, t, dash]) => `<span><svg width="22" height="10" style="vertical-align:middle"><line x1="1" y1="5" x2="21" y2="5" style="stroke:${c};stroke-width:3${dash ? ";stroke-dasharray:4 3" : ""}"></line></svg> ${t}</span>`).join("")}</div>`);
  }
  // non-negative weights summing to one that minimise |A w - b|^2 (accelerated projected gradient)
  function project(v) {
    const u = v.slice().sort((a, b) => b - a);
    let c = 0, k = 0, cum = 0;
    for (let i = 0; i < u.length; i++) { cum += u[i]; if (u[i] * (i + 1) > cum - 1) { k = i; c = cum; } }
    const th = (c - 1) / (k + 1);
    return v.map((x) => Math.max(x - th, 0));
  }
  function simplexLS(A, b, iters) {   // A: rows x cols (array of rows)
    const m = A.length, n = A[0].length;
    const At = (r) => { const g = new Array(n).fill(0); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) g[j] += A[i][j] * r[i]; return g; };
    const Ax = (w) => A.map((row) => row.reduce((s, a, j) => s + a * w[j], 0));
    let L = 0; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) L += A[i][j] * A[i][j];   // Frobenius bound
    let w = new Array(n).fill(1 / n), z = w.slice(), t = 1;
    for (let it = 0; it < (iters || 1500); it++) {
      const r = Ax(z).map((x, i) => x - b[i]);
      const g = At(r);
      const wn = project(z.map((x, j) => x - g[j] / L));
      const tn = (1 + Math.sqrt(1 + 4 * t * t)) / 2;
      z = wn.map((x, j) => x + ((t - 1) / tn) * (x - w[j]));
      w = wn; t = tn;
    }
    return w;
  }

  /* ============ Prop 99: paths ============ */
  W.p99Paths = function (root) {
    const P9 = D.p99, yrs = P9.years;
    let view = "avg";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([["avg", "California vs. the other 38"], ["synth", "California vs. synthetic"], ["gap", "The gap"]], view, (v) => { view = v; draw(); }));
    const { charts, hosts } = frame(root, ["Cigarette sales per capita (packs)"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 230, x: [1970, 2000], y: [0, 140], m: { t: 12, r: 16, b: 34, l: 46 } });
    function draw() {
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      if (view === "gap") {
        P.setY(-35, 15);
        P.axes({ xt: [1970, 1975, 1980, 1985, 1990, 1995, 2000], yt: [-30, -20, -10, 0, 10] });
        P.hline(0, "truth", "", "back");
        P.path(yrs.map((y, i) => [y, P9.ca[i] - P9.synth[i]]), "line-v");
        P.path(yrs.map((y, i) => [y, P9.ca[i] - P9.avg[i]]), "line-cf").style.stroke = COL.u;
        P.vline(1988.5, "truth", "Prop 99", "back");
        ro.innerHTML = `<span style="color:var(--c-est)">California − synthetic: <b>${fmt(P9.avgGap, 1)}</b> packs on average, 1989–2000</span><span style="color:var(--c-sample)">California − average of 38 (dashed): already falling away before 1989</span>`;
        return;
      }
      P.setY(0, 140);
      P.axes({ xt: [1970, 1975, 1980, 1985, 1990, 1995, 2000], yt: [0, 40, 80, 120] });
      P.vline(1988.5, "truth", "Prop 99", "back");
      P.path(yrs.map((y, i) => [y, P9.ca[i]]), "line-v");
      const other = view === "avg" ? P9.avg : P9.synth;
      const l = P.path(yrs.map((y, i) => [y, other[i]]), "line-cf"); l.style.stroke = view === "avg" ? COL.u : COL.g;
      P.text(2000, P9.ca[P9.ca.length - 1] - 8, "California", { "text-anchor": "end", class: "lbl halo" }).style.fill = "var(--c-est)";
      P.text(2000, other[other.length - 1] + 10, view === "avg" ? "average of the other 38 states" : "synthetic California", { "text-anchor": "end", class: "lbl halo" }).style.fill = view === "avg" ? "var(--c-sample)" : "var(--good)";
      ro.innerHTML = view === "avg"
        ? `<span>Before 1989 California was already pulling away from the average state: equal weights + parallel trends would mislead.</span>`
        : `<span>Synthetic = ${Object.entries(P9.weights).map(([k, v]) => `${fmt(v, 2)} × ${k}`).join(" + ")}; pre-1989 miss ${fmt(P9.preRmspe, 2)} packs</span>`;
    }
    draw();
  };

  /* ============ geometry of the weights ============ */
  W.hullPicture = function (root) {
    const donors = [[2, 3], [3.5, 7.5], [6.5, 8.2], [8.6, 5.6], [8, 2.2], [5, 1.4], [5.2, 5.2], [3.2, 4.8]];
    const names = "ABCDEFGH".split("");
    let tx = 9.2, ty = 8.4;
    const ctr = h(`<div class="controls"></div>`);
    const sx = slider("Predictor 1", 0, 10, 0.1, tx, (v) => fmt(v, 1), (v) => { tx = v; draw(); });
    const sy = slider("Predictor 2", 0, 10, 0.1, ty, (v) => fmt(v, 1), (v) => { ty = v; draw(); });
    ctr.append(sx, sy);
    const wrap = h(`<div class="cols c-60"></div>`);
    const { charts, hosts } = frame(root, ["Donors (blue), treated unit (orange, drag it), synthetic (green)"]);
    const tbl = h(`<div></div>`);
    wrap.append(charts, tbl);
    root.append(ctr, wrap);
    const P = new Plot(hosts[0], { w: 420, h: 380, x: [0, 10], y: [0, 10], m: { t: 10, r: 10, b: 36, l: 36 } });
    function hull(pts) {
      const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], up = [];
      p.forEach((q) => { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
      p.slice().reverse().forEach((q) => { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
      return lo.slice(0, -1).concat(up.slice(0, -1));
    }
    const H = hull(donors);
    function draw() {
      P.axes({ xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10], xlab: "Predictor 1" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      el("path", { d: H.map((q, k) => `${k ? "L" : "M"}${P.sx(q[0])},${P.sy(q[1])}`).join("") + "Z", class: "hull" }, P.g.back);
      const A = [donors.map((d) => d[0]), donors.map((d) => d[1])];
      const w = simplexLS(A, [tx, ty], 2000);
      const s = [0, 1].map((k) => donors.reduce((acc, d, j) => acc + w[j] * d[k], 0));
      donors.forEach((d, j) => { if (w[j] > 0.01) { const ln = P.line(s[0], s[1], d[0], d[1], "wline", "main"); ln.style.strokeWidth = 1 + 6 * w[j]; } });
      donors.forEach((d, j) => { P.dot(d[0], d[1], 6, "dot-u", "front"); P.text(d[0] + 0.25, d[1] + 0.25, names[j], { class: "lbl halo" }); });
      P.dot(s[0], s[1], 6, "dot-g", "front");
      const t = P.dot(tx, ty, 8, "dot-v", "front"); t.style.cursor = "grab";
      const dist = Math.hypot(tx - s[0], ty - s[1]);
      tbl.innerHTML = `<table class="t" style="font-size:14px"><tr><th class="l">Donor</th><th>Weight</th></tr>` +
        names.map((n, j) => `<tr><td class="l">${n}</td><td${w[j] > 0.01 ? ' class="hi"' : ""}>${w[j] > 0.005 ? fmt(w[j], 2) : "0"}</td></tr>`).join("") +
        `</table><p class="small">Donors used: <b>${w.filter((x) => x > 0.01).length}</b> of 8. Distance to the synthetic: <b>${fmt(dist, 2)}</b>${dist > 0.05 ? " (outside the hull: the synthetic sits on the nearest edge or corner, and no weights can do better)" : " (inside the hull: a perfect fit, and many different weights would fit equally well; with many predictors this rarely happens)"}</p>`;
    }
    // drag the treated point
    let dragging = false;
    const toData = (ev) => {
      const pt = P.svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      const q = pt.matrixTransform(P.svg.getScreenCTM().inverse());
      const m = P.o.m;
      return [Math.min(10, Math.max(0, ((q.x - m.l) / P.iw) * 10)), Math.min(10, Math.max(0, (1 - (q.y - m.t) / P.ih) * 10))];
    };
    P.svg.addEventListener("pointerdown", (ev) => { dragging = true; P.svg.setPointerCapture(ev.pointerId); move(ev); });
    P.svg.addEventListener("pointermove", (ev) => { if (dragging) move(ev); });
    P.svg.addEventListener("pointerup", () => { dragging = false; });
    function move(ev) {
      [tx, ty] = toData(ev).map((v) => Math.round(v * 10) / 10);
      sx.querySelector("input").value = tx; sx.querySelector("output").textContent = fmt(tx, 1);
      sy.querySelector("input").value = ty; sy.querySelector("output").textContent = fmt(ty, 1);
      draw();
    }
    P.svg.style.touchAction = "none";
    draw();
  };

  /* ============ Germany: synthetic vs regression weights ============ */
  W.wBars = function (root) {
    const reg = D.de.reg, syn = D.de.synth;
    const countries = Object.keys(reg).sort((a, b) => (syn[b] || 0) - (syn[a] || 0) || reg[b] - reg[a]);
    const { charts, hosts } = frame(root, ["Weights in the counterfactual West Germany"]);
    charts.classList.add("one");
    root.append(charts, h(`<div class="readout" style="margin-top:0"><span><svg width="14" height="10"><rect width="14" height="10" style="fill:var(--c-est)"></rect></svg> synthetic control</span><span><svg width="14" height="10"><rect width="14" height="10" style="fill:var(--c-sample)"></rect></svg> regression</span></div>`));
    const n = countries.length;
    const P = new Plot(hosts[0], { w: 460, h: 30 + 19 * n, x: [-0.15, 0.45], y: [-0.5, n - 0.5], m: { t: 6, r: 12, b: 28, l: 92 } });
    P.axes({ noY: true, xt: [-0.1, 0, 0.1, 0.2, 0.3, 0.4] });
    P.vline(0, "truth", "", "back");
    countries.forEach((c, i) => {
      const y = n - 1 - i;
      if (syn[c]) P.rect(0, y + 0.02, syn[c], y + 0.38, "bar-v");
      P.rect(0, y - 0.38, reg[c], y - 0.02, "bar-u");
      P.text(-0.15, y - 0.2, c, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(-0.15) - 6);
    });
  };

  /* ============ factor model: DiD vs synthetic control ============ */
  W.factorSim = function (root) {
    let mu1 = 1.5, sigma = 1.5, T0 = 20, seed = 7;
    const J = 20, Tpost = 10, tau = -8;
    const box = h(`<div class="sliders"></div>`);
    box.append(slider("Treated unit's loading μ₁", 0, 3, 0.1, mu1, (v) => fmt(v, 1), (v) => { mu1 = v; draw(); }),
      slider("Noise σ", 0.2, 6, 0.2, sigma, (v) => fmt(v, 1), (v) => { sigma = v; draw(); }),
      slider("Pre-period length T₀", 6, 30, 1, T0, (v) => v, (v) => { T0 = v; draw(); }));
    const btn = h(`<button type="button" class="btn small">New random draw</button>`);
    btn.addEventListener("click", () => { seed++; draw(); });
    const { charts, hosts } = frame(root, ["Outcome of the treated unit, its synthetic, and the DiD counterfactual (donors in grey)"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(box, btn, charts, legend([[COL.v, "treated unit"], [COL.g, "synthetic control", true], [COL.u, "DiD counterfactual", true]]), ro);
    const P = new Plot(hosts[0], { w: 720, h: 260, x: [1, 40], y: [0, 100], m: { t: 12, r: 16, b: 34, l: 44 } });
    function draw() {
      const R = rng(1000 + seed), T = T0 + Tpost;
      const lam = Array.from({ length: T }, (_, t) => 0.9 * t + 4 * Math.sin(t / 3));       // the common factor
      const del = Array.from({ length: T }, (_, t) => 30 + 0.3 * t);
      const mus = Array.from({ length: J }, (_, j) => 0.05 + (2 * j) / (J - 1) * 0.95 + 0.05 * R.norm());
      const Y = mus.map((m) => del.map((d, t) => d + lam[t] * m + sigma * R.norm()));      // donors x periods
      const y1 = del.map((d, t) => d + lam[t] * mu1 + sigma * R.norm() + (t >= T0 ? tau : 0));
      const A = Array.from({ length: T0 }, (_, t) => mus.map((_, j) => Y[j][t]));
      const w = simplexLS(A, y1.slice(0, T0), 1500);
      const syn = del.map((_, t) => Y.reduce((s, row, j) => s + w[j] * row[t], 0));
      const avg = del.map((_, t) => Y.reduce((s, row) => s + row[t], 0) / J);
      const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
      const shift = mean(y1.slice(0, T0)) - mean(avg.slice(0, T0));
      const did = avg.map((v) => v + shift);
      const scEst = mean(y1.slice(T0).map((v, k) => v - syn[T0 + k]));
      const didEst = mean(y1.slice(T0).map((v, k) => v - did[T0 + k]));
      const preRmse = Math.sqrt(mean(y1.slice(0, T0).map((v, t) => (v - syn[t]) ** 2)));
      const all = Y.flat().concat(y1);
      P.setX(1, T); P.setY(Math.floor(Math.min(...all) / 10) * 10, Math.ceil(Math.max(...all) / 10) * 10);
      P.axes({ xlab: "Period" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      Y.forEach((row) => P.path(row.map((v, t) => [t + 1, v]), "line-m", "back"));
      P.vline(T0 + 0.5, "truth", "intervention", "back");
      P.path(y1.map((v, t) => [t + 1, v]), "line-v", "front");
      const a = P.path(syn.map((v, t) => [t + 1, v]), "line-cf", "front"); a.style.stroke = COL.g;
      const b = P.path(did.map((v, t) => [t + 1, v]), "line-cf", "main"); b.style.stroke = COL.u;
      const used = w.filter((x) => x > 0.02).length;
      ro.innerHTML = `<span>True effect: <b>${tau}</b></span><span style="color:var(--good)">Synthetic control: <b>${fmt(scEst, 1)}</b> (${used} donors; pre-period miss ${fmt(preRmse, 1)})</span>` +
        `<span style="color:var(--c-sample)">Difference-in-differences: <b>${fmt(didEst, 1)}</b></span>` +
        (mu1 > 2.05 ? `<span style="color:var(--bad)">μ₁ is above every donor's loading: no weighted average can keep up.</span>` : "");
    }
    draw();
  };

  /* ============ compliance types: what the Wald ratio estimates ============ */
  W.lateSim = function (root) {
    const s = { pa: 0.2, pn: 0.3, pd: 0, tc: 4, ta: 8, tn: 1, td: 4, del: 0 };
    const box = h(`<div class="sliders"></div>`);
    const add = (k, lab, min, max, step, show) => box.append(slider(lab, min, max, step, s[k], show, (v) => { s[k] = v; draw(); }));
    const pct = (v) => Math.round(v * 100) + "%";
    add("pa", "Always-takers", 0, 0.4, 0.01, pct);
    add("pn", "Never-takers", 0, 0.6, 0.01, pct);
    add("pd", "Defiers", 0, 0.2, 0.01, pct);
    add("tc", "Effect for compliers", -4, 10, 0.5, (v) => fmt(v, 1));
    add("ta", "Effect for always-takers", -4, 10, 0.5, (v) => fmt(v, 1));
    add("tn", "Effect for never-takers", -4, 10, 0.5, (v) => fmt(v, 1));
    add("td", "Effect for defiers", -4, 10, 0.5, (v) => fmt(v, 1));
    add("del", "Direct effect of the instrument", -1, 1, 0.05, (v) => fmt(v, 2));
    const { charts, hosts } = frame(root, ["What the Wald ratio recovers"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(box, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 170, x: [-6, 14], y: [-0.5, 3.5], m: { t: 8, r: 16, b: 30, l: 170 } });
    function draw() {
      const pc = Math.max(0, 1 - s.pa - s.pn - s.pd);
      const fs = pc - s.pd;
      const itt = pc * s.tc - s.pd * s.td + s.del;
      const wald = Math.abs(fs) > 1e-6 ? itt / fs : NaN;
      const tr = s.pa + 0.5 * pc + 0.5 * s.pd;
      const att = tr > 0 ? (s.pa * s.ta + 0.5 * pc * s.tc + 0.5 * s.pd * s.td) / tr : NaN;
      const ate = s.pa * s.ta + pc * s.tc + s.pn * s.tn + s.pd * s.td;
      const rows = [["Wald ratio (ITT / first stage)", wald, "bar-v"], ["LATE: compliers' effect", s.tc, "bar-u"], ["Effect on the treated (ATT)", att, "bar-u"], ["Average effect (ATE)", ate, "bar-u"]];
      P.axes({ noY: true, xt: [-4, 0, 4, 8, 12] });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.vline(0, "truth", "", "back");
      rows.forEach(([lab, v, c], i) => {
        const y = 3 - i, x = Math.max(-6, Math.min(14, Number.isFinite(v) ? v : 0));
        P.rect(0, y - 0.32, x, y + 0.32, c);
        P.text(-6, y - 0.12, lab, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(-6) - 6);
        P.text(Math.max(0, x) + 0.3, y - 0.12, Number.isFinite(v) ? fmt(v, 2) : "undefined", { class: "lbl halo" });
      });
      const ok = s.pd === 0 && s.del === 0;
      ro.innerHTML = `<span>Compliers: <b>${Math.round(pc * 100)}%</b></span><span>ITT = ${fmt(pc, 2)}×${fmt(s.tc, 1)}${s.pd ? ` − ${fmt(s.pd, 2)}×${fmt(s.td, 1)}` : ""}${s.del ? ` + ${fmt(s.del, 2)}` : ""} = <b>${fmt(itt, 2)}</b></span><span>First stage = <b>${fmt(fs, 2)}</b></span>` +
        `<span style="color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? "No defiers, no direct effect: Wald = LATE" : s.pd ? "Defiers enter with a minus sign: Wald ≠ LATE" : "Exclusion fails: bias = direct effect / first stage = " + fmt(s.del / fs, 2)}</span>`;
    }
    draw();
  };

  /* ============ type shares ============ */
  W.typeShares = function (root) {
    const J = D.jtpa;
    const rows = [["JTPA training", J.pa, J.pc, J.pn], ["KIPP lottery", 0.046, 0.741, 0.213], ["Draft lottery (approx.)", null, 0.159, null]];
    const { charts, hosts } = frame(root, ["Shares of each type"]);
    charts.classList.add("one");
    root.append(charts, h(`<div class="readout" style="margin-top:0"><span><svg width="14" height="10"><rect width="14" height="10" style="fill:var(--c-est);opacity:.6"></rect></svg> always-takers</span><span><svg width="14" height="10"><rect width="14" height="10" style="fill:var(--good)"></rect></svg> compliers</span><span><svg width="14" height="10"><rect width="14" height="10" style="fill:var(--c-sample);opacity:.6"></rect></svg> never-takers</span></div>`));
    const P = new Plot(hosts[0], { w: 380, h: 170, x: [0, 1], y: [-0.5, 2.5], m: { t: 6, r: 10, b: 28, l: 118 } });
    P.axes({ noY: true, xt: [0, 0.25, 0.5, 0.75, 1], xf: (v) => Math.round(v * 100) + "%" });
    rows.forEach(([lab, a, c, n], i) => {
      const y = 2 - i;
      if (a == null) { P.rect(0, y - 0.3, c, y + 0.3, "bar-g").style.fill = "var(--good)"; P.text(c + 0.02, y - 0.1, `compliers ${Math.round(c * 100)}%`, { class: "lbl" }); }
      else {
        P.rect(0, y - 0.3, a, y + 0.3, "bar-v").style.opacity = 0.6;
        P.rect(a, y - 0.3, a + c, y + 0.3, "bar-g").style.fill = "var(--good)";
        P.rect(a + c, y - 0.3, 1, y + 0.3, "bar-u").style.opacity = 0.6;
        P.text(a + c / 2, y - 0.1, Math.round(c * 100) + "%", { "text-anchor": "middle", class: "lbl halo" });
      }
      P.text(0, y - 0.1, lab, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(0) - 6);
    });
  };

  /* ============ JTPA estimates ============ */
  W.jtpaBars = function (root) {
    const J = D.jtpa;
    const rows = [["ITT (effect of the offer)", J.itt, "bar-u"], ["LATE = ITT / first stage", J.wald, "bar-v"], ["As treated (observational)", J.asTreated, "bar-u"], ["Per protocol (observational)", J.perProtocol, "bar-u"]];
    const { charts, hosts } = frame(root, ["Effect of JTPA training on 30-month earnings ($)"]);
    charts.classList.add("one");
    root.append(charts);
    const P = new Plot(hosts[0], { w: 440, h: 190, x: [0, 2800], y: [-0.5, 3.5], m: { t: 6, r: 14, b: 28, l: 168 } });
    P.axes({ noY: true, xt: [0, 1000, 2000], xf: (v) => "$" + v.toLocaleString() });
    rows.forEach(([lab, v, c], i) => {
      const y = 3 - i;
      P.rect(0, y - 0.3, v, y + 0.3, c);
      P.text(0, y - 0.1, lab, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(0) - 6);
      P.text(v + 40, y - 0.1, "$" + Math.round(v).toLocaleString(), { class: "lbl halo" });
    });
  };

  /* ============ Illinois: compliers vs never-takers ============ */
  W.compliersIll = function (root) {
    const G = D.ill.gym_post;
    const rows = [["Compliers, with the program", G.y1c, "bar-v"], ["Compliers, without it", G.y0c, "bar-u"], ["Never-takers, without it", G.y0n, "bar-u"]];
    const { charts, hosts } = frame(root, ["Gym visits a year after the program started"]);
    charts.classList.add("one");
    root.append(charts, h(`<div class="readout"><span>LATE = ${fmt(G.y1c, 2)} − ${fmt(G.y0c, 2)} = <b>${fmt(G.y1c - G.y0c, 2)}</b></span><span>Naive: participants − non-participants among those offered = ${fmt(G.y1c, 2)} − ${fmt(G.y0n, 2)} = <b>+${fmt(G.y1c - G.y0n, 2)}</b></span><span>Shares: ${Math.round(G.pc * 100)}% compliers, ${Math.round(G.pn * 100)}% never-takers</span></div>`));
    const P = new Plot(hosts[0], { w: 440, h: 160, x: [0, 9], y: [-0.5, 2.5], m: { t: 6, r: 14, b: 28, l: 176 } });
    P.axes({ noY: true, xt: [0, 2, 4, 6, 8] });
    rows.forEach(([lab, v, c], i) => {
      const y = 2 - i;
      const r = P.rect(0, y - 0.3, v, y + 0.3, c); if (i === 2) r.style.opacity = 0.45;
      P.text(0, y - 0.1, lab, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(0) - 6);
      P.text(v + 0.12, y - 0.1, fmt(v, 2), { class: "lbl halo" });
    });
  };

  /* ============ latent index: whose effect? ============ */
  W.latentIndex = function (root) {
    let g0 = 0.2, g1 = 0.3, b = 6;
    const box = h(`<div class="sliders"></div>`);
    box.append(slider("γ₀ (share of always-takers)", 0, 0.5, 0.01, g0, (v) => Math.round(v * 100) + "%", (v) => { g0 = v; draw(); }),
      slider("γ₁ (instrument strength = share of compliers)", 0.05, 0.75, 0.01, g1, (v) => Math.round(v * 100) + "%", (v) => { g1 = v; draw(); }),
      slider("How fast gains fall with resistance", 0, 8, 0.5, b, (v) => fmt(v, 1), (v) => { b = v; draw(); }));
    const { charts, hosts } = frame(root, ["Gain from treatment by resistance v (people sorted from eager to reluctant)"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(box, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 230, x: [0, 1], y: [0, 10], m: { t: 12, r: 16, b: 34, l: 40 } });
    function draw() {
      const hi = Math.min(1, g0 + g1);
      const tau = (v) => 5 + b * (0.5 - v);
      const avg = (a, c) => (c > a ? 5 + b * (0.5 - (a + c) / 2) : NaN);
      const late = avg(g0, hi), ate = 5;
      const tr = g0 + 0.5 * (hi - g0);
      const att = tr > 0 ? (g0 * avg(0, g0 || 1e-9) * (g0 > 0) + 0.5 * (hi - g0) * late) / tr : NaN;
      P.setY(Math.min(0, tau(1) - 1), Math.max(10, tau(0) + 1));
      P.axes({ xt: [0, 0.25, 0.5, 0.75, 1], xlab: "resistance to treatment v (uniform)" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.rect(0, P.y0, g0, P.y1, "band-a", "back"); P.rect(g0, P.y0, hi, P.y1, "band-c", "back"); P.rect(hi, P.y0, 1, P.y1, "band-n", "back");
      if (g0 > 0.05) P.text(g0 / 2, P.y1 - 0.6, "always", { "text-anchor": "middle", class: "lbl" });
      P.text((g0 + hi) / 2, P.y1 - 0.6, "compliers", { "text-anchor": "middle", class: "lbl" });
      if (hi < 0.95) P.text((hi + 1) / 2, P.y1 - 0.6, "never", { "text-anchor": "middle", class: "lbl" });
      P.path([[0, tau(0)], [1, tau(1)]], "line-v");
      P.line(g0, late, hi, late, "est", "front");
      P.hline(ate, "truth", "", "back");
      ro.innerHTML = `<span style="color:var(--c-est)">LATE (compliers' average gain): <b>${fmt(late, 2)}</b></span><span>ATT: <b>${fmt(att, 2)}</b></span><span>ATE (dashed): <b>${fmt(ate, 2)}</b></span>` +
        (b === 0 ? `<span>Everyone gains the same: all three coincide.</span>` : "");
    }
    draw();
  };
})();
