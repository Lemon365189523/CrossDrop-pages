# M5-ONB-01 首次引导设计

> 日期：2026-07-30  
> 状态：已批准  
> 对齐：PRD-03 §4.1 / PRD-04 §7

## 行为

- `onboardingDone == false` → `/onboarding`（三页 PageView）
- 跳过 → 第 3 页；允许/稍后均写 `onboardingDone` 后进首页
- 复用现有本地网络权限 API；桌面端「开始使用」

## 非目标

插画动画打磨、通知权限、帮助页
