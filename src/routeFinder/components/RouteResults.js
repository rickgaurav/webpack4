import React from 'react';
import Route from "./Route.js";
import styles from './RouteResults.less';

const RouteResults = props => {
  const route ={
    // path: [76, 181, 1, 114, 131, 31, 58, 201, 245]
    // path: [180, 237, 222, 242, 12, 118, 76, 181, 1, 114, 131, 31, 58, 201, 245]
    path: [180, 237, 240, 14, 13, 113, 265, 140, 236, 7, 219, 137, 20, 151, 42, 25, 83, 99, 40, 72, 60, 106, 52, 130, 22, 3, 111]
  };
  return (
    <div className={styles.container}>
      <Route route={route} {...props}/>
    </div>
  );
};

export default RouteResults;