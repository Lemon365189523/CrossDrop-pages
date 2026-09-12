# M2-PERM 本地网络权限（最小可用）设计

> 日期：2026-07-23  
> 任务：M2-PERM-01、M2-PERM-02  
> 状态：已批准（对话确认，范围 A）  
> 对齐：PRD-04 §8.9 / §27.1（功能级）、TDD-01 §13

---

## 1. 目标

打通 iOS / Android 真机局域网发现的权限门槛：

1. 平台权限声明（plist / manifest）
2. `PlatformCapability` 真实检测 / 申请 / 打开设置
3. 首页权限缺失横幅（含用途说明 Dialog → 系统申请 → 打开设置）
4. 回前台复检

## 2. 非目标

- 完整首次引导多页（M5-ONB-01）
- 设置页权限状态页
- 通知权限（本轮不做）
- Windows 防火墙文案（M2-PERM-04）

## 3. 架构

- 依赖：`permission_handler`（Android 运行时权限）
- iOS Local Network：Info.plist 声明 + MethodChannel 触发系统弹窗（系统无稳定公开「已授权」API 时，以触发 + 用户操作结果为准）
- 桌面（macOS/Windows）：短路为已授权
- UI 只改首页横幅 + lifecycle

## 4. 平台声明

### iOS
- `NSLocalNetworkUsageDescription`（中英文用途说明）
- `NSBonjourServices`：`_crossdrop._udp`、`_crossdrop._tcp`

### Android
- `INTERNET`、`ACCESS_NETWORK_STATE`、`ACCESS_WIFI_STATE`
- `CHANGE_WIFI_MULTICAST_STATE`（组播/广播接收）
- API 33+：`NEARBY_WIFI_DEVICES`（`usesPermissionFlags="neverForLocation"`）

## 5. UI 行为

- `localNetworkPermissionProvider`：启动检测；App resume 复检
- 缺失：首页顶部警告横幅 +「允许」/「打开设置」
- 「允许」→ 用途说明 Dialog → `requestLocalNetworkPermission` → 复检；若仍拒绝且 permanentlyDenied → 引导设置
- 恢复后：横幅消失，`discovery.refreshNow()`

## 6. 成功标准

- [ ] 声明齐全
- [ ] Android 可拒绝并见横幅
- [ ] iOS 首次可弹出本地网络系统框（真机）
- [ ] analyze / test 通过
- [ ] 看板 M2-PERM-01/02 done
