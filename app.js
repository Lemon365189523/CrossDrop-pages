(function () {
  const ICONS = {
    macos:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
    windows:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5 10.5 4.2v7.6H3V5.5zm0 8.3h7.5v7.6L3 20.1V13.8zm9-9.3L21 3.2v7.5h-9V4.5zm0 9.3h9v7.6l-9-1.4v-6.2z"/></svg>',
    android:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 9.5 19 6.8a.5.5 0 0 0-.9-.4l-1.5 2.8a7.9 7.9 0 0 0-4.2-1.2 7.9 7.9 0 0 0-4.2 1.2L6.9 6.4a.5.5 0 1 0-.9.4l1.4 2.7A6.5 6.5 0 0 0 4 14.5v3.5a1 1 0 0 0 1 1h1v2.5a1.5 1.5 0 0 0 3 0V19h6v2.5a1.5 1.5 0 0 0 3 0V19h1a1 1 0 0 0 1-1v-3.5a6.5 6.5 0 0 0-2.4-5zM8.5 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>',
    ios:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3c-.2 1.3-.8 2.5-1.6 3.5-.9 1-2.1 1.8-3.4 1.7.1-1.2.7-2.4 1.5-3.3.9-1 2.2-1.7 3.5-1.9zM20.8 17.1c-.6 1.4-1.3 2.7-2.3 3.9-1 1.2-2 2.4-3.5 2.4-1.3 0-1.7-.8-3.2-.8-1.5 0-2 .8-3.3.8-1.5 0-2.6-1.3-3.6-2.5-2-2.4-3.5-6.8-1.5-9.8 1-1.5 2.8-2.4 4.6-2.4 1.4 0 2.7.9 3.2.9.5 0 2-.9 3.4-.9 1.2 0 2.3.5 3.1 1.4-2.7 1.5-2.3 5.4.3 6.6-.5 1.3-1.1 2.6-1.9 3.8z"/></svg>',
  };

  const PLACEHOLDER_RE = /(YOUR_|id0000000000|example\.com|^#)/i;

  function isPlaceholder(url) {
    if (!url || typeof url !== "string") return true;
    return PLACEHOLDER_RE.test(url.trim());
  }

  function createButton(label, url, primary, external) {
    const a = document.createElement("a");
    a.className = primary
      ? "btn btn-primary btn-block"
      : "btn btn-secondary btn-block";
    a.textContent = label;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.href = url;
    return a;
  }

  function renderCard(key, platform, releasesPage) {
    const card = document.createElement("article");
    card.className = "download-card";

    const head = document.createElement("div");
    head.className = "download-card-head";

    const iconWrap = document.createElement("div");
    iconWrap.className = "platform-icon";
    iconWrap.innerHTML = ICONS[key] || ICONS.android;

    const title = document.createElement("h3");
    title.textContent = platform.label;

    head.appendChild(iconWrap);
    head.appendChild(title);

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = platform.hint || "";

    const actions = document.createElement("div");
    actions.className = "download-actions";

    const ready = !isPlaceholder(platform.url);
    if (ready) {
      const label =
        platform.store === "appstore" ? "前往 App Store" : `下载 ${platform.label}`;
      actions.appendChild(
        createButton(label, platform.url, true, platform.store === "appstore")
      );
    } else {
      const pending = document.createElement("span");
      pending.className = "btn btn-primary is-disabled btn-block";
      pending.textContent =
        platform.store === "appstore" ? "App Store 即将上架" : "安装包即将发布";
      actions.appendChild(pending);
      actions.appendChild(
        createButton("查看 GitHub Release", releasesPage, false, true)
      );
    }

    if (platform.secondaryUrl && !isPlaceholder(platform.secondaryUrl)) {
      actions.appendChild(
        createButton(
          platform.secondaryLabel || "备用下载",
          platform.secondaryUrl,
          false,
          true
        )
      );
    }

    card.appendChild(head);
    card.appendChild(hint);
    card.appendChild(actions);
    return card;
  }

  async function init() {
    const grid = document.getElementById("download-grid");
    const loading = document.getElementById("download-loading");
    const versionLine = document.getElementById("version-line");
    if (!grid) return;

    try {
      const res = await fetch("downloads.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("downloads.json not found");
      const data = await res.json();

      if (versionLine && data.version) {
        const date = data.releasedAt ? ` · ${data.releasedAt}` : "";
        versionLine.textContent = `当前版本 v${data.version}${date} · 安装包托管于 GitHub Releases`;
      }

      grid.replaceChildren();
      grid.removeAttribute("aria-busy");
      if (loading) loading.remove();

      const order = ["macos", "windows", "android", "ios"];
      for (const key of order) {
        const platform = data.platforms?.[key];
        if (!platform) continue;
        grid.appendChild(renderCard(key, platform, data.releasesPage));
      }
    } catch (err) {
      grid.removeAttribute("aria-busy");
      if (loading) loading.remove();
      grid.innerHTML =
        '<p class="hint download-error">下载信息加载失败，请稍后在 <a href="https://github.com/Lemon365189523/CrossDrop/releases">GitHub Releases</a> 获取安装包。</p>';
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
