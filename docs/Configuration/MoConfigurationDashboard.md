# Dashboard



## 解析
  1. 离线和在线参数指的是是否需要重启服务，而不是配置是否生效的意思。
  2. 配置是有层级关系的，不管是通过DashboardUI获取的还是ClientUI获取的配置列表，均是`List<DtoDomainConfigs>`。基于领域驱动设计，将微服务按子域分组，分组后的是DtoDomainConfigs，每个组有多个微服务的相关配置，也就是DtoServiceConfigs。微服务内可以有多个配置类，也就是DtoConfig。配置类中可以有多个配置项，也就是DtoOptionItem的信息
  3. 配置修改，可以基于单独的配置项修改或者按照配置类进行修改，其中修改的appid，值位于DtoServiceConfigs。修改的Key，根据项或类取于DtoOptionItem或DtoConfig中的Key。
  4. 注意根据EOptionItemValueBasicType以及EOptionItemValueSpecialType来选取配置修改所需的组件，因为配置修改都是基于Json序列化方式进行的，因此无需判断托管类型，而是根据EOptionItemValueBasicType中有哪些类型来选取。EOptionItemValueSpecialType是指诸如`List<string>`，这种类型。那么SpecialType就是Array，BasicType就是string，需要使用可添加及修改的列表组件，子组件是能够编辑string的。如果是Dict，需要可以新增项、编辑key的组件。
  5. 如果BasicType是Object，证明OptionItem中嵌套定义一个子配置类，因此该情况会有SubStructure类型（当前仅支持一层嵌套）因此，如果BasicType是Object，则需要通过SubStrcture的类型去嵌套展示子配置类。

