import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '易于使用',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        MoLibrary 被设计为易于上手，能够快速集成到您的项目中，并提供强大的开箱即用功能。
      </>
    ),
  },
  {
    title: '专注核心业务',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        MoLibrary 处理常见的基础架构问题，让您的团队可以专注于核心业务逻辑的开发。
      </>
    ),
  },
  {
    title: '扩展性强',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        MoLibrary 的模块化设计使其具有极强的扩展性，可以根据项目需求轻松定制和扩展。
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
        <h3>{title}</h3>
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