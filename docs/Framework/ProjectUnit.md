# 项目单元（ProjectUnit）

## 概述

项目单元（ProjectUnit）是 MoLibrary.Framework 的核心设计理念，它将项目中的各种基础架构组件抽象成统一的"项目单元"概念。通过这种设计，框架能够自动识别、分析和管理项目中的各种架构组件，为开发团队提供统一的开发规范和架构治理能力。

## 设计思想

### 核心理念

当使用 MoLibrary Framework 时，项目的开发模式已经被规范化：

- **应用服务**：继承 `MoApplicationService` 基类
- **领域服务**：继承 `MoDomainService` 基类  
- **仓储层**：实现 `IMoRepository<T>` 接口
- **后台作业**：继承 `MoBackgroundJob<T>` 基类
- **领域事件**：实现相关领域事件接口
- **实体模型**：继承 `MoEntity` 基类

项目单元系统通过反射和约定，自动识别这些架构组件，将它们抽象为项目单元，形成项目的整体架构视图。

### 架构优势

1. **统一标准**：为项目中的各种组件提供统一的抽象模型
2. **自动化管理**：自动识别和注册项目单元，减少手工配置
3. **依赖关系管理**：自动分析和建立组件间的依赖关系
4. **命名规范约束**：支持可配置的命名规范检查
5. **架构可视化**：提供API接口查询项目结构信息
6. **开发规范约束**：通过编译时和运行时检查确保代码规范

## 项目单元类型

### 基础项目单元类型

```csharp
public enum EProjectUnitType
{
    ApplicationService,    // 应用服务
    DomainService,        // 领域服务
    Repository,           // 仓储
    DomainEvent,          // 领域事件
    DomainEventHandler,   // 领域事件处理程序
    LocalEventHandler,    // 本地事件处理程序
    BackgroundWorker,     // 后台工作者
    BackgroundJob,        // 后台作业
    Entity,               // 实体、聚合
    RequestDto,           // 请求类
    // ... 更多类型
}
```

### 具体项目单元实现

#### 1. 应用服务单元（UnitApplicationService）

**识别条件**：继承自 `MoApplicationService` 的类

**特殊属性**：
- `IsCommand/IsQuery`：区分命令和查询操作
- `RequestType/ResponseType`：请求和响应类型
- 自动关联请求DTO的依赖关系

**命名约定**：默认包含 "Handler" 字符串

```csharp
// 示例应用服务
public class UserCreateCommandHandler : MoApplicationService<UserCreateCommand, UserDto>
{
    // 实现具体业务逻辑
}
```

#### 2. 领域服务单元（UnitDomainService）

**识别条件**：继承自 `MoDomainService` 的类

**命名约定**：默认以 "Domain" 前缀开头

```csharp
// 示例领域服务
public class DomainUserService : MoDomainService
{
    // 实现领域业务逻辑
}
```

#### 3. 仓储单元（UnitRepository）

**识别条件**：实现 `IMoRepository<T>` 接口的类

**特殊属性**：
- `EntityType`：关联的实体类型
- `RepoInterface`：仓储接口类型
- `IsHistoryRepo`：是否为历史记录仓储
- 自动关联实体的依赖关系

**命名约定**：默认以 "Repository" 前缀开头，并要求有对应的接口 `I{ClassName}`

```csharp
// 示例仓储
public interface IUserRepository : IMoRepository<User>
{
    // 扩展方法
}

public class UserRepository : MoRepository<User>, IUserRepository
{
    // 实现具体数据访问逻辑
}
```

#### 4. 后台作业单元（UnitBackgroundJob）

**识别条件**：继承自 `MoBackgroundJob<T>` 的类

**特殊属性**：
- `JobArgsType`：作业参数类型
- 自动注册到后台作业管理器

**命名约定**：默认以 "Job" 前缀开头

```csharp
// 示例后台作业
public class JobEmailNotification : MoBackgroundJob<EmailArgs>
{
    // 实现后台作业逻辑
}
```

## 工厂模式与自动识别

### 工厂接口

每个项目单元类型都实现 `IHasProjectUnitFactory` 接口：

```csharp
public interface IHasProjectUnitFactory
{
    public static abstract ProjectUnit? Factory(FactoryContext context);
}
```

### 自动注册机制

1. **静态构造函数注册**：每个项目单元类型在静态构造函数中注册自己的工厂方法
2. **反射扫描**：系统启动时通过反射扫描所有类型
3. **工厂链调用**：依次调用各个工厂方法尝试创建项目单元
4. **类型验证**：验证类型约束和命名规范
5. **依赖关系建立**：在所有单元创建完成后建立依赖关系

```csharp
// 工厂方法示例
public static ProjectUnit? Factory(FactoryContext context)
{
    var unit = new UnitApplicationService(context.Type);
    return unit.VerifyType() ? unit : null;
}
```

## 命名规范约束

### 规范配置

项目单元支持可配置的命名规范约束：

```csharp
public class UnitNameConventionOption
{
    public string? Prefix { get; set; }    // 前缀要求
    public string? Postfix { get; set; }   // 后缀要求  
    public string? Contains { get; set; }  // 包含字符串要求
    public ENameConventionMode? NameConventionMode { get; set; }
}

public enum ENameConventionMode
{
    Disable,  // 禁用检查
    Warning,  // 警告模式
    Strict    // 严格模式（抛出异常）
}
```

