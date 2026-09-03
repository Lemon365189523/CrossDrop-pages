# Web UI 预览 Implementation Plan

> **For agentic workers:** 本计划由当前会话直接执行（范围小，不拆 subagent）。

**Goal:** 完成 Web 端 UI 预览成品（无局域网传输）。

**Architecture:** 继续 `supportsLanTransport=false` stub；仅品牌化壳与隐藏无效入口。

**Tech Stack:** Flutter Web、现有 l10n / Riverpod

## Global Constraints

- 不实现 WebRTC / 网关  
- 文案简体中文 + 英文 arb  
- 主题色对齐 L1：`#E8EEF5` / `#5B8DEF`

---

### Task 1：Web 壳与图标

- [ ] 更新 `web/index.html`、`web/manifest.json`
- [ ] 复制 branding 图标到 `web/icons` / favicon
- [ ] Verify: 文件内容含 CrossDrop

### Task 2：l10n + 帮助 / 设置

- [ ] 增强 `webPreviewHint`；新增 `helpTopicWeb` / `helpBodyWeb`
- [ ] 帮助页在 `platformLabel == web` 时展示
- [ ] 设置保存路径在 `files == null` 时禁用并副标题说明
- [ ] Verify: `flutter gen-l10n`；analyze

### Task 3：构建验收

- [ ] `flutter build web`
- [ ] 更新看板 M1-WEB-02 done
