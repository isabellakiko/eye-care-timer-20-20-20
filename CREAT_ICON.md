# 🎨 创建 PWA 图标

如果您想要完整的PWA体验，需要创建 `icons/` 目录并添加不同尺寸的图标。

## 📁 icons目录结构

```
icons/
├── icon-72x72.png      # Android Chrome
├── icon-96x96.png      # Android Chrome
├── icon-128x128.png    # Chrome Web Store
├── icon-144x144.png    # Windows磁贴
├── icon-152x152.png    # iPad主屏幕
├── icon-192x192.png    # Android主屏幕
├── icon-384x384.png    # Android启动画面
└── icon-512x512.png    # PWA安装图标
```

## 🛠️ 生成图标的方法

### 方法1：在线工具（推荐）
1. 访问 [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html/)
2. 上传您的 `icon.svg` 文件
3. 下载生成的所有尺寸图标
4. 将图标文件放入 `icons/` 目录

### 方法2：使用已有的icon.svg
如果暂时不想生成图标，可以：

1. 创建 `icons/` 目录
2. 将 `icon.svg` 复制到 `icons/` 目录
3. 重命名为对应尺寸（虽然是SVG，但能工作）

### 方法3：简化版本
如果觉得太复杂，可以只创建两个主要尺寸：
```
icons/
├── icon-192x192.png    # 主要图标
└── icon-512x512.png    # 高分辨率图标
```

## 📝 更新manifest.json

如果创建了icons目录，确保 `manifest.json` 中的路径正确：

```json
"icons": [
  {
    "src": "icons/icon-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "icons/icon-512x512.png",
    "sizes": "512x512",
    "type": "image/png"
  }
]
```

## 🚀 快速开始建议

**新手推荐：**
1. 先用最简版本发布
2. 基本功能验证无误后
3. 再逐步添加图标和截图

这样可以快速上线，避免在细节上花费太多时间！