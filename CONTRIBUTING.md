# 🤝 贡献指南

感谢您对Eye Care Timer 20-20-20项目的关注！我们欢迎所有形式的贡献，无论是报告bug、提出功能建议、改进文档还是提交代码。

## 📋 贡献方式

### 🐛 报告Bug
发现问题？请帮助我们改进！

1. 检查 [Issues页面](https://github.com/your-username/eye-care-timer-20-20-20/issues) 确保问题尚未被报告
2. 如果是新问题，请 [创建新Issue](https://github.com/your-username/eye-care-timer-20-20-20/issues/new)
3. 使用清晰的标题描述问题
4. 提供详细的重现步骤
5. 包含您的环境信息（浏览器版本、操作系统等）

#### Bug报告模板
```markdown
**问题描述**
简洁地描述遇到的问题

**重现步骤**
1. 打开应用
2. 点击 '...'
3. 观察到错误

**预期行为**
描述您期望发生的情况

**实际行为**
描述实际发生的情况

**环境信息**
- 浏览器: [例如 Chrome 120.0]
- 操作系统: [例如 Windows 11]
- 设备: [例如 桌面端/移动端]

**截图**
如果适用，添加截图帮助解释问题
```

### 💡 功能建议
有好想法？我们很乐意听到！

1. 检查是否已有类似建议
2. 创建Feature Request Issue
3. 详细描述建议的功能
4. 解释为什么这个功能有用
5. 如果可能，提供设计草图或示例

#### 功能建议模板
```markdown
**功能概述**
简洁地描述建议的功能

**问题/需求**
这个功能解决了什么问题？

**解决方案**
详细描述您希望实现的功能

**替代方案**
是否考虑过其他解决方案？

**附加信息**
任何其他相关信息、截图、设计草图等
```

### 📝 改进文档
文档同样重要！

- 修正拼写错误或语法问题
- 改进使用说明的清晰度
- 添加更多使用示例
- 翻译文档到其他语言

### 💻 代码贡献

#### 开发环境设置

1. **Fork项目**
   ```bash
   # 在GitHub上点击Fork按钮
   ```

2. **克隆您的fork**
   ```bash
   git clone https://github.com/your-username/eye-care-timer-20-20-20.git
   cd eye-care-timer-20-20-20
   ```

3. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-description
   ```

4. **启动开发服务器**
   ```bash
   # 使用npx serve (推荐)
   npx serve .
   
   # 或使用Python
   python -m http.server 8000
   
   # 或使用PHP
   php -S localhost:8000
   ```

5. **在浏览器中打开**
   ```
   http://localhost:8000
   ```

#### 代码规范

##### HTML
- 使用语义化HTML5标签
- 保持适当的缩进（2个空格）
- 添加有意义的alt属性和aria标签
- 确保可访问性

##### CSS
- 使用CSS自定义属性（CSS变量）
- 遵循BEM命名规范或类似的约定
- 移动端优先的响应式设计
- 避免使用!important

##### JavaScript
- 使用ES6+语法
- 添加详细的注释
- 使用有意义的变量和函数名
- 遵循错误处理最佳实践
- 使用console.log进行调试，提交前移除

#### 提交规范

使用约定式提交格式：

```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

**类型：**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档变更
- `style`: 代码格式调整（不影响逻辑）
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具变动

**示例：**
```bash
git commit -m "feat: add dark theme toggle functionality"
git commit -m "fix: resolve audio context suspension in Chrome"
git commit -m "docs: improve installation instructions"
```

#### Pull Request流程

1. **确保代码质量**
    - 测试所有功能正常工作
    - 检查响应式布局
    - 验证所有浏览器兼容性
    - 运行代码检查

2. **推送更改**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   git push origin feature/your-feature-name
   ```

3. **创建Pull Request**
    - 在GitHub上点击"Compare & pull request"
    - 填写清晰的标题和描述
    - 链接相关的Issues
    - 添加截图（如果有UI变更）

4. **PR描述模板**
   ```markdown
   ## 变更概述
   简洁描述这次PR的主要变更

   ## 变更类型
   - [ ] Bug修复
   - [ ] 新功能
   - [ ] 重大变更
   - [ ] 文档更新

   ## 测试清单
   - [ ] 功能在Chrome中正常工作
   - [ ] 功能在Firefox中正常工作
   - [ ] 功能在Safari中正常工作
   - [ ] 响应式布局正常
   - [ ] 无控制台错误
   - [ ] PWA功能正常

   ## 截图
   如果有UI变更，请提供前后对比截图

   ## 相关Issues
   修复 #issue-number
   ```

5. **代码审查**
    - 响应reviewers的反馈
    - 根据建议进行修改
    - 保持讨论的建设性

## 🎯 优先贡献领域

我们特别欢迎以下方面的贡献：

### 🌐 国际化
- 添加多语言支持
- 翻译界面文本
- 本地化时间和数字格式

### ♿ 可访问性
- 改进键盘导航
- 增强屏幕阅读器支持
- 提高颜色对比度
- 添加更多ARIA属性

### 📱 移动端优化
- 改进触摸交互
- 优化移动端布局
- 添加手势支持

### 🔊 音频功能
- 更多音效选项
- 音量控制
- 音频可视化

### 📊 数据功能
- 导出统计数据
- 更详细的分析
- 目标设置和追踪

### 🎨 主题和自定义
- 更多主题选项
- 自定义颜色方案
- 动画效果设置

## 📖 代码库结构

```
/
├── index.html          # 主HTML文件
├── timer.css           # 样式文件
├── timer.js            # 主JavaScript逻辑
├── manifest.json       # PWA配置
├── icon.svg            # 主图标
├── README.md           # 项目说明
├── CONTRIBUTING.md     # 本文件
├── LICENSE             # MIT许可证
└── docs/               # 文档目录
    ├── DEPLOY.md       # 部署指南
    └── API.md          # API文档（如果有）
```

## 🔍 代码审查标准

### 功能性
- ✅ 功能按预期工作
- ✅ 没有引入新的bug
- ✅ 兼容所有支持的浏览器

### 代码质量
- ✅ 代码清晰易读
- ✅ 适当的注释
- ✅ 遵循项目约定
- ✅ 没有冗余代码

### 用户体验
- ✅ 界面直观易用
- ✅ 响应迅速
- ✅ 错误处理得当
- ✅ 移动端友好

### 性能
- ✅ 不影响页面加载速度
- ✅ 内存使用合理
- ✅ 动画流畅

## 🏆 贡献者认可

我们重视每一个贡献！贡献者将会：

- 在README中被列入贡献者名单
- 获得项目的贡献者徽章
- 在发布说明中被感谢
- 被邀请参与项目决策讨论

## 📞 联系方式

有任何问题？可以通过以下方式联系：

- 创建GitHub Issue
- 在Discussions中提问
- 发送邮件到：your.email@example.com

## 🎉 感谢

感谢您考虑为Eye Care Timer 20-20-20项目做贡献！每一个贡献，无论大小，都对项目的发展很重要。

让我们一起创建更好的护眼工具，帮助更多人保护视力健康！ 👀✨