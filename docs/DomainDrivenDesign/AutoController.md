# AutoController



## Convention

### CQRS模式接口惯例

基本路由规则：`api/v1/{DomainName(PascalCase)}/{method-name(KebabCase)}`

如果接口方法未定义 `HttpGet` 等特性，则根据请求类自动转换方法名为方法路由：
如 `QueryGetUserName`，将会移除 `Query` 以及 `Get`，并变换 `UserName` 为 `user-name`。

`Query` 请求默认使用 `Get` 方法， `Command` 请求默认使用 `Post` 方法。 



### 客户端API生成

根据

```cs 
public class CommandHandlerMessageReceive : OurApplicationService<CommandHandlerMessageReceive, CommandMessageReceive, Res<ResponseMessageReceive>>  
{  
    [HttpPost("in-messages")]  
    public override async Task<Res<ResponseMessageReceive>> Handle(CommandMessageReceive request,  
        CancellationToken cancellationToken)  
    {        
       
    }
}
```

生成接口：

```cs
[ServiceContract]
public interface ICommandMessage : IMoRpcApi  
{  
    /// <summary>  
    /// <inheritdoc cref="CommandMessageReceive"/>
	/// </summary>  
    [OperationContract]
    [MustUseReturnValue]  
    public Task<Res<ResponseMessageReceive>> MessageReceive(CommandMessageReceive req);
}
```

以及HTTP实现（后续要支持生成gRPC实现）：

```cs
  
public class CommandMessageHttpApi(HttpClient httpClient, IMoServiceProvider provider) : OurHttpApi(provider, httpClient), ICommandMessage  
{  
    public async Task<Res<ResponseMessageReceive>> ReceiveMessage(CommandMessageReceive commandMessage)  
    {       
	    return await _httpClient.PostAsJsonAsync("api/v1/Message/in-messages", commandMessage).GetResponse<Res<ResponseMessageReceive>>();  
    }
}

```


