# MoLibrary 文档站点

该仓库包含 MoLibrary 的文档网站，使用 [Docusaurus 2](https://docusaurus.io/) 构建。

MoLibrary 是一个模块化的 .NET 基础设施库，旨在提供可独立使用的组件，帮助您快速构建高质量的应用程序。

## 本地开发

```bash
# 安装依赖
$ yarn install

# 启动本地开发服务器
$ yarn start
```

此命令启动本地开发服务器并打开浏览器窗口。大多数更改都会实时反映，无需重新启动服务器。

## 构建

```bash
# 生成静态内容到 `build` 目录
$ yarn build
```

## 部署

本站点使用 GitHub Actions 自动部署到 GitHub Pages。
当代码推送到 `main` 分支时，会自动触发构建和部署流程。

如需手动部署，可以运行：

```bash
# 使用 GitHub Actions 手动触发部署
$ yarn deploy
```

## 项目结构

- `/docs/`: 文档文件
- `/blog/`: 博客文章
- `/src/`: 自定义代码 
- `/static/`: 静态资源

## 贡献

欢迎提交 Pull Request 或 Issue 来帮助我们改进文档。

## 更多信息

有关 Docusaurus 的更多信息，请查看 [官方文档](https://docusaurus.io/)。
