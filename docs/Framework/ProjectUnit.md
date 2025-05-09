# 项目单元ProjectUnit



## 反射性能与命名判断

实际上反射性能远超命名规范判断。
- **`Type.IsSubclassOf`**
    
    - 在 .NET Framework 4.6 以前，它会沿着类型的 `BaseType` 链向上遍历，最坏情况需要走完整个继承链；这个链通常很短（几级到十几级），而且完全在托管堆栈上操作，几乎没有分配开销。​[Stack Overflow](https://stackoverflow.com/questions/48866564/is-type-issubclassoftype-othertype-cached-or-do-i-have-to-do-that-myself?utm_source=chatgpt.com)
        
    - 在 .NET Core / .NET 5+ 中，Runtime 对此做了多轮优化，底层有更多的本地代码加速，某些版本还引入了缓存或更快的本地实现，使得调用成本进一步下降。
        
- **`Type.Name.EndsWith("AppService")`**
    
    - `Type.Name` 本身是一个元数据中的常量字符串引用（不会每次都重新分配），但对它做 `EndsWith` 调用时，CLR 会将后缀参数和目标字符串逐字符比较，复杂度是 _O(m)_，m 为后缀长度；如果你用的多个后缀组合判断（如 `"A".EndsWith("X") || ...`），还会有额外的循环和短路判断开销。​[Stack Overflow](https://stackoverflow.com/questions/37338620/which-one-is-faster-regex-or-endswith?utm_source=chatgpt.com)
        
    - 如果字符串很短（比如 `"AppService"` 只有 10 个字符），单次开销也就在几十纳秒量级，但如果热路径下调用千万级别，累加起来就可能明显慢于反射检测。

```cs
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using System;

[MemoryDiagnoser]
public class TypeCheckBenchmark
{
    private readonly Type t = typeof(TestChildClassAppService);

    [Benchmark(Baseline = true)]
    public bool ReflectionCheck() 
        => t.IsSubclassOf(typeof(AppServiceBase));

    [Benchmark]
    public bool NameCheck() 
        => t.Name.EndsWith("AppService");
}

public class AppServiceBase { }

public class TestChildClassAppService : AppServiceBase { }

public class Program
{
    public static void Main(string[] args)
        => BenchmarkRunner.Run<TypeCheckBenchmark>();
}
```

> 实测反射判断是否有泛型接口实现、是否继承某基类、是否实现某接口等，发现反射要快10-50倍左右。
