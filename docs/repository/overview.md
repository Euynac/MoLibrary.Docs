---
sidebar_position: 1
---

# 仓储模式概述

MoLibrary.Repository 模块提供了对仓储模式的实现，帮助您轻松构建数据访问层，并将领域模型与数据持久化逻辑分离。

## 什么是仓储模式

仓储模式是一种用于隔离应用程序与数据存储交互细节的设计模式。它提供了一个简单、一致的接口来访问数据，同时隐藏了数据访问的复杂性。

主要优势包括：

- **关注点分离** - 将数据访问逻辑与业务逻辑分离
- **可测试性** - 便于单元测试，可轻松模拟仓储行为
- **灵活性** - 可以更换底层数据访问技术而不影响业务逻辑

## 核心接口

MoLibrary 提供了一系列通用的仓储接口：

```csharp
/// <summary>
/// 基础仓储接口
/// </summary>
public interface IRepository<TEntity, TKey> where TEntity : class, IEntity<TKey>
{
    Task<TEntity> GetByIdAsync(TKey id);
    Task<IReadOnlyList<TEntity>> GetAllAsync();
    Task<TEntity> AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
    Task<bool> ExistsAsync(TKey id);
}
```

## EF Core 实现

MoLibrary 提供了 Entity Framework Core 的仓储实现：

```csharp
/// <summary>
/// 使用 Entity Framework Core 的仓储实现
/// </summary>
public class EfCoreRepository<TEntity, TKey> : IRepository<TEntity, TKey> 
    where TEntity : class, IEntity<TKey>
{
    protected readonly DbContext _dbContext;
    protected readonly DbSet<TEntity> _dbSet;

    public EfCoreRepository(DbContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = dbContext.Set<TEntity>();
    }

    public virtual async Task<TEntity> GetByIdAsync(TKey id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IReadOnlyList<TEntity>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(TEntity entity)
    {
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }

    public virtual async Task<bool> ExistsAsync(TKey id)
    {
        return await _dbSet.AnyAsync(e => e.Id.Equals(id));
    }
}
```

## 使用方式

### 注册服务

```csharp
services.AddMoModuleRepository(options => 
{
    options.UseEfCore<YourDbContext>();
});
```

### 自定义仓储

您可以为特定实体创建自定义仓储接口和实现：

```csharp
// 自定义仓储接口
public interface IProductRepository : IRepository<Product, Guid>
{
    Task<IReadOnlyList<Product>> GetByCategory(string category);
    Task<IReadOnlyList<Product>> GetFeatured();
}

// 自定义仓储实现
public class ProductRepository : EfCoreRepository<Product, Guid>, IProductRepository
{
    public ProductRepository(YourDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyList<Product>> GetByCategory(string category)
    {
        return await _dbSet
            .Where(p => p.Category == category)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Product>> GetFeatured()
    {
        return await _dbSet
            .Where(p => p.IsFeatured)
            .ToListAsync();
    }
}
```

### 在服务中使用仓储

```csharp
public class ProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Product> GetProductByIdAsync(Guid id)
    {
        return await _productRepository.GetByIdAsync(id);
    }

    public async Task<IReadOnlyList<Product>> GetFeaturedProductsAsync()
    {
        return await _productRepository.GetFeatured();
    }
}
```

## 事务管理

MoLibrary.Repository 支持事务管理，可以在单个操作中执行多个仓储操作：

```csharp
using (var transaction = await _unitOfWork.BeginTransactionAsync())
{
    try
    {
        await _orderRepository.AddAsync(order);
        
        foreach (var item in orderItems)
        {
            await _orderItemRepository.AddAsync(item);
        }
        
        await _inventoryRepository.UpdateStockLevels(orderItems);
        
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

## 高级特性

MoLibrary.Repository 还提供了多种高级功能：

1. **规范模式** - 使用规范模式进行复杂查询
2. **多租户支持** - 内置多租户隔离
3. **软删除** - 支持实体软删除
4. **并发控制** - 处理并发更新冲突

## 最佳实践

1. **使仓储关注单一聚合** - 每个仓储应专注于单一实体或聚合
2. **避免在仓储中包含业务逻辑** - 仓储应只负责数据访问
3. **使用规范模式进行复杂查询** - 保持仓储接口简洁
4. **考虑使用只读仓储** - 对于只读操作，创建专用仓储接口 