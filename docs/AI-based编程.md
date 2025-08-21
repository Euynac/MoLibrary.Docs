# AI-based编程

本项目支持模板化编程，提供了开箱即用的编程规则，位于项目`rules`目录下，可用于`cursor`等支持读取规则或文档的`AI IDE`。

# 为Claude Code安装MCP服务器指南

本指南提供为Claude Code安装和配置Model Context Protocol（MCP）服务器的详细指令，基于您提供的配置。这些服务器通过MCP标准协议增强Claude的功能，允许AI模型与外部工具和数据源交互。以下涵盖了Context7、Puppeteer、Filesystem、Memory、Sequential-Thinking和Microsoft Docs服务器的安装步骤、描述和配置说明。

## 前提条件

在开始之前，请确保满足以下要求：

- **Claude Code CLI**：已安装最新版本（参考[官方文档](https://docs.anthropic.com/en/docs/claude-code/mcp)）。
- **Node.js**：本地服务器需要Node.js 18或更高版本（从[nodejs.org](https://nodejs.org/)下载）。
- **环境配置**：对于需要环境变量的服务器（如Filesystem），确保您可以在系统或客户端配置中设置变量。
- **Windows用户**：在原生Windows（非WSL）上，运行本地MCP服务器时需使用`cmd /c`包装器，例如：
    
    ```shell
    claude mcp add my-server -- cmd /c npx -y @some/package
    ```
    
    否则可能遇到“Connection closed”错误。

## 安装和配置说明

### 1. Context7

#### 描述

Context7 MCP服务器为大型语言模型和AI代码编辑器提供实时、版本特定的文档。它从官方来源获取最新的文档和代码示例，减少使用过时API的风险，适用于快速发展的库如Next.js、React Query或Tailwind CSS。

#### 文档

[upstash/context7](https://github.com/upstash/context7)

#### 安装

- **远程服务器**：
    
    ```shell
    claude mcp add --transport http context7 https://mcp.context7.com/mcp
    ```
    
    或使用SSE传输：
    
    ```shell
    claude mcp add --transport sse context7 https://mcp.context7.com/sse
    ```
    
- **本地服务器**：
    
    ```shell
    claude mcp add context7 -- npx -y @upstash/context7-mcp
    ```
    

#### 配置说明

- 在Claude Code中，添加后可通过提示词如“use context7”使用，例如：“创建带有JWT认证的Next.js中间件，use context7”。
- 验证安装：运行`claude mcp list`检查服务器是否列出。

### 2. Puppeteer

#### 描述

Puppeteer MCP服务器支持浏览器自动化，允许AI模型与网页交互、捕获截图或在浏览器环境中执行JavaScript。适用于网页抓取、自动化测试或表单填写等任务。

#### 文档

[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

#### 安装

```shell
claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer
```

#### 配置说明

- 可选环境变量：通过`-e`设置Puppeteer选项，例如：
    
    ```shell
    claude mcp add puppeteer -e PUPPETEER_LAUNCH_OPTIONS='{"headless": false, "executablePath": "C:/Program Files/Google/Chrome/Application/chrome.exe"}' -- npx -y @modelcontextprotocol/server-puppeteer
    ```
    
- Windows用户：可能需要`cmd /c`，例如：
    
    ```shell
    claude mcp add puppeteer -- cmd /c npx -y @modelcontextprotocol/server-puppeteer
    ```
    

### 3. Filesystem

#### 描述

Filesystem MCP服务器提供安全的文件操作，允许AI模型在指定目录中读写和操作文件。它包含可配置的访问控制，防止未经授权的访问，适用于文件管理或代码分析。

#### 文档

[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

#### 安装

```shell
claude mcp add filesystem -e ALLOWED_DIRECTORIES="d:\\Euynac\\Programming\\.NET\\Euynac\\MoLibrary" -- npx -y @modelcontextprotocol/server-filesystem
```

#### 配置说明

- **环境变量**：使用`-e ALLOWED_DIRECTORIES`指定允许访问的目录。您也可以直接在命令中指定目录，例如：
    
    ```shell
    claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Documents ~/Desktop ~/Downloads ~/Projects
    ```
    
- **注意**：将`"d:\\Euynac\\Programming\\.NET\\Euynac\\MoLibrary"`替换为您需要的目录路径。
- 确保路径格式与您的操作系统兼容（Windows使用反斜杠，Unix使用正斜杠）。

### 4. Memory

#### 描述

Memory MCP服务器提供基于知识图谱的持久内存系统，使AI模型能够在交互中存储和检索上下文信息，增强个性化交互。

#### 文档

[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

#### 安装

```shell
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
```

#### 配置说明

- 可选环境变量：设置`MEMORY_FILE_PATH`指定知识图谱数据的存储路径，例如：
    
    ```shell
    claude mcp add memory -e MEMORY_FILE_PATH="/path/to/memory.json" -- npx -y @modelcontextprotocol/server-memory
    ```
    

### 5. Sequential-Thinking

#### 描述

Sequential-Thinking MCP服务器通过将复杂任务分解为结构化的步骤，支持动态和反思性问题解决，适用于复杂任务的迭代推理。

#### 文档

[modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

#### 安装

```shell
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

#### 配置说明

- 可选环境变量：设置`DISABLE_THOUGHT_LOGGING=true`禁用日志记录，例如：
    
    ```shell
    claude mcp add sequential-thinking -e DISABLE_THOUGHT_LOGGING=true -- npx -y @modelcontextprotocol/server-sequential-thinking
    ```
    

### 6. Microsoft Docs

#### 描述

Microsoft Learn MCP服务器是远程服务，提供对微软官方文档的访问，包括Azure、Microsoft 365等技术内容，确保AI模型获取最新信息。

#### 文档

[MicrosoftDocs/mcp](https://github.com/MicrosoftDocs/mcp#-installation--getting-started)

#### 安装

```shell
claude mcp add --transport http microsoft_docs_mcp https://learn.microsoft.com/api/mcp
```

#### 配置说明

- 无需本地安装，直接通过HTTP连接到远程服务器。
- 在提示词中使用“search Microsoft docs”，例如：“提供创建Azure容器应用的Azure CLI命令，search Microsoft docs”。

## 验证和故障排除

- **验证安装**：运行以下命令检查已注册的服务器：
    
    ```shell
    claude mcp list
    ```
    
    确保所有服务器列出且状态为“connected”。
- **作用域**：默认使用本地作用域（仅当前项目）。若需全局使用，添加`-s user`，例如：
    
    ```shell
    claude mcp add puppeteer -s user -- npx -y @modelcontextprotocol/server-puppeteer
    ```
    
- **Windows注意事项**：若遇到“Connection closed”错误，尝试使用`cmd /c`包装器。
- **调试**：运行`claude mcp list`或在Claude Code中运行`/mcp`查看连接状态。

## 总结表

|服务器名称|类型|安装命令|配置说明|
|---|---|---|---|
|Context7|本地/远程|`claude mcp add --transport http context7 https://mcp.context7.com/mcp` 或 `claude mcp add context7 -- npx -y @upstash/context7-mcp`|远程使用HTTP/SSE，本地使用npx。|
|Puppeteer|本地|`claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer`|可选Puppeteer启动选项。|
|Filesystem|本地|`claude mcp add filesystem -e ALLOWED_DIRECTORIES="d:\\Euynac\\Programming\\.NET\\Euynac\\MoLibrary" -- npx -y @modelcontextprotocol/server-filesystem`|设置ALLOWED_DIRECTORIES限制访问。|
|Memory|本地|`claude mcp add memory -- npx -y @modelcontextprotocol/server-memory`|可选MEMORY_FILE_PATH设置存储路径。|
|Sequential-Thinking|本地|`claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking`|可选禁用日志记录。|
|Microsoft Docs|远程|`claude mcp add --transport http microsoft_docs_mcp https://learn.microsoft.com/api/mcp`|使用远程URL，无需本地安装。|


## Graphiti

知识图谱，记忆，可使用 docker 部署。


```sh
# Claude Code添加MCP命令

claude mcp add --transport sse --scope user graphiti-memory http://localhost:8000/sse
```

### 使用rule

```
# 使用Graphiti MCP工具的指令

## 开始任何任务之前

**始终先搜索：** 在开始工作之前，使用search_nodes工具查找相关的偏好设置和程序。

**同时搜索事实：** 使用search_facts工具发现可能与您的任务相关的关系和事实信息。

**按实体类型过滤：** 在节点搜索中指定"Preference"（偏好）或"Procedure"（程序）以获得针对性结果。

**审查所有匹配项：** 仔细检查与当前任务匹配的任何偏好、程序或事实。

## 始终保存新的或更新的信息

**立即捕获需求和偏好：** 当用户表达需求或偏好时，立即使用add_episode存储它。最佳实践是将很长的需求拆分为较短的逻辑块。

**明确标识更新：** 如果某些内容是对现有知识的更新，请明确说明。

**清晰记录程序：** 当您发现用户希望如何完成某些操作时，将其记录为程序。

**记录事实关系：** 当您了解到实体之间的连接时，将这些信息存储为事实。

**明确分类：** 为偏好和程序标注清晰的类别，以便日后更好地检索。

## 工作过程中

**遵循发现的偏好：** 使您的工作与找到的任何偏好保持一致。

**严格按照程序执行：** 如果找到适用于当前任务的程序，请严格按步骤执行。

**应用相关事实：** 使用事实信息来指导您的决策和建议。

**保持一致性：** 与先前识别的偏好、程序和事实保持一致。

## 最佳实践

**建议前先搜索：** 在提出建议之前，始终检查是否存在既定知识。

**结合节点和事实搜索：** 对于复杂任务，同时搜索节点和事实以构建完整图景。

**使用center_node_uuid：** 在探索相关信息时，围绕特定节点进行搜索。

**优先考虑具体匹配：** 更具体的信息优先于一般信息。

**主动识别模式：** 如果您注意到用户行为中的模式，考虑将其存储为偏好或程序。

**重要提醒：** 知识图谱是您的记忆。持续使用它来提供个性化协助，尊重用户既定的程序和事实背景。
```



## Browser MCP

前端必备调试MCP。

```json
"browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
```
