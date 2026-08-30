# M5-SET-02 主题 / 语言独立设置页 设计

> 日期：2026-08-03  
> 状态：已实现  
 
> 对齐：PRD-04 §22–23；现有 `ThemePreference` / `localeCode` / `device_name` 子页模式

## 目标

1. `/settings/theme`：跟随系统 / 浅色 / 深色，即时生效。  
2. `/settings/locale`：简体中文 / English，即时生效。  
3. 设置主页改为入口 ListTile（副标题显示当前值），移除开关与点按切换。

## 非目标

更多语言、自定义色、关于页打磨。

## 实现要点

- `theme_settings_page.dart` / `locale_settings_page.dart` + router  
- l10n 文案；`RadioListTile` + `settingsRepository.update`  
- 留在子页，返回即回设置列表
