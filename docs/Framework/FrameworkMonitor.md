# 框架监控模块（ModuleFrameworkMonitor）

## 概述

`ModuleFrameworkMonitor` 是 MoLibrary.Framework 中的核心监控模块，它负责自动分析和监控整个项目的架构组件。该模块基于项目单元（ProjectUnit）设计思想，提供了强大的项目分析、架构治理和运行时监控能力。

## 模块功能

### 1. 项目架构自动分析

模块会在应用启动时自动扫描整个项目，识别和分析所有的架构组件：

- **自动识别项目单元**：扫描所有符合框架规范的组件
- **建立依赖关系**：分析组件间的依赖关系并建立连接
- **验证架构规范**：检查命名规范和类型约束
- **提取元数据信息**：收集组件的特性和配置信息

### 2. HTTP API 接口

模块提供了丰富的 HTTP API 接口，用于查询项目结构信息：

#### 获取所有项目单元信息
```http
GET /framework/units
```

返回项目中所有识别到的项目单元信息，包括类型、依赖关系、特性等。

#### 获取领域事件信息
```http
GET /framework/units/domain-event
```

返回项目中所有领域事件的详细信息和结构。

#### 测试发布领域事件
```http
POST /framework/units/domain-event/{eventKey}/publish
```

提供领域事件的测试发布功能，方便开发和调试。

#### 获取枚举信息
```http
GET /framework/enum?name={enumName}
```

查询项目中的枚举类型信息，支持按名称过滤。

#### 请求过滤管理
```http
POST /framework/request-filter
```

动态管理请求过滤规则，用于测试和调试场景。

### 3. 请求过滤功能

模块集成了请求过滤中间件，提供以下功能：

- **动态启用/禁用接口**：运行时控制特定接口的可用性
- **URL 模式匹配**：支持灵活的 URL 匹配规则
- **批量操作**：支持批量启用或禁用多个接口

### 4. 枚举类型管理

自动收集和管理项目中的枚举类型：

- **自动扫描**：识别项目中所有枚举类型
- **元数据提取**：提取枚举值和描述信息
- **API 查询**：提供便捷的枚举信息查询接口

## 模块架构

### 类结构图

```
ModuleFrameworkMonitor
├── ModuleFrameworkMonitorOption     // 配置选项
├── ModuleFrameworkMonitorGuide      // 配置指南
├── ModuleFrameworkMonitorBuilderExtensions  // 扩展方法
└── 核心功能
    ├── 项目单元自动识别
    ├── HTTP API 端点
    ├── 请求过滤中间件
    └── 枚举信息管理
```

### 关键接口

#### IWantIterateBusinessTypes
```csharp
public interface IWantIterateBusinessTypes
{
    IEnumerable<Type> IterateBusinessTypes(IEnumerable<Type> types);
}
```

模块实现此接口，在应用启动时遍历所有业务类型，进行项目单元识别和分析。

## 配置选项

### ModuleFrameworkMonitorOption

```csharp
public class ModuleFrameworkMonitorOption
{
    /// <summary>
    /// 是否启用请求过滤功能
    /// </summary>
    public bool EnableRequestFilter { get; set; } = false;
    
    /// <summary>
    /// API 分组名称
    /// </summary>
    public string ApiGroupName { get; set; } = "Framework";
    
    /// <summary>
    /// 命名规范选项
    /// </summary>
    public ConventionOptions ConventionOptions { get; set; } = new();
    
    /// <summary>
    /// 日志记录器
    /// </summary>
    public ILogger? Logger { get; set; }
}
```

### 命名规范配置

```csharp
public class ConventionOptions
{
    /// <summary>
    /// 是否启用命名规范检查
    /// </summary>
    public bool EnableNameConvention { get; set; } = true;
    
    /// <summary>
    /// 默认命名规范模式
    /// </summary>
    public ENameConventionMode NameConventionMode { get; set; } = ENameConventionMode.Warning;
    
    /// <summary>
    /// 各类型项目单元的命名规范配置
    /// </summary>
    public Dictionary<EProjectUnitType, UnitNameConventionOption> Dict { get; set; } = new();
}
```

## 使用方式

### 1. 基本配置

```csharp
// 在 Program.cs 中配置
builder.ConfigMoFrameworkMonitor(options =>
{
    options.EnableRequestFilter = true;
    options.ApiGroupName = "系统框架";
    options.ConventionOptions.NameConventionMode = ENameConventionMode.Strict;
});
```

### 2. 流式配置

