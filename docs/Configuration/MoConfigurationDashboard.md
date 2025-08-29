# Dashboard

## 概述

配置管理系统基于领域驱动设计（DDD），采用分层架构来管理微服务配置。系统支持通过Dashboard UI和Client UI两种方式进行配置管理。

> **重要说明**：离线和在线参数指的是是否需要重启服务，而不是配置是否生效的意思。

## 数据结构层级

配置数据采用四层结构，从上到下分别为：

```
DtoDomainConfigs (子域配置组)
  └── DtoServiceConfigs (微服务配置组)
        └── DtoConfig (配置类)
              └── DtoOptionItem (配置项)
```

### 1. DtoDomainConfigs - 子域配置组

按照领域驱动设计，将微服务按子域进行分组。

```csharp
public class DtoDomainConfigs
{
    /// <summary>
    /// 显示标题
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 子域名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 子域内微服务信息
    /// </summary>
    public List<DtoServiceConfigs> Children { get; set; } = [];
}
```

### 2. DtoServiceConfigs - 微服务配置组

每个子域包含多个微服务的配置信息。

```csharp
public class DtoServiceConfigs
{
    /// <summary>
    /// 显示标题
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 微服务名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// AppID（配置修改时的必要标识）
    /// </summary>
    public string AppId { get; set; }

    /// <summary>
    /// 微服务内配置类
    /// </summary>
    public List<DtoConfig> Children { get; set; } = [];
}
```

### 3. DtoConfig - 配置类

每个微服务包含多个配置类。

```csharp
public class DtoConfig
{
    /// <summary>
    /// 显示标题
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 配置类名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 配置参数类别
    /// </summary>
    public string? Type { get; set; }

    /// <summary>
    /// 配置类描述
    /// </summary>
    public string? Desc { get; set; }

    /// <summary>
    /// 配置类相关APPID
    /// </summary>
    public string? AppId { get; set; }

    /// <summary>
    /// 配置项
    /// </summary>
    public List<DtoOptionItem> Items { get; set; }

    #region 审计字段
    /// <summary>
    /// 版本号
    /// </summary>
    public string? Version { get; set; }

    /// <summary>
    /// 配置获取时间
    /// </summary>
    public DateTime FetchTime { get; } = DateTime.Now;
    
    /// <summary>
    /// 配置上一次更新时间
    /// </summary>
    public DateTime? LastModificationTime { get; set; }
    
    /// <summary>
    /// 配置上一次更新来源人ID
    /// </summary>
    public string? LastModifierId { get; set; }
    
    /// <summary>
    /// 配置上一次更新来源人名
    /// </summary>
    public string? Username { get; set; }
    #endregion
}
```

### 4. DtoOptionItem - 配置项

配置类的最小单元，包含具体的配置值和元数据。

```csharp
public class DtoOptionItem
{
    /// <summary>
    /// 显示标题
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 配置项名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 配置项Key，用此来进行配置项修改
    /// </summary>
    public required string Key { get; set; }

    /// <summary>
    /// 配置项描述
    /// </summary>
    public string? Desc { get; set; }
    
    /// <summary>
    /// 配置项值
    /// </summary>
    [JsonConverter(typeof(PreserveOriginalWithEnumStringConverter))]
    public object? Value { get; set; }

    /// <summary>
    /// 是否是离线参数，是则需要重启微服务才能生效
    /// </summary>
    public bool IsOffline { get; set; }

    /// <summary>
    /// 配置基本类型
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EOptionItemValueBasicType Type { get; set; } = EOptionItemValueBasicType.String;
    
    /// <summary>
    /// 配置特殊类型
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EOptionItemValueSpecialType? SpecialType { get; set; }

    /// <summary>
    /// 正则验证表达式
    /// </summary>
    public string? RegexPattern { get; set; }

    /// <summary>
    /// 指示该配置是可空类型（可传入null）
    /// </summary>
    public bool IsNullable { get; set; }

    /// <summary>
    /// 子配置结构类型（当Type为Object时使用）
    /// </summary>
    public DtoConfig? SubStructure { get; set; }

    /// <summary>
    /// 配置Provider
    /// </summary>
    public string? Provider { get; set; }
    
    /// <summary>
    /// 配置来源信息
    /// </summary>
    public string? Source { get; set; }
}
```

## 配置类型系统

### 基本类型 (EOptionItemValueBasicType)

```csharp
public enum EOptionItemValueBasicType
{
    None,
    String,      // 字符串类型
    Numeric,     // 数值类型
    DateTime,    // 日期时间类型
    TimeSpan,    // 时间跨度类型
    Boolean,     // 布尔类型
    Enum,        // 枚举类型
    Object       // 对象类型（支持嵌套子结构）
}
```

### 特殊类型 (EOptionItemValueSpecialType)

