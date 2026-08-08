/* =========================================================
   PttLB Website - Shared JavaScript
   Features:
     1. Gear icon (top-left) -> settings panel with language &
        music options. Auto-retracts when the mouse leaves.
     2. Language switching (中文 / English) via data-i18n.
     3. Background music on/off (Web Audio synthesized loop).
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- i18n dictionary ---------------- */
  const I18N = {
    en: {
      lang_label: "Language",
      music_label: "Music",
      volume_label: "Volume",
      music_on: "ON",
      music_off: "OFF",
      // first page
      tap_to_start: "Tap to start",
      // choose page
      choose_hint: "Choose your story",
      box1_title: "Story Mode",
      box1_desc: "A brand-new adventure awaits you. Step into the world of PttLB.",
      box2_title: "Free Battle",
      box2_desc: "Jump into quick battles and challenge players from all over.",
      box3_title: "Gallery",
      box3_desc: "Unlock gorgeous artwork and collect every precious moment.",
      choose_go: "Enter",
      // pttlb page
      pttlb_back: "Back",
      btn_play: "Play Now",
      btn_showcase: "Gameshowcase",
      btn_download: "Download",
      btn_about: "About Us",
      // play page
      play_title: "Play Now",
      play_lead: "Choose how you want to play",
      play_quick: "Quick Match",
      play_quick_desc: "Jump straight into a game, no waiting.",
      play_story: "Story Mode",
      play_story_desc: "Follow the adventure from the very beginning.",
      play_versus: "Versus Friend",
      play_versus_desc: "Invite a friend and battle head to head.",
      play_start: "Start Game",
      // showcase page
      show_title: "Game Showcase",
      show_lead: "Explore the world of PttLB",
      show_c1_t: "Characters",
      show_c1_d: "Meet the heroes of the PttLB universe and learn their stories.",
      show_c2_t: "Scenes",
      show_c2_d: "Wander through beautifully illustrated worlds and hidden lands.",
      show_c3_t: "Trailers",
      show_c3_d: "Watch the latest trailers and behind-the-scenes previews.",
      show_watch: "Watch",
      // download page
      dl_title: "Download",
      dl_lead: "Get PttLB on your favourite platform",
      dl_windows: "Windows",
      dl_windows_d: "PC client for Windows 10 / 11",
      dl_android: "Android",
      dl_android_d: "Mobile version for Android devices",
      dl_ios: "iOS",
      dl_ios_d: "Available on the App Store",
      dl_get: "Download",
      dl_note: "All platforms support cloud-sync progress.",
      // about page
      about_title: "About Us",
      about_lead: "The team behind PttLB",
      about_p1:
        "PttLB is a colourful adventure game crafted with love by a small, passionate indie team.",
      about_p2:
        "We believe games should spark joy, so we poured bright colours, lively characters and a heartfelt story into every frame.",
      about_team: "Meet the Team",
      about_m1: "Game Design",
      about_m2: "Art & Illustration",
      about_m3: "Programming",
      about_m4: "Music & Sound",
      about_thanks: "Thank you for playing!",
      back_home: "Home",
    },
    zh: {
      lang_label: "语言",
      music_label: "音乐",
      volume_label: "音量",
      music_on: "开",
      music_off: "关",
      // first page
      tap_to_start: "点击开始",
      // choose page
      choose_hint: "选择你的故事",
      box1_title: "剧情模式",
      box1_desc: "全新的冒险正在等待你，踏入PttLB的世界。",
      box2_title: "自由对战",
      box2_desc: "快速加入对局，与来自各地的玩家一决高下。",
      box3_title: "图鉴收藏",
      box3_desc: "解锁精美插画，收藏每一份珍贵回忆。",
      choose_go: "进入",
      pttlb_back: "返回",
      btn_play: "开始游戏",
      btn_showcase: "游戏展示",
      btn_download: "下载游戏",
      btn_about: "关于我们",
      play_title: "开始游戏",
      play_lead: "选择你想游玩的方式",
      play_quick: "快速匹配",
      play_quick_desc: "直接加入一局游戏，无需等待。",
      play_story: "剧情模式",
      play_story_desc: "从最初开始跟随这场冒险。",
      play_versus: "好友对战",
      play_versus_desc: "邀请好友，面对面一决胜负。",
      play_start: "开始游戏",
      show_title: "游戏展示",
      show_lead: "探索PttLB的世界",
      show_c1_t: "角色",
      show_c1_d: "认识PttLB宇宙中的英雄们，了解他们的故事。",
      show_c2_t: "场景",
      show_c2_d: "漫步在精美插画的世界与隐藏之地。",
      show_c3_t: "预告片",
      show_c3_d: "观看最新预告片与幕后花絮。",
      show_watch: "观看",
      dl_title: "下载游戏",
      dl_lead: "在你喜欢的平台上获取PttLB",
      dl_windows: "Windows",
      dl_windows_d: "适用于 Windows 10 / 11 的电脑客户端",
      dl_android: "Android",
      dl_android_d: "适用于安卓设备的移动版",
      dl_ios: "iOS",
      dl_ios_d: "可在 App Store 获取",
      dl_get: "下载",
      dl_note: "所有平台均支持云端同步进度。",
      about_title: "关于我们",
      about_lead: "PttLB背后的团队",
      about_p1:
        "PttLB 是一款由充满热情的小型独立团队精心打造的缤纷冒险游戏。",
      about_p2:
        "我们相信游戏应当带来快乐，因此我们把明亮的色彩、生动的角色与温暖的故事注入每一帧画面。",
      about_team: "认识团队",
      about_m1: "游戏设计",
      about_m2: "美术与插画",
      about_m3: "程序开发",
      about_m4: "音乐与音效",
      about_thanks: "感谢你的游玩！",
      back_home: "首页",
    },
  };

  /* ---------------- state ---------------- */
  const PREF_KEY = "pttlb_prefs";
  let prefs = { lang: "zh", music: false, volume: 100 };
  try {
    const saved = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
    if (saved.lang) prefs.lang = saved.lang;
    if (typeof saved.music === "boolean") prefs.music = saved.music;
    if (typeof saved.volume === "number" && saved.volume >= 0 && saved.volume <= 100) {
      prefs.volume = saved.volume;
    }
  } catch (e) {
    /* ignore */
  }

  /* ---------------- music (single in-page player, zero-gap) ---------------- */
  // The site uses soft (single-page) navigation, so the page is never fully
  // reloaded. ONE persistent <audio> element plays the MP3 with zero gaps —
  // no separate popup window appears, and closing the tab stops the music.
  const AUDIO_SRC = "assets/audio/background.mp3";

  const Music = (function () {
    let audio = null;

    function ensureAudio() {
      if (audio) return true;
      try {
        audio = new Audio();
        audio.src = AUDIO_SRC;
        audio.loop = true;
        audio.preload = "auto";
        audio.setAttribute("aria-hidden", "true");
        applyVolume();
        document.body.appendChild(audio);
        return true;
      } catch (e) {
        return false;
      }
    }

    function applyVolume() {
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, (prefs.volume || 100) / 100));
      }
    }

    return {
      start() {
        if (!ensureAudio()) return;
        applyVolume();
        const p = audio.play();
        if (p && p.catch) p.catch(() => {});
      },
      stop() {
        if (audio) audio.pause();
      },
      setVolume(v) {
        if (audio) audio.volume = Math.max(0, Math.min(1, v / 100));
      },
      isPlaying() {
        return !!audio && !audio.paused && !audio.ended;
      },
    };
  })();

  /* ---------------- single-page router (soft navigation) ---------------- */
  // Page files are fetched and their content is swapped into the canvas
  // without a full reload, so the music never restarts. The router is
  // SUB-PATH aware: it works at the domain root, on GitHub Pages project
  // pages (https://user.github.io/repo/), and under any folder.
  const PAGE_FILES = [
    "index.html",
    "choose.html",
    "pttlb.html",
    "play.html",
    "gameshowcase.html",
    "download.html",
    "about.html",
  ];

  let BASE = "/"; // hosting base directory, e.g. "/" or "/my-site/"
  let homeHTML = null; // saved first-page canvas content
  let currentFile = "index.html";

  // map a URL path to a page file name ("index.html" | "choose.html" | ...)
  function fileFromPath(pathname) {
    let rel = pathname;
    if (BASE && BASE !== "/" && rel.indexOf(BASE) === 0) rel = rel.slice(BASE.length);
    rel = rel.replace(/^\/+/, "");
    const file = rel.split("/")[0];
    if (file === "" || file === "index.html") return "index.html";
    if (PAGE_FILES.indexOf(file) !== -1) return file;
    return null;
  }

  function initPage() {
    applyLang(prefs.lang);
    refreshMusicUI();
    initSettings();
    initChooseBoxes();
  }

  function restoreHome() {
    const canvas = document.querySelector(".canvas");
    if (canvas && homeHTML !== null) {
      canvas.className = "canvas first-page";
      canvas.innerHTML = homeHTML;
    }
    currentFile = "index.html";
    initPage();
  }

  function swapTo(file) {
    const canvas = document.querySelector(".canvas");
    if (!canvas) return Promise.resolve(false);
    if (file === "index.html") {
      restoreHome();
      return Promise.resolve(true);
    }
    if (file === currentFile) return Promise.resolve(true); // already showing

    return fetch(file)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("fetch failed"))))
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const src = doc.querySelector(".canvas");
        if (!src) throw new Error("no canvas");
        const cls = (src.className || "").replace("canvas", "").trim();
        canvas.className = "canvas " + cls;
        canvas.innerHTML = src.innerHTML;
        currentFile = file;
        initPage();
        return true;
      })
      .catch(() => {
        // fallback: hard navigation so the site still works
        window.location.href = BASE + file;
        return false;
      });
  }

  // navigate to a page without reloading (also exposed globally for onclick)
  function go(page) {
    const file =
      (page.indexOf("/") === 0 ? page.slice(BASE.length) : page) || "index.html";
    const url = BASE + file;
    if (location.pathname !== url) history.pushState(null, "", url);
    return swapTo(file);
  }
  window.go = go;

  // back / forward buttons
  window.addEventListener("popstate", () => {
    const file = fileFromPath(location.pathname);
    swapTo(file || "index.html");
  });

  /* ---------------- apply language ---------------- */
  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    // update active state on segmented controls
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang-btn") === lang);
    });
  }

  function setLang(lang) {
    prefs.lang = lang;
    savePrefs();
    applyLang(lang);
  }

  /* ---------------- music UI ---------------- */
  function refreshMusicUI() {
    document.querySelectorAll("[data-music-switch]").forEach((sw) => {
      sw.classList.toggle("on", prefs.music);
    });
    document.querySelectorAll("[data-music-state]").forEach((el) => {
      const dict = I18N[prefs.lang] || I18N.en;
      el.textContent = prefs.music ? dict.music_on : dict.music_off;
    });
    document.querySelectorAll("[data-volume-slider]").forEach((sl) => {
      sl.value = String(prefs.volume);
    });
  }

  function setVolume(v) {
    const val = Math.max(0, Math.min(100, Number(v) || 0));
    prefs.volume = val;
    savePrefs();
    Music.setVolume(val);
    refreshMusicUI();
  }

  function setMusic(on) {
    prefs.music = on;
    savePrefs();
    if (on) Music.start();
    else Music.stop();
    refreshMusicUI();
  }

  /* ---------------- prefs ---------------- */
  function savePrefs() {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    } catch (e) {
      /* ignore */
    }
  }

  // Browsers block audio until the first user gesture. If music is enabled
  // but the <audio> element is not allowed to autoplay yet, start it on the
  // first interaction.
  function resumeMusicOnInteraction() {
    const handler = () => {
      if (prefs.music) Music.start();
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", handler);
    };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("keydown", handler);
  }

  /* ---------------- settings panel (gear) ---------------- */
  function initSettings() {
    const gear = document.querySelector(".gear");
    const panel = document.querySelector(".settings-panel");
    if (!gear || !panel) return;

    let hideTimer = null;
    let gearHovered = false;
    let gearSpinStart = 0;
    let gearSpinTimer = null;
    const GEAR_PERIOD = 3200; // ms per revolution (matches the CSS animation)

    const gearIcon = () => gear.querySelector("svg, img");
    const gearAngleNow = () =>
      ((performance.now() - gearSpinStart) * (360 / GEAR_PERIOD)) % 360;

    // start spinning (CSS animation drives the constant spin)
    const gearSpinOn = () => {
      const el = gearIcon();
      if (!el) return;
      clearTimeout(gearSpinTimer);
      gearSpinStart = performance.now();
      el.style.animation = "";
      el.style.transition = "";
      el.style.transform = "";
    };

    // stop spinning with a slow, decelerating ease to the next full turn
    const gearSpinOff = () => {
      const el = gearIcon();
      if (!el) return;
      const angle = gearAngleNow();
      el.style.animation = "none";
      el.style.transition = "none";
      el.style.transform = "rotate(" + angle + "deg)";
      void el.offsetWidth; // force reflow so the transition below runs
      const target = (Math.floor(angle / 360) + 1) * 360;
      el.style.transition = "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "rotate(" + target + "deg)";
      clearTimeout(gearSpinTimer);
      gearSpinTimer = setTimeout(() => {
        el.style.transition = "";
        el.style.transform = "";
        el.style.animation = "";
      }, 1800);
    };

    const updateGearSpin = () => {
      if (gearHovered || panel.classList.contains("open")) gearSpinOn();
      else gearSpinOff();
    };

    const cancelHide = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const openPanel = () => {
      cancelHide();
      panel.classList.add("open");
      gear.classList.add("spinning");
      updateGearSpin();
    };
    const scheduleHide = () => {
      cancelHide();
      hideTimer = setTimeout(() => {
        panel.classList.remove("open");
        gear.classList.remove("spinning");
        updateGearSpin();
      }, 350);
    };

    gear.addEventListener("click", (e) => {
      e.stopPropagation();
      if (panel.classList.contains("open")) scheduleHide();
      else openPanel();
    });

    // auto retract when the mouse leaves gear + panel
    const zone = document.createElement("div");
    zone.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:0;z-index:69;";
    // listen on the panel and gear
    panel.addEventListener("mouseenter", cancelHide);
    panel.addEventListener("mouseleave", scheduleHide);
    gear.addEventListener("mouseenter", () => {
      cancelHide();
      gearHovered = true;
      updateGearSpin();
    });
    gear.addEventListener("mouseleave", () => {
      gearHovered = false;
      if (panel.classList.contains("open")) scheduleHide();
      updateGearSpin();
    });
    // clicking anywhere else closes it
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !gear.contains(e.target)) {
        panel.classList.remove("open");
        gear.classList.remove("spinning");
        updateGearSpin();
      }
    });

    // language buttons
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
    });

    // music switch
    document.querySelectorAll("[data-music-switch]").forEach((sw) => {
      sw.addEventListener("click", () => setMusic(!prefs.music));
    });

    // music volume slider
    document.querySelectorAll("[data-volume-slider]").forEach((sl) => {
      sl.addEventListener("input", () => setVolume(sl.value));
    });
  }

  /* ---------------- choose-page hover boxes navigation ---------------- */
  function initChooseBoxes() {
    document.querySelectorAll(".choose-box").forEach((box) => {
      const target = box.getAttribute("data-target");
      box.setAttribute("tabindex", "0");
      // On coarse-pointer / no-hover devices (phones) there is no hover, so a
      // tap expands the box first and a second tap (or the CTA) navigates.
      const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      box.addEventListener("click", (e) => {
        const onCta = e.target.closest(".box-cta");
        if (isTouch && !box.classList.contains("expanded") && !onCta) {
          document.querySelectorAll(".choose-box.expanded").forEach((b) => {
            if (b !== box) b.classList.remove("expanded");
          });
          box.classList.add("expanded");
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (target) go(target);
        e.stopPropagation();
      });
      box.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && target) go(target);
      });
    });
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    // determine the hosting base directory (works at root or under a folder)
    const p = location.pathname;
    BASE = p.substring(0, p.lastIndexOf("/") + 1);
    if (BASE === "/") BASE = "/";

    const canvas = document.querySelector(".canvas");
    homeHTML = canvas ? canvas.innerHTML : null;

    // if the user landed directly on an inner page URL, load it softly
    const initialFile = fileFromPath(location.pathname);
    if (initialFile && initialFile !== "index.html") {
      currentFile = initialFile; // already rendered (full page); avoid re-fetch
    } else {
      currentFile = "index.html";
    }
    initPage();
    if (prefs.music) resumeMusicOnInteraction();
  });
})();
