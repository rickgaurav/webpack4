import React from 'react';
import Route from "./Route.js";
import styles from './RouteResults.less';
import { Collapse } from 'antd';

const Panel = Collapse.Panel;

const RouteResults = props => {
  // const route1 ={
  //   // path: [76, 181, 1, 114, 131, 31, 58, 201, 245]
  //   // path: [180, 237, 222, 242, 12, 118, 76, 181, 1, 114, 131, 31, 58, 201, 245]
  //   path: [180, 237, 240, 14, 13, 113, 265, 140, 236, 7, 219, 137, 20, 151, 42, 25, 83, 99, 40, 72, 60, 106, 52, 130, 22, 3, 111]
  // };

  const route = props.allRoutes[0] || {};

  return (
    <div className={styles.container}>

      <Collapse accordion>
        <Panel header="Direct Route (No Line Changes)" className='result-panel' key="1">
          <p>{text}</p>
        </Panel>
        <Panel header="Quickest Route(Minimum Time)" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="Non Direct Shortest Route" key="3">
          <p>{text}</p>
        </Panel>
        <Panel header="Next 3 Quickest routes">

        </Panel>
        <Panel header="Next 3 Routes with minimum transfers">

        </Panel>
      </Collapse>,
    </div>
  );
};

export default RouteResults;