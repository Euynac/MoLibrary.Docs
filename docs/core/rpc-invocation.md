---
sidebar_position: 2
---

# 服务间调用

MoLibrary 提供了简便的服务间调用机制，支持 HTTP 和 gRPC 两种方式进行服务通信，并提供了代码生成工具简化开发流程。

## 服务配置

服务间调用需要在配置文件中定义各个服务：

```json
{
  "Services": {
    "FlightService.API": {
      "AppId": "service-flight-api"
    },
    "FlightService.ActorHost": {
      "AppId": "service-flight-actorhost"
    },
    "MessageService.API": {
      "AppId": "service-message-api"
    }
  }
}
```

## HTTP 服务端实现

在实现 HTTP 服务端时，需要注意 `[Get]` 方法中的请求 DTO 参数必须添加 `[FromQuery]` 特性，否则会被认为有 `Body` 而导致调用失败。

## 自动代码生成

MoLibrary 提供了通过请求类生成 RPC 客户端代码的功能。如果当前项目已存在对应的 Handler，则系统会仅生成 RPC 实现及其本地调用实现。

### 请求定义示例

```csharp
/// <summary>
/// 用户登录指令
/// </summary>
[Route("api/v1/user")]
[HttpPost("login")]
public record CommandLogin : IMoRequest<ResponseLogin>
{
    /// <summary>
    /// 用户名
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// 密码
    /// </summary>
    public string Password { get; set; } = string.Empty;
}
```

### 服务端实现

#### HTTP 实现

```csharp
[Route("api/v1/user")]
[ApiController]
public class HttpServerImplCommandUser(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// 用户登录指令
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType((int) HttpStatusCode.Accepted)]
    [ProducesResponseType((int) HttpStatusCode.BadRequest)]
    [ProducesResponseType(typeof(Res<ResponseLogin>), (int) HttpStatusCode.OK)]
    public async Task<ActionResult> Login(
        [FromBody] CommandLogin dto)
    {
        return await mediator.Send(dto).GetResponse(this);
    }
}
```

#### RPC 实现

下面的实现也可用于同领域应用服务调用：

```csharp
public class GrpcServerImplCommandUser(IMediator mediator) : ICommandUser
{
    public async Task<Res<ResponseLogin>> Login(CommandLogin req)
    {
        return await _mediator.Send(query);
    }
}
```

## 客户端调用

客户端调用方式取决于您选择的通信协议(HTTP 或 gRPC)，系统会自动生成对应的客户端代码供您使用。 