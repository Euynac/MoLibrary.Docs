---
sidebar_position: 2
---

# 模块MoModule

## 概述

`MoLibrary` 是一个模块化的基础设施库，以 `ASP.NET Core` 为基础，大程度上解耦基础设施、库间的依赖，允许您单独使用某个模块而无需引入整个繁重的框架。
模块化是 `MoLibrary` 的核心设计理念，通过 `MoModule` 机制将基础设施划分为可独立使用的功能单元。

### 特性

1. **统一直觉的注册方式**：所有模块都遵循相同的注册和配置模式，上手简易。
2. **自动中间件注册**：只需配置依赖注入，无需手动注册中间件。
3. **防止重复注册**：所有模块都自动仅注册一次，不必担心服务或中间件重复注册。
4. **高性能服务注册**：对于需要反射的自动注册操作，在所有 `MoModule` 注册过程中只遍历一次。
5. **及时释放临时对象**：减少注册阶段的内存占用。（如果普通方式进行注册，通常使用`static`来贯穿服务注册及中间件阶段，而一般不会释放。）
6. **自动解决中间件顺序**：无需手动管理中间件的注册顺序。
7. **可视化依赖关系**：及时提醒可能的注册失败、误操作等。

### 组成部分

`MoModule`作为库的核心注册机制，每个Library有一个或多个`Module`，每个`Module`组成如下：

1. `Module{ModuleName}Option`: 模块Option的设置
2. `Module{ModuleName}Guide`: 模块配置的向导类
3. `Module{ModuleName}`: 含有依赖注入的方式以及配置ASP.NET Core中间件等具体实现
4. `Module{ModuleName}BuilderExtensions`: 面向用户的扩展方法

### 使用方式

开发者使用原生的方式注册Module，每个Module的方式都类似如下示例：

```cs
services.ConfigModuleAuthorization(Action<ModuleAuthorizationOption> option = null)
```


其中注册方法返回值为ModuleGuide，用于指引用户进一步配置模块相关功能

```cs
public class ModuleAuthorizationGuide
{
     public ModuleGuideAuthorization AddPermissionBit<TEnum>(string claimTypeDefinition) where TEnum : struct, Enum
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


#### 模块配置

为了提高开发者设置的优先级，在开发者`AddMoModule`的过程中，配置`Option`的`Action`设置如果不是模块第一次注册，仍会覆盖上一次的配置设置。这是因为模块的级联注册可能在开发者使用模块之前，已经进行了模块的配置。

如若有其他配置顺序需求，开发者可以使用以下扩展方法：

```cs
    public TModuleGuideSelf ConfigureOption<TOption>(Action<TOption> extraOptionAction, EMoModuleOrder order = EMoModuleOrder.Normal) where TOption : IMoModuleOption<TModule>
```

> 来自模块级联注册的Option的优先级始终比用户Order低1，这是通过级联注册`GuideFrom`判断实现的



#### 模块级联注册

模块内部进行级联注册时可采用如下方法获取`Guide`类进行进一步配置。

```cs
protected TOtherModuleGuide DependsOnModule<TOtherModuleGuide>()  where TOtherModuleGuide : MoModuleGuide, new()
{
    return new TOtherModuleGuide()
    {
        GuideFrom = CurModuleEnum()
    };
}
```



## 原理

### MoDomainTypeFinder 

用于获取当前应用程序相关程序集及搜索，可设置业务程序集。
用于Core扫描相关程序集所有类型进行自动注册、项目单元发现等，提高整个框架的性能。

### ModuleBuilderExtensions

依赖注入背后的设置方式

```cs
public static ModuleAuthorizationGuide AddMoModuleAuthorization<TEnum>(this IServiceCollection services, string claimTypeDefinition) where TEnum : struct, Enum
{
    return new ModuleAuthorizationGuide()
        .AddDefaultPermissionBit<TEnum>(claimTypeDefinition);
}
```

### MoModuleRegisterCentre

模块注册中心，用以控制整个模块注册生命周期。

#### 注册流程

##### 注册服务`MoModuleRegisterServices`

用户注册配置`Module`完毕后，在`builder.Builder()`之前调用`MoModuleRegisterServices`用于初始化注册`MoModule`

1. 遍历模块注册请求上下文字典`ModuleRegisterContextDict`，对于每个Key，代表存在一个`Module`类型模块的注册请求。
2. 对于每个模块类使用默认配置（获取模块相关配置类使用反射创建实例）进行临时实例化，用于测试模块类，如果是`MoModuleWithDependencies`则调用`ClaimDependencies` 进一步填充`ModuleRegisterContextDict`。
3. 再次重新遍历，对于每个模块注册请求信息，初始化模块相关配置类`InitFinalConfigures`，用于构建真正的模块实例。

对于每个模块实例，按顺序调用如下方法：
1. `ConfigureBuilder`
2. `ConfigureServices`
3. `PostConfigureServices`：在执行遍历业务程序集类`IWantIterateBusinessTypes`后配置服务依赖注入

##### 注册中间件 `MoModuleUseMiddlewares`

用户注册完服务后，开始配置应用程序管道时，应要调用`MoModuleUseMiddlewares`用于自动配置`MoModule`的中间件。

```cs
var app = builder.Build();
app.MoModuleUseMiddlewares(); // 在所有中间件构建之前配置
```

对于每个模块实例，按顺序调用如下方法：
1.  `ConfigureApplicationBuilder`：配置应用程序管道


#### 模块配置

模块配置包含模块本身配置`ModuleOption`及额外配置`ModuleExtraOption`，
