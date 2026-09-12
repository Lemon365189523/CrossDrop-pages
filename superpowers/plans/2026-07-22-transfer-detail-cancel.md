# 传输详情页 + 取消/断网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐传输详情页（进度/速度/ETA/取消）与协议级取消、断网错误映射。

**Architecture:** `TcpTransferEngine` 持有 `_activeSession`；`cancelActive` 发 `transfer.cancel` 后关连接；纯函数 `TransferProgressTracker` 算速度/ETA；UI 消费 `activeTransferProvider`。

**Tech Stack:** Flutter / Riverpod / go_router / CDLP/1 / crossdrop_core

**Spec:** `docs/superpowers/specs/2026-07-22-transfer-detail-cancel-design.md`

## Global Constraints

- 协议字段以 TDD-02 为准；`transfer.cancel` payload：`by` + `reason`
- Verifying 不接受取消
- Domain / core 禁止 `dart:io`
- 注释用简体中文；更新 `DEV/开发任务进度看板.md`
- 不做 Drift、不做 PRD-04 像素打磨

---

### Task 1: TransferProgressTracker（速度/ETA）

**Files:**
- Create: `packages/crossdrop_core/lib/src/utils/transfer_progress_tracker.dart`
- Modify: `packages/crossdrop_core/lib/crossdrop_core.dart`
- Test: `packages/crossdrop_core/test/transfer_progress_tracker_test.dart`

**Produces:** `TransferProgressTracker.update(bytes, now)` → `{speedBytesPerSec, eta}`

- [ ] 写失败测试：两次采样后速度与 ETA 正确；速度为 0 时 eta 为 null
- [ ] 实现滑动窗口（约 1s）最小实现
- [ ] `dart test` 在 `packages/crossdrop_core` 通过

---

### Task 2: 引擎取消帧 + 断网映射 + 进度字段

**Files:**
- Modify: `lib/infrastructure/transfer/tcp_transfer_engine.dart`

**行为:**
- 字段：`_activeSession`、`_cancelRequested`、`_progressTracker`
- `cancelActive`：verifying/终态直接 return；否则发 cancel、关 session、发布 cancelled
- send/receive 路径绑定 session；catch 若 `_cancelRequested` 不覆盖为 failed
- 接收路径 catch 内发布 cancelled/failed（修复仅 rethrow 不落终态）
- 发送循环检查 cancel 标志；SocketException → `networkInterrupted`（连接阶段仍可用 `connectFailed`）
- 进度 publish 时写入 speed/eta

---

### Task 3: 详情页 UI + 路由 + 导航 + l10n

**Files:**
- Create: `lib/features/transfer/transfer_detail_page.dart`
- Create: `lib/features/transfer/transfer_active_navigator.dart`
- Modify: `lib/app/router.dart`、`lib/app/app.dart`、`lib/features/home/home_page.dart`
- Modify: `lib/l10n/app_zh.arb`、`lib/l10n/app_en.arb`

**行为:**
- `/transfer/active` 详情页；banner 可点；发送进入 sending/waiting 后可自动进详情；接收 accept 后进详情
- 取消二次确认；返回不取消
- arb：`transferDetail`、`cancelTransfer`、`cancelTransferConfirm`、`transferSpeed`、`transferEta`、状态文案

---

### Task 4: 看板 + 验证

- [ ] 更新看板 M3-UI-02 / M3-TCP-04 / M3-TCP-05 → done + 完成记录
- [ ] `flutter analyze` + `flutter test` + core package test
