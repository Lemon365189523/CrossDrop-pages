# Web UI 预览成品设计

> 日期：2026-08-13  
> 状态：已批准  
> 任务：M1-WEB-02

## 目标

浏览器中 CrossDrop 作为**界面预览**可完整体验导航；明确不能局域网传文件；不引入服务器 / WebRTC。

## 范围

**做**
1. `web/index.html` + `manifest.json` 品牌化（CrossDrop、描述、主题色 `#E8EEF5` / `#5B8DEF`）
2. Web 图标使用 `assets/branding` 衍生尺寸
3. 首页保留「Web 仅预览」说明；不出现无效扫描/权限引导（已由 `supportsLanTransport` 短路）
4. 设置：无 `FileAccessService` 时保存位置展示为不可用说明
5. 引导第三页用 Web 预览文案；主按钮为「开始」
6. 帮助：Web 平台增加专题 FAQ
7. 验收：`flutter build web`

**不做**
- 真实发现 / 传文件 / App 网关 / 假设备列表

## 成功标准

- `flutter build web` 成功  
- Web 打开后标题为 CrossDrop；首页可见预览说明  
- 设置改保存路径有明确不可用反馈  
- 帮助含 Web 说明  
