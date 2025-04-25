---
slug: welcome
title: 欢迎使用 MoLibrary
authors: [euynac]
tags: [MoLibrary, 欢迎]
---

我们很高兴向您介绍 MoLibrary，这是一个模块化的 .NET 基础设施库，旨在提供可独立使用的组件，帮助您快速构建高质量的应用程序。

## 为什么选择 MoLibrary？

MoLibrary 的核心设计理念是模块化和可组合性。我们不希望您为了使用某个特定功能而引入整个繁重的框架，因此每个模块都可以独立使用，同时又能与其他模块协同工作。

主要特点：

- **模块化设计**：只需引入您需要的组件
- **统一直觉的 API**：所有模块遵循一致的设计模式
- **高性能**：经过优化的实现，专注于性能
- **全面文档**：详细的文档和示例代码
- **强类型支持**：充分利用 C# 类型系统，提供良好的开发体验

## 可用模块

MoLibrary 目前提供以下模块：

- **Core**：核心功能和基础设施
- **DomainDrivenDesign**：DDD 模式实现
- **Repository**：仓储模式实现
- **DependencyInjection**：增强的依赖注入功能
- **BackgroundJob**：后台任务处理
- **SignalR**：实时通信扩展
- **AutoModel**：自动模型映射和转换
- **Configuration**：配置管理
- **DataChannel**：数据通道
- **Tool**：常用工具和辅助功能

## 快速开始

要使用 MoLibrary，只需通过 NuGet 安装所需模块：

```bash
dotnet add package MoLibrary.Core
dotnet add package MoLibrary.Repository
# 其他您需要的模块...
```

然后在您的 Startup.cs 中注册模块：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // 添加 MoLibrary 核心模块
    services.AddMoModule();
    
    // 添加其他需要的模块
    services.AddMoModuleRepository(options => {
        // 配置选项
    });
}
```

## 下一步

我们正在积极开发新功能和改进现有模块。敬请关注以下即将推出的功能：

- 更多数据访问提供程序
- 增强的分布式系统支持
- 更丰富的示例项目

我们欢迎您的贡献和反馈！请访问我们的 [GitHub 仓库](https://github.com/Euynac/MoLibrary) 了解更多信息。 