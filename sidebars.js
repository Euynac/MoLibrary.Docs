// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Intro',
    },
    {
      type: 'doc',
      id: 'module',
      label: 'Module',
    },
    {
      type: 'doc',
      id: 'rpc-invocation',
      label: 'RPC-Invocation',
    },
    {
      type: 'category',
      label: '模块',
      items: [
        {
          type: 'doc',
          id: 'Authority/index',
          label: 'Authority',
        },
        {
          type: 'doc',
          id: 'BackgroundJob/index',
          label: 'BackgroundJob',
        },
        {
          type: 'doc',
          id: 'SignalR/index',
          label: 'SignalR',
        },
        {
          type: 'doc',
          id: 'Repository/index',
          label: 'Repository',
        },
        {
          type: 'doc',
          id: 'DomainDrivenDesign/index',
          label: 'DomainDrivenDesign',
        },
        {
          type: 'doc',
          id: 'AutoModel/index',
          label: 'AutoModel',
        },
        {
          type: 'doc',
          id: 'DependencyInjection/index',
          label: 'DependencyInjection',
        },
        {
          type: 'doc',
          id: 'DataChannel/index',
          label: 'DataChannel',
        },
        {
          type: 'doc',
          id: 'Tool/index',
          label: 'Tool',
        },
        {
          type: 'doc',
          id: 'Configuration/index',
          label: 'Configuration',
        },
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
