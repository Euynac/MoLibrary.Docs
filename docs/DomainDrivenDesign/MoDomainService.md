# 领域服务MoDomainService

## 领域服务

[领域服务](DDDIntroduction.md#领域服务)是领域内的核心业务逻辑服务。

- 领域服务类必须继承自`MoDomainService<TSelfDomainService>`。
- 类名建议以`Domain`开头。

### 领域服务方法

- 领域服务方法应该有描述性命名，反映它们所封装的业务逻辑。
- 执行可能有错误消息的异步操作的方法应返回`Task<Res>`或`Task<Res<T>>`，而同步操作应返回`Res`或`Res<T>`。
- 领域服务应独立于应用层封装业务逻辑。 
