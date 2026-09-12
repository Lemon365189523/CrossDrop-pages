# M4-IOS-02 iOS 后台传输限制提示

日期：2026-08-08  
状态：已实现

## 目标

明确告知用户：MVP **不承诺** iOS 后台传输；请保持前台。

## 范围（仅 iOS）

1. **传输详情横幅**：活动任务期间固定提示。
2. **回前台对话框**：活动传输期间曾进入后台 → 回前台弹一次（本会话不重复）；「知道了」/「查看帮助」。
3. **帮助 FAQ**：仅 iOS 展示「后台传输」专题。

## 非目标

后台保活、BGTask、Android/桌面改动、永久 Prefs 关闭（会话内即可）。

## 实现要点

- `IosBackgroundTransferTipBinder`：监听 lifecycle + `activeTransferProvider`
- `TransferDetailPage`：iOS 时插入横幅
- `HelpPage`：`platformLabel == 'ios'` 时 FAQ
- l10n 中英

## 验证

`flutter gen-l10n` + `flutter analyze`；真机：传文件中切后台再回前台应见对话框。
