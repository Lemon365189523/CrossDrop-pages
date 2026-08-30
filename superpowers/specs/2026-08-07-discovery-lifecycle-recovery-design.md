# 传输后 / iOS 回前台发现断连 — 修复设计

日期：2026-08-07

## 现象

- 三端初始可互见
- 完成一次传输后，附近设备列表清空
- iOS 退后台一段时间后回前台，同样断连

## 根因

1. **Darwin limited broadcast**：网卡枚举短暂失败时回退到 `255.255.255.255`，在 macOS/iOS 上会 errno 49 并毁掉 `RawDatagramSocket`（此前仅 macOS 做了防护）。
2. **无 socket 恢复**：损坏后仅 `refreshNow()` 无法重绑 UDP；前后台切换后 socket 也可能失效。
3. **广播目标无缓存**：传输期间 / 回前台瞬间 `NetworkInterface.list` 可能返回空，触发上述回退。

## 修复

1. iOS 与 macOS 同样禁止 limited broadcast；子网广播结果缓存 30s，失败时用上次有效目标。
2. `DiscoveryService.restart()`：不发送 goodbye、不清设备表，重绑 socket。
3. Socket error / 连续发送失败 → 自动 restart。
4. 回前台、传输槽位释放 → `LocalNetworkPermissionBinder` 调用 restart。

## 验证

1. 三端互见 → 完成一次传输 → 2s 内仍互见
2. iOS 退后台 30s+ → 回前台 → 2s 内恢复互见
3. 重复多轮传输与前后台切换，列表不应永久清空