```csharp
public enum EOptionItemValueSpecialType
{
    None,
    Array,    // 数组类型，如 List<T>
    Dict      // 字典类型，如 Dictionary<TKey, TValue>
}
```

## 配置修改机制

### 1. 配置修改请求结构

```csharp
public class DtoUpdateConfig
{
    /// <summary>
    /// 配置项/配置类所对应AppID
    /// </summary>
    public required string AppId { get; set; }
    
    /// <summary>
    /// 配置项/配置类Key
    /// </summary>
    public required string Key { get; set; }
    
    /// <summary>
    /// 配置项/配置类修改值
    /// </summary>
    public JsonNode? Value { get; set; }
}
```

### 2. 配置修改响应结构

```csharp
public class DtoUpdateConfigRes
{
    /// <summary>
    /// 相应配置项/配置类所对应AppID
    /// </summary>
    public string? AppId { get; set; }
    /// <summary>
    /// 相应配置项/配置类Key
    /// </summary>
    public required string Key { get; set; }
    /// <summary>
    /// 配置类标题
    /// </summary>
    public required string Title { get; set; }
    /// <summary>
    /// 最终配置类/配置项值
    /// </summary>
    public required JsonNode? NewValue { get; set; }
    /// <summary>
    /// 原始配置类/配置项值
    /// </summary>
    public required JsonNode? OldValue { get; set; }
   
}
```

### 3. 修改粒度

- **配置项级别修改**：直接修改单个DtoOptionItem
  - AppId：从DtoServiceConfigs获取
  - Key：从DtoOptionItem获取
  
- **配置类级别修改**：批量修改整个DtoConfig
  - AppId：从DtoServiceConfigs获取
  - Key：从DtoConfig获取

## UI组件选择策略

基于配置项的类型组合，选择对应的编辑组件：

### 1. 基本类型组件映射

| BasicType | SpecialType | 组件类型    | 说明                 |
| --------- | ----------- | ------- | ------------------ |
| String    | None        | 文本输入框   | 支持RegexPattern验证   |
| Numeric   | None        | 数值输入框   | 支持数值范围验证           |
| DateTime  | None        | 日期时间选择器 | -                  |
| TimeSpan  | None        | 时间跨度输入器 | -                  |
| Boolean   | None        | 开关组件    | -                  |
| Enum      | None        | 下拉选择框   | 枚举值选择              |
| Object    | None        | 对象编辑器   | 通过SubStructure嵌套展示 |

> 基本类型组件有两个，一个是ObjectEditor，一个是BasicTypeEditor，ObjectEditor要根据SubStructure来嵌套使用BasicTypeEditor。

### 2. 复合类型组件映射

| BasicType | SpecialType | 组件类型    | 功能说明             |
| --------- | ----------- | ------- | ---------------- |
| Any       | Array       | 列表编辑器   | 支持添加、删除、修改列表项    |
| Any       | Dict        | 键值对编辑器  | 支持添加、删除键值对，编辑键和值 |
> 复合类型的BasicType使用的组件类型复用基本类型组件映射，如果值是Object则使用ObjectEditor，否则使用BasicTypeEditor


### 3. 嵌套对象处理

当`BasicType = Object`时：
- 必须包含`SubStructure`属性
- `SubStructure`是一个完整的`DtoConfig`对象
- UI递归渲染子配置结构
- 当前仅支持一层嵌套

## 配置生效机制

### 在线参数（IsOffline = false）
- 修改后立即生效
- 无需重启服务
- 通过配置热更新机制实现

### 离线参数（IsOffline = true）
- 修改后需要重启服务才能生效
- UI需要明确提示用户
- 可以批量修改后统一重启

## 配置审计

每个配置类（DtoConfig）包含审计信息：
- **Version**：配置版本号
- **FetchTime**：配置获取时间
- **LastModificationTime**：最后修改时间
- **LastModifierId**：最后修改人ID
- **Username**：最后修改人名称

## 数据流程

1. **获取配置列表**
   - 客户端请求 → 返回 `List<DtoDomainConfigs>`
   - 包含完整的四层结构数据

2. **修改配置**
   - 客户端提交 `DtoUpdateConfig`
   - 服务端处理并返回 `DtoUpdateConfigRes`
   - 包含修改前后的值对比

3. **配置验证**
   - 基于 `RegexPattern` 进行格式验证
   - 基于 `IsNullable` 进行空值验证
   - 基于类型信息进行类型验证

## 扩展性考虑

1. **Provider机制**
   - 支持多种配置来源（本地文件、远程服务等）
   - 通过 `Provider` 和 `Source` 字段标识

2. **类型扩展**
   - 可以扩展 `EOptionItemValueBasicType`
   - 可以扩展 `EOptionItemValueSpecialType`
   - UI组件需要相应扩展

3. **嵌套深度**
   - 当前仅支持一层嵌套
   - 未来可以考虑多层嵌套支持