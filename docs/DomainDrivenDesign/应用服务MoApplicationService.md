# 应用服务MoApplicationService


## 应用服务

[应用服务](领域驱动设计简介#应用服务)简单来说就是接口API，属于子域的边界，对外暴露的功能。

### CQRS模式接口

CQRS (Command Query Responsibility Segregation) 命令查询职责隔离，简单来说就是读写分离。
由**请求类**、**响应类**和**Handler**组成。


#### 请求类与响应类

- 请求类需实现`IMoRequest<TResponse>`，并建议按照`Command$BusinessFunctionName$`或`Query$BusinessFunctionName$`格式命名。
- 响应类应按照`Response$BusinessFunctionName$`格式命名。

#### Handler处理程序类
采用中介者模式，通过请求类获取相应的相应类实现。

- 处理程序类名称建议以`CommandHandler`或`QueryHandler`开头。
- 处理程序类应包含类似`[Route("api/v1/$DomainName$")]`的`Route`特性。
- 处理程序类必须重写`Handle`方法并包含`[HttpPost("$APIRoute$")]`特性。

1. 含响应类的带有应用服务采用该基类`MoApplicationService<TSelfHandler, TRequest, TResponse>`
2. 简单响应类的（即仅需返回OK或Failed类型的）应用服务采用该基类`MoApplicationService<TSelfHandler, TRequest>`，请求类需转为实现`IMoRequest`
3. 如不想使用统一响应模型，或响应类型比较特殊，如文件类型等，可使用`MoCustomApplicationService<TSelfHandler, TRequest, TResponse>`基类，请求类许转为实现`IMoCustomRequest`


#### 示例

```cs
/// <summary>
/// 业务功能描述
/// </summary>
public record Command$BusinessFunctionName$  : IMoRequest<Response$BusinessFunctionName$>
{
    
}

/// <summary>
/// <inheritdoc cref="Command$BusinessFunctionName$"/> 接口响应
/// </summary>
public record Response$BusinessFunctionName$
{

}
/// <summary>
/// <inheritdoc cref="Command$BusinessFunctionName$"/> 请求处理
/// </summary>
[Route("api/v1/$DomainName$")]
public class CommandHandler$BusinessFunctionName$ : MoApplicationService<CommandHandler$BusinessFunctionName$, Command$BusinessFunctionName$, Response$BusinessFunctionName$> 
{
    [HttpPost("$APIRoute$")]
    public override Task<Res<Response$BusinessFunctionName$>> Handle(Command$BusinessFunctionName$ request, CancellationToken cancellationToken)
    {
        ...
    }
}
``` 


### CRUD模式自动接口

- CRUD服务为实体提供标准的创建、读取、更新、删除操作。
- CRUD服务必须以`CrudService`为后缀命名（例如，`UserCrudService`），否则不会进行自动注册。（该逻辑可在`MoCrudControllerOption`中的`CrudControllerPostfix`配置）
- CRUD服务应该根据所需功能继承自`MoCrudAppService`基类之一。
- 新的公共方法将根据命名约定自动生成相应的API。应始终使用`Res`或`Res<T>`作为返回类型。

#### 基类泛型参数说明

`MoCrudAppService` 基类提供了多种重载形式，以适应不同的CRUD场景。以下是完整泛型参数的说明：

- **TEntity**: 实体类型，必须实现 `IMoEntity<TKey>` 接口
- **TGetOutputDto**: 获取单个实体时的输出DTO类型，必须实现 `IMoEntityDto<TKey>` 接口
- **TGetListOutputDto**: 获取实体列表时的输出DTO类型，必须实现 `IMoEntityDto<TKey>` 接口
- **TKey**: 实体主键类型
- **TGetListInput**: 获取实体列表时的输入参数类型
- **TCreateInput**: 创建实体时的输入参数类型
- **TUpdateInput**: 更新实体时的输入参数类型
- **TBulkDeleteInput**: 批量删除实体时的输入参数类型
- **TRepository**: 实体仓储类型，必须实现 `IMoRepository<TEntity, TKey>` 接口

#### 基类重载形式

`MoCrudAppService` 提供了多种重载形式，以简化不同场景下的使用，具体可通过IDE提示尝试选择。

1. **基础形式** - 完整参数版本：
   ```csharp
   MoCrudAppService<TEntity, TGetOutputDto, TGetListOutputDto, TKey, TGetListInput, TCreateInput, TUpdateInput, TBulkDeleteInput, TRepository>
   ```

2. **简化形式** - 列表输出与单个输出DTO相同：
   ```csharp
   MoCrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TCreateInput, TUpdateInput, TRepository>
   ```

3. **简化形式** - 使用默认分页请求：
   ```csharp
   MoCrudAppService<TEntity, TEntityDto, TKey, TCreateInput, TUpdateInput, TRepository>
   ```

4. **只读形式** - 禁用修改与增加功能：
   ```csharp
   MoCrudAppService<TEntity, TEntityDto, TKey, TGetListInput, TRepository>
   ```

#### 路由生成规则

子类必须以设定的 `MoCrudControllerOption.CrudControllerPostfix` 结尾（默认为"CrudService"），否则无法自动注册。类名的其余部分会自动生成为一部分路由名，以小写单词短横线隔开。例如：

- `UserListCrudService` 生成路由: `user-list`
- `OrganUnitCrudService` 生成路由: `organ-unit`



#### 常见可重写方法

##### 查询相关可重写方法

- `GetAsync(TKey id)`: 重写以自定义单个实体检索逻辑。
- `GetListAsync(TGetListInput input)`: 重写以自定义实体列表检索逻辑。
- `GetEntityByIdAsync(TKey id)`: 重写以自定义根据ID获取实体的逻辑，包括异常处理。
- `CreateFilteredQueryAsync(TGetListInput input)`: 重写以自定义查询过滤逻辑。
- `ApplyCustomFilterQueryAsync(TGetListInput input, IQueryable<TEntity> query)`: 重写以添加自定义过滤条件。
- `ApplyCustomFilterQueryClientSideAsync(TGetListInput input)`: 重写以添加客户端侧过滤条件。
- `ApplyCustomActionToResponseListAsync(List<TGetListOutputDto> entities)`: 重写以对响应列表进行自定义处理。
- `ApplyListInclude(IQueryable<TEntity> queryable)`: 重写以在列表查询中包含关联实体。
- `ApplyInclude(IQueryable<TEntity> queryable)`: 重写以在单个实体查询中包含关联实体。
- `WithDetail()`: 重写以决定是否使用仓储层的WithDetail方法加载关联实体。

##### 创建/更新/删除相关可重写方法

- `CreateAsync(TCreateInput input)`: 重写以自定义实体创建逻辑。
- `UpdateAsync(TKey id, TUpdateInput input)`: 重写以自定义实体更新逻辑。
- `DeleteAsync(TKey id)`: 重写以自定义实体删除逻辑。
- `DeleteByIdAsync(TKey id)`: 重写以自定义实体删除的具体实现。

##### 映射相关可重写方法

- `MapToGetOutputDtoAsync(TEntity entity)`: 重写以自定义实体到DTO的异步映射。
- `MapToGetOutputDto(TEntity entity)`: 重写以自定义实体到单个输出DTO的映射。
- `MapToGetListOutputDtosAsync(List<TEntity> entities)`: 重写以自定义实体列表到DTO列表的异步映射。
- `MapToGetListOutputDto(TEntity entity)`: 重写以自定义实体到列表输出DTO的映射。
- `MapToEntity(TCreateInput createInput)`: 重写以自定义创建输入到实体的映射。
- `MapToEntity(TUpdateInput updateInput, TEntity entity)`: 重写以自定义更新输入到实体的映射。

##### 排序和分页相关可重写方法

- `ApplySorting(IQueryable<TEntity> query, TGetListInput input)`: 重写以自定义排序逻辑。
- `ApplyDefaultSorting(IQueryable<TEntity> query)`: 重写以自定义默认排序逻辑。
- `ApplyPaging(IQueryable query, TGetListInput input)`: 重写以自定义分页逻辑。

##### 响应消息相关可重写属性和方法

- `EntityName`: 重写以为响应消息提供自定义实体名称。
- `ResEntityNotFound(string id)`: 重写以自定义实体未找到的响应消息。
- `ResEntityUpdateSuccess(string entityId)`: 重写以自定义实体更新成功的响应消息。
- `ResEntityUpdateFailed(string entityId)`: 重写以自定义实体更新失败的响应消息。
- `ResEntityCreateSuccess(TGetOutputDto dto)`: 重写以自定义实体创建成功的响应消息。
- `ResEntityCreateSuccess(string entityId)`: 重写以自定义实体创建成功的响应消息（重载版本）。
- `ResEntityCreateFailed()`: 重写以自定义实体创建失败的响应消息。
- `ResEntityDeleteSuccess(string id)`: 重写以自定义实体删除成功的响应消息。
- `ResEntityDeleteFailed()`: 重写以自定义实体删除失败的响应消息。

#### OverrideService特性

当需要自定义CRUD的增删改查接口服务的返回值时（因为默认的`override`关键字重写方式不支持更改返回值方法签名），可使用`[OverrideService(int order = 0)]`特性对CRUD接口服务进行重写。其中`order`为重写基类的顺序，越大优先级越高，即相同方法签名时，优先级高的作为接口进行生成。

示例：

```cs
[OverrideService]
public new async Task<Res<ResponseMyNewDto>> CreateAsync(TCreateInput dto)
{
    // 自定义逻辑
    return Res.Ok();
}
```

#### 特性

- 使用`[Tags("实体描述")]`特性对CRUD服务进行分类。

#### 示例

下面示例除了自动生成了增删改的接口外，额外新增了一个`POST`方法的接口，具体路由根据规约生成。规约借鉴至ABP框架，详见[Auto API Controllers | ABP.IO Documentation](https://abp.io/docs/latest/framework/api-development/auto-controllers)

```cs

[Tags("组织单位(OrganUnit)")]
public class OrganUnitAppService(IRepositoryOrganUnit repository, DomainOrganUnitManager manager, IRepositoryUser userRepo) :
    MoCrudAppService<OrganUnit, DtoOrganUnit, long, CommandCreateOrganUnit, CommandUpdateOrganUnit,
        IRepositoryOrganUnit>(repository)
{
    protected override string? EntityName => "组织单位";

    public class UpdateMembersRequest
    {
        /// <summary>
        /// 用户Id列表
        /// </summary>
        public required List<Guid> Users { get; set; }
        /// <summary>
        /// 组织单位Id，为空代表移除用户组织单位
        /// </summary>
        public long? Id { get; set; }
    }

    /// <summary>
    /// 批量修改给定用户组织单位
    /// </summary>
    public async Task<Res> UpdateMembersAsync(UpdateMembersRequest request)
    {
        var id = request.Id;
        var members = request.Users;
        if (id != null)
        {
            var unit = await repository.GetAsync(true, id.Value);
            if (unit == null) return ResEntityNotFound(id.Value.ToString());
            var users = await (await userRepo.WithDetailsAsync(p=>p.OrganUnit!)).Where(p => members.Contains(p.Id)).ToListAsync();
            foreach (var user in users)
            {
                user.OrganUnit = unit;
            }

            await userRepo.UpdateManyAsync(users);
            return Res.Ok($"已将{users.Count}个用户加入组织单位");
        }
        else
        {
            var users = await (await userRepo.WithDetailsAsync(p => p.OrganUnit!)).Where(p => members.Contains(p.Id) && p.OrganUnit != null).ToListAsync(); 
            foreach (var user in users)
            {
                user.OrganUnit = null;
            }

            await userRepo.UpdateManyAsync(users);
            return Res.Ok($"已将{users.Count}个用户移除组织单位");
        }
      
    }
}
``` 
