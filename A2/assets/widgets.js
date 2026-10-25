/* Simulations for the module on the potential-outcomes framework (uses window.Charts from charts.js).
 *   fourUnits      the four-unit population: click D to assign, see what exists vs. what we see,
 *                  estimands and both selection-bias decompositions update live
 *   ashenfelter    earnings of 1964 MDTA trainees vs. a comparison group (Ashenfelter 1978, Table 1)
 *   selectionDial  100,000 stores: from self-selection to a coin flip, SDO = ATE + bias + heterogeneity
 *   llnSdo         difference in means as the sample grows, random assignment vs. self-selection
 *   badControls    run many experiments: no control, a pre-treatment control, a post-treatment control
 * The store population follows code/A2_examples.py (same model; JS random numbers, so values differ
 * slightly from the Python numbers quoted on the slides).
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const { el, h, fmt, mean, rng, R, Plot, histogram, seg, button, frame, ols } = window.Charts;

  /* ============ the four-unit population ============ */
  const Y1 = [3, 1, 1, 1], Y0 = [0, 1, 0, 1], TAU = Y1.map((v, i) => v - Y0[i]);
  const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
  function decompose(D) {
    const T = D.map((d, i) => (d ? i : -1)).filter((i) => i >= 0), C = D.map((d, i) => (d ? -1 : i)).filter((i) => i >= 0);
    const pick = (arr, idx) => idx.map((i) => arr[i]);
    const pi = T.length / 4, ATE = avg(TAU), ATT = avg(pick(TAU, T)), ATU = avg(pick(TAU, C));
    const Y = D.map((d, i) => (d ? Y1[i] : Y0[i]));
    const SDO = avg(pick(Y, T)) - avg(pick(Y, C)), SB = avg(pick(Y0, T)) - avg(pick(Y0, C));
    return { pi, ATE, ATT, ATU, SDO, SB, HTE: (1 - pi) * (ATT - ATU), Y, EY0T: avg(pick(Y0, T)), EY0C: avg(pick(Y0, C)), EY1T: avg(pick(Y1, T)), ok: T.length > 0 && C.length > 0 };
  }
  const n2 = (v) => (Number.isFinite(v) ? (Math.round(v * 100) / 100).toString() : "–");

  W.fourUnits = function (root) {
    let D = (root.dataset.assign || "1,1,0,0").split(",").map(Number);
    let view = root.dataset.view || "see";
    const show = root.dataset.show || "none", lock = root.hasAttribute("data-lock");
    const ctr = h(`<div class="controls"></div>`);
    if (root.dataset.views !== "none") {
      ctr.append(seg([["see", "What we see"], ["truth", "What exists (God's view)"]], view, (v) => { view = v; draw(); }));
    }
    if (!lock) {
      ctr.append(h(`<span class="small">Assignment:</span>`), seg([["1,1,0,0", "A"], ["0,1,0,1", "B"], ["1,0,1,0", "C"]], D.join(","), (v) => { D = v.split(",").map(Number); draw(); }));
      ctr.append(h(`<span class="small">or click a unit's D to switch it.</span>`));
    }
    const table = h(`<table class="t four"></table>`);
    const out = h(`<div class="four-out"></div>`);
    root.append(ctr, table, out);
    function cell(v, observed, hidden) {
      if (observed) return `<td><b>${v}</b></td>`;
      return hidden ? `<td class="cf">?</td>` : `<td class="cf">${v}</td>`;
    }
    function draw() {
      const d = decompose(D), hide = view === "see";
      let rows = `<tr><th>Unit <i>i</i></th><th>Y<sub>1i</sub></th><th>Y<sub>0i</sub></th><th>τ<sub>i</sub> = Y<sub>1i</sub> − Y<sub>0i</sub></th><th>D<sub>i</sub></th><th>Observed Y<sub>i</sub></th></tr>`;
      for (let i = 0; i < 4; i++) {
        rows += `<tr><td>${i + 1}</td>${cell(Y1[i], D[i] === 1, hide)}${cell(Y0[i], D[i] === 0, hide)}${hide ? `<td class="cf">?</td>` : `<td class="cf">${TAU[i]}</td>`}` +
          `<td>${lock ? D[i] : `<button type="button" class="dbtn${D[i] ? " on" : ""}" data-i="${i}" title="Switch unit ${i + 1}">${D[i]}</button>`}</td><td><b>${d.Y[i]}</b></td></tr>`;
      }
      rows += `<tr class="avg"><td>Average</td><td>${hide ? "?" : n2(avg(Y1))}</td><td>${hide ? "?" : n2(avg(Y0))}</td><td>${hide ? "?" : n2(d.ATE)}</td><td>π = ${n2(d.pi)}</td><td></td></tr>`;
      table.innerHTML = rows;
      table.querySelectorAll(".dbtn").forEach((b) => b.addEventListener("click", () => { D[+b.dataset.i] = 1 - D[+b.dataset.i]; draw(); }));
      if (show === "none") { out.innerHTML = ""; return; }
      if (!d.ok) { out.innerHTML = `<p class="small">Treat at least one unit and leave at least one untreated to compare groups.</p>`; return; }
      const q = (v) => (hide ? `<span class="cf">?</span>` : `<b>${n2(v)}</b>`);
      let html = "";
      if (show === "estimands" || show === "all") {
        html += `<div class="eq"><span class="lab">ATE = E[τ<sub>i</sub>]</span> ${q(d.ATE)}<span class="lab">ATT = E[τ<sub>i</sub> | D<sub>i</sub>=1]</span> ${q(d.ATT)}<span class="lab">ATU = E[τ<sub>i</sub> | D<sub>i</sub>=0]</span> ${q(d.ATU)}</div>` +
          `<div class="eq small">Check: π·ATT + (1−π)·ATU = ${hide ? "?" : `${n2(d.pi)}×${n2(d.ATT)} + ${n2(1 - d.pi)}×${n2(d.ATU)} = ${n2(d.pi * d.ATT + (1 - d.pi) * d.ATU)}`} = ATE ${hide ? "" : "✓"}</div>`;
      }
      if (show === "decomp" || show === "all") {
        html += `<div class="eq"><span class="lab">SDO = E[Y<sub>i</sub> | D=1] − E[Y<sub>i</sub> | D=0]</span> <b>${n2(d.SDO)}</b> <span class="small">(computable from the black numbers)</span></div>` +
          `<div class="eq"><span class="lab">Selection bias = E[Y<sub>0i</sub> | D=1] − E[Y<sub>0i</sub> | D=0]</span> ${hide ? `<span class="cf">?</span>` : `${n2(d.EY0T)} − ${n2(d.EY0C)} = <b>${n2(d.SB)}</b>`}</div>` +
          `<div class="eq"><span class="lab">Heterogeneity term = (1−π)(ATT − ATU)</span> ${q(d.HTE)}</div>` +
          (hide ? `<div class="eq small">Switch to God's view to see the terms. The SDO is all the data give you.</div>` :
            `<div class="eq"><span class="lab">Decomposition 1</span> SDO ${n2(d.SDO)} = ATT ${n2(d.ATT)} + selection bias ${n2(d.SB)} ✓</div>` +
            `<div class="eq"><span class="lab">Decomposition 2</span> SDO ${n2(d.SDO)} = ATE ${n2(d.ATE)} + selection bias ${n2(d.SB)} + heterogeneity ${n2(d.HTE)} ✓</div>`);
      }
      out.innerHTML = html;
    }
    draw();
  };

  /* ============ Ashenfelter's dip ============ */
  const YEARS = Array.from({ length: 11 }, (_, k) => 1959 + k);
  const ASH = {
    white: { t: [1443, 1533, 1572, 1843, 1810, 1551, 2923, 3750, 3964, 4401, 4717], c: [2588, 2699, 2782, 2963, 3108, 3275, 3458, 4351, 4430, 4955, 5033] },
    black: { t: [904, 976, 1017, 1211, 1182, 1273, 2327, 2983, 3048, 3409, 3714], c: [1438, 1521, 1573, 1742, 1896, 2121, 2338, 2919, 3097, 3487, 3681] },
  };
  W.ashenfelter = function (root) {
    let g = "white";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([["white", "White men"], ["black", "Black men"]], g, (v) => { g = v; draw(); }));
    const { charts, hosts } = frame(root, ["Mean annual earnings, 1964 trainees vs. a comparison group"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 300, x: [1958.5, 1969.5], y: [0, 5500] });
    function draw() {
      const d = ASH[g];
      P.axes({ xt: YEARS.filter((y) => y % 2 === 1), yf: (v) => "$" + v.toLocaleString(), ylab: "Earnings ($)" });
      ["back", "main", "front", "top"].forEach((k) => P.clear(k));
      P.rect(1963.5, 0, 1964.5, 5500, "band", "back");
      P.text(1964, 5250, "training year", { "text-anchor": "middle", class: "lbl" });
      const cp = P.path(YEARS.map((y, k) => [y, d.c[k]]), "path"); cp.style.stroke = "var(--c-pop)"; cp.style.strokeWidth = 3;
      const tp = P.path(YEARS.map((y, k) => [y, d.t[k]]), "path"); tp.style.stroke = "var(--c-sample)"; tp.style.strokeWidth = 3;
      YEARS.forEach((y, k) => { P.dot(y, d.c[k], 3.5, "dot-pop"); P.dot(y, d.t[k], 3.5, "dot-sample"); });
      P.text(1959.2, d.c[0] + 300, "comparison group", { class: "lbl halo" });
      P.text(1959.2, d.t[0] - 330, "trainees", { class: "lbl halo" });
      ro.innerHTML = `<span>1959: trainees <b>$${d.t[0].toLocaleString()}</b> vs. <b>$${d.c[0].toLocaleString()}</b></span><span>1964 (dip): <b>$${d.t[5].toLocaleString()}</b> vs. <b>$${d.c[5].toLocaleString()}</b></span><span>1969: <b>$${d.t[10].toLocaleString()}</b> vs. <b>$${d.c[10].toLocaleString()}</b></span>`;
    }
    draw();
  };

  /* ============ the simulated store population (as in code/A2_examples.py) ============ */
  let POP = null;
  function population() {
    if (POP) return POP;
    const g = rng(436), N = 100000;
    const base = new Float64Array(N), y0 = new Float64Array(N), tau = new Float64Array(N), eps = new Float64Array(N);
    let s = 0;
    for (let i = 0; i < N; i++) {
      base[i] = 50 + 10 * g.norm();
      y0[i] = base[i] + 8 * g.norm();
      tau[i] = 5 + 0.2 * (base[i] - 50) + 3 * g.norm();
      eps[i] = g.norm();
      s += tau[i];
    }
    POP = { N, base, y0, tau, eps, ATE: s / N };
    return POP;
  }
  // treated if s * z(base) + sqrt(1 - s^2) * noise > c; s = 0 is a coin flip, s = 0.857 is the deck's rule
  function assign(s, c) {
    const P = population(), d = new Uint8Array(P.N), k = Math.sqrt(1 - s * s);
    for (let i = 0; i < P.N; i++) d[i] = s * (P.base[i] - 50) / 10 + k * P.eps[i] > c ? 1 : 0;
    return d;
  }
  function decomp(d) {
    const P = population();
    let n1 = 0, y1s = 0, y0t = 0, y0c = 0, t1 = 0, t0 = 0;
    for (let i = 0; i < P.N; i++) {
      if (d[i]) { n1++; y1s += P.y0[i] + P.tau[i]; y0t += P.y0[i]; t1 += P.tau[i]; }
      else { y0c += P.y0[i]; t0 += P.tau[i]; }
    }
    const n0 = P.N - n1, pi = n1 / P.N, ATT = t1 / n1, ATU = t0 / n0;
    return { pi, ATE: P.ATE, ATT, ATU, SDO: y1s / n1 - y0c / n0, SB: y0t / n1 - y0c / n0, HTE: (1 - pi) * (ATT - ATU) };
  }

  W.selectionDial = function (root) {
    let s = 0.86;
    const ctr = h(`<div class="controls"></div>`);
    const lab = h(`<label>How strongly do big stores select into the promotion? <input type="range" min="0" max="0.95" step="0.01" value="${s}"><output></output></label>`);
    lab.querySelector("input").addEventListener("input", (e) => { s = +e.target.value; draw(); });
    ctr.append(lab, button("Coin flip (0)", "", () => set(0)), button("As on the slides (0.86)", "", () => set(0.86)));
    const { charts, hosts } = frame(root, ["The difference in means, taken apart (one third of the 100,000 stores are treated)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 250, x: [-2, 26], y: [0, 4], m: { t: 12, r: 20, b: 40, l: 150 } });
    function set(v) { s = v; lab.querySelector("input").value = v; draw(); }
    function draw() {
      lab.querySelector("output").textContent = s.toFixed(2);
      const d = decomp(assign(s, 0.4307));
      P.axes({ noY: true, xlab: "Weekly sales (thousands)", xt: [0, 5, 10, 15, 20, 25] });
      ["main", "front", "top"].forEach((k) => P.clear(k));
      const rows = [
        ["ATE", 0, d.ATE, "bar-good"],
        ["+ selection bias", d.ATE, d.ATE + d.SB, "bar-bad"],
        ["+ heterogeneity", d.ATE + d.SB, d.ATE + d.SB + d.HTE, "bar-est"],
        ["= difference in means", 0, d.SDO, "bar-sample"],
      ];
      rows.forEach(([name, a, b, cls], k) => {
        const y = 3.5 - k;
        P.rect(a, y - 0.32, b, y + 0.32, cls);
        P.text(-2, y - 0.1, name, { "text-anchor": "end", class: "lbl", dx: -8 });
        P.text(Math.max(a, b), y - 0.1, ` ${fmt(b - a, 2)}`, { class: "lbl", dx: 4 });
      });
      ro.innerHTML = `<span>ATE <b>${fmt(d.ATE, 2)}</b></span><span>ATT <b>${fmt(d.ATT, 2)}</b></span><span>ATU <b>${fmt(d.ATU, 2)}</b></span>` +
        `<span>Difference in means <b>${fmt(d.SDO, 2)}</b> = ${fmt(d.ATE, 2)} + ${fmt(d.SB, 2)} + ${fmt(d.HTE, 2)}</span>`;
    }
    draw();
  };

  W.llnSdo = function (root) {
    const P0 = population(), ns = Array.from({ length: 70 }, (_, k) => Math.round(10 * Math.pow(10000, k / 69)));
    const dSelf = assign(0.857, 0.4287);
    let order = null;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("Draw the stores in a new random order", "primary", () => { reshuffle(); draw(); }));
    const { charts, hosts } = frame(root, ["Difference in means among the first n stores (log scale)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 300, x: [10, 100000], y: [-10, 32], xlog: true });
    function reshuffle() {
      order = new Uint32Array(P0.N);
      for (let i = 0; i < P0.N; i++) order[i] = i;
      for (let i = P0.N - 1; i > 0; i--) { const j = R.int(i + 1); const t = order[i]; order[i] = order[j]; order[j] = t; }
    }
    function paths(coin) {
      const out = [];
      let n1 = 0, n0 = 0, s1 = 0, s0 = 0, k = 0;
      for (let m = 0; m < P0.N && k < ns.length; m++) {
        const i = order[m], d = coin ? (R.u() < 0.5 ? 1 : 0) : dSelf[i];
        if (d) { n1++; s1 += P0.y0[i] + P0.tau[i]; } else { n0++; s0 += P0.y0[i]; }
        if (m + 1 === ns[k]) { out.push([ns[k], n1 && n0 ? s1 / n1 - s0 / n0 : NaN]); k++; }
      }
      return out;
    }
    function draw() {
      if (!order) reshuffle();
      P.axes({ xlab: "Sample size n (log scale)", ylab: "Difference in means", xf: (v) => v.toLocaleString() });
      ["main", "front", "top"].forEach((k) => P.clear(k));
      const pr = paths(true), ps = paths(false);
      const clip = (pts) => pts.map(([x, y]) => [x, Math.max(P.y0, Math.min(P.y1, y))]);   // small samples swing off the chart
      const a = P.path(clip(pr), "path"); a.style.stroke = "var(--c-sample)"; a.style.strokeWidth = 2.2;
      const b = P.path(clip(ps), "path"); b.style.stroke = "var(--bad)"; b.style.strokeWidth = 2.2;
      P.hline(P0.ATE, "truth", `ATE = ${fmt(P0.ATE, 2)}`);
      P.text(90000, 24.5, "self-selection", { class: "lbl halo", "text-anchor": "end" }).style.fill = "var(--bad)";
      P.text(90000, 1, "random assignment", { class: "lbl halo", "text-anchor": "end" }).style.fill = "var(--c-sample)";
      ro.innerHTML = `<span>With all 100,000 stores: random assignment <b>${fmt(pr[pr.length - 1][1], 2)}</b>, self-selection <b>${fmt(ps[ps.length - 1][1], 2)}</b>, ATE <b>${fmt(P0.ATE, 2)}</b></span>`;
    }
    draw();
  };

  /* ============ good and bad controls, over many experiments ============ */
  W.badControls = function (root) {
    const P0 = population(), NS = 2000, SPECS = [
      ["(1) no controls", "bar-sample"], ["(2) + pre-treatment covariate", "bar-good"], ["(3) + post-treatment variable", "bar-bad"]];
    let est = [[], [], []], last = null, busy = false;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("Run one experiment", "", () => run(1)), button("Run 300 experiments", "primary", () => run(300)), button("Reset", "", () => { est = [[], [], []]; last = null; draw(); }));
    const tbl = h(`<table class="t"></table>`);
    const { charts, hosts } = frame(root, ["Estimated effect of the promotion in each experiment"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, tbl, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 260, x: [-1, 9], y: [0, 3], m: { t: 10, r: 16, b: 40, l: 16 } });
    function experiment() {
      const y = new Array(NS), d = new Array(NS), xpre = new Array(NS), mpost = new Array(NS);
      let tsum = 0;
      for (let j = 0; j < NS; j++) {
        const i = R.int(P0.N);
        d[j] = R.u() < 0.5 ? 1 : 0;
        y[j] = P0.y0[i] + d[j] * P0.tau[i];
        xpre[j] = P0.base[i] + 2 * R.norm();          // a noisy measure of the customer base, fixed before the promotion
        mpost[j] = 0.6 * y[j] + 4 * R.norm();          // foot traffic: the promotion moves it
        tsum += P0.tau[i];
      }
      const r = [ols(y, [d]), ols(y, [d, xpre]), ols(y, [d, mpost])];
      return { b: r.map((m) => m.beta[1]), se: r.map((m) => m.se[1]), ate: tsum / NS };
    }
    function run(k) {
      if (busy) return;
      busy = true;
      let left = k;
      const step = () => {
        const m = Math.min(25, left);
        for (let t = 0; t < m; t++) { last = experiment(); last.b.forEach((b, s) => est[s].push(b)); }
        left -= m;
        draw();
        if (left > 0) setTimeout(step, 0); else busy = false;
      };
      step();
    }
    function draw() {
      tbl.innerHTML = `<tr><th class="l">Latest experiment (2,000 stores)</th><th>effect of D</th><th>std. error</th></tr>` +
        SPECS.map(([name], s) => `<tr><td class="l">${name}</td><td>${last ? fmt(last.b[s], 2) : "–"}</td><td>${last ? fmt(last.se[s], 2) : "–"}</td></tr>`).join("") +
        `<tr><td class="l small">True ATE in this sample</td><td>${last ? fmt(last.ate, 2) : "–"}</td><td></td></tr>`;
      P.axes({ noY: true, xlab: "Estimated effect of the promotion", xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
      ["main", "front", "top"].forEach((k) => P.clear(k));
      SPECS.forEach(([name, cls], s) => {
        const y0 = 2 - s, hh = histogram(est[s], -1, 9, 80, true), top = Math.max(1, ...hh.counts);
        hh.counts.forEach((c, k) => { if (c) P.rect(hh.edges[k] + 0.01, y0 + 0.05, hh.edges[k + 1] - 0.01, y0 + 0.05 + 0.85 * c / top, cls); });
        P.text(8.9, y0 + 0.75, name, { class: "lbl halo", "text-anchor": "end" });
      });
      P.vline(P0.ATE, "truth", `ATE ≈ ${fmt(P0.ATE, 1)}`);
      const sdv = (a) => (a.length > 1 ? Math.sqrt(a.reduce((t, v) => t + (v - mean(a)) ** 2, 0) / (a.length - 1)) : NaN);
      ro.innerHTML = est[0].length
        ? `<span>Experiments: <b>${est[0].length}</b></span>` + SPECS.map(([name], s) => `<span>${name.split(" ")[0]} average <b>${fmt(mean(est[s]), 2)}</b>, spread <b>${fmt(sdv(est[s]), 2)}</b></span>`).join("")
        : `<span>Each experiment draws 2,000 stores, flips a coin for each, and runs the three regressions.</span>`;
    }
    draw();
  };
})();