```csharp
// 使用配置指南进行流式配置
builder.ConfigMoFrameworkMonitor()
    .EnableRequestFilter()
    .SetApiGroupName("框架监控")
    .UseStrictNamingConvention()
    .ConfigureConvention(EProjectUnitType.ApplicationService, conv =>
    {
        conv.Postfix = "Handler";
        conv.Contains = "Command";
    });
```

### 3. 自定义日志

```csharp
builder.ConfigMoFrameworkMonitor(options =>
{
    options.Logger = LoggerFactory.Create(builder => builder.AddConsole())
        .CreateLogger<ModuleFrameworkMonitor>();
});
```

## 生命周期

### 1. 服务配置阶段 (ConfigureServices)

- **初始化项目单元工厂**：注册所有项目单元类型的工厂方法
- **设置配置选项**：将配置选项传递给项目单元系统
- **注册请求过滤服务**：根据配置决定是否注册请求过滤中间件

### 2. 类型遍历阶段 (IterateBusinessTypes)

- **提取项目单元信息**：分析所有业务类型，创建项目单元
- **提取枚举信息**：收集所有枚举类型信息
- **存储到项目单元存储器**：将分析结果存储到全局存储器中

### 3. 后配置阶段 (PostConfigureServices)

- **建立项目单元连接**：调用所有项目单元的 `DoingConnect` 方法建立依赖关系
- **注册请求过滤器**：配置请求过滤中间件

### 4. 应用构建阶段 (ConfigureApplicationBuilder)

- **启用请求过滤中间件**：将请求过滤中间件添加到管道中

### 5. 端点配置阶段 (ConfigureEndpoints)

- **注册 HTTP API 端点**：注册所有框架监控相关的 API 端点
- **配置 OpenAPI 文档**：为 API 端点添加 Swagger 文档

## API 端点详解

### 1. 项目单元查询 API

#### GET /framework/units
查询所有项目单元信息

**响应格式**：
```json
[
  {
    "key": "MyProject.Services.UserCreateCommandHandler",
    "title": "用户创建处理器",
    "unitType": "ApplicationService",
    "dependencyUnits": [
      {
        "key": "MyProject.DTOs.UserCreateCommand",
        "title": "UserCreateCommand",
        "unitType": "RequestDto"
      }
    ],
    "attributes": []
  }
]
```

### 2. 领域事件 API

#### GET /framework/units/domain-event
查询所有领域事件信息

**响应格式**：
```json
[
  {
    "info": {
      "key": "MyProject.Events.UserCreatedEvent",
      "title": "用户创建事件",
      "unitType": "DomainEvent"
    },
    "structure": {
      "properties": [
        {
          "name": "UserId",
          "type": "Guid",
          "description": "用户ID"
        }
      ]
    }
  }
]
```

#### POST /framework/units/domain-event/{eventKey}/publish
测试发布领域事件

**请求参数**：
- `eventKey`: 事件的完整类型名
- `eventContent`: JSON 格式的事件数据

**请求示例**：
```http
POST /framework/units/domain-event/MyProject.Events.UserCreatedEvent/publish
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "userName": "张三",
  "createdAt": "2023-12-01T10:00:00Z"
}
```

### 3. 枚举查询 API

#### GET /framework/enum
查询所有枚举类型

**响应格式**：
```json
{
  "success": true,
  "data": [
    {
      "from": "MyProject.Core",
      "enums": [
        {
          "name": "UserStatus",
          "values": [
            {
              "index": 0,
              "name": "Active",
              "description": "活跃状态"
            },
            {
              "index": 1,
              "name": "Inactive",
              "description": "非活跃状态"
            }
          ]
        }
      ]
    }
  ]
}
```

#### GET /framework/enum?name=UserStatus
查询特定枚举类型

### 4. 请求过滤 API

#### POST /framework/request-filter
管理请求过滤规则

**请求格式**：
```json
{
  "urls": ["/api/users", "/api/orders"],
  "disable": true
}
```

**响应**：返回当前被禁用的 URL 列表

## 请求过滤功能详解

### 启用请求过滤

```csharp
builder.ConfigMoFrameworkMonitor(options =>
{
    options.EnableRequestFilter = true;
});
```

### 动态控制接口

```csharp
// 禁用特定接口
var client = httpClientFactory.CreateClient();
await client.PostAsJsonAsync("/framework/request-filter", new
{
    urls = new[] { "/api/sensitive-endpoint" },
    disable = true
});

// 重新启用接口
await client.PostAsJsonAsync("/framework/request-filter", new
{
    urls = new[] { "/api/sensitive-endpoint" },
    disable = false
});
```

