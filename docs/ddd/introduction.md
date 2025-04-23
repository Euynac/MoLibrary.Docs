---
sidebar_position: 1
---

# 领域驱动设计简介

MoLibrary.DomainDrivenDesign 模块提供了一套完整的领域驱动设计 (DDD) 实现，帮助您构建清晰、可维护的业务领域模型。

## 什么是领域驱动设计

领域驱动设计是一种软件开发方法，它将复杂的业务需求转化为可管理的软件模型。DDD 强调：

- 围绕业务领域概念进行设计
- 与领域专家紧密合作
- 创建反映业务现实的模型
- 使用通用语言沟通业务概念

## 核心概念

### 实体与值对象

```csharp
// 实体示例
public class Order : Entity<OrderId>
{
    public CustomerId CustomerId { get; private set; }
    public Money TotalAmount { get; private set; }
    public OrderStatus Status { get; private set; }
    
    // 构造函数、方法等
}

// 值对象示例
public class Money : ValueObject
{
    public decimal Amount { get; }
    public string Currency { get; }
    
    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }
    
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }
}
```

### 聚合与聚合根

```csharp
public class Order : AggregateRoot<OrderId>
{
    private readonly List<OrderLine> _orderLines = new();
    public IReadOnlyCollection<OrderLine> OrderLines => _orderLines.AsReadOnly();
    
    // 添加订单行项目
    public void AddOrderLine(Product product, int quantity)
    {
        var orderLine = new OrderLine(OrderId, product.Id, product.Price, quantity);
        _orderLines.Add(orderLine);
        // 应用领域事件
        AddDomainEvent(new OrderLineAddedEvent(this, orderLine));
    }
}
```

### 领域事件

```csharp
public class OrderPlacedEvent : DomainEvent
{
    public Order Order { get; }
    
    public OrderPlacedEvent(Order order)
    {
        Order = order;
    }
}
```

### 仓储

```csharp
public interface IOrderRepository : IRepository<Order, OrderId>
{
    Task<Order> FindByCustomerAsync(CustomerId customerId);
    Task<IEnumerable<Order>> FindCompletedOrdersAsync();
}
```

## 使用方式

使用 MoLibrary.DomainDrivenDesign 模块：

```csharp
// 在服务配置中添加 DDD 模块
services.AddMoModuleDomainDrivenDesign(options =>
{
    // 配置选项
});
```

## 最佳实践

1. **保持聚合小而内聚** - 每个聚合应该专注于单一职责
2. **通过 ID 引用其他聚合** - 避免直接对象引用导致的复杂依赖
3. **使用领域事件进行聚合间通信** - 松耦合的事件驱动方式
4. **聚合根控制所有状态变化** - 确保业务规则的一致性

## 下一步

请查看详细的 API 文档和示例代码，了解如何在您的项目中应用领域驱动设计。 