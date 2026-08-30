# M4-IOS-01 本地网络 Usage Description 设计

> 日期：2026-08-06  
> 状态：已实现  
> 对齐：TDD-01 §12.x iOS；承接 M2-PERM-01

## 目标

系统本地网络权限弹窗提供中/英用途说明（`InfoPlist.strings`）。

## 非目标

改 MethodChannel、引导页、Bonjour 服务名。

## 实现

- `ios/Runner/zh.lproj/InfoPlist.strings`、`en.lproj/InfoPlist.strings`  
- `Info.plist` 默认英文回退；Xcode `knownRegions` 含 `zh`  
