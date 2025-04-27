/**
 * @typedef {Object} PluginOptions
 * @property {Boolean} [folderBasedSidebar=true] 是否启用基于文件夹的侧边栏生成功能
 * @property {Function} [transformLabel] 自定义文件夹名转换为标签的函数
 */

/**
 * Docusaurus插件：自动生成基于文件夹结构的侧边栏
 * 
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {PluginOptions} options
 * @returns {import('@docusaurus/types').Plugin}
 */
function autoSidebarPlugin(context, options = {}) {
  const {
    folderBasedSidebar = true,
    transformLabel = (folderName) => folderName,
  } = options;

  return {
    name: 'docusaurus-plugin-auto-sidebar',
    extendCli(cli) {
      // 可以在未来扩展CLI命令
    },
    configureWebpack(config, isServer, utils) {
      // 可能的webpack配置
      return {};
    },

    // 扩展或修改docusaurus配置
    extendPluginConfig(pluginConfig, pluginId) {
      // 只处理docs插件
      if (pluginId !== 'docusaurus-plugin-content-docs' && !pluginId.endsWith('plugin-content-docs')) {
        return pluginConfig;
      }

      if (!folderBasedSidebar) {
        return pluginConfig;
      }

      // 注入sidebarItemsGenerator
      return {
        ...pluginConfig,
        sidebarItemsGenerator: async (args) => {
          // 先获取默认的侧边栏项
          const defaultGenerator = pluginConfig.sidebarItemsGenerator || args.defaultSidebarItemsGenerator;
          const sidebarItems = await defaultGenerator(args);

          // 变换侧边栏项
          return processItems(sidebarItems);
        },
      };
    },
  };

  /**
   * 处理并转换侧边栏项
   * @param {Array} items 侧边栏项
   * @returns {Array} 处理后的侧边栏项
   */
  function processItems(items) {
    if (!items || !Array.isArray(items)) {
      return items;
    }

    return items.map(item => {
      // 如果是分类，设置分类名称为文件夹名并递归处理子项
      if (item.type === 'category') {
        // 应用标签转换函数
        if (item.label) {
          item.label = transformLabel(item.label);
        }
        
        // 递归处理子项
        if (item.items && Array.isArray(item.items)) {
          item.items = processItems(item.items);
        }
      }
      
      return item;
    });
  }
}

module.exports = autoSidebarPlugin; 