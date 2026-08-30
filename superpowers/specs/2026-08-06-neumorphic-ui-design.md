# CrossDrop 新拟态 UI 设计

> 日期：2026-08-06  
> 更新：2026-08-07（深色）  
> 状态：已实现  

> 参考：浅色灰蓝样板；深色炭灰+薄荷绿样板

## 目标

全 App 新拟态：
- **浅色**：灰蓝底、蓝色强调
- **深色**：炭灰底 `#1E1E1E`、薄荷绿强调 `#4ED08C`、双阴影凸起/凹陷

## 非目标

改交互/协议、插画级装饰。

## 实现

- `NeoColors.light` / `NeoColors.dark` + 共用 `_buildNeoTheme`
- `NeoSurface` / `NeoInset` / `NeoPrimaryButton`（阴影在深色下调 alpha）
- Shell、首页、历史、设置、帮助、引导、传输相关页