### 默认规范

每种项目单元类型都有默认的命名规范：

- **应用服务**：包含 "Handler"
- **领域服务**：以 "Domain" 开头
- **仓储**：以 "Repository" 开头
- **后台作业**：以 "Job" 开头

## 依赖关系管理

### 自动依赖分析

系统能够自动分析和建立组件间的依赖关系：

1. **应用服务 ↔ 请求DTO**：根据泛型参数自动关联
2. **仓储 ↔ 实体**：根据仓储的泛型参数自动关联
3. **事件处理器 ↔ 事件**：根据处理的事件类型自动关联

### 依赖关系API

```csharp
public abstract class ProjectUnit
{
    public List<ProjectUnit> DependencyUnits { get; protected set; }
    
    public virtual void AddDependency(ProjectUnit unit);
    public virtual IReadOnlyList<T> FetchDependency<T>() where T : ProjectUnit;
    public virtual void DoingConnect(); // 建立依赖关系的钩子方法
}
```

## 特性支持

### 单元特性接口

```csharp
public interface IUnitCachedAttribute
{
    // 标记接口，用于识别项目单元特性
}
```

### 内置特性

```csharp
[AttributeUsage(AttributeTargets.Class)]
public class UnitInfoAttribute : Attribute, IUnitCachedAttribute
{
    public string Name { get; set; }
    // 用于为项目单元提供显示名称
}
```

### 使用示例

```csharp
[UnitInfo(Name = "用户创建处理器")]
public class UserCreateCommandHandler : MoApplicationService<UserCreateCommand, UserDto>
{
    // 实现逻辑
}
```

## 项目单元存储

### 存储结构

```csharp
public static class ProjectUnitStores
{
    // 按完整名称索引
    public static Dictionary<string, ProjectUnit> ProjectUnitsByFullName { get; }
    
    // 按类名索引（检测重名）
    public static Dictionary<string, ProjectUnit> ProjectUnitsByName { get; }
    
    // 枚举类型存储
    public static Dictionary<string, Type> EnumTypes { get; }
}
```

### 查询API

```csharp
// 获取所有项目单元
public static List<ProjectUnit> GetAllUnits()

// 获取特定类型的项目单元
public static List<T> GetUnits<T>() where T : ProjectUnit

// 根据键获取项目单元
public static T? GetUnit<T>(string key) where T : ProjectUnit
```

## 使用场景

### 1. 架构治理

- **代码审查**：确保所有组件都遵循架构规范
- **命名检查**：自动检查命名是否符合团队约定
- **依赖分析**：分析组件间的依赖关系，发现潜在问题

### 2. 开发辅助

- **API文档生成**：基于项目单元信息自动生成API文档
- **代码生成**：基于项目单元结构生成样板代码
- **测试辅助**：为领域事件等提供测试发布功能

### 3. 运维监控

- **系统监控**：监控各个组件的运行状态
- **性能分析**：分析组件间调用链路和性能瓶颈
- **故障诊断**：快速定位问题组件

### 4. 团队协作

- **架构文档**：自动生成项目架构文档
- **新人培训**：帮助新团队成员快速理解项目结构
- **知识管理**：维护项目的架构知识库

## 扩展机制

### 自定义项目单元类型

1. **继承ProjectUnit基类**：
```csharp
public class CustomUnit : ProjectUnit, IHasProjectUnitFactory
{
    public CustomUnit(Type type) : base(type, EProjectUnitType.Custom) { }
    
    public static ProjectUnit? Factory(FactoryContext context)
    {
        // 实现识别逻辑
    }
}
```

2. **注册工厂方法**：
```csharp
static CustomUnit()
{
    AddFactory(Factory);
}
```

3. **实现验证逻辑**：
```csharp
protected override bool VerifyTypeConstrain()
{
    // 实现类型约束验证
}
```

### 扩展枚举类型

在 `EProjectUnitType` 枚举中添加新的项目单元类型。

## 最佳实践

### 1. 命名规范

- 保持一致的命名风格
- 使用有意义的类名和方法名
- 遵循框架建议的命名约定

### 2. 依赖管理

- 避免循环依赖
- 保持依赖关系的单向性
- 合理使用依赖注入

### 3. 特性使用

- 为重要的项目单元添加 `UnitInfo` 特性
- 使用自定义特性扩展项目单元信息
- 避免过度使用特性导致代码复杂化

### 4. 扩展开发

- 优先使用现有的项目单元类型
- 只有在必要时才创建自定义项目单元类型
- 确保扩展的项目单元类型遵循框架约定

## 总结

项目单元系统是 MoLibrary.Framework 架构治理的核心功能，它通过抽象和统一管理项目中的各种组件，为团队提供了：

- **统一的开发规范**
- **自动化的架构管理**
- **可视化的项目结构**
- **强类型的依赖关系**
- **灵活的扩展机制**

通过项目单元系统，开发团队能够更好地维护代码质量，提高开发效率，确保项目架构的一致性和可维护性。