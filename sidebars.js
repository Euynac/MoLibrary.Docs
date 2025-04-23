/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: '入门',
      collapsed: false,
      items: ['intro/getting-started'],
    },
    {
      type: 'category',
      label: '核心功能',
      collapsed: false,
      items: [
        'core/modules',
        'core/rpc-invocation',
      ],
    },
    {
      type: 'category',
      label: 'Domain Driven Design',
      items: ['ddd/introduction'],
    },
    {
      type: 'category',
      label: '自动模型',
      items: ['automodel/overview'],
    },
    {
      type: 'category',
      label: '依赖注入',
      items: ['dependency-injection/overview'],
    },
    {
      type: 'category',
      label: '数据通道',
      items: ['data-channel/overview'],
    },
    {
      type: 'category',
      label: '后台任务',
      items: ['background-job/overview'],
    },
    {
      type: 'category',
      label: '仓储模式',
      items: ['repository/overview'],
    },
    {
      type: 'category',
      label: 'SignalR',
      items: ['signalr/overview'],
    },
    {
      type: 'category',
      label: '配置',
      items: ['configuration/overview'],
    },
    {
      type: 'category',
      label: '工具',
      items: ['tool/overview'],
    },
  ],
};

module.exports = sidebars; 