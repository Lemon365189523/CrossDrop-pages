# M4-MAC-02 打开文件 / 在文件夹中显示 设计

> 日期：2026-08-02  
> 任务：M4-MAC-02（范围 C）  
> 状态：已实现（2026-08-02）  
> 对齐：PRD-03 §接收成功操作、PRD-04 结果页/历史桌面入口

---

## 1. 目标

1. 实现 `FileAccessService.openFile` / `showInFolder`（桌面可用）。
2. 接收成功结果页、历史成功项：提供「打开文件」；桌面另提供「在文件夹中显示」。
3. 本地文件不存在时禁用/提示，不调用系统命令。

---

## 2. 非目标

- iOS/Android 精细分享面板 / SAF。
- 发送侧结果页（无 `savedPath`）不提供上述按钮。

---

## 3. 实现

### 3.1 IoFileAccessService（`Process`，无新依赖）

| 平台 | openFile | showInFolder |
|------|----------|--------------|
| macOS | `open` path | `open -R` path |
| Windows | `cmd /c start "" path` | `explorer /select,path` |
| 其它 | 尽力 `open` 或抛可识别失败 | no-op / 失败提示 |

预先 `File(path).exists()`；不存在则抛 `AppError(fileNotFound)` 或返回，由 UI 映射文案。

### 3.2 UI

- 结果页：`savedPath != null` 且接收成功 → 按钮组。
- 「在文件夹中显示」仅 `Platform.isMacOS \|\| Platform.isWindows`。
- 历史：成功且有 `savedPath` → trailing 菜单或两个 IconButton。
- l10n：`openFile` / `showInFolder` / 复用 `errorFileNotFound`。

### 3.3 验收

- macOS 接收成功 → Finder 选中文件；打开文件用默认 App。
- 删除文件后再点 → 用户可读「找不到该文件」。
- analyze + 相关单测（存在性分支可测；Process 可 mock 或跳过集成）。
