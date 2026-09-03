# M2-PERM-04 Windows 防火墙引导文案 设计

> 日期：2026-08-03  
> 状态：已实现  
> 对齐：PRD-04 §24 / §31.4；TDD-01 §12.5；看板备注「帮助页」

## 目标

1. Windows 帮助页新增「Windows 防火墙」专题 FAQ（允许专用网络等步骤）。  
2. Windows 空状态 hint 追加防火墙短提示，并保留「查看排查方法」。  
3. 非 Windows 不展示上述文案；通用「找不到附近设备」去掉笼统第 5 条。

## 非目标

- M4-WIN-01 首次防火墙弹窗  
- 自动打开防火墙设置 / 探测是否被拦

## 实现要点

- `platformLabel == 'windows'`（`PlatformCapability`）分流  
- l10n：`helpTopicWindowsFirewall` / `helpBodyWindowsFirewall` / `noDevicesWindowsFirewallHint`  
- `help_page.dart` 条件插入 FAQ；`home_page.dart` 空状态拼接 hint  