### 使用场景

1. **测试环境**：临时禁用某些接口进行测试
2. **维护模式**：在系统维护时禁用特定功能
3. **渐进式发布**：逐步启用新功能接口
4. **故障隔离**：快速隔离有问题的接口

## 性能考虑

### 1. 启动性能

- **反射缓存**：使用缓存机制减少重复的反射操作
- **并行处理**：在类型分析阶段使用并行处理提高效率
- **延迟初始化**：非关键组件采用延迟初始化

### 2. 运行时性能

- **内存缓存**：项目单元信息在内存中缓存，避免重复计算
- **索引优化**：使用多种索引方式快速查找项目单元
- **最小化开销**：请求过滤中间件设计为最小性能开销

### 3. 资源管理

- **内存控制**：合理控制缓存大小，避免内存泄漏
- **GC 友好**：减少不必要的对象分配
- **线程安全**：确保多线程环境下的数据安全

## 扩展点

### 1. 自定义项目单元类型

可以通过实现 `IHasProjectUnitFactory` 接口扩展新的项目单元类型：

```csharp
public class CustomProjectUnit : ProjectUnit, IHasProjectUnitFactory
{
    public CustomProjectUnit(Type type) : base(type, EProjectUnitType.Custom) { }
    
    public static ProjectUnit? Factory(FactoryContext context)
    {
        // 自定义识别逻辑
        return new CustomProjectUnit(context.Type);
    }
}
```

### 2. 自定义API端点

可以通过配置回调扩展额外的 API 端点：

```csharp
builder.ConfigMoFrameworkMonitor()
    .ConfigureEndpoints(endpoints =>
    {
        endpoints.MapGet("/custom/endpoint", () => "Custom Response");
    });
```

### 3. 自定义过滤器

可以扩展请求过滤器的功能：

```csharp
public class CustomRequestFilter : IRequestFilter
{
    public void Enable(string url) { /* 自定义逻辑 */ }
    public void Disable(string url) { /* 自定义逻辑 */ }
    public List<string> GetDisabledUrls() { /* 自定义逻辑 */ }
}
```

## 故障排除

### 1. 项目单元识别问题

**问题**：某些组件没有被识别为项目单元

**解决方案**：
- 检查组件是否继承了正确的基类
- 验证命名是否符合规范要求
- 查看日志输出的警告信息
- 确认项目单元工厂是否正确注册

### 2. 依赖关系异常

**问题**：项目单元间的依赖关系不正确

**解决方案**：
- 检查泛型参数是否正确
- 验证相关类型是否都被识别为项目单元
- 查看 `DoingConnect` 方法的实现
- 检查项目单元存储器中的数据

### 3. API 接口异常

**问题**：框架监控 API 返回异常

**解决方案**：
- 检查模块是否正确注册
- 验证端点配置是否正确
- 查看异常日志信息
- 确认相关依赖服务是否正常注册

### 4. 请求过滤失效

**问题**：请求过滤功能不生效

**解决方案**：
- 确认 `EnableRequestFilter` 选项已启用
- 检查中间件注册顺序
- 验证 URL 匹配规则
- 查看过滤器的内部状态

## 最佳实践

### 1. 配置管理

- **环境隔离**：不同环境使用不同的配置
- **敏感信息保护**：避免在配置中暴露敏感信息
- **配置验证**：启动时验证配置的正确性

### 2. 监控集成

- **日志记录**：启用详细的日志记录用于故障排除
- **性能监控**：监控框架模块的性能影响
- **健康检查**：集成到应用的健康检查系统

### 3. 安全考虑

- **访问控制**：在生产环境中限制框架 API 的访问
- **数据保护**：避免通过 API 暴露敏感的业务信息
- **请求验证**：对输入参数进行严格验证

### 4. 版本兼容

- **向后兼容**：保持 API 接口的向后兼容性
- **渐进式升级**：支持渐进式的功能升级
- **文档维护**：及时更新相关文档

## 总结

`ModuleFrameworkMonitor` 是 MoLibrary.Framework 的核心监控模块，它提供了强大的项目分析和架构治理能力。通过自动识别项目单元、提供丰富的查询 API、支持动态配置等功能，该模块为开发团队提供了：

- **全面的项目架构视图**
- **便捷的调试和测试工具**
- **灵活的运行时配置能力**
- **强大的架构治理支持**

合理使用该模块可以显著提高开发效率，确保项目架构的一致性和可维护性。