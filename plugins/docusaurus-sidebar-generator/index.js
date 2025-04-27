/**
 * @typedef {Object} GeneratorOptions
 * @property {Boolean} [useFileNameAsLabel=true] 是否使用文件名作为文档标签而不是文档内的标题
 * @property {Boolean} [useFolderNameAsCategory=true] 是否使用文件夹名作为分类标签
 * @property {Function} [transformLabel] 自定义文件夹名和文件名转换为标签的函数
 * @property {Boolean} [transformCategoryLabelOnly=false] 是否只转换分类标签，不转换文件标签
 */

/**
 * 创建一个自定义的侧边栏生成器，用于替换Docusaurus的默认生成器
 * 
 * @param {GeneratorOptions} options 生成器选项
 * @returns {Function} 自定义的侧边栏生成器函数
 */
function createSidebarItemsGenerator(options = {}) {
  const {
    useFileNameAsLabel = true,
    useFolderNameAsCategory = true,
    transformLabel = (name) => name,
    transformCategoryLabelOnly = false,
  } = options;

  /**
   * 自定义侧边栏生成器
   * 
   * @param {Object} args Docusaurus传入的参数
   * @returns {Promise<Array>} 处理后的侧边栏项
   */
  return async function customSidebarItemsGenerator(args) {
    const {
      defaultSidebarItemsGenerator,
      numberPrefixParser,
      item,
      version,
      docs,
      categoriesMetadata,
      isCategoryIndex,
    } = args;

    // 先获取默认的侧边栏项
    const sidebarItems = await defaultSidebarItemsGenerator({
      numberPrefixParser,
      item,
      version,
      docs,
      categoriesMetadata,
      isCategoryIndex,
    });

    // 处理项目
    return processItems(sidebarItems);
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
      if (useFolderNameAsCategory && item.type === 'category') {
        // 应用标签转换函数
        if (item.label) {
          item.label = transformLabel(item.label);
        }
        
        // 递归处理子项
        if (item.items && Array.isArray(item.items)) {
          item.items = processItems(item.items);
        }
      }
      
      // 如果是文档，且需要使用文件名作为标签
      if (useFileNameAsLabel && item.type === 'doc') {
        const docPath = item.id;
        let fileName = '';
        
        // 如果是index文件，使用其父文件夹名作为标签
        if (docPath.endsWith('/index')) {
          const pathParts = docPath.split('/');
          fileName = pathParts[pathParts.length - 2]; // 获取父文件夹名
        } else {
          // 否则使用文件名作为标签
          const pathParts = docPath.split('/');
          fileName = pathParts[pathParts.length - 1]; // 获取文件名
        }

        // 只有在不只转换分类时，或者是index文件（作为分类代表）时，才应用转换
        if (!transformCategoryLabelOnly || docPath.endsWith('/index')) {
          item.label = transformLabel(fileName);
        } else if (transformCategoryLabelOnly) {
          // 如果只转换分类，对于普通文件，仍然设置为文件名，但不进行转换
          item.label = fileName;
        }
      }
      
      return item;
    });
  }
}

module.exports = createSidebarItemsGenerator; 