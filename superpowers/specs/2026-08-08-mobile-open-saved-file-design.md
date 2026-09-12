# 移动端打开已接收文件

日期：2026-08-08  
状态：已实现  
用户批准：按建议做（结果页/历史「打开文件」；移动端不做「在文件夹中显示」）

## 目标

iOS / Android 接收成功后可一键用系统应用打开文件。

## 范围

- `open_file`：移动端 `FileAccessService.openFile`（已替换无 SPM 的 open_filex）
- `supportsOpenSavedFile` 含 ios/android；结果页与历史自动出现「打开文件」
- 「在文件夹中显示」仍仅桌面

## 非目标

SAF/Downloads 迁移（M4-AND-02）、分享面板、相册写入。

## 验证

`flutter pub get`；`flutter analyze`；真机接收后点「打开文件」。
