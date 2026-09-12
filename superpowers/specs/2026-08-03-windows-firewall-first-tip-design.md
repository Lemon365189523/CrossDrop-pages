# M4-WIN-01 Windows 防火墙首次提示 设计

> 日期：2026-08-03  
> 状态：已实现  
> 对齐：TDD-01 §12.5；承接 M2-PERM-04 帮助文案

## 目标

Windows 首次进入首页时弹一次应用内提示：若系统防火墙询问，请允许「专用网络」；可跳转帮助。

## 非目标

探测是否被拦、自动打开系统防火墙设置、非 Windows 展示、重复提醒。

## 实现要点

- `SharedPreferences` flag：`crossdrop.windows_firewall_tip_seen`（多实例键隔离）  
- `WindowsFirewallTipBinder`：`platformLabel == windows` + `onboardingDone` + 路径 `/home`  
- 按钮：「知道了」关闭；「查看帮助」→ `/help`；两者都写 flag  
