# MoLibrary 文档网站

这个目录包含 MoLibrary 的文档网站，使用 [Docusaurus 2](https://docusaurus.io/) 构建。

## 准备工作

1. 确保已安装 [Node.js](https://nodejs.org/) (版本 >= 16.14)
2. 确保已安装 [npm](https://www.npmjs.com/) (通常随 Node.js 一起安装)

## 本地开发

```bash
# 进入网站目录
cd website

# 安装依赖
npm install

# 启动本地开发服务器
npm start
```

这个命令会启动一个本地开发服务器并打开浏览器窗口。大多数更改都会实时反映，无需重启服务器。

## 构建

```bash
# 进入网站目录
cd website

# 构建静态网站
npm run build
```

这个命令会在 `build` 目录中生成静态内容，可以使用任何静态内容托管服务进行部署。

## 部署

本网站使用 GitHub Actions 自动部署到 GitHub Pages。当您将更改推送到 `main` 分支时，如果更改涉及 `website` 目录，网站将自动构建并部署。

### 手动部署

如果需要手动部署，可以使用以下命令：

```bash
# 使用 GitHub Pages 部署
cd website
GIT_USER=<你的GitHub用户名> npm run deploy
```

如果您使用的是 GitHub 页面进行托管，这个命令很方便，因为它会构建网站并将构建的内容推送到您仓库的 `gh-pages` 分支。

## 添加内容

### 添加新文档

1. 在相应的目录中创建 Markdown 文件，例如 `website/docs/new-feature/overview.md`
2. 使用 frontmatter 设置标题和侧边栏位置:

```md
---
sidebar_position: 1
---

# 新功能概述

这里是新功能的概述内容...
```

3. 在 `sidebars.js` 中添加到侧边栏配置（如果需要）

### 添加新博客文章

在 `website/blog` 目录中创建新的 Markdown 文件，例如 `2023-04-21-new-release.md`：

```md
---
slug: new-release
title: MoLibrary 1.0 发布
authors: [username]
tags: [release, new-features]
---

这里是博客文章内容...
```

## 自定义主题

要自定义网站主题，可以编辑 `src/css/custom.css` 文件中的 CSS 变量。

## 搜索功能

当前配置使用 Algolia DocSearch 作为搜索引擎。要激活搜索功能，需要：

1. 在 [Algolia DocSearch](https://docsearch.algolia.com/apply/) 申请
2. 获得 appId, apiKey 和 indexName
3. 更新 `docusaurus.config.js` 中的相应信息

## 国际化

当前支持中文和英文。要添加新语言翻译：

1. 在 `docusaurus.config.js` 中的 `i18n.locales` 数组中添加新语言代码
2. 运行 `npm run write-translations -- --locale <语言代码>` 生成翻译文件
3. 编辑 `i18n/<语言代码>/` 目录下的翻译文件

## 更多信息

有关详细信息，请查看 [Docusaurus 文档](https://docusaurus.io/docs)。 