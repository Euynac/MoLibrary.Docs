// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
// 引入自定义侧边栏生成器
const createSidebarItemsGenerator = require('./plugins/docusaurus-sidebar-generator');

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MoLibrary',
  tagline: '模块化的 .NET 基础设施库',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://euynac.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // baseUrl: '/MoLibrary.Docs/',
  baseUrl: '/', //For custom domain
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Euynac', // Usually your GitHub org/user name.
  projectName: 'MoLibrary.Docs', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  // 不再需要插件配置，因为我们直接在docs配置中使用自定义生成器
  plugins: [],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Euynac/MoLibrary/tree/main/docs/',
          // 设置文档路由基础路径
          routeBasePath: '/docs',
          // 使用自定义的侧边栏生成器
          sidebarItemsGenerator: createSidebarItemsGenerator({
            // 使用文件名作为文档标签
            useFileNameAsLabel: true,
            // 使用文件夹名作为分类标签
            useFolderNameAsCategory: true,
            // 将驼峰式命名转换为空格分隔的标题
            transformLabel: (name) => {
              return name
                // .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
                // .replace(/^./, (str) => str.toUpperCase()) // 首字母大写
                .trim();
            },
          }),
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Euynac/MoLibrary/tree/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/molibrary-social-card.jpg',
      // // 添加 Algolia DocSearch 配置
      // algolia: {
      //   // Algolia Application ID
      //   appId: 'YOUR_APP_ID',
      //   // 公开的搜索API密钥
      //   apiKey: 'YOUR_SEARCH_API_KEY',
      //   // 索引名称
      //   indexName: 'molibrary',
      //   // 可选配置
      //   contextualSearch: true,
      //   // 可选：配置搜索页面路径，默认为false
      //   searchPagePath: 'search',
      // },
      navbar: {
        title: 'MoLibrary',
        logo: {
          alt: 'MoLibrary Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {
            href: 'https://github.com/Euynac/MoLibrary',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '快速开始',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/Euynac/MoLibrary/discussions',
              },
              {
                label: 'Issues',
                href: 'https://github.com/Euynac/MoLibrary/issues',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Euynac/MoLibrary',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MoLibrary. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp', 'bash', 'json'],
      },
    }),
};

export default config;
