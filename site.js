// Hangar website: four languages, download links from the latest release, the departures board.
(() => {
  // Installers live in a separate public repo (Hangar's source repo is private).
  const REPO = "Caoquyen1913/hangar-app";
  const LANGS = ["en", "vi", "ja", "zh-CN"];

  // ---------- inline markup: `code`, **bold**, *em*, [text](link) ----------
  const TOKEN = /(`[^`]+`|\*\*.+?\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;
  const SAFE_HREF = /^(https:\/\/|#|[a-z0-9-]+\.html(#[\w-]+)?$)/i;

  function render(parent, text) {
    parent.textContent = "";
    for (const part of text.split(TOKEN)) {
      if (!part) continue;
      if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
        const c = document.createElement("code");
        c.textContent = part.slice(1, -1);
        parent.append(c);
      } else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        const b = document.createElement("strong");
        appendRendered(b, part.slice(2, -2));
        parent.append(b);
      } else if (part.startsWith("[") && part.endsWith(")")) {
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (m && SAFE_HREF.test(m[2])) {
          const a = document.createElement("a");
          a.href = m[2];
          a.textContent = m[1];
          parent.append(a);
        } else {
          parent.append(part);
        }
      } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        const e = document.createElement("em");
        e.textContent = part.slice(1, -1);
        parent.append(e);
      } else {
        parent.append(part);
      }
    }
  }
  function appendRendered(parent, text) {
    const holder = document.createElement("span");
    render(holder, text);
    parent.append(...holder.childNodes);
  }

  // ---------- language ----------
  const texts = [...document.querySelectorAll("[data-i18n]")];
  const attrs = [
    ["data-i18n-alt", "alt"],
    ["data-i18n-aria", "aria-label"],
    ["data-i18n-content", "content"],
  ].flatMap(([key, attr]) =>
    [...document.querySelectorAll(`[${key}]`)].map((el) => ({ el, attr, id: el.getAttribute(key) })),
  );
  const EN = {};
  for (const n of texts) EN[n.dataset.i18n] ??= n.textContent.trim().replace(/\s+/g, " ");
  for (const a of attrs) EN[a.id] ??= a.el.getAttribute(a.attr);

  const DL = {
    en: { windows: "Download for Windows", mac: "Download for macOS", linux: "Download for Linux" },
  };
  const dicts = { en: {} };
  const select = document.querySelector("[data-lang]");
  let lang = "en";
  let generation = 0;

  const store = {
    get() { try { return localStorage.getItem("hangar-lang"); } catch { return null; } },
    set(v) { try { localStorage.setItem("hangar-lang", v); } catch { /* private mode */ } },
  };

  async function load(code) {
    if (dicts[code]) return dicts[code];
    try {
      const res = await fetch(`i18n/${code}.json`);
      dicts[code] = res.ok ? await res.json() : {};
    } catch {
      dicts[code] = {};
    }
    return dicts[code];
  }

  async function setLang(code) {
    const dict = await load(code);
    lang = code;
    generation += 1;
    const t = (id) => dict[id] ?? EN[id];
    for (const n of texts) render(n, t(n.dataset.i18n));
    for (const a of attrs) a.el.setAttribute(a.attr, t(a.id));
    document.documentElement.lang = code;
    if (select) select.value = code;
    labelPrimary(dict);
    pickVideo();
  }

  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    const saved = store.get();
    if (LANGS.includes(saved)) return saved;
    for (const l of navigator.languages || [navigator.language || ""]) {
      const s = l.toLowerCase();
      if (s.startsWith("vi")) return "vi";
      if (s.startsWith("ja")) return "ja";
      if (s.startsWith("zh")) return "zh-CN";
      if (s.startsWith("en")) return "en";
    }
    return "en";
  }

  select?.addEventListener("change", () => {
    store.set(select.value);
    setLang(select.value);
  });

  // ---------- which system is this ----------
  function detectOs() {
    const p = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
    if (p.includes("win")) return "windows";
    if (p.includes("mac")) return "mac";
    if (p.includes("linux") && !/android/i.test(navigator.userAgent)) return "linux";
    return null;
  }
  const os = detectOs();
  const primary = document.querySelector("[data-primary-download]");
  const primaryLabel = document.querySelector("[data-primary-label]");

  function labelPrimary(dict) {
    if (!os || !primaryLabel) return;
    primaryLabel.textContent = dict[`dl.for.${os}`] ?? DL.en[os];
  }

  if (os) {
    document.querySelector(`.platform[data-os="${os}"]`)?.classList.add("is-you");
    document.querySelector(".platforms")?.classList.add("has-you");
  }
  // macOS and Linux install with the curl command in their card, so send them there.
  if (primary && (os === "mac" || os === "linux")) primary.href = "#download";

  // ---------- copy the install command ----------
  for (const btn of document.querySelectorAll("[data-copy]")) {
    btn.addEventListener("click", async () => {
      const cmd = btn.parentElement.querySelector("pre").textContent.trim();
      try {
        await navigator.clipboard.writeText(cmd);
      } catch {
        return; // No clipboard (http, old browser): the command stays visible to select by hand.
      }
      const label = btn.textContent;
      btn.textContent = "✓";
      setTimeout(() => (btn.textContent = label), 1500);
    });
  }

  // ---------- links from the latest release ----------
  async function loadRelease() {
    if (!document.querySelector("[data-asset]")) return;
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) return;
      const rel = await res.json();
      const assets = rel.assets || [];
      const version = document.querySelector("[data-version]");
      if (version && rel.tag_name) version.textContent = rel.tag_name;
      for (const a of document.querySelectorAll("[data-asset]")) {
        const hit = assets.find((x) => x.name.endsWith(a.dataset.asset));
        if (hit) {
          a.href = hit.browser_download_url;
          a.title = `${hit.name} (${(hit.size / 1048576).toFixed(1)} MB)`;
        } else if (a.classList.contains("alt")) {
          a.hidden = true;
        }
      }
      if (primary && os === "windows") {
        const first = document.querySelector(`.platform[data-os="${os}"] .btn.primary`);
        if (first && first.href.includes("/download/")) primary.href = first.href;
      }
    } catch {
      // Offline or rate-limited: every button still points at the releases page.
    }
  }

  // ---------- intro video, one per language ----------
  const video = document.querySelector("[data-video]");
  function pickVideo() {
    if (!video || !video.paused) return;
    const src = `video/intro-${lang}.mp4`;
    const source = video.querySelector("source");
    if (source && source.getAttribute("src") !== src) {
      source.setAttribute("src", src);
      video.poster = `video/poster-${lang}.webp`;
      video.load();
    }
  }

  // ---------- departures board ----------
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => {
      const d = new Date();
      clock.textContent = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    tick();
    setInterval(tick, 15000);
  }

  // One reveal on load: each tile cycles through characters, then settles, row by row.
  function flipBoard() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    const gen = generation;
    [...document.querySelectorAll("[data-board] .flap")].forEach((tile, i) => {
      const final = tile.textContent;
      const row = Math.floor(i / 5);
      const start = 250 + row * 140 + (i % 5) * 45;
      const steps = 9 + (i % 4);
      let n = 0;
      const scramble = () => final.replace(/[A-Za-z0-9]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
      tile.style.minWidth = `${tile.getBoundingClientRect().width}px`;
      tile.textContent = scramble();
      setTimeout(function flip() {
        // A language switch mid-reveal already wrote the new text: leave it.
        if (gen !== generation) return;
        n += 1;
        if (n >= steps) {
          tile.textContent = final;
          return;
        }
        tile.textContent = scramble();
        setTimeout(flip, 55);
      }, start);
    });
  }

  // ---------- guide: highlight the section in view ----------
  const tocLinks = [...document.querySelectorAll(".toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = [...byId.keys()].find((id) => seen.get(id));
        if (first) for (const [id, a] of byId) a.classList.toggle("on", id === first);
      },
      { rootMargin: "-80px 0px -55% 0px" },
    );
    for (const id of byId.keys()) {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    }
  }

  // ---------- start ----------
  setLang(initialLang()).then(flipBoard);
  loadRelease();
})();
