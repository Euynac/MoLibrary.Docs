// 调试脚本，用于测试 remark-filename-to-title 插件
const fs = require('fs');
const path = require('path');
const remarkFilenameToTitle = require('./plugins/remark-filename-to-title');

// 简单测试函数
function testPlugin() {
  console.log('🧪 开始测试 remark-filename-to-title 插件');

  // 测试文件路径
  const testFiles = [
    'docs/some-feature-document.md',
    'docs/complex-file_name-with-hyphens_and_underscores.md',
    'docs/explicit-title-document.md',
    'docs/test-folder/example-document.md'
  ];

  // 创建插件实例
  const plugin = remarkFilenameToTitle({ removeFirstHeading: false });
  console.log('🔍 插件实例类型:', typeof plugin);

  for (const filePath of testFiles) {
    try {
      console.log(`\n🧪 测试文件: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${filePath}`);
        continue;
      }
      
      // 创建一个模拟的 AST 树和文件对象
      const mockTree = { 
        type: 'root',
        children: [
          { type: 'heading', depth: 1, children: [{ type: 'text', value: 'Test Heading' }] }
        ]
      };
      
      const mockFile = {
        path: filePath,
        data: {},
        cwd: process.cwd()
      };
      
      // 直接调用插件函数
      console.log('🔍 调用插件处理文件:', filePath);
      plugin(mockTree, mockFile);
      
      // 输出结果
      if (mockFile.data && mockFile.data.frontmatter) {
        console.log('✅ 处理后的 frontmatter:', JSON.stringify(mockFile.data.frontmatter, null, 2));
      } else {
        console.log('❌ 没有生成 frontmatter 数据');
      }
    } catch (error) {
      console.error(`❌ 处理文件 ${filePath} 时出错:`, error);
    }
  }
}

// 运行测试
testPlugin(); 