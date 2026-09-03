# M4-AND-02 Android 默认写入公共 Downloads

日期：2026-08-10  
状态：已实现  
用户批准：方案 1（MediaStore + 缓存 .part）

## 目标

Android 默认接收文件出现在系统「下载」；自定义 savePath 仍写所选目录。

## 范围

1. 默认：`.part` 写缓存 → 校验后 MediaStore 发布到 Downloads → 删除临时文件  
2. `getDefaultDownloadPath` 展示公共 Downloads 路径  
3. 原生 MethodChannel，不引入无 SPM 的 Apple 插件  

## 非目标

SAF 持久授权树（范围 B）；全链路 content:// 流式写。

## 验证

`flutter analyze`；真机接收后系统「下载」/文件管理器可见，结果页可打开。
