---
sidebar_position: 1
---

# 模块系统

模块化是 MoLibrary 的核心设计理念，通过 `MoModule` 机制将基础设施划分为可独立使用的功能单元。

## 概述

MoLibrary 是一个模块化的基础设施库，以 `ASP.NET Core` 为基础，大程度上解耦基础设施、库间的依赖，允许您单独使用某个模块而无需引入整个繁重的框架。

## 特性

1. **统一直觉的注册方式**：所有模块都遵循相同的注册和配置模式，上手简易。
2. **自动中间件注册**：只需配置依赖注入，无需手动注册中间件。
3. **防止重复注册**：所有模块都自动仅注册一次，不必担心服务或中间件重复注册。
4. **高性能服务注册**：对于需要反射的自动注册操作，在所有 `MoModule` 注册过程中只遍历一次。
5. **及时释放临时对象**：减少注册阶段的内存占用。
6. **自动解决中间件顺序**：无需手动管理中间件的注册顺序。
7. **可视化依赖关系**：及时提醒可能的注册失败、误操作等。

## 组成部分

每个模块都包含以下组成部分：

1. `ModuleOption{ModuleName}`：模块配置选项类
2. `ModuleGuide{ModuleName}`：模块配置向导类，引导用户进行进一步配置
3. `Module{ModuleName}`：包含依赖注入方式和中间件配置的具体实现
4. `ModuleBuilderExtensions{ModuleName}`：面向用户的扩展方法，作为使用入口

## 使用方式

开发者使用原生的方式注册模块，每个模块的注册方式都类似如下：

```csharp
services.AddMoModuleAuthorization(Action<ModuleOptionAuthorization> option = null)
```

注册方法返回值为 `ModuleGuide` 类型，用于指引用户进一步配置模块相关功能：

```csharp
public class ModuleGuideAuthorization
{
    public ModuleGuideAuthorization AddPermissionBit<TEnum>(string claimTypeDefinition) 
        where TEnum : struct, Enum
    {
        ConfigureExtraServices(nameof(AddPermissionBit), context =>
        {
            var checker = new PermissionBitChecker<TEnum>(claimTypeDefinition);
            PermissionBitCheckerManager.AddChecker(checker);
            context.Services.AddSingleton<IPermissionBitChecker<TEnum>, PermissionBitChecker<TEnum>>(_ => checker);
        });
        return this;
    }
}
```

### 模块配置

为了提高开发者设置的优先级，在开发者 `AddMoModule` 的过程中，配置 `Option` 的 `Action` 设置即使不是模块第一次注册，仍会覆盖上一次的配置。这是因为模块的级联注册可能在开发者使用模块之前，已经进行了模块的配置。

如果有特殊的配置顺序需求，开发者可以使用以下扩展方法：

```csharp
public TModuleGuideSelf ConfigureOption<TOption>(
    Action<TOption> extraOptionAction, 
    EMoModuleOrder order = EMoModuleOrder.Normal) 
    where TOption : IMoModuleOption<TModule>
```

> 来自模块级联注册的 Option 优先级始终比用户 Order 低 1，这是通过级联注册 `GuideFrom` 判断实现的

#### 模块额外配置

`Guide` 类中提供 `ConfigureExtraOption` 用于配置额外的模块配置类：

```csharp
public TModuleGuideSelf ConfigureExtraOption<TOption>(
    Action<TOption> extraOptionAction, 
    EMoModuleOrder order = EMoModuleOrder.Normal) 
    where TOption : IMoModuleExtraOption<TModule>
```

### 模块级联注册

模块内部进行级联注册时可采用如下方法获取 `Guide` 类进行进一步配置：

```csharp
protected TOtherModuleGuide DependsOnModule<TOtherModuleGuide>()  
    where TOtherModuleGuide : MoModuleGuide, new()
{
    return new TOtherModuleGuide()
    {
        GuideFrom = CurModuleEnum()
    };
}
```

## 实现原理

MoLibrary 的模块系统通过以下核心组件实现：

### MoDomainTypeFinder

用于获取当前应用程序相关程序集及搜索，可设置业务程序集。用于 Core 扫描相关程序集所有类型进行自动注册、项目单元发现等，提高整个框架的性能。

### MoModuleRegisterCentre

模块注册中心，用于控制整个模块注册生命周期。注册流程主要包括：

1. **ConfigureBuilder**：配置构建器
2. **ConfigureServices**：配置服务
3. **PostConfigureServices**：在执行遍历业务程序集类后配置服务
4. **ConfigureApplicationBuilder**：配置应用程序管道 