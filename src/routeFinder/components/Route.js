import React from 'react';
import { Steps } from 'antd';
import styles from './Route.less';
import { isEmpty } from 'lodash';

const Step = Steps.Step;

const getStationIcon = (stationId, stationIdToStationMap, stationNameToStationIdsMap ) => {
  const stationIds = stationNameToStationIdsMap[stationIdToStationMap[stationId].name];
  return stationIds.map(stationId => {
    const station =stationIdToStationMap[stationId];
    return (
      <div className={`line-${station.lineName}`.toLowerCase()}>
        {station.lineName}{station.position}
      </div>
    )
  });

};

const getDescription = (station, nextStation, time, isInterchange) => {
  const nameAndTime = (
    <div>
      <div>
        {station.name}
      </div>
      <div>
        Time: {time} mins
      </div>
    </div>
  );

  return (
    <div>
      {nameAndTime}
      {
        time === 0 && isInterchange && nextStation ?
          <div className='strong'>Board on {nextStation.lineName} line</div> : ''
      }
      {
        time > 0 && nextStation && station.lineName !== nextStation.lineName ?
          <div className='strong'>Change to {nextStation.lineName} Line</div> : ''
      }
    </div>
  );
};

const isInterchangeStation = (stationId, stationIdToStationMap, stationNameToStationIdsMap) => {
  return stationNameToStationIdsMap[stationIdToStationMap[stationId].name].length > 1;
};

const Route = ({ route, stationIdToStationMap, stationNameToStationIdsMap }) => {
  const { time, lineChangesCount, path } = route;
  if(!path || path.length === 0 || isEmpty(stationIdToStationMap) || isEmpty(stationNameToStationIdsMap)) {
    return null;
  }

  let timeTaken = 0;
  const steps = path.map((stationId, index, pathArray) => {
    const station = stationIdToStationMap[stationId];
    const  nextStation = pathArray[index+1] && stationIdToStationMap[pathArray[index+1]];
    const isInterchange = isInterchangeStation(stationId, stationIdToStationMap, stationNameToStationIdsMap);
    const title = getStationIcon(stationId, stationIdToStationMap, stationNameToStationIdsMap);

    const step =  (
      <Step key={stationId}
            status='wait'
            title={title}
            description={getDescription(station, nextStation, timeTaken, isInterchange)}
            className={`next-line-${nextStation && nextStation.lineName.toLowerCase()}-color line-${station.lineName.toLowerCase()}-color`}/>
    );

    timeTaken = ((nextStation && nextStation.lineName) !== station.lineName) && index > 0 ? timeTaken + 4: timeTaken + 2;
    return step;
  });


  return (
    <div className={styles.container}>
        <div className='route-header'>
          <div>
            Total Time Taken: {time} minutes
          </div>
          <div>
            Number of Transfers to Destination: {lineChangesCount}
          </div>
        </div>
        <Steps size="small"
               labelPlacement='vertical'>
          {steps}
        </Steps>
    </div>
  );
};

export default Route;