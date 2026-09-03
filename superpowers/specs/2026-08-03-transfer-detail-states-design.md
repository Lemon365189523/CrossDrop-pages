# M5-XFER-01 等待确认 / 传输详情全状态 设计

> 日期：2026-08-03  
> 状态：已实现  
> 对齐：PRD-04 §10 / §12；协议 `decisionTimeout` 30s

## 目标

1. 发送方 `waiting`：同路由专用布局（倒计时、文件卡、取消）。  
2. connecting / validating / sending / receiving / verifying 按状态展示差异化 UI。

## 非目标

独立等待路由、接收弹窗改版、连线动画、进度防倒退、持续传输条大改。

## 实现要点

- 仍用 `/transfer/active`；`waiting`（发送）分支 `_WaitingBody`  
- 倒计时：`createdAt + CdlpV1.decisionTimeout`，每秒刷新  
- verifying 隐藏取消；传中展示字节进度与速度/ETA  
