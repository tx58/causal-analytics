/* Simulations for the module on staggered rollouts (uses window.Charts from charts.js and window.A5 from
 * a5data.js, written by ../../code/A5_web_data.py).
 *   didPicture    the 2x2 picture, with parallel trends holding or failing
 *   mapTabs       the green-plate rollout maps (Dec 2016, Dec 2017, Mar 2018, Dec 2018)
 *   rolloutChart  cities adopting each month in the simulated rollout, and the share already treated
 *   controlsGrid  12 stylized cities: for a wave and a month, who is a fair or a forbidden comparison
 *   twoWaves      the two-wave example: an effect that grows; the one-number regression vs. the truth
 *   gpSim         the simulated green-plate rollout: fair comparisons vs. the one-number regression
 */
(function () {
  "use strict";
  const W = (window.Widgets = window.Widgets || {});
  const { h, fmt, Plot, seg, frame, ols } = window.Charts;
  const D = window.A5;
  function slider(label, min, max, step, value, show, onInput) {
    const l = h(`<label>${label} <input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${show(value)}</output></label>`);
    l.querySelector("input").addEventListener("input", (e) => { const v = +e.target.value; l.querySelector("output").textContent = show(v); onInput(v); });
    return l;
  }
  function legend(items) {   // [[colour, label, dashed?]]
    return h(`<div class="readout" style="margin-top:0">${items.map(([c, t, dash]) => `<span><svg width="22" height="10" style="vertical-align:middle"><line x1="1" y1="5" x2="21" y2="5" style="stroke:${c};stroke-width:3${dash ? ";stroke-dasharray:4 3" : ""}"></line></svg> ${t}</span>`).join("")}</div>`);
  }
  const COL = { v: "var(--c-est)", u: "var(--c-sample)", g: "var(--good)", b: "var(--bad)", m: "var(--faint)" };

  /* ============ DiD in one picture ============ */
  W.didPicture = function (root) {
    let fails = false;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([[false, "Parallel trends hold"], [true, "Parallel trends fail"]], fails, (v) => { fails = v; draw(); }));
    const { charts, hosts } = frame(root, ["Average outcome"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, legend([[COL.v, "treated group"], [COL.u, "comparison group"], [COL.v, "treated group without the change", true]]), ro);
    const P = new Plot(hosts[0], { w: 640, h: 230, x: [-0.15, 1.15], y: [0, 12], m: { t: 12, r: 120, b: 36, l: 44 } });
    function draw() {
      P.axes({ xt: [0, 1], xf: (v) => (v ? "after" : "before"), yt: [0, 4, 8, 12] });
      ["main", "front", "top"].forEach((g) => P.clear(g));
      const cf = fails ? 9 : 8;                       // the treated group's untreated outcome after
      P.path([[0, 3], [1, 5]], "line-u");
      P.path([[0, 6], [1, 10]], "line-v");
      const l = P.path([[0, 6], [1, cf]], "line-cf"); l.style.stroke = COL.v;
      [[0, 3, "dot-u"], [1, 5, "dot-u"], [0, 6, "dot-v"], [1, 10, "dot-v"]].forEach(([x, y, c]) => P.dot(x, y, 5, c, "front"));
      P.line(1.04, cf, 1.04, 10, "est", "front");
      P.text(1.07, (cf + 10) / 2 + 0.2, `true effect ${10 - cf}`, { class: "est-label halo" });
      P.text(1.07, 5.2, "comparison: +2", { class: "lbl halo" });
      ro.innerHTML = `<span>DiD = (10 − 6) − (5 − 3) = <b>2</b></span><span>True effect: <b>${10 - cf}</b></span>` +
        (fails ? `<span>Without the change the treated group would have risen by 3, not 2: the estimate absorbs the gap.</span>` : `<span>The comparison group's change (+2) is what the treated group would have done: the estimate is right.</span>`);
    }
    draw();
  };

  /* ============ rollout maps ============ */
  W.mapTabs = function (root) {
    const maps = [["2016-12", "Dec 2016", "5 pilot cities"], ["2017-12", "Dec 2017", "+12 named by Beijing, +71 chosen by provinces"],
      ["2018-03", "Mar 2018", "provinces keep adding cities"], ["2018-12", "Dec 2018", "nearly everywhere"]];
    let k = 0;
    const ctr = h(`<div class="controls"></div>`);
    const fig = h(`<figure><img alt="Map of Chinese cities issuing green plates"><figcaption></figcaption></figure>`);
    ctr.append(seg(maps.map((m, i) => [i, m[1]]), k, (v) => { k = v; show(); }));
    root.append(ctr, fig);
    function show() {
      fig.querySelector("img").src = `img/gp_rollout_${maps[k][0]}.jpg`;
      fig.querySelector("figcaption").textContent = `${maps[k][1]}: ${maps[k][2]}. Green: issuing green plates; white: not yet; grey: date unknown.`;
    }
    show();
  };

  /* ============ adoption by month (simulated rollout) ============ */
  W.rolloutChart = function (root) {
    const A = D.adopt, n = A.months.length;
    const { charts, hosts } = frame(root, [`Cities adopting green plates each month (bars) and share already treated (line); simulated panel of ${A.nCities} cities`]);
    charts.classList.add("one");
    root.append(charts);
    const top = Math.max(...A.newCities) * 1.15;
    const P = new Plot(hosts[0], { w: 720, h: 220, x: [-0.5, n - 0.5], y: [0, top], m: { t: 12, r: 46, b: 40, l: 44 } });
    const yearTicks = A.months.map((m, i) => [m, i]).filter(([m]) => m.endsWith("-01")).map(([, i]) => i);
    P.axes({ xt: yearTicks, xf: (i) => A.months[i].slice(0, 4), ylab: "Cities" });
    A.newCities.forEach((v, i) => { if (v) P.rect(i - 0.38, 0, i + 0.38, v, "bar-v"); });
    const line = P.path(A.cumShare.map((s, i) => [i, s * top]), "path", "front");
    line.style.stroke = COL.u; line.style.strokeWidth = 2.5;
    [0, 0.5, 1].forEach((s) => P.text(n - 0.2, s * top + 3, Math.round(s * 100) + "%", { class: "lbl", "text-anchor": "start" }));
    const lab = (m, txt, dy) => { const i = A.months.indexOf(m); const v = A.newCities[i]; P.text(i, Math.min(top * 0.95, v + top * 0.06 + (dy || 0)), txt, { class: "lbl halo", "text-anchor": "middle" }); };
    lab("2016-12", "pilots", 0);
    lab("2017-12", "wave 2", 0);
    P.text(A.months.indexOf("2018-06"), top * 0.45, "wave 3: month by month", { class: "lbl halo", "text-anchor": "middle" });
  };

  /* ============ who is a fair comparison? ============ */
  W.controlsGrid = function (root) {
    // 12 stylized cities: adoption month (1-30), Infinity = never
    const cities = [["Pilot city", 3], ["City B", 12], ["City C", 12], ["City D", 12], ["City E", 15], ["City F", 17], ["City G", 19], ["City H", 21], ["City I", 23], ["City J", 25], ["City K", Infinity], ["City L", Infinity]];
    const waves = [[3, "Pilot (month 3)"], [12, "Wave 2 (month 12)"], [19, "City G (month 19)"]];
    let wave = 12, month = 14;
    const ctr = h(`<div class="controls"><span class="small">Wave:</span></div>`);
    const mon = slider("Month", 1, 30, 1, month, (v) => v, (v) => { month = v; draw(); });
    ctr.append(seg(waves, wave, (v) => { wave = v; month = Math.max(month, wave); mon.querySelector("input").value = month; mon.querySelector("output").textContent = month; draw(); }), mon);
    const { charts, hosts } = frame(root, ["Each row a city, each column a month; orange = treated"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, ro);
    const P = new Plot(hosts[0], { w: 720, h: 300, x: [0.5, 30.5], y: [0, 12], m: { t: 8, r: 10, b: 36, l: 76 } });
    function draw() {
      P.axes({ noY: true, xt: [1, 5, 10, 15, 20, 25, 30], xlab: "Month" });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      const m = Math.max(month, wave);
      P.rect(m - 0.5, 0, m + 0.5, 12, "col-now", "back");
      P.rect(wave - 1.5, 0, wave - 0.5, 12, "col-now", "back");
      let fair = 0, bad = 0;
      cities.forEach(([name, g], r) => {
        const y = 11 - r;
        P.text(0.3, y + 0.32, name, { class: "lbl", "text-anchor": "end" });
        for (let t = 1; t <= 30; t++) P.rect(t - 0.42, y + 0.1, t + 0.42, y + 0.9, t >= g ? (g === wave ? "cell-wave" : "cell-on") : "cell-off");
        if (g === wave) return;
        if (g > m) { P.rect(0.55, y + 0.04, 30.45, y + 0.96, "cell-ok", "front"); fair++; }
        else { P.rect(0.55, y + 0.04, 30.45, y + 0.96, "cell-bad", "front"); bad++; }
      });
      P.text(wave - 1, 12.15, "base", { class: "lbl", "text-anchor": "middle" });
      ro.innerHTML = `<span>Comparing the wave's change from month ${wave - 1} to month ${m}:</span>` +
        `<span style="color:var(--good)"><b>${fair}</b> fair (not yet or never treated)</span><span style="color:var(--bad)"><b>${bad}</b> forbidden (treated earlier)</span>`;
    }
    draw();
  };

  /* ============ two waves, an effect that grows ============ */
  W.twoWaves = function (root) {
    const T = 12, gE = 4, gL = 9, ts = Array.from({ length: T }, (_, i) => i + 1);
    let growth = 1, view = "data";
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(slider("Effect grows each period by", 0, 1.5, 0.1, growth, (v) => fmt(v, 1), (v) => { growth = v; draw(); }),
      seg([["data", "The data"], ["fair", "A fair comparison"], ["bad", "A forbidden comparison"]], view, (v) => { view = v; draw(); }));
    const { charts, hosts } = frame(root, ["Average outcome by period"]);
    charts.classList.add("one");
    const wrap = h(`<div class="cols c-60"></div>`);
    const tbl = h(`<div></div>`);
    wrap.append(charts, tbl);
    root.append(ctr, wrap, legend([[COL.v, "early wave (from period 4)"], [COL.u, "late wave (from period 9)"], [COL.m, "without treatment", true]]));
    const P = new Plot(hosts[0], { w: 460, h: 260, x: [0.5, 12.5], y: [10, 30], m: { t: 12, r: 12, b: 36, l: 40 } });
    const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
    function draw() {
      const base = ts.map((t) => 10 + 0.5 * t);
      const tau = (t, g) => (t >= g ? 1 + growth * (t - g) : 0);
      const yE = ts.map((t, i) => base[i] + 2 + tau(t, gE)), yL = ts.map((t, i) => base[i] + tau(t, gL));
      // one-number regression: y on D, a unit dummy and period dummies
      const y = yE.concat(yL);
      const Dv = ts.map((t) => +(t >= gE)).concat(ts.map((t) => +(t >= gL)));
      const X = [Dv, ts.map(() => 0).concat(ts.map(() => 1))];
      for (let p = 2; p <= T; p++) X.push(ts.concat(ts).map((t) => +(t === p)));
      const beta = ols(y, X).beta[1];
      const pick = (arr, f) => arr.filter((_, i) => f(ts[i]));
      const fair = (mean(pick(yE, (t) => t >= gE && t < gL)) - mean(pick(yE, (t) => t < gE))) - (mean(pick(yL, (t) => t >= gE && t < gL)) - mean(pick(yL, (t) => t < gE)));
      const bad = (mean(pick(yL, (t) => t >= gL)) - mean(pick(yL, (t) => t >= gE && t < gL))) - (mean(pick(yE, (t) => t >= gL)) - mean(pick(yE, (t) => t >= gE && t < gL)));
      const trueAll = mean(ts.filter((t) => t >= gE).map((t) => tau(t, gE)).concat(ts.filter((t) => t >= gL).map((t) => tau(t, gL))));
      const trueE = mean(ts.filter((t) => t >= gE && t < gL).map((t) => tau(t, gE)));
      const trueL = mean(ts.filter((t) => t >= gL).map((t) => tau(t, gL)));
      const top = Math.max(26, Math.ceil(Math.max(...yE) + 1));
      P.setY(10, top);
      P.axes({ xt: [1, 4, 9, 12], yt: Array.from({ length: Math.floor((top - 10) / 5) + 1 }, (_, i) => 10 + 5 * i) });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      const keep = view === "fair" ? (t) => t < gL : view === "bad" ? (t) => t >= gE : () => true;
      const cfE = P.path(ts.map((t, i) => [t, base[i] + 2]).filter(([t]) => t >= gE - 1), "line-cf", "back"); cfE.style.stroke = COL.v;
      const cfL = P.path(ts.map((t, i) => [t, base[i]]).filter(([t]) => t >= gL - 1), "line-cf", "back"); cfL.style.stroke = COL.u;
      [[yE, "line-v", "dot-v"], [yL, "line-u", "dot-u"]].forEach(([arr, lc, dc]) => {
        const all = P.path(ts.map((t, i) => [t, arr[i]]), lc); if (view !== "data") all.classList.add("faded");
        if (view !== "data") P.path(ts.map((t, i) => [t, arr[i]]).filter(([t]) => keep(t)), lc);
        ts.forEach((t, i) => { const d = P.dot(t, arr[i], 3.5, dc, "front"); if (!keep(t)) d.classList.add("faded"); });
      });
      P.vline(gE - 0.5, "truth", "", "back"); P.vline(gL - 0.5, "truth", "", "back");
      if (view === "fair") P.text(1, top - 1, `fair: ${fmt(fair, 1)} (early wave's true effect ${fmt(trueE, 1)})`, { class: "lbl halo" }).style.fill = "var(--good)";
      if (view === "bad") P.text(4.2, top - 1, `forbidden: ${fmt(bad, 1)} (late wave's true effect ${fmt(trueL, 1)})`, { class: "lbl halo" }).style.fill = "var(--bad)";
      tbl.innerHTML = `<table class="t" style="font-size:15px">` +
        `<tr><td class="l">True average effect</td><td><b>${fmt(trueAll, 2)}</b></td></tr>` +
        `<tr><td class="l">One-number regression</td><td class="hi">${fmt(beta, 2)}</td></tr>` +
        `<tr><td class="l" style="color:var(--good)">Fair: early vs. late, before the late wave starts</td><td>${fmt(fair, 2)}</td></tr>` +
        `<tr><td class="l" style="color:var(--bad)">Forbidden: late vs. early, after the early wave started</td><td>${fmt(bad, 2)}</td></tr></table>` +
        `<p class="small">${growth === 0 ? "No growth: every comparison agrees, and the regression is right." : "The regression mixes the fair and the forbidden comparison."}</p>`;
    }
    draw();
  };

  /* ============ the simulated green-plate rollout ============ */
  W.gpSim = function (root) {
    let showNaive = true;
    const ctr = h(`<div class="controls"></div>`);
    ctr.append(seg([[true, "Show the one-number regression"], [false, "Hide it"]], showNaive, (v) => { showNaive = v; draw(); }));
    const { charts, hosts } = frame(root, ["Effect on log EV sales, by months since adoption (simulated rollout)"]);
    charts.classList.add("one");
    const ro = h(`<div class="readout"></div>`);
    root.append(ctr, charts, legend([[COL.m, "true effect (known: simulated data)"], [COL.g, "fair comparisons, by month"], [COL.b, "one-number regression", true], [COL.g, "fair comparisons, averaged", true]]), ro);
    const E = D.es, idx = E.e.map((e, i) => [e, i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
    const es = idx.map((i) => [E.e[i], E.clean[i], E.truth[i]]);
    const P = new Plot(hosts[0], { w: 720, h: 250, x: [-6.5, 12.5], y: [-0.2, 0.8], m: { t: 12, r: 16, b: 40, l: 46 } });
    function draw() {
      P.axes({ xt: [-6, -3, 0, 3, 6, 9, 12], xlab: "Months relative to adopting green plates", yt: [-0.2, 0, 0.2, 0.4, 0.6, 0.8] });
      ["back", "main", "front", "top"].forEach((g) => P.clear(g));
      P.hline(0, "truth", "", "back");
      P.vline(-0.5, "truth", "", "back");
      P.path(es.map(([e, , tr]) => [e, tr]), "truth-thick", "back");
      es.forEach(([e, c]) => P.dot(e, c, 4.5, "dot-g", "front"));
      P.line(0, D.clean, 12, D.clean, "hl-good", "main");
      if (showNaive) { P.line(0, D.naive, 12, D.naive, "hl-bad", "main"); P.text(12.3, D.naive - 0.05, `regression ${fmt(D.naive, 2)}`, { class: "lbl halo", "text-anchor": "end" }).style.fill = "var(--bad)"; }
      P.text(12.3, D.clean + 0.04, `fair, averaged ${fmt(D.clean, 2)}`, { class: "lbl halo", "text-anchor": "end" }).style.fill = "var(--good)";
      ro.innerHTML = `<span>True average effect: <b>${fmt(D.truth, 2)}</b></span><span>Fair comparisons, averaged: <b>${fmt(D.clean, 2)}</b></span>` +
        (showNaive ? `<span>One-number regression: <b>${fmt(D.naive, 2)}</b> (SE ${fmt(D.seNaive, 2)}): a fifth too small, and precise about the wrong number</span>` : "");
    }
    draw();
  };
})();
