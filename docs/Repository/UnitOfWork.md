# 工作单元(Unit Of Work)

## 简介

工作单元（Unit of Work，简称UOW）是一种设计模式，用于维护一组在事务边界内执行的操作列表。MoLibrary实现了工作单元模式，提供了一种优雅的方式来确保数据库操作的原子性，同时简化了事务管理。

工作单元模式可以帮助我们：
- 将多个数据库操作包装在单个事务中
- 确保数据的一致性
- 简化事务管理的复杂性
- 提高代码的可维护性和可测试性

## 使用方式

目前仓储层需要`IDbContextProvider`来获取与数据库建立的连接对象。

框架提供`UnitOfWorkDbContextProvider`作为提供者，因此如果使用工作单元`Provider`，则仅有在开启工作单元后才可以使用仓储层。

一旦启动一个新的 `UOW`，它会创建一个环境作用域，当前作用域内执行的所有数据库操作都会参与其中，并被视为单个事务边界。这些操作会一起提交（成功时）或回滚（出现异常时）。

常见的使用模式，是在业务请求的入口先开启一个`UOW`，这样内部可以任意的使用仓储层。常见的请求的入口：
1. 后台作业([BackgroundJob](../BackgroundJob/BackgroundJob.md))执行的入口
2. 应用服务([MoApplicationService](../DomainDrivenDesign/MoApplicationService.md))请求入口
3. SignalR([MoSignalR](../SignalR/MoSignalR.md))客户端请求入口
4. 领域事件([ModelEventBus](../EventBus/ModelEventBus.md))处理器入口

在入口开启工作单元后，（TODO 待测试Transient入口是否有问题）


### 获取工作单元

目前支持使用AOP拦截器的自动方式，以及手动注入`IMoUnitOfWorkManager`方式建立工作单元。

#### 自动AOP拦截器


#### 手动 IMoUnitOfWorkManager




## 错误排查

### 并发异常

如出现并发异常或未知错误，如`Sqlite`出现：`SQLite Error 5: 'unable to delete/modify user-function due to active statements'.` 可以检查是否存在异步方法未等待导致并发使用同一个`DbContext`，因为`DbContext`并不是线程安全的，`UnitOfWork`在一个请求`Scope`生命周期内，复用同一个`DbContext`，所以其范围内的仓储层相关异步方法必须`await`。



**以下为AI生成，仅供参考，暂未整理。**



## 核心组件

MoLibrary的工作单元实现包含以下核心组件：

### IMoUnitOfWork

`IMoUnitOfWork`是工作单元的主要接口，定义了工作单元的基本行为：

```csharp
public interface IMoUnitOfWork : IDisposable, IMoServiceProviderAccessor
{
    Guid Id { get; }
    bool IsDisposed { get; }
    Dictionary<string, object> Items { get; }
    bool IsCompleted { get; }
    IMoUnitOfWork? Outer { get; }
    MoUnitOfWorkOptions Options { get; }
    
    void Initialize(MoUnitOfWorkOptions options);
    Task CompleteAsync(CancellationToken cancellationToken = default);
    Task RollbackAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
    
    void AttachDbContext<TDbContext>(TDbContext dbContext) where TDbContext : DbContext;
    TDbContext? TryGetDbContext<TDbContext>() where TDbContext : DbContext;
    
    void OnDisposed(Action handler);
    void OnCompleted(Func<Task> handler);
    void SetOuter(IMoUnitOfWork? outer);
}
```

### IMoUnitOfWorkManager

`IMoUnitOfWorkManager`是管理工作单元的主要服务，用于创建和管理工作单元：

```csharp
public interface IMoUnitOfWorkManager
{
    /// <summary>
    /// 获取当前活动的工作单元（如果有）
    /// </summary>
    IMoUnitOfWork? Current { get; }
    
    /// <summary>
    /// 使用指定选项开始一个新的工作单元
    /// </summary>
    IMoUnitOfWork Begin(MoUnitOfWorkOptions options, bool requiresNew = false);
    
    /// <summary>
    /// 开始一个新的工作单元
    /// </summary>
    IMoUnitOfWork Begin(bool requiresNew = false);
}
```

### MoUnitOfWorkOptions

`MoUnitOfWorkOptions`类用于配置工作单元的行为：

```csharp
public class MoUnitOfWorkOptions
{
    /// <summary>
    /// 是否为事务性工作单元，默认：false
    /// </summary>
    public bool IsTransactional { get; set; }

    /// <summary>
    /// 事务隔离级别
    /// </summary>
    public IsolationLevel? IsolationLevel { get; set; }

    /// <summary>
    /// 超时时间（毫秒）
    /// </summary>
    public int? Timeout { get; set; }
}
```

## 工作单元的使用

### 开始一个新的工作单元

