# Docusaurus Custom Plugins

This directory contains custom plugins for Docusaurus.

## remark-filename-to-title

A remark plugin that uses Markdown filenames as document titles in the web output, rather than relying on the first heading in the content.

### Usage

```js
// docusaurus.config.js
const remarkFilenameToTitle = require('./plugins/remark-filename-to-title');

module.exports = {
  // ...
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // Add our custom remark plugin to use filenames as titles
          remarkPlugins: [
            [remarkFilenameToTitle, { 
              // Set to true if you want to remove the first heading from the content
              // when it's used as a title in the frontmatter
              removeFirstHeading: false 
            }]
          ],
          // Use beforeDefaultRemarkPlugins to ensure our plugin runs before
          // Docusaurus processes the markdown
          beforeDefaultRemarkPlugins: [
            [remarkFilenameToTitle, { removeFirstHeading: false }]
          ],
        },
      },
    ],
  ],
};
```

### Options

- `removeFirstHeading` (boolean, default: false): When set to true, the plugin will remove the first level-1 heading (`# Heading`) from the document content, since the title will be generated from the filename.

### How it works

The plugin:

1. Extracts the filename from the file path
2. Formats it by replacing hyphens and underscores with spaces and capitalizing words
3. Sets the formatted filename as the `title` in the document's frontmatter
4. Optionally removes the first heading from the content

This ensures your document titles in the web UI are derived from filenames rather than markdown content, reducing conflicts and making document organization more consistent. 