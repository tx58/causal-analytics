/* Simulations for the module on yes/no outcomes and propensity scores (uses window.Charts from charts.js
 * and window.A4 from a4data.js, written by ../../code/A4_web_data.py).
 *   churnPred     predicted churn probabilities: linear probability model vs. logit
 *   sCurve        the logistic curve: a starting probability plus a change in the index
 *   threshold     classification threshold on the churn logit: flagged, caught, false alarms, accuracy
 *   priorHist     prior prescriptions of visited and unvisited doctors
 *   tradTable     the company's decile list
 *   specBars      specialty mix of visited and unvisited doctors
 *   overlap       estimated propensity scores of the two groups, common support, the five strata
 *   binBalance    balance of prior prescriptions and specialty inside one bin of the score
 *   strata        subclassification with 1-20 strata: estimates against the truth
 *   matchPicture  nearest-neighbor matching on the log-odds of the score (a small sample) + full-data results
 *   lovePlot      standardized mean differences before / after matching / after weighting
 *   trimming      inverse probability weights trimmed at [a, 1 - a]
 *   deciles       true effects by decile of the company's list vs. the causal list; the noisy estimates
 *   lalonde       the job-training data: overlap and the estimates against the experiment
 * All numbers come from the same computations as code/A4_examples.py (the Beamer deck).
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const { el, h, fmt, Plot, seg, frame } = window.Charts;
  const D = window.A4;
  const C = D.case;
  const Lam = (z) => 1 / (1 + Math.exp(-z));
  const logit = (p) => Math.log(p / (1 - p));
  const pct = (v, d = 0) => fmt(100 * v, d) + "%";
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  function slider(label, min, max, step, value, show, onInput) {
    const l = h(`<label>${label} <input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${show(value)}</output></label>`);
    l.querySelector("input").addEventListener("input", (e) => { const v = +e.target.value; l.querySelector("output").textContent = show(v); onInput(v); });
    return l;
  }
  function legend(items) {   // [[class, label]]
    return h(`<div class="readout" style="margin-top:0">${items.map(([c, t]) => `<span><svg width="14" height="10" style="vertical-align:middle"><rect width="14" height="10" style="fill:${c}"></rect></svg> ${t}</span>`).join("")}</div>`);
  }
  const COL = { v: "var(--c-est)", u: "var(--c-sample)", g: "var(--good)", m: "var(--faint)" };

  /* ============ LPM vs logit predictions ============ */
  W.churnPred = function (root) {
    let mode = "lpm";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([["lpm", "Linear probability model"], ["logit", "Logit"]], mode, (v) => { mode = v; draw(); }));
    const { charts, hosts } = frame(root, ["Predicted Pr(churn), 7,218 customers"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const ch = D.churn;
    const P = new Plot(hosts[0], { w: 700, h: 220, x: [-0.3, 1.1], y: [0, 1], m: { t: 12, r: 16, b: 40, l: 54 } });
    function draw() {
      const counts = mode === "lpm" ? ch.lpmHist : ch.logitHist;
      P.setY(0, Math.max(...counts) * 1.15);
      P.axes({ xt: [-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1], xlab: "Predicted probability of churn", ylab: "Customers" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.rect(-0.3, 0, 0, P.y1, "shade", "back");
      P.rect(1, 0, 1.1, P.y1, "shade", "back");
      P.bars(ch.predEdges, counts, mode === "lpm" ? "bar-bad" : "bar-sample");
      P.vline(0, "truth", "0", "front");
      P.vline(1, "truth", "1", "front");
      ro.innerHTML = mode === "lpm"
        ? `<span>Predictions below 0: <b>${pct(ch.lpmBelow0)}</b> of customers</span><span>A straight line has no floor or ceiling</span>`
        : `<span>Every prediction between 0 and 1: from <b>0.002</b> to <b>0.80</b></span>`;
    }
    draw();
  };

  /* ============ the S-curve ============ */
  W.sCurve = function (root) {
    let p0 = 0.10, dz = 0.8;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(slider("Starting probability", 0.01, 0.99, 0.01, p0, (v) => fmt(v, 2), (v) => { p0 = v; draw(); }),
      slider("Change in the index (β × ΔX)", -3, 3, 0.1, dz, (v) => (v > 0 ? "+" : "") + fmt(v, 1), (v) => { dz = v; draw(); }));
    const { charts, hosts } = frame(root, ["Pr(Y = 1) = Λ(z)", "Slope of the curve, p(1 − p)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const A = new Plot(hosts[0], { w: 420, h: 250, x: [-6, 6], y: [0, 1], m: { t: 12, r: 12, b: 40, l: 44 } });
    const B = new Plot(hosts[1], { w: 420, h: 250, x: [-6, 6], y: [0, 0.27], m: { t: 12, r: 12, b: 40, l: 50 } });
    const zs = Array.from({ length: 121 }, (_, i) => -6 + i / 10);
    A.axes({ xlab: "Index z = β₀ + β₁X₁ + …", yt: [0, 0.25, 0.5, 0.75, 1] });
    A.path(zs.map((z) => [z, Lam(z)]), "curve", "back");
    B.axes({ xlab: "Index z", yt: [0, 0.05, 0.1, 0.15, 0.2, 0.25] });
    B.path(zs.map((z) => [z, Lam(z) * (1 - Lam(z))]), "curve", "back");
    function draw() {
      const z0 = logit(p0), z1 = Math.max(-6, Math.min(6, z0 + dz)), p1 = Lam(z0 + dz);
      ["main", "front", "top"].forEach((g) => { A.clear(g); B.clear(g); });
      A.line(z0, 0, z0, p0, "truth"); A.line(z1, 0, z1, p1, "est");
      A.line(-6, p0, z0, p0, "truth"); A.line(-6, p1, z1, p1, "est");
      A.dot(z0, p0, 6, "dot-pop", "front"); A.dot(z1, p1, 6, "dot-v", "front");
      A.text(-5.8, p1 + (p1 > p0 ? 0.04 : -0.06), `after: ${fmt(p1, 3)}`, { class: "est-label halo" });
      A.text(-5.8, p0 + (p1 > p0 ? -0.06 : 0.04), `before: ${fmt(p0, 3)}`, { class: "truth-label halo" });
      B.dot(z0, p0 * (1 - p0), 6, "dot-pop", "front");
      B.text(z0, p0 * (1 - p0) + 0.02, `${fmt(p0 * (1 - p0), 3)}`, { class: "lbl halo", "text-anchor": "middle" });
      ro.innerHTML = `<span>Change in probability: <b>${p1 > p0 ? "+" : ""}${fmt(100 * (p1 - p0), 1)} points</b></span>` +
        `<span>Approximation β·ΔX·p(1 − p): <b>${dz * p0 * (1 - p0) > 0 ? "+" : ""}${fmt(100 * dz * p0 * (1 - p0), 1)} points</b> (good for small changes)</span>`;
    }
    draw();
  };

  /* ============ classification threshold ============ */
  W.threshold = function (root) {
    let thr = 0.5;
    const ch = D.churn, nC = sum(ch.thrChurn), nS = sum(ch.thrStay), n = nC + nS;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(slider("Flag a customer if Pr(churn) is above", 0.05, 0.8, 0.01, thr, (v) => fmt(v, 2), (v) => { thr = v; draw(); }));
    const { charts, hosts } = frame(root, ["Customers by predicted Pr(churn) (logit)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, legend([[COL.v, "churned"], [COL.u, "stayed"]]), ro);
    const P = new Plot(hosts[0], { w: 700, h: 210, x: [0, 0.82], y: [0, 560], m: { t: 12, r: 16, b: 40, l: 54 } });
    const edges = Array.from({ length: 42 }, (_, i) => i * 0.02);
    const stay = edges.slice(0, -1).map((_, i) => ch.thrStay[2 * i] + ch.thrStay[2 * i + 1]);
    const churn = edges.slice(0, -1).map((_, i) => ch.thrChurn[2 * i] + ch.thrChurn[2 * i + 1]);
    function draw() {
      P.axes({ xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], xlab: "Predicted probability of churn", ylab: "Customers" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.rect(thr, 0, 0.82, 560, "shade", "back");
      stay.forEach((s, i) => { if (s) P.rect(edges[i] + 0.002, 0, edges[i + 1] - 0.002, Math.min(560, s), "bar-u"); });
      churn.forEach((c, i) => { if (c && stay[i] < 560) P.rect(edges[i] + 0.002, stay[i], edges[i + 1] - 0.002, Math.min(560, stay[i] + c), "bar-v"); });
      const over = stay.map((s, i) => s + churn[i]).filter((v) => v > 560);
      if (over.length) P.text(0.012 + 0.02 * over.length, 520, `↑ off the scale: ${over.map((v) => v.toLocaleString()).join(" and ")} customers, almost none churned`, { class: "lbl halo" });
      P.vline(thr, "est", `threshold ${fmt(thr, 2)}`);
      const k = Math.round(thr * 100);
      const tp = sum(ch.thrChurn.slice(k)), fp = sum(ch.thrStay.slice(k));
      ro.innerHTML = `<span>Flagged: <b>${pct((tp + fp) / n)}</b> of customers</span><span>Churners caught: <b>${pct(tp / nC)}</b></span>` +
        `<span>Stayers flagged (false alarms): <b>${pct(fp / nS)}</b></span><span>Accuracy: <b>${pct((tp + nS - fp) / n, 1)}</b> (predicting "nobody churns": ${pct(nS / n, 1)})</span>`;
    }
    draw();
  };

  /* ============ the case: who got visited ============ */
  function twoHists(root, titles, edges, a, b, xlab, means) {
    const { charts, hosts } = frame(root, titles);
    root.append(charts);
    const top = Math.max(...a, ...b) * 1.12;
    [a, b].forEach((counts, j) => {
      const P = new Plot(hosts[j], { w: 360, h: 210, x: [edges[0], edges[edges.length - 1]], y: [0, top], m: { t: 12, r: 10, b: 40, l: 50 } });
      P.axes({ xlab, ylab: j ? "" : "Doctors", yf: (v) => v.toLocaleString() });
      P.bars(edges, counts, j ? "bar-v" : "bar-u");
      if (means) P.vline(means[j], "truth", `mean ${fmt(means[j], 1)}`);
    });
  }
  W.priorHist = function (root) {
    twoHists(root, [`Not visited (${C.n0.toLocaleString()} doctors)`, `Visited (${C.n1.toLocaleString()} doctors)`], C.rxEdges, C.rxHist0, C.rxHist1,
      "Prior prescriptions (score before)", [C.prior0, C.prior1]);
    root.append(h(`<div class="readout"><span>Visited doctors wrote <b>${pct(C.prior1 / C.prior0 - 1)}</b> more prescriptions <i>before</i> anyone visited them</span></div>`));
  };
  W.tradTable = function (root) {
    const T = C.trad;
    root.append(h(`<div style="overflow-x:auto"><table class="t" style="font-size:14px"><tr><th class="l">Decile</th>${T.map((r) => `<th${r.d === 10 ? ' class="hi"' : ""}>${r.d}</th>`).join("")}</tr>` +
      `<tr><td class="l">Mean prior score</td>${T.map((r) => `<td${r.d === 10 ? ' class="hi"' : ""}>${fmt(r.prior, 0)}</td>`).join("")}</tr>` +
      `<tr><td class="l">Mean predicted</td>${T.map((r) => `<td${r.d === 10 ? ' class="hi"' : ""}>${fmt(r.pred, 0)}</td>`).join("")}</tr></table></div>`),
      h(`<p class="small" style="margin:2px 0 0">About ${T[0].n.toLocaleString()} unvisited doctors per decile.</p>`));
  };
  W.specBars = function (root) {
    const { charts, hosts } = frame(root, ["Share of doctors by specialty"]);
    root.append(charts, legend([[COL.u, "not visited"], [COL.v, "visited"]]));
    const S = C.specialties;
    const P = new Plot(hosts[0], { w: 420, h: 250, x: [-0.6, S.length - 0.4], y: [0, 0.65], m: { t: 12, r: 10, b: 40, l: 46 } });
    P.axes({ xt: [], yf: (v) => Math.round(v * 100) + "%" });
    S.forEach((s, i) => {
      P.rect(i - 0.36, 0, i - 0.02, C.spec0[i], "bar-u");
      P.rect(i + 0.02, 0, i + 0.36, C.spec1[i], "bar-v");
      P.text(i, -0.05, s, { "text-anchor": "middle", class: "lbl" });
    });
  };

  /* ============ overlap and common support ============ */
  W.overlap = function (root) {
    let showQ = true;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([[true, "Show the five strata"], [false, "Hide them"]], showQ, (v) => { showQ = v; draw(); }));
    const { charts, hosts } = frame(root, ["Not visited", "Visited"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const top = Math.max(...C.pHist0) * 1.1;
    const Ps = [C.pHist0, C.pHist1].map((cnt, j) => new Plot(hosts[j], { w: 700, h: 150, x: [0, 1], y: [0, j ? Math.max(...C.pHist1) * 1.15 : top], m: { t: 8, r: 16, b: j ? 40 : 24, l: 54 } }));
    function draw() {
      Ps.forEach((P, j) => {
        P.axes({ xlab: j ? "Estimated propensity score ê(X)" : "", ylab: "Doctors" });
        ["back", "main", "front", "top"].forEach((g) => P.clear(g));
        P.rect(0, 0, C.cs[0], P.y1, "shade", "back");
        P.rect(C.cs[1], 0, 1, P.y1, "shade", "back");
        P.bars(C.pEdges, j ? C.pHist1 : C.pHist0, j ? "bar-v" : "bar-u");
        P.vline(j ? C.pMean1 : C.pMean0, "truth", `mean ${fmt(j ? C.pMean1 : C.pMean0, 2)}`);
        if (showQ) C.quintiles.forEach((q) => { const l = P.line(q, 0, q, P.y1, "truth", "front"); l.style.strokeDasharray = "2 3"; l.style.opacity = 0.6; });
      });
      ro.innerHTML = `<span>Common support (grey area excluded): <b>${fmt(C.cs[0], 3)} to ${fmt(C.cs[1], 3)}</b></span>` +
        `<span>Dropped: <b>${C.dropped1}</b> visited, <b>${C.dropped0}</b> unvisited doctors</span>` + (showQ ? `<span>Dotted lines: quintiles of the score = the five strata of Part 3</span>` : "");
    }
    draw();
  };

  /* ============ balance inside one bin of the score ============ */
  W.binBalance = function (root) {
    let k = 5;
    const opts = C.bins.map((b, i) => [i, `${fmt(b.lo, 1)}–${fmt(b.lo + 0.1, 1)}`]).filter(([i]) => C.bins[i].n1 && C.bins[i].n0);
    const ctr = h(`<div class="controls"><span class="small">Score bin:</span></div>`);
    ctr.append(seg(opts.concat([[-1, "All doctors"]]), k, (v) => { k = v; draw(); }));
    const { charts, hosts } = frame(root, ["Prior prescriptions (share of each group)", "Specialty mix"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, legend([[COL.u, "not visited"], [COL.v, "visited"]]), ro);
    const A = new Plot(hosts[0], { w: 420, h: 230, x: [0, 100], y: [0, 0.4], m: { t: 12, r: 10, b: 40, l: 46 } });
    const B = new Plot(hosts[1], { w: 420, h: 230, x: [-0.6, 5.6], y: [0, 0.7], m: { t: 12, r: 10, b: 40, l: 46 } });
    function draw() {
      const b = k < 0 ? { n1: C.n1, n0: C.n0, prior1: C.prior1, prior0: C.prior0, rx1: C.rxHist1, rx0: C.rxHist0, spec1: C.spec1, spec0: C.spec0 } : C.bins[k];
      const s1 = sum(b.rx1), s0 = sum(b.rx0);
      const r1 = b.rx1.map((v) => v / s1), r0 = b.rx0.map((v) => v / s0);
      const top = Math.max(...r1, ...r0) * 1.15;
      A.setY(0, top);
      A.axes({ xlab: "Prior prescriptions", yf: (v) => Math.round(v * 100) + "%" });
      ["main", "front", "top"].forEach((g) => { A.clear(g); B.clear(g); });
      r0.forEach((v, i) => { if (v) A.rect(C.rxEdges[i] + 0.4, 0, C.rxEdges[i] + 2.5, v, "bar-u"); });
      r1.forEach((v, i) => { if (v) A.rect(C.rxEdges[i] + 2.5, 0, C.rxEdges[i + 1] - 0.4, v, "bar-v"); });
      B.axes({ xt: [], yf: (v) => Math.round(v * 100) + "%" });
      C.specialties.forEach((s, i) => {
        B.rect(i - 0.36, 0, i - 0.02, b.spec0[i], "bar-u");
        B.rect(i + 0.02, 0, i + 0.36, b.spec1[i], "bar-v");
        B.text(i, -0.055, s, { "text-anchor": "middle", class: "lbl" });
      });
      ro.innerHTML = `<span>${k < 0 ? "All doctors" : "Doctors with " + opts.find((o) => o[0] === k)[1].replace("–", " ≤ ê(X) &lt; ")}: <b>${b.n1.toLocaleString()}</b> visited, <b>${b.n0.toLocaleString()}</b> not</span>` +
        `<span>Mean prior prescriptions: visited <b>${fmt(b.prior1, 1)}</b>, not visited <b>${fmt(b.prior0, 1)}</b></span>`;
    }
    draw();
  };

  /* ============ subclassification ============ */
  W.strata = function (root) {
    let K = 5;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(slider("Number of strata", 1, 20, 1, K, (v) => v, (v) => { K = v; draw(); }));
    const wrap = h(`<div class="cols"></div>`);
    const { charts, hosts } = frame(root, ["Estimated effect on the visited (ATT) by number of strata"]);
    const tbl = h(`<div></div>`);
    wrap.append(charts, tbl);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, wrap, ro);
    const P = new Plot(hosts[0], { w: 420, h: 260, x: [0.5, 20.5], y: [0, 10], m: { t: 12, r: 12, b: 40, l: 40 } });
    const S = C.strata;
    function draw() {
      P.axes({ xt: [1, 5, 10, 15, 20], xlab: "Strata (quantiles of the score)", yt: [0, 2, 4, 6, 8, 10] });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      P.hline(C.trueAttCs, "truth", `truth ${fmt(C.trueAttCs, 2)}`);
      const pts = Array.from({ length: 20 }, (_, i) => [i + 1, S[i + 1].att]);
      P.path(pts.filter((p) => p[1] <= 10.5), "path", "main").style.stroke = "var(--c-est)";
      pts.forEach(([x, y]) => { if (y <= 10) P.dot(x, y, x === K ? 6 : 3, "dot-v"); });
      if (K === 1) P.text(1.4, 9.4, `one stratum: ${fmt(S[1].att, 1)} (off the chart)`, { class: "est-label halo" });
      else P.text(K, S[K].att + 0.7, fmt(S[K].att, 2), { class: "est-label halo", "text-anchor": "middle" });
      const s = S[K];
      tbl.innerHTML = K <= 8
        ? `<table class="t" style="font-size:13.5px"><tr><th>Score range</th><th>Visited</th><th>Not</th><th>Prior Rx (v / not)</th><th>Difference</th></tr>` +
          s.rows.map((r) => `<tr><td>${fmt(r.lo, 2)}–${fmt(r.hi, 2)}</td><td>${r.n1.toLocaleString()}</td><td>${r.n0.toLocaleString()}</td><td>${fmt(r.prior1, 0)} / ${fmt(r.prior0, 0)}</td><td>${r.diff > 0 ? "+" : ""}${fmt(r.diff, 2)}</td></tr>`).join("") + `</table>`
        : `<p class="small">${K} strata of about ${Math.round((C.n0 + C.n1 - C.dropped0 - C.dropped1) / K).toLocaleString()} doctors each. The top stratum now spans scores from ${fmt(s.rows[s.rows.length - 1].lo, 2)} to ${fmt(s.rows[s.rows.length - 1].hi, 2)}.</p>`;
      const removed = 1 - (s.att - C.trueAttCs) / (C.naiveCs - C.trueAttCs);
      ro.innerHTML = `<span>Effect on the visited (ATT): <b>${fmt(s.att, 2)}</b> (truth ${fmt(C.trueAttCs, 2)})</span><span>Effect on everyone (ATE): <b>${fmt(s.ate, 2)}</b> (truth ${fmt(C.trueAteCs, 2)})</span>` +
        `<span>Share of the naive bias removed: <b>${pct(Math.max(0, removed))}</b></span>`;
    }
    draw();
  };

  /* ============ matching on the score ============ */
  W.matchPicture = function (root) {
    let M = 1, cal = "wide";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(h(`<span class="small">Neighbors:</span>`), seg([[1, "1"], [5, "5"], [10, "10"]], M, (v) => { M = v; draw(); }),
      h(`<span class="small">Caliper:</span>`), seg([["none", "none"], ["wide", "0.2 SD (usual)"], ["tight", "0.02 SD"]], cal, (v) => { cal = v; draw(); }));
    const { charts, hosts } = frame(root, ["A sample: 24 visited doctors (top), 120 unvisited (bottom), by the log-odds of the score"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 170, x: [-4.3, 1.7], y: [0, 1], m: { t: 10, r: 16, b: 40, l: 16 } });
    const V = C.sampleV, U = C.sampleU;
    function draw() {
      const width = cal === "none" ? Infinity : cal === "wide" ? C.caliper : C.tight;
      P.axes({ noY: true, xt: [-4, -3, -2, -1, 0, 1], xlab: "log(ê / (1 − ê))" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      const used = new Set();
      V.forEach((x) => {
        const order = U.map((u, j) => [Math.abs(u - x), j]).sort((a, b) => a[0] - b[0]).slice(0, M);
        let any = false;
        order.forEach(([d, j]) => { if (d <= width) { P.line(x, 0.8, U[j], 0.2, "match"); used.add(j); any = true; } });
        if (!any) P.line(x, 0.8, U[order[0][1]], 0.2, "match-bad");
        P.dot(x, 0.8, 5, any ? "dot-v" : "dot-off", "front");
      });
      U.forEach((u, j) => P.dot(u, 0.2, 3.5, used.has(j) ? "dot-u" : "dot-off", "front"));
      const r = C.match[`${M}-${cal}`];
      ro.innerHTML = `<span><b>All 20,000 doctors</b>: effect on the visited <b>${fmt(r.att, 2)}</b> (truth ${fmt(r.trueAtt, 2)})</span>` +
        `<span>Visited doctors without a match: <b>${r.unmatched}</b></span><span>Distinct unvisited doctors used: <b>${r.distinct.toLocaleString()}</b></span>` +
        `<span class="small">Dashed red: the nearest neighbor is outside the caliper, so the visited doctor is dropped</span>`;
    }
    draw();
  };

  /* ============ Love plot ============ */
  W.lovePlot = function (root) {
    const show = { before: true, matched: true, weighted: false };
    const ctr = h(`<div class="controls"></div>`);
    [["before", "Before"], ["matched", "After matching"], ["weighted", "After weighting"]].forEach(([k, lab]) => {
      const b = h(`<label><input type="checkbox" ${show[k] ? "checked" : ""}> ${lab}</label>`);
      b.querySelector("input").addEventListener("change", (e) => { show[k] = e.target.checked; draw(); });
      ctr.append(b);
    });
    const { charts, hosts } = frame(root, ["|Standardized mean difference|, visited vs. comparison"]);
    charts.classList.add("one");
    root.append(ctr, charts);
    const rows = C.smd;
    const P = new Plot(hosts[0], { w: 520, h: 34 + 22 * rows.length, x: [0, 1], y: [-0.5, rows.length - 0.5], m: { t: 8, r: 16, b: 36, l: 150 } });
    function draw() {
      P.axes({ noY: true, xt: [0, 0.1, 0.25, 0.5, 0.75, 1] });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.vline(0.1, "truth", "0.1", "back");
      rows.forEach((r, i) => {
        const y = rows.length - 1 - i;
        P.text(-0.02, y - 0.25, r.cov, { "text-anchor": "end", class: "lbl" }).setAttribute("x", P.sx(0) - 8);
        P.line(0, y, 1, y, "match", "back").style.opacity = 0.25;
        if (show.before) P.dot(Math.abs(r.before), y, 5, "dot-v");
        if (show.matched) { const s = P.dot(Math.abs(r.matched), y, 5, "dot-u"); s.style.fill = COL.g; s.style.opacity = 1; }
        if (show.weighted) P.dot(Math.abs(r.weighted), y, 4.5, "dot-u");
      });
    }
    root.append(legend([[COL.v, "before"], [COL.g, "after matching (nearest neighbor, caliper)"], [COL.u, "after weighting (ATT weights)"]]));
    draw();
  };

  /* ============ trimming the weights ============ */
  W.trimming = function (root) {
    let k = 0;
    const T = C.trim;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(slider("Drop scores below a and above 1 − a; a =", 0, 0.15, 0.01, 0, (v) => fmt(v, 2), (v) => { k = Math.round(v * 100); draw(); }));
    const { charts, hosts } = frame(root, ["Estimated scores (both groups); grey = dropped"]);
    const est = h(`<div></div>`);
    const wrap = h(`<div class="cols c-60"></div>`);
    wrap.append(charts, est);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, wrap, ro);
    const P = new Plot(hosts[0], { w: 460, h: 220, x: [0, 1], y: [0, Math.max(...C.pHist0.map((v, i) => v + C.pHist1[i])) * 1.1], m: { t: 10, r: 12, b: 40, l: 50 } });
    function draw() {
      const t = T[k], a = t.a;
      P.axes({ xlab: "Estimated propensity score", ylab: "Doctors" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      C.pEdges.slice(0, -1).forEach((x0, i) => {
        const x1 = C.pEdges[i + 1], u = C.pHist0[i], v = C.pHist1[i];
        if (u) P.rect(x0 + 0.002, 0, x1 - 0.002, u, "bar-u");
        if (v) P.rect(x0 + 0.002, u, x1 - 0.002, u + v, "bar-v");
      });
      if (a > 0) { P.rect(0, 0, a, P.y1, "shade", "front"); P.rect(1 - a, 0, 1, P.y1, "shade", "front"); }
      est.innerHTML = `<table class="t" style="font-size:14px"><tr><th class="l"></th><th>Estimate</th><th>Truth for the doctors kept</th></tr>` +
        `<tr><td class="l">Effect on everyone (ATE)</td><td class="hi">${fmt(t.ate, 2)}</td><td>${fmt(t.trueAte, 2)}</td></tr>` +
        `<tr><td class="l">Effect on the visited (ATT)</td><td class="hi">${fmt(t.att, 2)}</td><td>${fmt(t.trueAtt, 2)}</td></tr></table>`;
      ro.innerHTML = `<span>Dropped: <b>${t.drop1.toLocaleString()}</b> visited, <b>${t.drop0.toLocaleString()}</b> unvisited</span>` +
        `<span>Largest weight: <b>${fmt(t.wmax, 1)}</b></span><span>Effective size of the weighted unvisited group: <b>${t.ess0.toLocaleString()}</b> of ${(t.kept - (C.n1 - t.drop1)).toLocaleString()}</span>`;
    }
    root.append(legend([[COL.u, "not visited"], [COL.v, "visited"]]));
    draw();
  };

  /* ============ deciles: the company's list vs the causal list ============ */
  W.deciles = function (root) {
    let showEst = false;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([[false, "True effects"], [true, "… and the estimates"]], showEst, (v) => { showEst = v; draw(); }));
    const { charts, hosts } = frame(root, ["Effect of a visit (extra prescriptions), by decile of each ranking (10 = visit first)"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 250, x: [0.5, 10.5], y: [-2, 8], m: { t: 12, r: 16, b: 40, l: 46 } });
    function draw() {
      P.setY(showEst ? -32 : -2, showEst ? 32 : 8);
      P.axes({ xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xlab: "Decile of the ranking", yt: showEst ? [-30, -20, -10, 0, 10, 20, 30] : [-2, 0, 2, 4, 6, 8] });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.hline(0, "truth", "", "back");
      const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      P.path(xs.map((x, i) => [x, C.decTrad[i]]), "line-m");
      P.path(xs.map((x, i) => [x, C.decCausal[i]]), "line-g");
      xs.forEach((x, i) => { P.dot(x, C.decTrad[i], 4, "lm"); P.dot(x, C.decCausal[i], 4, "lg"); });
      if (showEst) { P.path(xs.map((x, i) => [x, C.decEst[i]]), "line-dot"); xs.forEach((x, i) => P.dot(x, C.decEst[i], 3, "lg")); }
      P.text(10.3, C.decTrad[9] - (showEst ? 3 : 0.6), "company's list (predicted prescriptions)", { "text-anchor": "end", class: "lbl halo" }).style.fill = "var(--muted)";
      P.text(10.3, C.decCausal[9] + (showEst ? 3 : 0.6), "causal list: true effect", { "text-anchor": "end", class: "lbl halo" }).style.fill = "var(--good)";
      if (showEst) P.text(9.6, C.decEst[9], "causal list: the estimates", { "text-anchor": "end", class: "lbl halo" }).style.fill = "var(--good)";
      ro.innerHTML = `<span>Company's top decile: true effect <b>${fmt(C.decTrad[9], 2)}</b></span><span>Causal list's top decile: <b>${fmt(C.decCausal[9], 2)}</b></span>` +
        (showEst ? `<span>Estimates: <b>${fmt(C.decEst[0], 0)}</b> to <b>+${fmt(C.decEst[9], 0)}</b> (SD of one doctor's estimate ≈ ${fmt(C.estSd, 0)})</span>` : "");
    }
    draw();
  };

  /* ============ LaLonde with the score ============ */
  W.lalonde = function (root) {
    let g = "cps1";
    const L = D.lalonde;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([["cps1", "CPS-1: 15,992 survey men"], ["cps3", "CPS-3: 429 pre-screened men"]], g, (v) => { g = v; draw(); }));
    const { charts, hosts } = frame(root, ["Estimated scores (count, log scale)", "Estimated effect on 1978 earnings ($)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, legend([[COL.u, "comparison men"], [COL.v, "trainees"]]), ro);
    const A = new Plot(hosts[0], { w: 420, h: 240, x: [0, 1], y: [0, 4.4], m: { t: 12, r: 10, b: 40, l: 46 } });
    const B = new Plot(hosts[1], { w: 420, h: 240, x: [-9000, 3000], y: [-0.5, 6.3], m: { t: 12, r: 14, b: 40, l: 128 } });
    const lg = (v) => (v > 0 ? Math.log10(v) + 0.3 : 0);
    function draw() {
      const d = L[g];
      A.axes({ xlab: "Estimated propensity score", yt: [0.3, 1.3, 2.3, 3.3, 4.3], yf: (v) => [1, 10, 100, "1,000", "10,000"][Math.round(v - 0.3)] });
      ["main", "front", "top"].forEach((k) => { A.clear(k); B.clear(k); });
      d.pEdges.slice(0, -1).forEach((x0, i) => {
        const x1 = d.pEdges[i + 1], c = lg(d.pHistC[i]), t = lg(d.pHistT[i]);
        if (c) A.rect(x0 + 0.002, 0, (x0 + x1) / 2, c, "bar-u");
        if (t) A.rect((x0 + x1) / 2, 0, x1 - 0.002, t, "bar-v");
      });
      const rows = [["Raw difference", d.raw], ["OLS, 8 covariates", d.ols], ["5 strata of the score", d.strat], ["Matching, 1 neighbor", d.match1], ["Matching, 10 in caliper", d.match10], ["Weighting (ATT)", d.ipw]];
      B.axes({ noY: true, xt: [-8000, -4000, 0, 2000], xf: (v) => (v / 1000) + "k" });
      rows.forEach(([lab, v], i) => {
        const y = rows.length - 1 - i, x = Math.max(-9000, v);
        B.rect(0, y - 0.3, x, y + 0.3, i ? "bar-sample" : "bar-bad");
        B.text(-9000, y - 0.12, lab, { "text-anchor": "end", class: "lbl" }).setAttribute("x", B.sx(-9000) - 6);
        B.text(Math.max(0, v) + 150, y - 0.12, (v < 0 ? "−" : "") + "$" + Math.abs(v).toLocaleString(), { "text-anchor": "start", class: "lbl halo" });
      });
      B.vline(L.experiment, "est", `experiment $${L.experiment.toLocaleString()}`);
      ro.innerHTML = `<span>Comparison men with a score below 0.01: <b>${pct(d.below01)}</b></span><span>One-to-one matching used <b>${d.distinct}</b> distinct men for 185 trainees</span>`;
    }
    draw();
  };
})();