使用`IMoUnitOfWorkManager`的`Begin`方法可以创建一个新的工作单元：

```csharp
public class MyService
{
    private readonly IMoUnitOfWorkManager _unitOfWorkManager;

    public MyService(IMoUnitOfWorkManager unitOfWorkManager)
    {
        _unitOfWorkManager = unitOfWorkManager;
    }
    
    public async Task DoSomethingAsync()
    {
        using (var uow = _unitOfWorkManager.Begin(requiresNew: true, 
            new MoUnitOfWorkOptions { IsTransactional = true }))
        {
            // 执行数据库操作...
            
            // 提交事务
            await uow.CompleteAsync();
        }
    }
}
```

### 嵌套工作单元

工作单元支持嵌套，当在一个工作单元内部创建新的工作单元时，会自动处理嵌套关系：

```csharp
public async Task DoSomethingAsync()
{
    using (var outerUow = _unitOfWorkManager.Begin(true))
    {
        // 外部工作单元操作...
        
        using (var innerUow = _unitOfWorkManager.Begin())
        {
            // 内部工作单元操作...
            // 这将使用外部工作单元的事务
            
            await innerUow.CompleteAsync(); // 内部Complete不会实际提交事务
        }
        
        // 只有当外部工作单元完成时，事务才会被提交
        await outerUow.CompleteAsync();
    }
}
```

### 保存更改

可以使用`SaveChangesAsync`方法在工作单元完成前保存更改：

```csharp
public async Task CreateEntityAsync()
{
    using (var uow = _unitOfWorkManager.Begin(true))
    {
        var entity = new MyEntity { Name = "Test" };
        await _repository.InsertAsync(entity);
        
        // 保存更改以获取自动生成的ID
        await uow.SaveChangesAsync();
        
        // 使用生成的ID
        var id = entity.Id;
        
        // 继续其他操作...
        
        await uow.CompleteAsync();
    }
}
```

### 事务管理

工作单元默认不是事务性的，可以通过设置`IsTransactional`为`true`来使其具有事务性：

```csharp
var options = new MoUnitOfWorkOptions
{
    IsTransactional = true,
    IsolationLevel = IsolationLevel.ReadCommitted,
    Timeout = 30000 // 30秒
};

using (var uow = _unitOfWorkManager.Begin(options))
{
    // 在事务中执行操作...
    await uow.CompleteAsync();
}
```

### 回滚事务

如果需要回滚事务，可以调用`RollbackAsync`方法：

```csharp
using (var uow = _unitOfWorkManager.Begin(
    new MoUnitOfWorkOptions { IsTransactional = true }))
{
    try
    {
        // 尝试执行操作...
        if (somethingWentWrong)
        {
            await uow.RollbackAsync();
            return;
        }
        
        await uow.CompleteAsync();
    }
    catch
    {
        await uow.RollbackAsync();
        throw;
    }
}
```

或者，如果不调用`CompleteAsync`方法，事务会在工作单元被释放时自动回滚。

## 获取当前工作单元

可以通过`IMoUnitOfWorkManager.Current`属性获取当前活动的工作单元：

```csharp
public class MyService
{
    private readonly IMoUnitOfWorkManager _unitOfWorkManager;

    public MyService(IMoUnitOfWorkManager unitOfWorkManager)
    {
        _unitOfWorkManager = unitOfWorkManager;
    }
    
    public async Task DoSomethingAsync()
    {
        var currentUow = _unitOfWorkManager.Current;
        if (currentUow != null)
        {
            // 在现有工作单元中执行操作
            await currentUow.SaveChangesAsync();
        }
        else
        {
            // 没有活动的工作单元，可能需要创建一个
        }
    }
}
```

## 实现细节

MoLibrary的工作单元实现基于异步本地存储（AsyncLocal）来维护当前工作单元的上下文，使其在异步环境下正常工作。工作单元管理器会自动处理嵌套工作单元，确保事务正确传播。

工作单元也支持事件钩子，可以在工作单元完成或释放时执行自定义逻辑：

```csharp
using (var uow = _unitOfWorkManager.Begin())
{
    uow.OnCompleted(async () =>
    {
        // 工作单元成功完成后执行的操作
        await SendEmailAsync();
    });
    
    uow.OnDisposed(() =>
    {
        // 工作单元被释放时执行的操作
        CleanupResources();
    });
    
    // 执行操作...
    await uow.CompleteAsync();
}
```

## 数据库上下文集成

工作单元支持附加和管理多个数据库上下文：

```csharp
public void AttachDbContext<TDbContext>(TDbContext dbContext)
    where TDbContext : DbContext;

public TDbContext? TryGetDbContext<TDbContext>()
    where TDbContext : DbContext;
```

这允许在同一工作单元中管理多个数据库上下文，确保它们在同一事务中操作。


