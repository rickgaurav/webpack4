import React, { Component } from 'react';
import styles from './Footer.less';

export default class FooterComp extends Component {
  render() {
    return (
      <div className={styles.container}>
        Copyright 2019
      </div>
    );
  }
}
