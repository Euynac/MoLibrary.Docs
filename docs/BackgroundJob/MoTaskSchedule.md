# MoTaskSchedule

## 功能

1. Fire and forget task，不过需要带有id
2. Recurring Jobs
3. Delayed Jobs


## 模块划分

### Control Plane 控制平面

#### REST API
- 任务注册检测

> 服务注册中心调用应该增加分布式锁，针对相同appid的，相同路由的方法，不同实例的请求直接拒绝。

批量传入任务唯一标识符，返回有哪些未注册的任务，使用任务注册接口注册。


- 任务注册
批量传入任务定义，注册到注册中心。


- 

##### UI
- 任务列表
- 手动触发任务
- 暂停任务
- 修改任务周期
- 查看任务历史

##### Worker


- 调度器群（可能多个实例，带 leader 选举或分布式协调）：负责解析 Cron/计划、DAG 依赖、计算哪些任务应进入执行队列，并写入元数据/发布消息。
- 编排引擎（可选）：处理任务依赖（DAG）、复杂工作流（fan-in/fan-out）。

### Metadata Store 任务元数据存储

### Message Broker 消息处理

