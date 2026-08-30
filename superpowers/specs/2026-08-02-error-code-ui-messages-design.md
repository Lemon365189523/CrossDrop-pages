# M6-ERR-01 错误码 → UI 文案表 设计

> 日期：2026-08-02  
> 任务：M6-ERR-01  
> 状态：已实现（2026-08-02）  
> 对齐：PRD-03 §11.2、PRD-05 §14.2、TDD-01 §6.3

---

## 1. 目标

1. 面向用户的失败 / 取消说明统一由 **`ErrorCode` → l10n** 生成。
2. **禁止**展示内部 `errorMessage`、异常 `toString()`、线协议错误码字符串。
3. 未知 `errorCode` 名或未分类异常 → 泛化文案 `errorGeneric`。

---

## 2. 非目标

- 不修改 CDLP 线协议错误码或引擎写入的 `errorCode` 字段语义（仍为 `ErrorCode.name`）。
- 不根据 `retryable` 做结果页「重试」主按钮策略（可后续任务）。
- 不在 `crossdrop_core` / domain 内嵌 UI 文案。

---

## 3. API

新增 app 层（建议路径 `lib/l10n/error_messages.dart`）：

```dart
abstract final class ErrorMessages {
  /// 已知枚举 → 本地化文案。
  static String forCode(AppLocalizations l10n, ErrorCode code);

  /// 任务 / 历史里存的 `ErrorCode.name`；null / 未知 → errorGeneric。
  static String forCodeName(AppLocalizations l10n, String? codeName);

  /// `AppError` 取其 code；其它 Object → errorGeneric（永不拼接 $e）。
  static String forAppError(AppLocalizations l10n, Object error);
}
```

---

## 4. 文案表

| ErrorCode | arb key（建议） | zh 示意 |
|-----------|-----------------|---------|
| netUnavailable | errorNetUnavailable | 网络不可用，请检查连接后重试 |
| permLocalNetwork | errorPermLocalNetwork | 需要本地网络权限才能发现设备并传输 |
| deviceOffline | errorDeviceOffline | 设备已离线 |
| deviceBusy | errorDeviceBusy | 对方正在忙碌，请稍后重试 |
| fileTooLarge | errorFileTooLarge | 单个文件最大支持 10 GB |
| fileUnreadable | errorFileUnreadable | 无法读取该文件 |
| fileNotFound | errorFileNotFound | 找不到该文件 |
| requestRejected | errorRequestRejected | 对方已拒绝 |
| requestTimeout | errorRequestTimeout | 对方未在限定时间内响应 |
| connectFailed | errorConnectFailed | 无法连接对方，请确认在同一局域网 |
| connectTimeout | errorConnectTimeout | 连接超时，请重试 |
| transferCancelledLocal | errorTransferCancelledLocal | 已取消传输 |
| transferCancelledRemote | errorTransferCancelledRemote | 对方已取消传输 |
| networkInterrupted | errorNetworkInterrupted | 网络连接已中断 |
| processInterrupted | errorProcessInterrupted | 应用中断，传输未完成 |
| diskFull | errorDiskFull | 存储空间不足 |
| savePathInvalid | errorSavePathInvalid | 保存位置不可用，请在设置中更换 |
| protocolVersion | errorProtocolVersion | 协议版本不兼容，请升级双方应用 |
| protocolInvalid | errorProtocolInvalid | 传输协议异常 |
| hashMismatch | errorHashMismatch | 文件校验失败，请重新发送 |
| unsupportedPlatform | errorUnsupportedPlatform | 当前平台暂不支持 |
| cancelled | errorCancelled | 已取消 |
| internal | errorGeneric | 出了点问题，请重试 |
| （未知 / null） | errorGeneric | 出了点问题，请重试 |

已有接近文案的 key（如 `fileTooLarge`）可复用或与 `errorFileTooLarge` 对齐，避免两套矛盾句。

---

## 5. 改动面

| 位置 | 行为 |
|------|------|
| `transfer_result_page.dart` | 失败/取消副文案用 `forCodeName(task.errorCode)`；移除直接显示 `errorMessage` |
| 历史 UI（列表副文案 / 若有详情） | 失败项展示映射文案，不展示 raw message |
| `home_page.dart` SnackBar | 离线 / 忙碌 / 发送失败 / 选文件异常 → `ErrorMessages` 或对应 l10n；禁止 `发送失败：$e` |
| 本地网络权限横幅 | 已有专用文案可保留；若走 `ErrorCode.permLocalNetwork` 则统一入口 |
| 单测 | `ErrorMessages.forCode` 覆盖全部枚举；`forCodeName(null)` / 未知名 → generic |

---

## 6. 验收

1. 拒绝 / 本地取消 / 断网失败：结果页为当前 locale 用户句，无英文 exception。
2. 首页发送路径异常：SnackBar 为泛化或映射文案，无 `$e`。
3. `flutter gen-l10n`、`flutter analyze`、相关 `flutter test` 通过。

---

## 7. 决策记录

- 范围：**C**（所有展示 ErrorCode / errorMessage / 发送失败 SnackBar 的入口）
- 未知码策略：**A**（仅泛化文案）
- 实现结构：方案 **1**（app 层 `ErrorMessages` + arb）
