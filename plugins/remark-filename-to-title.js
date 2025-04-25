/**
 * A remark plugin for Docusaurus that uses the Markdown filename as the document title
 * instead of the first heading in the content.
 * 
 * @param {object} options Plugin options
 * @returns {function} Plugin function
 */
const remarkFilenameToTitle = (options = {}) => {
  console.log('🔍 [remark-filename-to-title] Plugin initialized with options:', options);
  
  /**
   * @param {import('mdast').Root} tree - The markdown AST
   * @param {import('vfile').VFile} file - Virtual file representation
   */
  return (tree, file) => {
    // Get the filename without extension
    const path = file.path || '';
    let filename = path.split(/[\\/]/).pop();

    console.log(`🔍 [remark-filename-to-title] Processing file: ${path}`);
    console.log(`🔍 [remark-filename-to-title] Filename: ${filename}`);
    
    if (!filename) {
      console.log('⚠️ [remark-filename-to-title] No filename found, skipping');
      return;
    }

    // Dump the file.data object to check if frontmatter is being processed correctly
    console.log('🔍 [remark-filename-to-title] File data:', JSON.stringify(file.data || {}, null, 2));

    // Skip processing if frontmatter already has a title
    if (file.data?.frontmatter?.title) {
      console.log(`🔍 [remark-filename-to-title] Existing title found: "${file.data.frontmatter.title}", skipping`);
      return;
    }

    // For Docusaurus, we may need to set up the frontmatter data structure
    if (!file.data) {
      file.data = {};
      console.log('🔍 [remark-filename-to-title] Created file.data object');
    }
    
    if (!file.data.frontmatter) {
      file.data.frontmatter = {};
      console.log('🔍 [remark-filename-to-title] Created file.data.frontmatter object');
    }

    // Remove the extension
    filename = filename.replace(/\.[^.]+$/, '');
    console.log(`🔍 [remark-filename-to-title] Filename without extension: ${filename}`);

    // Format the filename as a title (replace hyphens/underscores with spaces and capitalize words)
    const formattedTitle = filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());

    console.log(`🔍 [remark-filename-to-title] Generated title: "${formattedTitle}"`);

    // Set the title in frontmatter data
    file.data.frontmatter.title = formattedTitle;
    console.log(`🔍 [remark-filename-to-title] Set title in frontmatter: "${formattedTitle}"`);

    // Verify the frontmatter structure after our changes
    console.log('🔍 [remark-filename-to-title] Updated file data:', JSON.stringify(file.data, null, 2));

    // Check if there's a first heading node in the tree and if we should replace it
    const firstHeadingIndex = tree.children.findIndex(node => 
      node.type === 'heading' && node.depth === 1
    );

    console.log(`🔍 [remark-filename-to-title] First heading index: ${firstHeadingIndex}`);

    if (firstHeadingIndex !== -1 && options.removeFirstHeading) {
      console.log('🔍 [remark-filename-to-title] Removing first heading node');
      // Remove the first heading as the title will come from the filename
      tree.children.splice(firstHeadingIndex, 1);
    }
  };
};

// 使用 CommonJS 导出
module.exports = remarkFilenameToTitle; 