// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

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
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Euynac', // Usually your GitHub org/user name.
  projectName: 'MoLibrary', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'main',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

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
          // 设置不使用文档内的标题作为侧边栏显示的标题，而使用文件名
          routeBasePath: '/docs',
          // 使用文件名作为侧边栏标题，而不是文档内容中的第一个标题
          sidebarItemsGenerator: async ({
            defaultSidebarItemsGenerator,
            numberPrefixParser,
            item,
            version,
            docs,
            categoriesMetadata,
            isCategoryIndex,
          }) => {
            // 获取默认的侧边栏项
            const sidebarItems = await defaultSidebarItemsGenerator({
              numberPrefixParser,
              item,
              version,
              docs,
              categoriesMetadata,
              isCategoryIndex,
            });
            
            // 遍历所有项并调整标签
            function processItems(items) {
              return items.map(sidebarItem => {
                // 如果是doc类型，就使用文件名作为标签
                if (sidebarItem.type === 'doc') {
                  const docPath = sidebarItem.id;
                  // 如果是index文件，使用其父文件夹名作为标签
                  if (docPath.endsWith('/index')) {
                    const folderName = docPath.split('/').slice(-2, -1)[0];
                    sidebarItem.label = folderName;
                  } else {
                    // 否则使用文件名(不含扩展名)作为标签
                    const fileName = docPath.split('/').pop();
                    sidebarItem.label = fileName;
                  }
                }
                // 如果是分类，递归处理其子项
                if (sidebarItem.type === 'category' && sidebarItem.items) {
                  sidebarItem.items = processItems(sidebarItem.items);
                }
                return sidebarItem;
              });
            }
            
            return processItems(sidebarItems);
          },
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
              {
                label: '模块',
                to: '/docs/module',
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
