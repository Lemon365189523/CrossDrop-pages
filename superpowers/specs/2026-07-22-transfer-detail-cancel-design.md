# 传输详情页 + 取消/断网路径 设计

> 日期：2026-07-22  
> 任务：M3-UI-02、M3-TCP-04、M3-TCP-05  
> 状态：已批准（对话确认）  
> 对齐：PRD-03 / PRD-04 §12（功能级）/ TDD-01 / TDD-02 §11.1

---

## 1. 目标

在现有单文件 TCP 传输之上，补齐：

1. **传输详情页**（进度、速度、ETA、取消二次确认）
2. **协议级取消**（双边 `transfer.cancel`）
3. **断网/IO 错误映射**（明确 `failed` + errorCode，不误标成功）

UI 本轮只做**功能闭环**，不追求 PRD-04 像素级打磨（留给 M5）。

---

## 2. 非目标（本轮不做）

- Drift 替换历史（M1-DB-01，deferred）
- 等待确认独立页、持续传输条完整交互（M5）
- 暂停/断点续传、多文件
- Verifying 阶段接受取消（协议要求忽略迟到 cancel）

---

## 3. 架构

采用**引擎内嵌会话句柄**（方案 1）：

- `TcpTransferEngine` 持有当前活动 `CdlpSocketSession`（及取消标志）
- `cancelActive` 在会话存活时发送 `transfer.cancel`，再关闭连接并落地 `cancelled`
- UI 只消费 `activeTransferProvider` / `TransferEngine.cancelActive`
- 不新增 CancelCoordinator 中间层

```text
HomeBanner / 自动导航
        │
        ▼
TransferDetailPage ──cancel──► TransferEngine.cancelActive
        │                              │
        │                              ▼
        │                     send transfer.cancel + close socket
        │                              │
        └──── watchActiveTask ◄────────┘
                       │
                       ▼（终态）
            TransferResultNavigator → /transfer/result
```

---

## 4. 引擎行为（M3-TCP-04 / M3-TCP-05）

### 4.1 会话持有

- 发送 / 接收路径在握手成功后将当前 session 赋给 `_activeSession`
- 路径结束（成功、失败、取消）时清空 `_activeSession`
- 可选 `_cancelRequested`：本地已发起取消，避免重复发帧或竞态覆盖

### 4.2 本地取消 `cancelActive`

前置：存在活动任务且 `status.occupiesSlot`，且状态**不是** `verifying` / 终态。

步骤：

1. 置 `_cancelRequested = true`
2. 若 `_activeSession != null`，尽力发送：

```json
{
  "v": 1,
  "type": "transfer.cancel",
  "taskId": "<uuid>",
  "ts": <ms>,
  "payload": { "by": "sender"|"receiver", "reason": "user_cancelled" }
}
```

3. 关闭 session / socket
4. 发布任务：`status=cancelled`，`errorCode=transferCancelledLocal`（或现有等价枚举）
5. `_clearActiveSoon()`（与现有一致）

`by` 字段按当前任务 `direction` 映射：send→`sender`，receive→`receiver`。

### 4.3 对端取消

- **接收侧**：DATA 循环已识别 `TransferCancelMessage` → `transferCancelledRemote`（保持并统一终态为 `cancelled`）
- **发送侧**：发送循环 / 读控制路径同样识别 cancel，落地 `cancelled` + remote 错误码
- Verifying 开始后忽略迟到 cancel（以 complete/ack 为准）

### 4.4 断网 / IO

| 现象 | 终态 | errorCode（建议） |
|------|------|-------------------|
| `SocketException` / 连接重置 | `failed` | `networkError`（与 `ErrorCode` 现有命名对齐） |
| 写盘失败 | `failed` | 现有 `ioError` / `diskFull` |
| 超时 | `timeout` | 现有超时码 |

禁止：部分写入后仍标 `finished`。

### 4.5 速度与 ETA

在 `bytesTransferred` 更新处用时间戳滑动窗口计算：

- `speedBytesPerSec`：近 N 秒（如 1～2s）平均吞吐
- `eta`：`(file.size - bytesTransferred) / speed`；速度为 0 时 `eta=null`

写入 `TransferTask.copyWith`，供 UI 直接展示。不在 UI 层重复估算。

---

## 5. UI（M3-UI-02）

### 5.1 路由

- 新增 `/transfer/active` → `TransferDetailPage`（`parentNavigatorKey: rootNavigatorKey`，覆盖 Shell）
- 现有 `/transfer/result` 不变

### 5.2 页面内容（功能级）

- 方向：发送中 / 接收中 / 等待中 / 连接中 / 校验中 等状态文案（l10n）
- 文件名、大小、对端设备名
- 进度条（真实 `task.progress`）
- 速度、ETA（有值才显示）
- 「取消传输」→ 二次确认对话框 → `cancelActive(reason: …)`
- Verifying：取消按钮禁用或隐藏

### 5.3 导航

- 首页活动 banner 点击 → `push('/transfer/active')`
- 任务进入非终态活动态时，可用轻量 navigator（类似 `TransferResultNavigator`）自动进入详情页；避免与接收确认弹窗抢焦点（接受后再跳，或仅发送侧自动跳）
- 系统返回 / AppBar 返回：**不取消**任务，回到首页；banner 仍可见
- 终态：现有 `TransferResultNavigator` 跳转结果页；若当前在详情页，同样跳转

### 5.4 文案

- 新增必要 arb 键（中/英）；避免详情页硬编码中文（接收弹窗历史硬编码本轮可不改）

---

## 6. 文件与职责

| 路径 | 职责 |
|------|------|
| `lib/infrastructure/transfer/tcp_transfer_engine.dart` | 会话句柄、cancel 帧、断网映射、速度/ETA |
| `lib/features/transfer/transfer_detail_page.dart` | 详情 UI |
| `lib/features/transfer/transfer_active_navigator.dart`（可选） | 活动任务自动进详情 |
| `lib/app/router.dart` | 注册 `/transfer/active` |
| `lib/features/home/home_page.dart` | banner 可点击 |
| `lib/l10n/app_*.arb` | 详情/取消相关文案 |
| `DEV/开发任务进度看板.md` | 任务状态与完成记录 |

协议包若已有 `TransferCancelMessage`，不改 schema；仅引擎发帧。

---

## 7. 测试与验证

1. 单元：若便于抽取，可为速度/ETA 纯函数写小测；状态机取消路径已有则复用
2. `flutter analyze`
3. `flutter test`（相关包 + 根目录）
4. 手工（macOS 双实例优先）：
   - 传输中一方取消 → 双方 `cancelled` → 结果页
   - 传输中断网（关 Wi-Fi / 杀对端进程）→ `failed` + 错误信息
   - 详情页返回首页 → 任务继续；再点 banner 回详情

---

## 8. 成功标准

- [ ] 详情页可展示进度、速度、ETA（有数据时）
- [ ] 取消二次确认后双边协议取消生效
- [ ] 断网不误标成功
- [ ] Verifying 不可取消
- [ ] analyze / test 通过
- [ ] 看板 M3-UI-02、M3-TCP-04、M3-TCP-05 更新为 done（或分批）

---

## 9. 风险

| 风险 | 缓解 |
|------|------|
| cancel 与 DATA 同连接竞态 | 先置标志；发 cancel 后立即 close；对端读到半包按现有 session 忽略策略 |
| 自动跳转与接收 Dialog 冲突 | 接收侧在 accept 之后再进详情；或仅 banner 手动进入 |
| 速度抖动 | 短滑动窗口；ETA 为估算，不伪造进度 |
