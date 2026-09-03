# M4-AND-01 Android 前台服务 + 传输通知

日期：2026-08-09  
状态：已实现  
用户批准：范围 A；勿引入无 SPM 的 Apple 插件 → 弃用 `flutter_foreground_task`，改原生 Kotlin FGS

## 目标

Android 活动传输期间启动 Foreground Service + 进度通知，降低切后台被杀概率。

## 范围（仅 Android）

1. 任务 `occupiesSlot` → 启动 FGS + 通知（文件名、进度%）
2. 终态 / 槽位清空 → 停止服务
3. 点通知回 App 前台
4. 按需申请 `POST_NOTIFICATIONS`

## 非目标

后台请求接受/拒绝通知；完成/失败终态通知；iOS 保活。

## 实现

- `TransferForegroundService`（`dataSync`）+ MethodChannel `crossdrop/transfer_foreground`
- `AndroidForegroundTransferBinder` 监听活动任务
- **无新增 iOS/macOS 插件**，不影响 Swift Package Manager

## 验证

`flutter gen-l10n`；`flutter analyze`；真机：传文件切后台通知常驻，结束后消失，点通知回 App。
