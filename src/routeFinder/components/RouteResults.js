import React from 'react';
import Route from "./Route.js";
import styles from './RouteResults.less';

const RouteResults = ({timeSortedRoutes, transferSortedRoutes, stationIdToStationMap, stationNameToStationIdsMap}) => {
  const renderRoutes = (routes, header, error) => {
    return (
      <div>
        <div className='routes-group-header'>
          {header}
        </div>
        {
          routes.length ?
            routes.map(
              route => {
                const routeProps = {
                  route,
                  stationIdToStationMap,
                  stationNameToStationIdsMap
                };
                return <Route {...routeProps}/>
              }) :
            <div className='error'>
              {error}
            </div>
        }
      </div>
    );
  };

  if(!timeSortedRoutes.length && !transferSortedRoutes.length) {
    return (
      <div className={`${styles.container}`} key='time'>
        <div className='error'>
          No Routes exist for the selected filters. Please increase the time and max stations count.
        </div>
      </div>
    );
  }

  return (
      [<div className={styles.container} key='time'>
        {renderRoutes(timeSortedRoutes, 'Routes sorted by Time Taken')}
      </div>,
      <div className={styles.container} key='transfers'>
        {renderRoutes(transferSortedRoutes, 'Routes sorted by Number of Transfers')}
      </div>]

  );
};

export default RouteResults;