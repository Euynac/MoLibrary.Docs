# MoLibrary 文档

这是 MoLibrary 的官方文档网站，使用 [Docusaurus](https://docusaurus.io/) 构建。

MoLibrary 是一个模块化的 .NET 基础设施库，旨在提供可独立使用的组件，帮助您快速构建高质量的应用程序。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

启动开发服务器后，浏览器会自动打开 http://localhost:3000/ 预览文档网站。

## 构建

```bash
npm run build
```

该命令会在 `build` 目录生成静态内容，可以使用任何静态托管服务进行部署。

## 部署到 GitHub Pages

```bash
# 使用 SSH
USE_SSH=true npm run deploy

# 不使用 SSH
GIT_USER=<您的 GitHub 用户名> npm run deploy
```

## 项目结构

- `/docs/`: 文档文件
- `/blog/`: 博客文章
- `/src/`: 自定义代码 
- `/static/`: 静态资源

## 贡献

欢迎提交 Pull Request 或 Issue 来帮助我们改进文档。
