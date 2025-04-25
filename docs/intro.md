---
sidebar_position: 1
---

# 快速开始

MoLibrary 是一个模块化的 .NET 基础设施库，旨在提供可独立使用的组件，帮助您快速构建高质量的应用程序。

## 安装

选择您需要的模块进行安装：

```bash
# 安装核心库
dotnet add package MoLibrary.Core

# 安装仓储模块
dotnet add package MoLibrary.Repository

# 安装依赖注入模块
dotnet add package MoLibrary.DependencyInjection

# 其他模块...
```

## 基本使用

MoLibrary 使用模块化的方式来注册和配置服务，简单易用：

```csharp
// 注册模块
services.AddMoModule();

// 每个模块的注册方式类似
services.AddMoModuleAuthorization(options => {
    // 配置模块选项
    options.DefaultScheme = "Bearer";
});
```

模块通常会返回一个 `ModuleGuide` 对象，用于进一步配置模块：

```csharp
services.AddMoModuleRepository()
        .ConfigureDatabase(options => {
            options.ConnectionString = "your-connection-string";
        })
        .AddDefaultRepositories();
```

## 核心概念

MoLibrary 的核心概念是 `MoModule`，每个模块遵循统一的注册和配置模式：

1. **ModuleOption\{ModuleName\}**: 模块的配置选项
2. **ModuleGuide\{ModuleName\}**: 模块配置的向导类
3. **Module\{ModuleName\}**: 包含依赖注入和中间件配置的具体实现
4. **ModuleBuilderExtensions\{ModuleName\}**: 面向用户的扩展方法

## 下一步

请查看各个模块的详细文档，了解更多高级功能和最佳实践。
