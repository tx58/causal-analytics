/* Simulations for the module on what can go wrong in experiments (uses window.Charts from charts.js).
 *   balanceSim     how many "significant" imbalances a perfectly randomized experiment shows
 *   stratified     two schools with different treatment shares: pooled vs. within-school comparisons
 *   noncompliance  compliers, always-takers, never-takers: ITT, first stage, Wald, as treated, per protocol
 *   eightUnits     Fisher's test by hand: pick 4 of 8 units, shuffle the labels, or list all 70 assignments
 *   resumePerm     the resume audit: shuffle the names and see how often a gap of 3.2 points appears
 *   tradeoff       internal vs. external validity as control over the setting grows (diagram)
 * Numbers follow code/A3_examples.py; the stratified and non-compliance widgets show large-experiment
 * (expected) values, so they differ slightly from the simulated numbers in the Beamer deck.
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const { el, h, fmt, mean, R, Plot, histogram, seg, button, frame } = window.Charts;

  // standard normal CDF (Abramowitz-Stegun 7.1.26)
  function Phi(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  }
  const pTwo = (z) => 2 * (1 - Phi(Math.abs(z)));
  function lgamma(x) {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  const lchoose = (n, k) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);

  /* ============ how many imbalances are normal? ============ */
  const COVS = ["Age", "Income", "Past purchases", "Months as a customer", "Share female", "Share urban", "Share on mobile", "Visits last month", "Basket size", "Opted in to email"];
  W.balanceSim = function (root) {
    let k = 10, counts = [], last = null;
    const ctr = h(`<div class="controls"></div>`);
    const lab = h(`<label>Pre-treatment variables checked <input type="range" min="5" max="30" step="1" value="${k}"><output>${k}</output></label>`);
    lab.querySelector("input").addEventListener("input", (e) => { k = +e.target.value; lab.querySelector("output").textContent = k; counts = []; last = null; draw(); });
    ctr.append(lab, button("Run one experiment", "", () => run(1)), button("Run 1,000 experiments", "primary", () => run(1000)));
    const wrap = h(`<div class="cols"></div>`);
    const tbl = h(`<div></div>`);
    const { charts, hosts } = frame(root, ["Experiments by number of p < 0.05 rows"]);
    wrap.append(tbl, charts);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, wrap, ro);
    const P = new Plot(hosts[0], { w: 420, h: 260, x: [-0.5, 4.5], y: [0, 1], m: { t: 14, r: 10, b: 40, l: 44 } });
    function run(times) {
      for (let t = 0; t < times; t++) {
        // each covariate's t-statistic is standard normal when assignment is random (2,000 units, 1,000 per arm)
        const z = Array.from({ length: k }, () => R.norm());
        counts.push(z.filter((v) => Math.abs(v) > 1.96).length);
        last = z;
      }
      draw();
    }
    function draw() {
      const se = Math.sqrt(2 / 1000);
      tbl.innerHTML = last ? `<table class="t" style="font-size:14px"><tr><th class="l">Variable</th><th>Difference (SDs)</th><th>p-value</th></tr>` +
        last.slice(0, 12).map((z, j) => { const p = pTwo(z); return `<tr${p < 0.05 ? ' class="sig"' : ""}><td class="l">${COVS[j % 10]}${j >= 10 ? " " + (Math.floor(j / 10) + 1) : ""}</td><td>${fmt(z * se, 3)}</td><td>${fmt(p, 3)}${p < 0.01 ? "**" : p < 0.05 ? "*" : ""}</td></tr>`; }).join("") +
        (k > 12 ? `<tr><td class="l small" colspan="3">… and ${k - 12} more rows</td></tr>` : "") + `</table>`
        : `<p class="small">Each experiment randomizes 2,000 customers and compares treated and control on ${k} pre-treatment variables.</p>`;
      P.axes({ xt: [0, 1, 2, 3, 4], xf: (v) => (v === 4 ? "4+" : v), yf: (v) => Math.round(v * 100) + "%", xlab: "Rows with p < 0.05" });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      if (counts.length) {
        const c = [0, 0, 0, 0, 0];
        counts.forEach((v) => c[Math.min(4, v)]++);
        c.forEach((v, j) => { const s = v / counts.length; P.rect(j - 0.35, 0, j + 0.35, s, j === 0 ? "bar-pop" : "bar-est"); P.text(j, s + 0.03, Math.round(s * 100) + "%", { "text-anchor": "middle", class: "lbl" }); });
      }
      const atLeast = counts.length ? counts.filter((v) => v >= 1).length / counts.length : NaN;
      ro.innerHTML = counts.length
        ? `<span>Experiments: <b>${counts.length.toLocaleString()}</b></span><span>With at least one "significant" row: <b>${fmt(100 * atLeast, 1)}%</b> (theory: 1 − 0.95<sup>${k}</sup> = ${fmt(100 * (1 - Math.pow(0.95, k)), 1)}%)</span>`
        : "";
    }
    draw();
  };

  /* ============ two schools, different treatment shares ============ */
  W.stratified = function (root) {
    const S = { A: { n: 1500, base: 60, tau: 7 }, B: { n: 500, base: 40, tau: 3 } };
    let pA = 0.8, pB = 0.3;
    const ctr = h(`<div class="controls"></div>`);
    const mk = (name, v, f) => { const l = h(`<label>Share treated in school ${name} <input type="range" min="0.05" max="0.95" step="0.05" value="${v}"><output>${Math.round(v * 100)}%</output></label>`); l.querySelector("input").addEventListener("input", (e) => { f(+e.target.value); l.querySelector("output").textContent = Math.round(+e.target.value * 100) + "%"; draw(); }); return l; };
    ctr.append(mk("A", pA, (v) => (pA = v)), mk("B", pB, (v) => (pB = v)));
    const { charts, hosts } = frame(root, ["Estimates of the effect of small classes (truth: ATE = 6)"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 250, x: [0, 18], y: [0, 5], m: { t: 10, r: 30, b: 40, l: 230 } });
    function draw() {
      const tA = S.A.n * pA, tB = S.B.n * pB, cA = S.A.n - tA, cB = S.B.n - tB;
      const naive = (tA * (S.A.base + S.A.tau) + tB * (S.B.base + S.B.tau)) / (tA + tB) - (cA * S.A.base + cB * S.B.base) / (cA + cB);
      const wA = S.A.n * pA * (1 - pA), wB = S.B.n * pB * (1 - pB);
      const dummy = (wA * S.A.tau + wB * S.B.tau) / (wA + wB);
      const sat = (S.A.n * S.A.tau + S.B.n * S.B.tau) / (S.A.n + S.B.n);
      const rows = [["Pooled difference in means", naive, "bar-bad"], ["Within school A", S.A.tau, "bar-pop"], ["Within school B", S.B.tau, "bar-pop"],
        ["Regression with a school dummy", dummy, "bar-est"], ["Within-school, weighted by size", sat, "bar-good"]];
      P.axes({ noY: true, xlab: "Percentile points", xt: [0, 3, 6, 9, 12, 15, 18] });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      rows.forEach(([name, v, cls], j) => {
        const y = 4.5 - j;
        P.rect(0, y - 0.32, Math.min(v, 18), y + 0.32, cls);
        P.text(0, y - 0.1, name, { "text-anchor": "end", class: "lbl", dx: -8 });
        P.text(Math.min(v, 18), y - 0.1, ` ${fmt(v, 1)}`, { class: "lbl", dx: 4 });
      });
      P.vline(6, "truth", "ATE = 6");
      ro.innerHTML = `<span>Treated group: <b>${Math.round(100 * tA / (tA + tB))}%</b> from school A · control group: <b>${Math.round(100 * cA / (cA + cB))}%</b> from school A</span>`;
    }
    draw();
  };

  /* ============ compliance types and five estimators ============ */
  W.noncompliance = function (root) {
    let pc = 0.5, sa = 0.4, g = 1;           // complier share; always-takers' share of the rest; how different non-compliers are
    const ctr = h(`<div class="controls"></div>`);
    const mk = (label, min, max, step, v, f, show) => { const l = h(`<label>${label} <input type="range" min="${min}" max="${max}" step="${step}" value="${v}"><output>${show(v)}</output></label>`); l.querySelector("input").addEventListener("input", (e) => { f(+e.target.value); l.querySelector("output").textContent = show(+e.target.value); draw(); }); return l; };
    ctr.append(mk("Compliers", 0.1, 0.9, 0.05, pc, (v) => (pc = v), (v) => Math.round(v * 100) + "%"),
      mk("Always-takers among the rest", 0, 1, 0.05, sa, (v) => (sa = v), (v) => Math.round(v * 100) + "%"),
      mk("How different are non-compliers?", 0, 1, 0.05, g, (v) => (g = v), (v) => (v === 0 ? "not at all" : v === 1 ? "as on the slides" : v.toFixed(2))));
    const cells = h(`<div></div>`);
    const { charts, hosts } = frame(root, ["Five estimators in a very large experiment (true effect on compliers: 4)"]);
    root.append(ctr, cells, charts);
    const P = new Plot(hosts[0], { w: 700, h: 250, x: [-2, 20], y: [0, 5], m: { t: 10, r: 30, b: 40, l: 190 } });
    function draw() {
      const pa = (1 - pc) * sa, pn = 1 - pc - pa;
      const y0 = { c: 50, a: 50 + 15 * g, n: 50 - 10 * g }, tau = { c: 4, a: 6, n: 2 };
      const itt = pc * tau.c, fs = pc, wald = itt / fs;
      const yD1 = (pa * (y0.a + tau.a) + (pc / 2) * (y0.c + tau.c)) / (pa + pc / 2);
      const yD0 = (pn * y0.n + (pc / 2) * y0.c) / (pn + pc / 2);
      const ppT = (pa * (y0.a + tau.a) + pc * (y0.c + tau.c)) / (pa + pc), ppC = (pn * y0.n + pc * y0.c) / (pn + pc);
      const asTreated = yD1 - yD0, perProtocol = ppT - ppC;
      cells.innerHTML = `<table class="t" style="font-size:14.5px"><tr><th></th><th>Received D = 0</th><th>Received D = 1</th></tr>` +
        `<tr><td class="l">Assigned Z = 0</td><td>compliers + never-takers (${Math.round(100 * (pc + pn))}%)</td><td>always-takers (${Math.round(100 * pa)}%)</td></tr>` +
        `<tr><td class="l">Assigned Z = 1</td><td>never-takers (${Math.round(100 * pn)}%)</td><td>compliers + always-takers (${Math.round(100 * (pc + pa))}%)</td></tr></table>` +
        `<p class="small" style="text-align:center">Outcome without treatment: compliers 50, always-takers ${fmt(y0.a, 0)}, never-takers ${fmt(y0.n, 0)}.</p>`;
      const rows = [["ITT (by assignment)", itt, "bar-sample"], ["First stage (share of compliers)", fs * 10, "bar-pop", `${fmt(fs, 2)} (×10 on this axis)`],
        ["Wald = ITT / first stage", wald, "bar-good"], ["As treated (by receipt)", asTreated, "bar-bad"], ["Per protocol", perProtocol, "bar-bad"]];
      P.axes({ noY: true, xlab: "Effect", xt: [0, 4, 8, 12, 16, 20] });
      ["main", "front", "top"].forEach((k) => P.clear(k));
      rows.forEach(([name, v, cls, label], j) => {
        const y = 4.5 - j, vv = Math.max(-2, Math.min(20, v));
        P.rect(0, y - 0.32, vv, y + 0.32, cls);
        P.text(-2, y - 0.1, name, { "text-anchor": "end", class: "lbl", dx: -8 });
        P.text(Math.max(0, vv), y - 0.1, ` ${label || fmt(v, 2)}`, { class: "lbl", dx: 4 });
      });
      P.vline(4, "truth", "effect on compliers = 4");
    }
    draw();
  };

  /* ============ Fisher's test by hand: eight units ============ */
  const Y8 = [12, 4, 6, 10, 6, 0, 1, 1];
  W.eightUnits = function (root) {
    let D = [1, 1, 1, 1, 0, 0, 0, 0];
    const seen = new Map();                   // assignment key -> tau
    const cards = h(`<div class="units"></div>`);
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(button("Actual assignment", "", () => { D = [1, 1, 1, 1, 0, 0, 0, 0]; record(); draw(); }),
      button("Shuffle the labels", "primary", () => { shuffle(); record(); draw(); }),
      button("Shuffle 10 times", "", () => { for (let t = 0; t < 10; t++) { shuffle(); record(); } draw(); }),
      button("Show all 70", "", () => { all(); draw(); }),
      button("Clear", "", () => { seen.clear(); draw(); }));
    const now = h(`<div class="readout"></div>`);
    const { charts, hosts } = frame(root, ["Difference in means for every assignment you have tried"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(cards, ctr, now, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 230, x: [-7, 7], y: [0, 6], m: { t: 12, r: 16, b: 40, l: 40 } });
    const tauOf = (d) => { const t = [], c = []; d.forEach((v, i) => (v ? t : c).push(Y8[i])); return t.length === 4 ? mean(t) - mean(c) : NaN; };
    function shuffle() { const idx = [0, 1, 2, 3, 4, 5, 6, 7]; for (let i = 7; i > 0; i--) { const j = R.int(i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; } D = new Array(8).fill(0); idx.slice(0, 4).forEach((i) => (D[i] = 1)); }
    function record() { const t = tauOf(D); if (Number.isFinite(t)) seen.set(D.join(""), t); }
    function all() { for (let m = 0; m < 256; m++) { const d = Array.from({ length: 8 }, (_, i) => (m >> (7 - i)) & 1); if (d.reduce((s, v) => s + v, 0) === 4) seen.set(d.join(""), tauOf(d)); } }
    function draw() {
      cards.innerHTML = Y8.map((y, i) => `<button type="button" class="unit${D[i] ? " on" : ""}" data-i="${i}"><span class="u">Unit ${i + 1}</span><span class="y">${y}</span><span class="lab">${D[i] ? "treated" : "control"}</span></button>`).join("");
      cards.querySelectorAll(".unit").forEach((b) => b.addEventListener("click", () => { D[+b.dataset.i] = 1 - D[+b.dataset.i]; record(); draw(); }));
      const nT = D.reduce((s, v) => s + v, 0), t = tauOf(D);
      now.innerHTML = nT === 4
        ? `<span>Treated mean − control mean = <b>${fmt(mean(Y8.filter((_, i) => D[i])), 2)} − ${fmt(mean(Y8.filter((_, i) => !D[i])), 2)} = ${fmt(t, 2)}</b></span>${D.join("") === "11110000" ? `<span>(the assignment that actually happened)</span>` : ""}`
        : `<span>Pick exactly 4 treated units (now ${nT}).</span>`;
      const vals = Array.from(seen.values());
      const cnt = new Map();
      vals.forEach((v) => cnt.set(v, (cnt.get(v) || 0) + 1));
      const top = Math.max(3, ...cnt.values());
      P.setY(0, top * 1.15);
      P.axes({ xt: [-6, -4, -2, 0, 2, 4, 6], xlab: "Difference in means", yf: (v) => (Number.isInteger(v) ? v : "") });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      cnt.forEach((c, v) => P.rect(v - 0.11, 0, v + 0.11, c, Math.abs(v) >= 6 - 1e-9 ? "bar-bad" : "bar-sample"));
      P.vline(6, "est", "actual: 6");
      const ge = vals.filter((v) => v >= 6 - 1e-9).length, abs = vals.filter((v) => Math.abs(v) >= 6 - 1e-9).length;
      ro.innerHTML = `<span>Assignments tried: <b>${vals.length}</b> of 70</span><span>As large as 6: <b>${ge}</b></span><span>As large as 6, either sign: <b>${abs}</b></span>` +
        (vals.length === 70 ? `<span><b>p = ${abs} / 70 = ${fmt(abs / 70, 3)}</b> (one-sided ${ge}/70 = ${fmt(ge / 70, 3)})</span>` : "");
    }
    record();
    draw();
  };

  /* ============ the resume audit: shuffle the names ============ */
  W.resumePerm = function (root) {
    const N0 = 2435, N1 = 2435, K0 = 235, K1 = 157;       // white / Black-sounding names, callbacks
    const Yall = new Uint8Array(N0 + N1), Dall = new Uint8Array(N0 + N1);
    for (let i = 0; i < N1; i++) { Dall[i] = 1; Yall[i] = i < K1 ? 1 : 0; }
    for (let i = 0; i < N0; i++) { Yall[N1 + i] = i < K0 ? 1 : 0; }
    let mode = "all", S = null, gaps = [];
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([["all", "All 4,870 résumés"], ["200", "A random 200"]], mode, (v) => { mode = v; setup(); draw(); }),
      button("Shuffle once", "", () => run(1)), button("Shuffle 1,000 times", "", () => run(1000)), button("Shuffle 20,000 times", "primary", () => run(20000)));
    const { charts, hosts } = frame(root, ["Callback gap (percentage points) after shuffling the names"]);
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 700, h: 260, x: [-5, 5], y: [0, 1], m: { t: 12, r: 16, b: 40, l: 16 } });
    function setup() {
      gaps = [];
      let n1 = N1, n = N0 + N1, k = K0 + K1, k1 = K1;
      if (mode === "200") {                              // draw 200 resumes without replacement
        const idx = Array.from({ length: N0 + N1 }, (_, i) => i);
        for (let i = 0; i < 200; i++) { const j = i + R.int(idx.length - i); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const pick = idx.slice(0, 200);
        n = 200; n1 = pick.filter((i) => Dall[i]).length; k = pick.filter((i) => Yall[i]).length; k1 = pick.filter((i) => Dall[i] && Yall[i]).length;
      }
      const n0 = n - n1, gap = 100 * (k1 / n1 - (k - k1) / n0);
      // exact distribution of the treated group's callbacks under the sharp null (labels shuffled): hypergeometric
      const lo = Math.max(0, n1 - (n - k)), hi = Math.min(k, n1), cdf = [];
      let s = 0;
      for (let j = lo; j <= hi; j++) { s += Math.exp(lchoose(k, j) + lchoose(n - k, n1 - j) - lchoose(n, n1)); cdf.push(s); }
      const pbar = k / n, se = 100 * Math.sqrt(pbar * (1 - pbar) * (n / (n - 2)) * (1 / n1 + 1 / n0));   // OLS (classical) standard error
      S = { n, n1, n0, k, k1, gap, lo, cdf, total: s, se };
      P.setX(mode === "all" ? -5 : -20, mode === "all" ? 5 : 20);
    }
    function draw1() {   // one shuffle: callbacks among the "Black-name" labels
      const u = R.u() * S.total;
      let a = 0, b = S.cdf.length - 1;
      while (a < b) { const m = (a + b) >> 1; if (S.cdf[m] < u) a = m + 1; else b = m; }
      const j = S.lo + a;
      return 100 * (j / S.n1 - (S.k - j) / S.n0);
    }
    function run(times) { for (let t = 0; t < times; t++) gaps.push(draw1()); draw(); }
    function draw() {
      const span = mode === "all" ? 5 : 20;
      P.axes({ noY: true, xlab: "Gap: Black-sounding minus white-sounding names (percentage points)", xt: mode === "all" ? [-4, -2, 0, 2, 4] : [-20, -10, 0, 10, 20] });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      if (gaps.length) {
        const hh = histogram(gaps, -span, span, mode === "all" ? 50 : 40, true);
        P.setY(0, Math.max(...hh.counts) * 1.15);
        P.bars(hh.edges, hh.counts, "bar-pop");
        hh.counts.forEach((c, k) => { const mid = (hh.edges[k] + hh.edges[k + 1]) / 2; if (c && Math.abs(mid) >= Math.abs(S.gap)) P.rect(hh.edges[k], 0, hh.edges[k + 1], c, "bar-bad"); });
      }
      P.vline(Math.max(-span, S.gap), "est", `actual gap ${fmt(S.gap, 1)}`);
      const extreme = gaps.filter((v) => Math.abs(v) >= Math.abs(S.gap) - 1e-9).length;
      const sdv = gaps.length > 1 ? Math.sqrt(gaps.reduce((t, v) => t + (v - mean(gaps)) ** 2, 0) / (gaps.length - 1)) : NaN;
      const pt = pTwo(S.gap / S.se);
      ro.innerHTML = `<span>${mode === "all" ? "All" : "Sample of"} ${S.n.toLocaleString()} résumés: callback rates <b>${fmt(100 * S.k1 / S.n1, 1)}%</b> vs. <b>${fmt(100 * (S.k - S.k1) / S.n0, 1)}%</b></span>` +
        (gaps.length ? `<span>Shuffles: <b>${gaps.length.toLocaleString()}</b></span><span>Gap at least as large (either sign): <b>${extreme.toLocaleString()}</b> → permutation p ${extreme ? "= <b>" + fmt(extreme / gaps.length, 3) + "</b>" : "&lt; <b>" + fmt(1 / gaps.length, 5) + "</b>"}</span>` +
          `<span>Spread of the shuffled gaps <b>${fmt(sdv, 2)}</b> vs. the regression's standard error <b>${fmt(S.se, 2)}</b></span>` : "") +
        `<span>t-test p-value: <b>${pt < 0.001 ? "&lt; 0.001" : fmt(pt, 3)}</b></span>`;
    }
    setup();
    draw();
  };

  /* ============ the internal / external validity trade-off ============ */
  W.tradeoff = function (root) {
    const { charts, hosts } = frame(root, [""]);
    root.append(charts);
    const P = new Plot(hosts[0], { w: 520, h: 280, x: [0, 10], y: [0, 10], m: { t: 16, r: 20, b: 44, l: 30 } });
    P.axes({ noY: true, xt: [], xlab: "More control over the setting →" });
    const xs = Array.from({ length: 51 }, (_, i) => i / 5);
    const a = P.path(xs.map((x) => [x, 1.2 + 7.8 * (1 - Math.exp(-x / 3))]), "path"); a.style.stroke = "var(--good)"; a.style.strokeWidth = 3;
    const b = P.path(xs.map((x) => [x, 9 - 0.75 * x]), "path"); b.style.stroke = "var(--bad)"; b.style.strokeWidth = 3;
    P.text(9.8, 8.4, "internal validity", { class: "lbl halo", "text-anchor": "end" }).style.fill = "var(--good)";
    P.text(0.3, 9.4, "resemblance to the real world", { class: "lbl halo" }).style.fill = "var(--bad)";
    P.text(0.3, 0.6, "field roll-out", { class: "lbl" });
    P.text(9.8, 0.6, "lab experiment", { class: "lbl", "text-anchor": "end" });
  };
})();
