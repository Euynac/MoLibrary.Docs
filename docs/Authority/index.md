---
sidebar_position: 1
---

# Authority 模块

MoLibrary.Authority 是一个用于权限管理和授权的模块。

## 功能特点

- 权限位（Permission Bit）管理
- 基于角色的授权
- 自定义授权策略

## 安装

```bash
dotnet add package MoLibrary.Authority
```

## 基本使用

```csharp
services.AddMoModuleAuthorization(options => {
    // 配置选项
    options.DefaultScheme = "Bearer";
});
```
