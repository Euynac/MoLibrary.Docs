# 简介

SignalR是微软团队对WebSocket等支持服务端与客户端进行双向通信的协议进行封装的库，该模块针对SignalR的使用进行了进一步的封装。支持以下功能：
1. 强类型的使用方式
2. 集成SignalR的Swagger接口文档生成
3. 提供开箱即用的WebSocket调试界面
4. 提供开箱即用的基于用户推送的接口

## 术语

### Hub
SignalR实现了一种RPC机制，其中消息格式参考如下：
`{"arguments":["arg0","arg1"],"invocationId":"2","target":"ReceiveTestMessage","type":1}`

因此我们可以定义一种该连接支持的方法集，称为`Hub`。

# 使用方式

注意到注册接口：
```cs
public static void AddMoSignalR<TIHubOperator, THubOperator, TIContract, TIUser>(this IServiceCollection services)
    where THubOperator : class, IMoHubOperator<TIContract, TIUser>, TIHubOperator
    where TIHubOperator : class, IMoHubOperator<TIContract, TIUser>
    where TIContract : IMoHubContract
    where TIUser : IMoCurrentUser
    
public static void MapMoHub<THubServer>(this IEndpointRouteBuilder endpoints,
     [StringSyntax("Route")] string pattern, Action<MoHubOptions>? optionAction = null) where THubServer : Hub

```

以下分别解释所需的泛型类型作用


## TIHubOperator

该类型用于业务代码中使用Hub向客户端推送消息

定义方式：
```cs
public interface IMyHubOperator : IMoHubOperator<IMyContract, IMyCurrentUser>
{
}
```

使用方式：
```cs
public class DomainEventHandlerForceUserLogout(IMyHubOperator hub)
    : MoDomainEventHandler<DomainEventHandlerForceUserLogout, EventForceUserLogout>
{
    public override async Task HandleEventAsync(EventForceUserLogout eto)
    {
        var dict = hub.GetConnectionInfos().Where(p => p.ConnectionTime < eto.TriggerTime && p.ClaimsPrincipal.AsCurrentUser().Username == eto.Username)
            .Select(p => p.ClaimsPrincipal.AsCurrentUser()).ToList();
        if (dict.Count <= 0) return;
        await hub.Users(dict).ClientReceiveForceUserLogout(eto.Reason);
    }
}
```

## THubOperator

`TIHubOperator`的实现类型，用于服务注册。 

## TIContract
定义RPC支持的方法集，建议命名进行客户端侧及服务端侧方法的区分，建议命名开头`ClientReceive`及`ClientSend`。

## THubServer

指示当前Hub定义，以及作为服务端对于客户端的方法执行请求的处理入口。另外也是Swagger生成文档的来源。

## TIUser

用于通过`Claim`获取当前连接用户信息的接口，可直接使用`IMoCurrentUser`


# 其他功能介绍

## Swagger文档生成

```cs

//如果客户端通过websocket调用，则会进入此方法
[SignalRHub("/signalr", tag: "SignalR接口", description: "仅做展示用，无法直接通过接口调用。路由/Debug中有测试SignalR功能。")]
public class UnifiedHub(IMoSignalRConnectionManager connectionManager)
    : MoHubServer<IUnifiedContract>(connectionManager), IUnifiedContract
{
    [SignalRMethod(description: "接收航班更新", summary: "接收航班更新")]
    public async Task ClientReceiveFlightUpdate(DtoFlightListData flight, bool isNew, bool isDelete, int filterVersion)
    {
        throw new NotImplementedException();
    }

    [SignalRMethod(description: "客户端设置航班筛选条件", summary: "客户端设置航班筛选条件")]
    public async Task ClientSendSetFlightCustomFilter(int version, QueryGetFlightList filter)
    {
        var info = connectionManager.GetConnectionInfo(Context.ConnectionId);
        info?.SaveState(new StateClientSetFlightCustomFilter
        {
            CustomFilter = filter,
            Version = version
        });
    }
}

```
