import React from 'react';
import styles from './Loading.less'

export default function Loading(props) {

  return (
    <div className={styles.container}>
      <div className='overlay'>
        LOADING...
      </div>
      <div className='loading'>
      </div>
    </div>
  );
};