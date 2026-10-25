/* Asynchronous-module player.
 *
 * The page supplies <div id="deck"> with <section class="slide" id="..."> blocks; each slide holds a
 * .slide-card (what students see) and an <aside class="script"> (the voice-over script / transcript).
 * This file builds the chrome around the deck: table of contents, per-slide audio with transcript,
 * auto-advance, a computer-voice fallback, step-by-step reveals, self-check quizzes, Python cells
 * that run in the browser (Pyodide), and a recording mode (?record) for making the voice-over.
 *
 * Audio files: audio/<slide id>.<ext>, tried in the order of CONFIG.audioExts. The first file that
 * exists plays, so a new recording (e.g. lln.m4a) overrides an archived clip (lln.2024.m4a).
 */
(function () {
  "use strict";

  const CFG = Object.assign({
    moduleId: "module",
    title: "Asynchronous module",
    subtitle: "",
    audioDir: "audio/",
    audioExts: ["m4a", "mp3", "webm", "2024.m4a"],
    archiveTag: ".2024.",
    archiveLabel: "2024 recording",
    colabUrl: "",             // a full Colab link to the notebook; overrides the GitHub link below
    github: "",               // "user/repo/folder" holding the notebook; on *.github.io it is read from the address
    githubBranch: "main",
    notebook: "",             // file name of the notebook, next to index.html
    pyodide: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    pyPackages: ["numpy", "matplotlib"],
    pySetup: null,            // function(pyodide) called once after loading, e.g. to write data files
  }, window.MODULE_CONFIG || {});

  const RECORD = /[?&]record\b/.test(location.search);

  /* Where the notebook opens in Colab. On GitHub Pages (user.github.io/repo/folder/) the repository
     is read from the address, so the page works unchanged in any repo. Elsewhere (local preview,
     Blackboard) the buttons download the notebook unless CONFIG.colabUrl or CONFIG.github is set.
     A user site (repo named user.github.io) needs CONFIG.github. */
  function notebookLinks(loc) {
    loc = loc || location;
    if (!CFG.notebook) return { colab: "", file: "" };
    let gh = CFG.github;
    if (!gh && /\.github\.io$/i.test(loc.hostname)) {
      const parts = loc.pathname.split("/").filter(Boolean);
      if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) parts.pop();
      if (parts.length) gh = [loc.hostname.split(".")[0]].concat(parts).join("/");
    }
    let colab = CFG.colabUrl;
    if (!colab && gh) {
      const p = gh.split("/").filter(Boolean);
      colab = `https://colab.research.google.com/github/${p[0]}/${p[1]}/blob/${CFG.githubBranch}/` + p.slice(2).concat([CFG.notebook]).join("/");
    }
    return { colab, file: CFG.notebook };
  }

  /* ---------------- storage (never required) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(CFG.moduleId + ":" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(CFG.moduleId + ":" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  /* ---------------- icons ---------------- */
  const I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.2" height="14" rx="1"/><rect x="13.8" y="5" width="4.2" height="14" rx="1"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>',
    theme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/></svg>',
    cc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6"/></svg>',
    run: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  };

  /* ---------------- build the chrome ---------------- */
  const deck = document.getElementById("deck");
  const slides = Array.from(deck.querySelectorAll(".slide"));
  const N = slides.length;

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="topbar">
      <button class="icon-btn" id="tocBtn" aria-label="Contents">${I.menu}</button>
      <div class="title">${CFG.title}<small>${CFG.subtitle}</small></div>
      <span class="counter" id="counter"></span>
      <button class="icon-btn" id="themeBtn" aria-label="Light or dark">${I.theme}</button>
      <button class="icon-btn" id="helpBtn" aria-label="Help">${I.help}</button>
      <div class="progress" id="progress"></div>
    </header>`);
  const layout = document.createElement("div");
  layout.className = "layout";
  layout.innerHTML = `<nav class="toc" id="toc" aria-label="Contents"></nav><main class="stage" id="stage"></main>`;
  deck.parentNode.insertBefore(layout, deck);
  const stage = layout.querySelector("#stage");
  stage.insertAdjacentHTML("beforeend", `
    <div class="banner" id="resume"><span id="resumeText"></span>
      <button class="btn small primary" id="resumeGo">Continue</button>
      <button class="btn small" id="resumeNo">Start from the beginning</button></div>`);
  stage.appendChild(deck);
  stage.insertAdjacentHTML("beforeend", `
    <section class="transcript" id="transcript">
      <header><span id="tLabel">Transcript</span><span class="tag" id="tTag" hidden></span></header>
      <div class="body" id="tBody"></div>
    </section>
    <div id="recSlot"></div>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="player" id="player">
      <button class="icon-btn" id="prevBtn" aria-label="Previous slide">${I.prev}</button>
      <button class="icon-btn play" id="playBtn" aria-label="Play">${I.play}</button>
      <button class="icon-btn" id="nextBtn" aria-label="Next slide">${I.next}</button>
      <div class="scrub"><input type="range" id="scrub" min="0" max="1" step="0.01" value="0" aria-label="Position"><span class="time" id="time"></span></div>
      <span class="status hide-sm" id="status"></span>
      <span class="sep"></span>
      <button class="pill" id="speedBtn" title="Playback speed">1×</button>
      <button class="pill" id="autoBtn" title="Go to the next slide when the audio ends">Auto<span class="hide-sm">-advance</span></button>
      <button class="icon-btn" id="ccBtn" aria-label="Show or hide the transcript" title="Transcript (T)">${I.cc}</button>
    </footer>
    <div class="pause-hint" id="pauseHint"><span>Your turn: try the interactive part, then continue.</span><button id="pauseGo">Continue ▸</button></div>
    <div class="overlay" id="help"><div class="panel">
      <h3>How to use this page</h3>
      <table>
        <tr><td><kbd>→</kbd> <kbd>←</kbd></td><td>Next / previous slide</td></tr>
        <tr><td><kbd>Space</kbd></td><td>Play / pause the voice-over</td></tr>
        <tr><td><kbd>T</kbd></td><td>Show / hide the transcript</td></tr>
        <tr><td><kbd>A</kbd></td><td>Auto-advance on / off (watch it like a video)</td></tr>
        <tr><td><kbd>S</kbd></td><td>Change the speed</td></tr>
        <tr><td><kbd>M</kbd></td><td>Show / hide the contents</td></tr>
      </table>
      <p class="small">Your place and the slides you have seen are saved in this browser. Python cells run inside the page; the first run downloads Python (about 20&nbsp;MB), later runs are instant.</p>
      <div class="btn-row"><button class="btn primary" id="helpClose">Got it</button></div>
    </div></div>
    <audio id="audio" preload="metadata"></audio>`);

  const $ = (id) => document.getElementById(id);
  const audio = $("audio");
  const ui = {
    toc: $("toc"), counter: $("counter"), progress: $("progress"), play: $("playBtn"), prev: $("prevBtn"), next: $("nextBtn"),
    scrub: $("scrub"), time: $("time"), status: $("status"), speed: $("speedBtn"), auto: $("autoBtn"), cc: $("ccBtn"),
    transcript: $("transcript"), tLabel: $("tLabel"), tTag: $("tTag"), tBody: $("tBody"), hint: $("pauseHint"),
  };

  /* ---------------- state ---------------- */
  const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];
  const state = {
    i: -1,
    mode: "none",            // "audio" | "tts" | "none"
    archive: false,          // the playing file is an archived recording
    pendingPlay: false,
    auto: store.get("auto", false),
    speed: store.get("speed", 1),
    showT: store.get("transcript", true),
    seen: new Set(store.get("seen", [])),
    tokens: 0,
  };

  /* ---------------- table of contents ---------------- */
  function slideTitle(s) {
    if (s.dataset.title) return s.dataset.title;
    const h = s.querySelector("h2, h1");
    return h ? h.childNodes[0].textContent.trim() : s.id;
  }
  function slideKind(s) {
    if (s.querySelector(".quiz")) return "check";
    if (s.querySelector(".widget")) return "try it";
    if (s.querySelector(".pycell")) return "code";
    return "";
  }
  let lastPart = null, html = "";
  slides.forEach((s, k) => {
    const part = s.dataset.part || "";
    if (part && part !== lastPart) { html += `<div class="part">${part}</div>`; lastPart = part; }
    const kind = slideKind(s);
    html += `<a href="#${s.id}" data-k="${k}"><span class="n">${k + 1}</span><span>${slideTitle(s)}${kind ? `<span class="kind">· ${kind}</span>` : ""}</span><span class="seen"></span></a>`;
  });
  ui.toc.innerHTML = html;
  const tocLinks = Array.from(ui.toc.querySelectorAll("a"));
  tocLinks.forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    go(+a.dataset.k);
    document.body.classList.remove("toc-open");
  }));
  function refreshSeen() {
    tocLinks.forEach((a, k) => { a.querySelector(".seen").textContent = state.seen.has(slides[k].id) ? "✓" : ""; });
  }

  /* ---------------- math ---------------- */
  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  /* ---------------- navigation ---------------- */
  function go(k, opts) {
    opts = opts || {};
    k = Math.max(0, Math.min(N - 1, k));
    if (k === state.i && !opts.force) return;
    stopAll();
    hideHint();
    if (state.i >= 0) slides[state.i].classList.remove("active");
    state.i = k;
    const s = slides[k];
    s.classList.add("active");
    tocLinks.forEach((a, j) => a.classList.toggle("active", j === k));
    const act = tocLinks[k];
    if (act && act.scrollIntoView && !opts.noScroll) act.scrollIntoView({ block: "nearest" });
    ui.counter.textContent = `${k + 1} / ${N}`;
    ui.progress.style.width = `${(100 * (k + 1)) / N}%`;
    ui.prev.disabled = k === 0;
    ui.next.disabled = k === N - 1;
    state.seen.add(s.id);
    store.set("seen", Array.from(state.seen));
    store.set("last", s.id);
    refreshSeen();
    if (location.hash !== "#" + s.id) history.replaceState(null, "", "#" + s.id);
    enterSlide(s);
    loadMedia(s, !!opts.play);
    if (!opts.noScroll) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (RECORD) Recorder.show(s);
  }
  const next = (opts) => go(state.i + 1, opts);
  const prev = () => go(state.i - 1);

  /* per-slide set-up the first time a slide is shown */
  function enterSlide(s) {
    if (s.dataset.entered) { s.dispatchEvent(new CustomEvent("slide:enter")); return; }
    s.dataset.entered = "1";
    s.querySelectorAll(".widget[data-widget]").forEach((w) => {
      const f = window.Widgets && window.Widgets[w.dataset.widget];
      if (f) { try { f(w); } catch (e) { w.insertAdjacentHTML("beforeend", `<p class="small">This interactive part failed to load (${e.message}).</p>`); console.error(e); } }
    });
    s.querySelectorAll(".pycell").forEach(PyCell.setup);
    s.dispatchEvent(new CustomEvent("slide:enter"));
  }

  /* ---------------- media ---------------- */
  function sources(id) {
    return CFG.audioExts.map((e) => `${CFG.audioDir}${id}.${e}`);
  }
  function loadMedia(s, play) {
    state.tokens++;
    const token = state.tokens;
    state.pendingPlay = play;
    state.mode = "none";
    state.archive = false;
    audio.pause();
    audio.removeAttribute("src");
    audio.innerHTML = "";
    setPlayIcon(false);
    ui.scrub.value = 0;
    ui.time.textContent = "";
    ui.status.textContent = "Looking for the recording…";
    renderTranscript(s);
    const take = RECORD && Recorder.takeFor(s.id);
    if (take) {
      audio.src = URL.createObjectURL(take.blob);
    } else {
      const list = s.dataset.audio ? [s.dataset.audio] : sources(s.id);
      list.forEach((src, j) => {
        const el = document.createElement("source");
        el.src = src;
        if (j === list.length - 1) el.addEventListener("error", () => { if (token === state.tokens) noMedia(s); });
        audio.appendChild(el);
      });
    }
    audio.playbackRate = state.speed;
    audio.load();
  }
  audio.addEventListener("loadedmetadata", () => {
    const s = slides[state.i];
    state.mode = "audio";
    state.archive = (audio.currentSrc || "").indexOf(CFG.archiveTag) >= 0;
    audio.playbackRate = state.speed;
    ui.scrub.max = audio.duration || 1;
    ui.scrub.step = 0.1;
    ui.status.textContent = state.archive ? CFG.archiveLabel : (RECORD && Recorder.takeFor(s.id) ? "your new take" : "");
    updateTime();
    renderTranscript(s);
    if (state.pendingPlay) { state.pendingPlay = false; audio.play().catch(() => {}); }
  });
  function noMedia(s) {
    state.mode = ttsAvailable() ? "tts" : "none";
    ui.status.textContent = state.mode === "tts" ? "No recording yet · computer voice" : "No recording yet · read the transcript";
    prepareTTS(s);
    if (state.pendingPlay) {
      state.pendingPlay = false;
      if (state.mode === "tts") ttsPlay(); else onEnded();
    }
  }
  audio.addEventListener("play", () => setPlayIcon(true));
  audio.addEventListener("pause", () => setPlayIcon(false));
  audio.addEventListener("timeupdate", () => { if (state.mode === "audio") { ui.scrub.value = audio.currentTime; updateTime(); syncLines(audio.currentTime); } });
  audio.addEventListener("ended", () => onEnded());
  function updateTime() {
    const f = (t) => { t = Math.max(0, t || 0); return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`; };
    ui.time.textContent = `${f(audio.currentTime)} / ${f(audio.duration)}`;
  }
  function setPlayIcon(on) { ui.play.innerHTML = on ? I.pause : I.play; ui.play.setAttribute("aria-label", on ? "Pause" : "Play"); }

  function togglePlay() {
    hideHint();
    if (state.mode === "audio") { audio.paused ? audio.play().catch(() => {}) : audio.pause(); }
    else if (state.mode === "tts") { tts.on ? ttsPause() : ttsPlay(); }
    else { state.pendingPlay = true; }
  }
  function stopAll() { audio.pause(); ttsStop(); }

  ui.scrub.addEventListener("input", () => {
    if (state.mode === "audio") { audio.currentTime = +ui.scrub.value; }
    else if (state.mode === "tts") { const on = tts.on; ttsStop(); tts.idx = Math.round(+ui.scrub.value); markSentence(tts.idx); if (on) ttsPlay(); }
  });

  /* end of the voice-over: auto-advance, or invite the student to try the slide */
  function onEnded() {
    setPlayIcon(false);
    if (!state.auto) return;
    const s = slides[state.i];
    if (s.hasAttribute("data-pause") || state.i === N - 1) { if (state.i < N - 1) showHint(); return; }
    const k = state.i;
    setTimeout(() => { if (state.i === k && state.auto) next({ play: true }); }, 700);
  }
  function showHint() { ui.hint.classList.add("show"); }
  function hideHint() { ui.hint.classList.remove("show"); }
  $("pauseGo").addEventListener("click", () => { hideHint(); next({ play: state.auto }); });

  /* ---------------- computer voice (fallback when a slide has no recording) ---------------- */
  const tts = { on: false, idx: 0, sentences: [], gen: 0, voice: null };
  function ttsAvailable() { return "speechSynthesis" in window && CFG.computerVoice !== false; }
  function pickVoice() {
    if (!ttsAvailable()) return null;
    const vs = speechSynthesis.getVoices().filter((v) => /^en(-|_|$)/i.test(v.lang));
    const pref = [/Aria|Jenny|Guy|Ava|Andrew|Emma|Brian/i, /Natural|Neural|Online/i, /Google US English/i, /Samantha|Alex/i, /en-US/i];
    for (const re of pref) { const v = vs.find((x) => re.test(x.name) || re.test(x.lang)); if (v) return v; }
    return vs[0] || null;
  }
  if (ttsAvailable()) speechSynthesis.onvoiceschanged = () => { tts.voice = pickVoice(); };
  function prepareTTS(s) {
    tts.sentences = Array.from(ui.tBody.querySelectorAll(".line")).map((el) => el.textContent);
    tts.idx = 0;
    ui.scrub.max = Math.max(1, tts.sentences.length);
    ui.scrub.step = 1;
    ui.scrub.value = 0;
    ui.time.textContent = tts.sentences.length ? `0 / ${tts.sentences.length}` : "";
  }
  function ttsPlay() {
    if (!tts.sentences.length) { onEnded(); return; }
    if (!tts.voice) tts.voice = pickVoice();
    tts.on = true;
    const gen = ++tts.gen;
    setPlayIcon(true);
    speechSynthesis.cancel();
    const speak = (j) => {
      if (gen !== tts.gen || !tts.on) return;
      if (j >= tts.sentences.length) { tts.on = false; tts.idx = 0; markSentence(-1); onEnded(); return; }
      tts.idx = j;
      markSentence(j);
      ui.scrub.value = j;
      ui.time.textContent = `${j + 1} / ${tts.sentences.length}`;
      const u = new SpeechSynthesisUtterance(tts.sentences[j]);
      if (tts.voice) u.voice = tts.voice;
      u.rate = state.speed;
      u.onend = () => { if (gen === tts.gen && tts.on) speak(j + 1); };
      u.onerror = () => { if (gen === tts.gen) { tts.on = false; setPlayIcon(false); } };
      speechSynthesis.speak(u);
    };
    speak(tts.idx);
  }
  function ttsPause() { tts.on = false; tts.gen++; if (ttsAvailable()) speechSynthesis.cancel(); setPlayIcon(false); }
  function ttsStop() { ttsPause(); tts.idx = 0; }
  function markSentence(j) {
    ui.tBody.querySelectorAll(".line").forEach((el, k) => el.classList.toggle("now", k === j));
    const el = ui.tBody.querySelectorAll(".line")[j];
    if (el) scrollLine(el);
  }

  /* ---------------- transcript ---------------- */
  function splitSentences(text) {
    return text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"“(])/).filter(Boolean);
  }
  function renderTranscript(s) {
    const arch = state.archive && window.ARCHIVE_TRANSCRIPTS && window.ARCHIVE_TRANSCRIPTS[s.id];
    ui.tTag.hidden = true;
    if (arch) {
      ui.tLabel.textContent = "Transcript";
      ui.tTag.hidden = false;
      ui.tTag.textContent = `${CFG.archiveLabel}, auto-generated`;
      ui.tBody.innerHTML = "<p>" + arch.map(([t, txt]) =>
        `<span class="line" data-t="${t}"><span class="ts">${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}</span>${escapeHtml(txt)}</span> `).join("") + "</p>";
      ui.tBody.querySelectorAll(".line").forEach((el) => el.addEventListener("click", () => {
        audio.currentTime = +el.dataset.t; if (audio.paused) audio.play().catch(() => {});
      }));
      return;
    }
    const aside = s.querySelector("aside.script");
    ui.tLabel.textContent = "Transcript";
    if (!aside || !aside.textContent.trim()) { ui.tBody.innerHTML = '<p class="empty">No narration for this slide.</p>'; return; }
    const paras = aside.querySelectorAll("p").length ? Array.from(aside.querySelectorAll("p")) : [aside];
    let k = 0;
    ui.tBody.innerHTML = paras.map((p) => "<p>" + splitSentences(p.textContent).map((t) =>
      `<span class="line" data-i="${k++}">${escapeHtml(t)}</span>`).join(" ") + "</p>").join("");
    ui.tBody.querySelectorAll(".line").forEach((el) => el.addEventListener("click", () => {
      if (state.mode === "tts") { ttsStop(); tts.idx = +el.dataset.i; ttsPlay(); }
    }));
  }
  function syncLines(t) {
    if (!state.archive) return;
    const lines = ui.tBody.querySelectorAll(".line[data-t]");
    let cur = -1;
    lines.forEach((el, k) => { if (+el.dataset.t <= t + 0.2) cur = k; });
    lines.forEach((el, k) => el.classList.toggle("now", k === cur));
    if (cur >= 0) scrollLine(lines[cur]);
  }
  function scrollLine(el) {
    const box = ui.tBody, top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) box.scrollTop = top - 30;
  }
  function escapeHtml(t) { return t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function setTranscript(on) { state.showT = on; store.set("transcript", on); ui.transcript.hidden = !on; ui.cc.classList.toggle("on", on); ui.cc.style.opacity = on ? 1 : 0.55; }

  /* ---------------- player buttons ---------------- */
  ui.play.addEventListener("click", togglePlay);
  ui.prev.addEventListener("click", prev);
  ui.next.addEventListener("click", () => next({ play: state.auto && (state.mode === "audio" ? !audio.paused : tts.on) }));
  function setSpeed(v) {
    state.speed = v; store.set("speed", v); audio.playbackRate = v;
    ui.speed.textContent = `${v}×`;
    if (tts.on) { const j = tts.idx; ttsPause(); tts.idx = j; ttsPlay(); }
  }
  ui.speed.addEventListener("click", () => setSpeed(SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length]));
  function setAuto(on) { state.auto = on; store.set("auto", on); ui.auto.classList.toggle("on", on); }
  ui.auto.addEventListener("click", () => setAuto(!state.auto));
  ui.cc.addEventListener("click", () => setTranscript(!state.showT));
  $("tocBtn").addEventListener("click", () => {
    if (window.matchMedia("(max-width: 1100px)").matches) document.body.classList.toggle("toc-open");
    else document.body.classList.toggle("toc-closed");
  });
  const THEMES = ["auto", "light", "dark"];
  function setTheme(t) { store.set("theme", t); if (t === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t; }
  $("themeBtn").addEventListener("click", () => setTheme(THEMES[(THEMES.indexOf(store.get("theme", "auto")) + 1) % 3]));
  $("helpBtn").addEventListener("click", () => $("help").classList.add("show"));
  $("helpClose").addEventListener("click", () => $("help").classList.remove("show"));
  $("help").addEventListener("click", (e) => { if (e.target.id === "help") $("help").classList.remove("show"); });

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t.closest && (t.closest("input, textarea, select, .CodeMirror, [contenteditable]"))) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
    else if (k === " " || k === "k") { e.preventDefault(); togglePlay(); }
    else if (k === "t" || k === "T") setTranscript(!state.showT);
    else if (k === "a" || k === "A") setAuto(!state.auto);
    else if (k === "s" || k === "S") ui.speed.click();
    else if (k === "m" || k === "M") $("tocBtn").click();
    else if (k === "?") $("help").classList.add("show");
    else if (k === "Escape") { $("help").classList.remove("show"); document.body.classList.remove("toc-open"); }
  });
  window.addEventListener("hashchange", () => {
    const k = slides.findIndex((s) => "#" + s.id === location.hash);
    if (k >= 0) go(k);
  });

  /* ---------------- step-by-step reveals and quizzes ---------------- */
  deck.querySelectorAll(".steps").forEach((box) => {
    const steps = Array.from(box.querySelectorAll(":scope > .step"));
    if (!steps.length) return;
    steps[0].classList.add("shown");
    if (steps.length === 1) return;
    const row = document.createElement("div");
    row.className = "btn-row";
    row.innerHTML = `<button class="btn small primary step-btn">Next step ▸</button><button class="btn small step-all">Show all</button>`;
    box.appendChild(row);
    const nextBtn = row.querySelector(".step-btn");
    const update = () => {
      const left = steps.filter((s) => !s.classList.contains("shown")).length;
      if (!left) row.remove();
      else nextBtn.textContent = `Next step ▸ (${left} more)`;
    };
    nextBtn.addEventListener("click", () => { const s = steps.find((x) => !x.classList.contains("shown")); if (s) s.classList.add("shown"); update(); });
    row.querySelector(".step-all").addEventListener("click", () => { steps.forEach((x) => x.classList.add("shown")); update(); });
    update();
  });
  deck.querySelectorAll(".quiz").forEach((q) => {
    const ans = q.dataset.answer;
    q.querySelectorAll(".opt").forEach((o) => o.addEventListener("click", () => {
      q.querySelectorAll(".opt").forEach((x) => x.classList.remove("right", "wrong"));
      o.classList.add(o.dataset.k === ans ? "right" : "wrong");
      if (o.dataset.k !== ans) { const r = q.querySelector(`.opt[data-k="${ans}"]`); if (r && q.dataset.reveal !== "no") r.classList.add("right"); }
      q.classList.add("done");
    }));
  });

  /* ---------------- Python cells (Pyodide, loaded on first use) ---------------- */
  const PyCell = (function () {
    let ready = null;
    function loadScript(src) {
      return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("could not load " + src)); document.head.appendChild(s); });
    }
    function boot(status) {
      if (!ready) {
        ready = (async () => {
          status("Downloading Python (first run only, about 20 MB)…");
          if (!window.loadPyodide) await loadScript(CFG.pyodide + "pyodide.js");
          const py = await window.loadPyodide({ indexURL: CFG.pyodide });
          status("Loading numpy and matplotlib…");
          await py.loadPackage(CFG.pyPackages);
          py.runPython("import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\nplt.show = lambda *a, **k: None\nplt.rcParams['figure.figsize'] = (6.4, 3.6)\nplt.rcParams['figure.dpi'] = 100");
          if (CFG.pySetup) await CFG.pySetup(py);
          return py;
        })();
        ready.catch(() => { ready = null; });
      }
      return ready;
    }
    function colabLink(cell) {
      const nb = notebookLinks();
      return nb.colab ? nb.colab + (cell ? "#scrollTo=" + cell : "") : nb.file;
    }
    function setup(box) {
      if (box.dataset.ready) return;
      box.dataset.ready = "1";
      const src = box.querySelector("textarea, pre");
      const code = (src.value !== undefined ? src.value : src.textContent).replace(/^\n+|\s+$/g, "");
      src.remove();
      const link = colabLink(box.dataset.colab);
      box.insertAdjacentHTML("afterbegin", `
        <div class="bar"><span class="lang">Python · runs in your browser</span>
          <button class="btn small primary run">${I.run} Run</button>
          <button class="btn small reset">Reset</button>
          ${link ? `<a class="btn small" href="${link}" target="_blank" rel="noopener">${I.ext} ${notebookLinks().colab ? "Open in Colab" : "Download notebook"}</a>` : ""}
        </div>
        <textarea class="code" spellcheck="false" aria-label="Python code"></textarea>
        <div class="out"></div>`);
      const ta = box.querySelector("textarea.code");
      ta.value = code;
      ta.rows = Math.min(24, code.split("\n").length + 1);
      let cm = null;
      if (window.CodeMirror) {
        cm = window.CodeMirror.fromTextArea(ta, { mode: "python", lineNumbers: true, indentUnit: 4, viewportMargin: Infinity,
          extraKeys: { "Shift-Enter": () => run(), Tab: (c) => c.replaceSelection("    ") } });
      } else {
        ta.addEventListener("keydown", (e) => {
          if (e.key === "Tab") { e.preventDefault(); const p = ta.selectionStart; ta.setRangeText("    ", p, ta.selectionEnd, "end"); }
          if (e.key === "Enter" && e.shiftKey) { e.preventDefault(); run(); }
        });
      }
      const out = box.querySelector(".out");
      const btn = box.querySelector(".run");
      const getCode = () => (cm ? cm.getValue() : ta.value);
      box.querySelector(".reset").addEventListener("click", () => { if (cm) cm.setValue(code); else ta.value = code; out.classList.remove("show"); out.innerHTML = ""; });
      btn.addEventListener("click", () => run());
      if (box.closest(".slide")) box.closest(".slide").addEventListener("slide:enter", () => { if (cm) setTimeout(() => cm.refresh(), 30); });
      async function run() {
        btn.disabled = true;
        out.classList.add("show");
        out.innerHTML = '<div class="stat">Starting…</div>';
        const status = (m) => { out.innerHTML = `<div class="stat">${m}</div>`; };
        let py;
        try { py = await boot(status); } catch (e) {
          out.innerHTML = `<pre class="err">Could not start Python in this browser (${escapeHtml(e.message)}). Use the Colab notebook instead.</pre>`;
          btn.disabled = false; return;
        }
        status("Running…");
        let text = "";
        py.setStdout({ batched: (s) => { text += s + "\n"; } });
        py.setStderr({ batched: (s) => { text += s + "\n"; } });
        let err = null;
        try { await py.runPythonAsync(getCode()); } catch (e) { err = String(e.message || e); }
        let imgs = [];
        try {
          const r = py.runPython("import io, base64\n_imgs = []\nfor _n in plt.get_fignums():\n    _b = io.BytesIO(); plt.figure(_n).savefig(_b, format='png', dpi=110, bbox_inches='tight'); _imgs.append(base64.b64encode(_b.getvalue()).decode())\nplt.close('all')\n_imgs");
          imgs = r.toJs(); r.destroy();
        } catch (e) { /* no figures */ }
        out.innerHTML = "";
        if (text.trim()) out.insertAdjacentHTML("beforeend", `<pre>${escapeHtml(text.replace(/\s+$/, ""))}</pre>`);
        imgs.forEach((b) => out.insertAdjacentHTML("beforeend", `<img alt="Figure produced by the code" src="data:image/png;base64,${b}">`));
        if (err) {
          const lines = err.trim().split("\n");
          const k = lines.findIndex((l) => l.indexOf('File "<exec>"') >= 0);
          out.insertAdjacentHTML("beforeend", `<pre class="err">${escapeHtml((k >= 0 ? lines.slice(k) : lines.slice(-6)).join("\n"))}</pre>`);
        }
        if (!text.trim() && !imgs.length && !err) out.innerHTML = '<div class="stat">Done (no output).</div>';
        btn.disabled = false;
      }
    }
    return { setup };
  })();

  /* ---------------- recording mode (?record) ---------------- */
  const Recorder = (function () {
    const takes = {};               // slide id -> {blob, mime}
    let db = null, media = null, rec = null, chunks = [], t0 = 0, timer = null, box = null;
    const ext = (mime) => (/mp4|aac|m4a/.test(mime) ? "m4a" : /ogg/.test(mime) ? "ogg" : "webm");
    function openDB() {
      return new Promise((res) => {
        try {
          const r = indexedDB.open(CFG.moduleId + "-recordings", 1);
          r.onupgradeneeded = () => r.result.createObjectStore("takes");
          r.onsuccess = () => res(r.result);
          r.onerror = () => res(null);
        } catch (e) { res(null); }
      });
    }
    async function init() {
      db = await openDB();
      if (!db) return;
      await new Promise((res) => {
        const tx = db.transaction("takes", "readonly"), st = tx.objectStore("takes");
        const r = st.openCursor();
        r.onsuccess = () => { const c = r.result; if (c) { takes[c.key] = c.value; c.continue(); } else res(); };
        r.onerror = () => res();
      });
    }
    function save(id, take) {
      takes[id] = take;
      if (db) try { db.transaction("takes", "readwrite").objectStore("takes").put(take, id); } catch (e) { /* ignore */ }
    }
    function drop(id) {
      delete takes[id];
      if (db) try { db.transaction("takes", "readwrite").objectStore("takes").delete(id); } catch (e) { /* ignore */ }
    }
    function download(blob, name) {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
    }
    function show(s) {
      const slot = $("recSlot");
      const n = Object.keys(takes).length;
      const script = s.querySelector("aside.script");
      slot.innerHTML = `
        <section class="recorder">
          <h4>Recording mode · slide “${slideTitle(s)}” → file <code>${s.id}.${takes[s.id] ? ext(takes[s.id].mime) : "webm"}</code></h4>
          <div class="btn-row">
            <button class="btn primary" id="recStart">● Record</button>
            <button class="btn" id="recStop" disabled>■ Stop</button>
            <span id="recState" class="small"></span>
          </div>
          <div class="btn-row">
            <button class="btn small" id="recSave" ${takes[s.id] ? "" : "disabled"}>Download this take</button>
            <button class="btn small" id="recDel" ${takes[s.id] ? "" : "disabled"}>Delete this take</button>
            <button class="btn small" id="recAll" ${n ? "" : "disabled"}>Download all takes (.zip, ${n})</button>
          </div>
          <p class="small">Takes are kept in this browser and play on this page right away. When you are done, download them and put the files in <code>web/audio/</code>. Read from the script below or speak freely.</p>
          <div class="prompter">${script ? script.innerHTML : "<p><i>No script for this slide.</i></p>"}</div>
        </section>`;
      box = slot.firstElementChild;
      box.querySelector("#recStart").addEventListener("click", () => start(s));
      box.querySelector("#recStop").addEventListener("click", stop);
      box.querySelector("#recSave").addEventListener("click", () => { const t = takes[s.id]; if (t) download(t.blob, `${s.id}.${ext(t.mime)}`); });
      box.querySelector("#recDel").addEventListener("click", () => { drop(s.id); go(state.i, { force: true, noScroll: true }); });
      box.querySelector("#recAll").addEventListener("click", zipAll);
    }
    async function start(s) {
      stopAll();
      try { media = media || await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
      catch (e) { box.querySelector("#recState").textContent = "Microphone not available: " + e.message; return; }
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", ""].find((m) => !m || (window.MediaRecorder && MediaRecorder.isTypeSupported(m)));
      rec = new MediaRecorder(media, mime ? { mimeType: mime, audioBitsPerSecond: 64000 } : undefined);
      chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        save(s.id, { blob, mime: blob.type });
        clearInterval(timer);
        go(state.i, { force: true, noScroll: true });
      };
      rec.start();
      t0 = Date.now();
      box.querySelector("#recStart").disabled = true;
      box.querySelector("#recStop").disabled = false;
      const st = box.querySelector("#recState");
      timer = setInterval(() => { st.innerHTML = `<span class="rec-dot"></span> recording ${Math.round((Date.now() - t0) / 1000)} s`; }, 250);
    }
    function stop() { if (rec && rec.state !== "inactive") rec.stop(); }
    async function zipAll() {
      const btn = box.querySelector("#recAll");
      btn.disabled = true; btn.textContent = "Preparing…";
      try {
        if (!window.JSZip) await new Promise((res, rej) => { const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
        const z = new window.JSZip();
        Object.entries(takes).forEach(([id, t]) => z.file(`${id}.${ext(t.mime)}`, t.blob));
        download(await z.generateAsync({ type: "blob" }), `${CFG.moduleId}_audio.zip`);
      } catch (e) {
        Object.entries(takes).forEach(([id, t]) => download(t.blob, `${id}.${ext(t.mime)}`));
      }
      btn.disabled = false; btn.textContent = `Download all takes (.zip, ${Object.keys(takes).length})`;
    }
    return { init, show, takeFor: (id) => takes[id] };
  })();

  /* ---------------- start ---------------- */
  async function start() {
    renderMath(deck);
    setTheme(store.get("theme", "auto"));
    setSpeed(state.speed);
    setAuto(state.auto);
    setTranscript(state.showT);
    if (RECORD) { await Recorder.init(); document.body.classList.add("recording"); }
    const fromHash = slides.findIndex((s) => "#" + s.id === location.hash);
    const last = slides.findIndex((s) => s.id === store.get("last", ""));
    if (fromHash >= 0) go(fromHash, { noScroll: true });
    else {
      go(0, { noScroll: true });
      if (last > 0) {
        $("resumeText").textContent = `Welcome back. You stopped at slide ${last + 1}: “${slideTitle(slides[last])}”.`;
        $("resume").classList.add("show");
        $("resumeGo").addEventListener("click", () => { $("resume").classList.remove("show"); go(last); });
        $("resumeNo").addEventListener("click", () => $("resume").classList.remove("show"));
      }
    }
    deck.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => {
      const k = slides.findIndex((s) => s.id === b.dataset.goto); if (k >= 0) go(k);
    }));
    deck.querySelectorAll("[data-action='play-all']").forEach((b) => b.addEventListener("click", () => { setAuto(true); next({ play: true }); }));
    deck.querySelectorAll("[data-action='next']").forEach((b) => b.addEventListener("click", () => next()));
    const nb = notebookLinks();
    deck.querySelectorAll("[data-notebook-links]").forEach((box) => {
      box.innerHTML = (nb.colab ? `<a class="btn primary" target="_blank" rel="noopener" href="${nb.colab}">${I.ext} Open in Colab</a>` : "") +
        (nb.file ? `<a class="btn${nb.colab ? "" : " primary"}" href="${nb.file}" download>Download the notebook (.ipynb)</a>` : "");
    });
  }
  window.Player = { go, next, prev, slides, store, notebookLinks };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
