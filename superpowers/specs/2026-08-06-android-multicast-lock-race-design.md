# Android 找不到 iOS/Mac — MulticastLock 竞态修复

日期：2026-08-06

## 问题

安卓手机（如小米）首页附近设备列表看不到同局域网的 iOS / Mac。

## 根因

`main()` 先 `await bootstrap()`（内部 `discovery.start()` → `LanMulticastLock.acquire()`），再 `runApp()`。

此时 `MainActivity.configureFlutterEngine` 尚未注册 `crossdrop/lan_multicast` MethodChannel，持锁调用静默失败。Android 未持 MulticastLock 时会丢弃 UDP 广播，表现为「找不到对方」。

## 修复

1. `MainActivity`：Engine 配置完成后立即 `acquireMulticastLock()`，不依赖 Dart 时序。
2. `LocalNetworkPermissionBinder`：首帧与 `resumed` 时补持锁并 `refreshNow()`。
3. `LanMulticastLock`：失败时 `debugPrint`，便于真机日志确认。

## 验证

1. 安卓与 Mac/iOS 连同一 Wi‑Fi（非访客网、关闭 VPN）。
2. 三端打开 CrossDrop 前台。
3. 安卓约 2 秒内应出现 Mac/iOS；反向也应互见。
4. 安卓切后台再回前台后仍能互见。
