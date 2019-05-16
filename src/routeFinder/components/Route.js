import React from 'react';

const Route = ({ route, stationIdToStationsMap, stationNameToStationIdsMap }) => {
  const { timeTaken, lineChangesCount, path } = route;

  const directions = [];

  let index = 0;

  while(index < path.length) {

    const stationId = path[index];
    const currentStation = stationIdToStationsMap[stationId];

    if(index === path.length - 1) {
      directions.push(
        <div>
          {currentStation.name} :You have reached your destination
        </div>
      );
      return;
    }

    const nextStation = path[index+1];
    const sameNameStationIds = stationNameToStationIdsMap[stationIdToStationsMap[stationId].name];
    const isInterchangeStation = sameNameStationIds.length > 1;

    if(index === 0) {
      if(isInterchangeStation) {
        directions.push(
          <div>
            ${stationIdToStationsMap[stationId].name} : Board the train on ${nextStation.lineName} Line(Towards ${nextStation.name} station)
          </div>
        );
      } else {
        directions.push(
          <div>
            ${stationIdToStationsMap[stationId].name} : Board the train towards ${nextStation.name} station.
          </div>
        );
      }
    } else {
      if(isInterchangeStation) {
        directions.push(
          <div>
            ${stationIdToStationsMap[stationId].name} : Board the train on ${nextStation.lineName} Line(Towards ${nextStation.name} station)
          </div>
        );
      } else {
        directions.push(
          <div>
            ${stationIdToStationsMap[stationId].name} : Board the train towards ${nextStation.name} station.
          </div>
        );
      }
    }


  }















  path.forEach((stationId, index, pathArray) => {





    if(isInterchangeStation) {
      if(index === 0) {

        return;
      }

      directions.push(

      );
      return;
    }


  });
  return (
    <div>
      asd
    </div>
  );
};