# M6-ERR-01 错误码 UI 文案 Implementation Plan

> **For agentic workers:** Spec: `docs/superpowers/specs/2026-08-02-error-code-ui-messages-design.md`

**Goal:** `ErrorCode` → l10n；禁止展示 raw `errorMessage` / `$e`。

**Tech:** Flutter l10n arb + `ErrorMessages` 映射；结果页 / 历史 / 首页 SnackBar。

## Tasks

### Task 1: arb + ErrorMessages + 单测
- 在 `app_zh.arb` / `app_en.arb` 增加 error* keys（`fileTooLarge` 可复用）
- 新增 `lib/l10n/error_messages.dart`
- 新增 `test/error_messages_test.dart`（全枚举非空；未知 → generic）
- `flutter gen-l10n` + test

### Task 2: 接线 UI
- `transfer_result_page.dart`：副文案用 `forCodeName`
- `history_page.dart`：失败/取消项副文案加映射；列表 error 态用 generic
- `home_page.dart`：离线/忙碌/选文件/发送失败 SnackBar
- analyze + test；更新看板 M6-ERR-01 → done
