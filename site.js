// Hangar landing page: language switch, departures-board reveal, download links from the latest release.
(() => {
  // Bản cài nằm ở repo công khai riêng (mã nguồn của Hangar là repo riêng tư).
  const REPO = "Caoquyen1913/hangar-app";

  // ---------- language ----------
  const VI = {
    skip: "Bỏ qua, tới nội dung",
    "nav.features": "Tính năng",
    "nav.download": "Tải về",
    "hero.title": "Mọi dự án bạn từng mở, đều nằm trong tầm mắt.",
    "hero.lede": "Hangar quét các thư mục dự án và cho bạn biết dự án nào đang làm, dự án nào đã nguội, dự án nào còn thay đổi chưa commit hoặc chưa push. Mở dự án nào cũng có sẵn editor, Git, terminal và Claude Code.",
    "hero.cta": "Tải Hangar",
    "hero.source": "Xem tính năng",
    "hero.fine": "Miễn phí. Windows, macOS và Linux.",
    "board.caption": "5 dự án. 1 đã nguội, 2 cần sao lưu.",
    facts: "Viết bằng Rust với GPUI. Mở trong chưa tới một giây, lúc rảnh dùng khoảng 55 MB bộ nhớ, và không bao giờ gửi mã của bạn đi đâu.",
    "features.title": "Một cửa sổ cho cả đội bay",
    "features.lede": "Mỗi dự án có sẵn các tab mà bình thường bạn phải mở năm ứng dụng. Hangar chỉ chạy công cụ cho dự án đang mở và tắt khi bạn rời đi.",
    "f1.t": "Biết mình đang dừng ở đâu",
    "f1.d": "Nhánh, thay đổi chưa commit và chưa push, commit và phiên Claude gần nhất. Bấm \"Mình đang làm gì nhỉ?\" để Claude đọc repo rồi tóm tắt.",
    "f2.t": "Editor tự cài công cụ cho từng ngôn ngữ",
    "f2.d": "Báo lỗi, gợi ý và đi tới định nghĩa cho 12 ngôn ngữ. Thiếu server thì cài gói ngôn ngữ bằng một cú bấm, không đụng công cụ cài toàn máy. Format khi lưu, xem trước Markdown và HTML.",
    "f3.t": "Git không phải đoán",
    "f3.d": "Stage từng đoạn, commit, pull và push, gỡ xung đột. Báo lỗi kèm bước tiếp theo. Hangar dùng chính git của bạn và không bao giờ force-push.",
    "f4.t": "Tìm ra dev server bạn bỏ quên",
    "f4.d": "Thấy tiến trình nào đang chạy trong từng dự án và ở port nào. Port bị chiếm thì biết tiến trình nào giữ nó. Server còn chạy trong dự án đã nguội hiện ra để bạn tắt.",
    "f5.t": "Biết trước thay đổi sẽ ảnh hưởng tới đâu",
    "f5.d": "Định nghĩa, nơi gọi và route HTTP xuyên các dự án liên kết. Lưu một file mà dự án khác đang dùng thì Hangar chỉ ra chỗ nào, và Claude đọc được cùng bản đồ đó.",
    "f6.t": "Claude Code, bạn vẫn cầm lái",
    "f6.d": "Trò chuyện ngay trong dự án, duyệt từng thay đổi dưới dạng diff, hoặc giao việc cho agent làm trên nhánh riêng trong worktree riêng cho tới khi bạn merge.",
    "f7.t": "Lấy lại hàng chục GB",
    "f7.d": "Dung lượng target/ và node_modules/ ở các dự án bạn không còn đụng tới, xóa bằng hai cú bấm. Thư viện cũ và có lỗ hổng trên mọi dự án.",
    "f8.t": "Chỉnh theo ý bạn",
    "f8.d": "Nhập theme VS Code hoặc Zed bạn đang dùng, chỉnh cỡ chữ, quản lý plugin Claude Code cho từng dự án. English, Tiếng Việt, 日本語 và 简体中文.",
    "dl.title": "Tải về",
    "dl.version": "Bản mới nhất:",
    "dl.all": "Mọi bản phát hành và mã kiểm tra",
    "dl.win.req": "Windows 10 hoặc 11, 64-bit",
    "dl.win.exe": "Tải bộ cài (.exe)",
    "dl.win.msi": "Gói MSI",
    "dl.win.note": "Chưa ký số: nếu SmartScreen chặn, chọn More info rồi Run anyway.",
    "dl.mac.req": "macOS 12 trở lên",
    "dl.mac.arm": "Chip Apple (.dmg)",
    "dl.mac.intel": "Mac chip Intel (.dmg)",
    "dl.mac.note": "Chưa notarize: lần đầu macOS chặn Hangar, mở System Settings › Privacy & Security rồi chọn Open Anyway.",
    "dl.linux.req": "x86-64, X11 hoặc Wayland",
    "dl.linux.appimage": "AppImage",
    "dl.linux.deb": "Debian / Ubuntu (.deb)",
    "dl.linux.note": "Cấp quyền chạy cho AppImage (chmod +x) rồi mở.",
    "dl.cli.t": "Công cụ dòng lệnh",
    "dl.cli.d": "Cùng bản quét dự án ngay trong terminal, lệnh hangar. Có sẵn cho từng hệ điều hành ở trang phát hành.",
    "dl.claude.t": "Cho tab Claude",
    "dl.claude.d": "Cài Claude Code và đăng nhập. Khung trò chuyện cần thêm Node.js và adapter ACP:",
    foot: "Hangar dùng miễn phí. Dự án và dữ liệu của bạn chỉ nằm trên máy bạn.",
  };
  const DL_VI = { windows: "Tải cho Windows", mac: "Tải cho macOS", linux: "Tải cho Linux" };
  const DL_EN = { windows: "Download for Windows", mac: "Download for macOS", linux: "Download for Linux" };

  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const EN = Object.fromEntries(nodes.map((n) => [n.dataset.i18n, n.textContent]));
  const toggle = document.querySelector("[data-lang-toggle]");
  let lang = "en";

  const store = {
    get() { try { return localStorage.getItem("hangar-lang"); } catch { return null; } },
    set(v) { try { localStorage.setItem("hangar-lang", v); } catch { /* private mode */ } },
  };

  function setLang(next) {
    lang = next;
    const dict = next === "vi" ? VI : EN;
    for (const n of nodes) {
      const text = dict[n.dataset.i18n];
      if (text) n.textContent = text;
    }
    document.documentElement.lang = next;
    toggle.textContent = next === "vi" ? "EN" : "VI";
    toggle.setAttribute("aria-label", next === "vi" ? "English" : "Tiếng Việt");
    labelPrimary();
  }

  toggle.addEventListener("click", () => {
    const next = lang === "vi" ? "en" : "vi";
    store.set(next);
    setLang(next);
  });

  // ---------- which system is this ----------
  function detectOs() {
    const p = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
    if (p.includes("win")) return "windows";
    if (p.includes("mac")) return "mac";
    if (p.includes("linux") && !/android/.test(navigator.userAgent.toLowerCase())) return "linux";
    return null;
  }
  const os = detectOs();
  const primary = document.querySelector("[data-primary-download]");
  const primaryLabel = document.querySelector("[data-primary-label]");
  let primaryHref = null;

  function labelPrimary() {
    if (!os) return;
    primaryLabel.textContent = (lang === "vi" ? DL_VI : DL_EN)[os];
  }

  if (os) {
    document.querySelector(`.platform[data-os="${os}"]`)?.classList.add("is-you");
    document.querySelector(".platforms")?.classList.add("has-you");
  }

  // ---------- links from the latest release ----------
  async function loadRelease() {
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) return;
      const rel = await res.json();
      const assets = rel.assets || [];
      document.querySelector("[data-version]").textContent = rel.tag_name;
      for (const a of document.querySelectorAll("[data-asset]")) {
        const hit = assets.find((x) => x.name.endsWith(a.dataset.asset));
        if (hit) {
          a.href = hit.browser_download_url;
          a.title = `${hit.name} (${(hit.size / 1048576).toFixed(1)} MB)`;
        } else if (a.classList.contains("alt")) {
          a.hidden = true;
        }
      }
      // Windows and Linux: the hero button downloads directly. A Mac can be Apple silicon or
      // Intel, which the browser does not say reliably, so it goes to the two choices.
      if (os === "windows" || os === "linux") {
        const first = document.querySelector(`.platform[data-os="${os}"] .btn.primary`);
        if (first && first.href.includes("/download/")) primaryHref = first.href;
      }
      if (primaryHref) primary.href = primaryHref;
    } catch {
      // Offline or rate-limited: every button still points at the releases page.
    }
  }

  // ---------- departures board ----------
  const clock = document.querySelector("[data-clock]");
  const tick = () => {
    const d = new Date();
    clock.textContent = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  tick();
  setInterval(tick, 15000);

  // One reveal on load: each tile cycles through characters, then settles, row by row.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
    const tiles = [...document.querySelectorAll("[data-board] .flap")];
    tiles.forEach((tile, i) => {
      const final = tile.textContent;
      tile.style.minWidth = `${final.length + 0.8}ch`;
      const row = Math.floor(i / 5);
      const start = 250 + row * 140 + (i % 5) * 45;
      const steps = 9 + (i % 4);
      let n = 0;
      const scramble = () =>
        final.replace(/[A-Za-z0-9]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
      tile.textContent = scramble();
      setTimeout(function flip() {
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

  // ---------- start ----------
  const saved = store.get();
  const initial = saved || ((navigator.language || "").toLowerCase().startsWith("vi") ? "vi" : "en");
  setLang(initial);
  if (primary && os === "mac") primary.href = "#download";
  loadRelease();
})();
