import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '模块化设计',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        每个组件都是独立的，您可以只使用所需的模块，无需引入整个框架。
        MoLibrary采用统一的注册和配置模式，让您的开发体验更加一致。
      </>
    ),
  },
  {
    title: '高性能实现',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        经过优化的性能实现，所有模块都关注于提高应用程序效率。
        自动中间件注册、防止重复注册、及时释放临时对象，减少资源占用。
      </>
    ),
  },
  {
    title: '.NET 原生体验',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        充分利用C#类型系统，提供强类型支持。详细的文档和示例代码，
        帮助您快速上手并构建高质量的应用程序。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
