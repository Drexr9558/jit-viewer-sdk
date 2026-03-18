# JitViewer SDK 🚀
> 🎯 一行代码集成，多格式文档在线预览解决方案

[📖 在线文档](https://jitword.com/jit-viewer.html) • [🚀 在线演示](https://jitword.com/jit-viewer.html#demo) • [📦 GitHub](https://github.com/jitOffice/jit-viewer-sdk) • [💬 问题反馈](https://github.com/jitOffice/jit-viewer-sdk/issues)

---

## ✨ 特性

- 📄 **多格式支持** - PDF、Word (DOCX)、Excel (XLSX)、PPT (PPTX)、Markdown、TXT
- ⚡ **一行代码集成** - 只需引入 2 个文件，即可运行完整预览器
- 🎨 **明暗主题** - 内置浅色/深色主题，支持动态切换
- 📱 **移动端适配** - 完美支持手机、平板等移动设备
- 🔧 **丰富 API** - 缩放、旋转、全屏、下载等完整控制接口
- 🌐 **多种文件源** - 支持 URL、File 对象、Blob、ArrayBuffer
- 🪶 **轻量高效** - 基于 Vue3 构建，性能优异

---

## 🚀 快速开始

### 1. 引入 SDK

```html
<!-- 引入样式 -->
<link rel="stylesheet" href=".cdn/jit-viewer.min.css">

<!-- 引入脚本 -->
<script src=".cdn/jit-viewer.min.js"></script>
```

### 2. 创建容器

```html
<div id="viewer" style="width: 100%; height: 600px;"></div>
```

### 3. 初始化预览器

```javascript
const viewer = JitViewer.createViewer({
  file: 'https://example.com/document.pdf',
  filename: 'document.pdf',
  toolbar: true,
  theme: 'light'
});

viewer.mount('#viewer');
```

✅ **完成！** 现在你可以在页面上预览文档了。

---

## 📖 详细文档

访问 [在线文档](https://jitword.com/jit-viewer.html) 获取：

- 📚 完整的 API 文档
- 💡 丰富的使用示例
- 🎮 可交互的在线演示
- 🔧 自定义配置指南

---

## 🎯 使用示例

### 预览远程文件

```javascript
const viewer = JitViewer.createViewer({
  file: 'https://example.com/report.pdf',
  filename: '年度报告.pdf',
  toolbar: true
});
viewer.mount('#viewer');
```

### 预览本地上传文件

```javascript
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const viewer = JitViewer.createViewer({
    file: file,
    filename: file.name,
    toolbar: true
  });
  
  viewer.mount('#viewer');
});
```

### 带认证头的文件

```javascript
const viewer = JitViewer.createViewer({
  file: {
    url: 'https://api.example.com/document',
    headers: {
      'Authorization': 'Bearer your-token'
    }
  },
  filename: 'protected-doc.pdf'
});

viewer.mount('#viewer');
```

### 程序化控制

```javascript
const viewer = JitViewer.createViewer({
  file: 'document.pdf',
  renderOptions: {
    zoom: 1.5,  // 初始缩放 150%
    rotate: 0   // 初始旋转角度
  }
});

viewer.mount('#viewer');

// 放大
viewer.zoom(2.0);

// 旋转
viewer.rotate(90);

// 切换主题
viewer.setTheme('dark');

// 全屏
viewer.fullscreen(true);

// 下载文件
viewer.download();
```

---

## 📋 支持的文件格式

| 格式 | 扩展名 | MIME Type |
|------|--------|-----------|
| PDF | `.pdf` | `application/pdf` |
| Word | `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Excel | `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| PowerPoint | `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| Markdown | `.md` | `text/markdown` |
| 文本 | `.txt` | `text/plain` |

---

## 🔧 API 概览

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file` | `string \| File \| Blob \| ArrayBuffer` | - | 文件源 |
| `filename` | `string` | - | 文件名 |
| `toolbar` | `boolean \| object` | `true` | 工具栏配置 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题 |
| `width` | `string \| number` | `'100%'` | 宽度 |
| `height` | `string \| number` | `'100%'` | 高度 |
| `onReady` | `function` | - | 准备就绪回调 |
| `onLoad` | `function` | - | 加载完成回调 |
| `onError` | `function` | - | 错误回调 |

### 实例方法

| 方法 | 说明 |
|------|------|
| `mount(target)` | 挂载到指定元素 |
| `zoom(scale)` | 设置缩放比例 (0.1 - 5) |
| `rotate(degree)` | 设置旋转角度 |
| `reset()` | 重置缩放和旋转 |
| `fullscreen(enable)` | 切换全屏模式 |
| `setTheme(theme)` | 切换主题 |
| `download()` | 下载文件 |
| `destroy()` | 销毁实例 |

📚 **查看完整 API 文档** → [https://jitword.com/jit-viewer.html#api](https://jitword.com/jit-viewer.html#api)

---

## 🖥️ 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome | ≥ 80 |
| Firefox | ≥ 75 |
| Safari | ≥ 13 |
| Edge | ≥ 80 |

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！

- 🐛 [提交 Bug](https://github.com/jitOffice/jit-viewer-sdk/issues/new?template=bug_report.md)
- 💡 [功能建议](https://github.com/jitOffice/jit-viewer-sdk/issues/new?template=feature_request.md)
- 🔧 [提交代码](https://github.com/jitOffice/jit-viewer-sdk/pulls)

---

## 🔗 相关链接

- 🌐 [在线文档](https://jitword.com/jit-viewer.html)
- 🎮 [在线演示](https://jitword.com/jit-viewer.html#demo)
- 📦 [GitHub 仓库](https://github.com/jitOffice/jit-viewer-sdk)
- 💬 [问题反馈](https://github.com/jitOffice/jit-viewer-sdk/issues)
- 🏠 [官方网站](https://jitword.com)

---

<p align="center">
  如果这个项目对你有帮助，请给我们一颗 ⭐️ Star！
</p>
