# 📦 部署指南

本指南将帮助您将Eye Care Timer 20-20-20部署到GitHub Pages，让全世界的用户都能使用您的护眼定时器。

## 🚀 快速部署到GitHub Pages

### 步骤1：创建GitHub仓库

1. 登录到 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
    - **Repository name**: `eye-care-timer-20-20-20` (推荐)
    - **Description**: `优雅的20-20-20护眼定时器，帮助保护视力健康`
    - **Visibility**: Public (公开，这样任何人都能访问)
    - **Add a README file**: ❌ 不勾选 (我们已经有了)
4. 点击 "Create repository"

### 步骤2：上传文件

#### 方法A：使用GitHub网页界面
1. 在新创建的仓库页面，点击 "uploading an existing file"
2. 将所有项目文件拖拽到上传区域：
   ```
   index.html
   timer.css
   timer.js
   README.md
   LICENSE
   manifest.json
   package.json
   icon.svg
   .gitignore
   ```
3. 在底部填写提交信息：
    - **Commit title**: `Initial commit: Add Eye Care Timer 20-20-20`
    - **Description**: `完整的护眼定时器应用，支持PWA和系统通知`
4. 点击 "Commit changes"

#### 方法B：使用Git命令行
```bash
# 克隆仓库
git clone https://github.com/your-username/eye-care-timer-20-20-20.git
cd eye-care-timer-20-20-20

# 添加所有文件
# (将项目文件复制到这个目录)

# 提交更改
git add .
git commit -m "Initial commit: Add Eye Care Timer 20-20-20"
git push origin main
```

### 步骤3：启用GitHub Pages

1. 在仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
    - 选择 "Deploy from a branch"
    - **Branch**: 选择 `main`
    - **Folder**: 选择 `/ (root)`
4. 点击 "Save"
5. 等待几分钟，GitHub会显示您的网站URL：
   ```
   https://your-username.github.io/eye-care-timer-20-20-20/
   ```

## 🎯 推荐的仓库命名

选择一个好的仓库名很重要，以下是一些建议：

### 最佳选择
- `eye-care-timer-20-20-20` ⭐ **推荐**
- `eyecare-timer`
- `vision-break-timer`

### 备选方案
- `20-20-20-timer`
- `eye-protection-timer`
- `break-reminder-20-20-20`
- `digital-eye-strain-timer`

### 命名规则
- ✅ 使用小写字母
- ✅ 使用连字符 `-` 分隔单词
- ✅ 简洁而描述性
- ✅ 容易记忆和输入
- ❌ 避免下划线 `_`
- ❌ 避免过长的名称

## 📂 文件结构

确保您的项目文件结构如下：

```
eye-care-timer-20-20-20/
├── index.html          # 主页面
├── timer.css           # 样式文件
├── timer.js            # JavaScript逻辑
├── README.md           # 项目说明
├── LICENSE             # 开源许可证
├── manifest.json       # PWA配置
├── package.json        # 项目信息
├── icon.svg            # 项目图标
├── .gitignore          # Git忽略文件
├── DEPLOY.md           # 本部署指南
└── icons/              # PWA图标目录 (可选)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## 🔧 自定义配置

### 更新个人信息
在上传前，请替换以下文件中的占位符：

#### README.md
- `your-username` → 您的GitHub用户名
- `Your Name` → 您的真实姓名

#### package.json
- `"author"` 部分的个人信息
- `"homepage"` 和 `"repository"` URL

#### LICENSE
- `[Your Name]` → 您的姓名

#### HTML meta标签
- 更新 `<meta>` 标签中的URL

### 添加自定义域名 (可选)
如果您有自己的域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为您的域名，例如：
   ```
   eyecare.yourdomain.com
   ```
3. 在您的DNS设置中添加CNAME记录指向 `your-username.github.io`

## 🎨 生成PWA图标

如果您想要完整的PWA体验，需要生成不同尺寸的图标：

### 在线工具推荐
- [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [App Icon Generator](https://www.appicon.co/)
- [Favicon Generator](https://favicon.io/)

### 需要的图标尺寸
- 72×72, 96×96, 128×128, 144×144
- 152×152, 192×192, 384×384, 512×512

## 📊 启用Analytics (可选)

如果您想追踪网站使用情况：

### Google Analytics
在 `index.html` 的 `<head>` 部分添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔍 SEO优化

为了让更多人发现您的项目：

1. **完善README**：详细的功能介绍和使用说明
2. **添加标签**：在仓库设置中添加相关标签
3. **社交分享**：分享到技术社区和社交媒体
4. **提交到目录**：提交到开源项目目录网站

## 🎉 部署完成

恭喜！您的护眼定时器现在已经在线运行了！

### 访问地址
```
https://your-username.github.io/eye-care-timer-20-20-20/
```

### 后续维护
- 定期检查Issues和用户反馈
- 持续改进功能和修复bug
- 保持依赖项的安全更新
- 响应用户的功能请求

---

**🌟 记得在社交媒体上分享您的项目，帮助更多人保护视力健康！**