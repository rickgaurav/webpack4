import stations from '../static/stations.json';

// For performance reasons, both the maps are computed in same function. With increasing number of lines and stations
// the performance can be impacted, hence computed 2 things in one function.

export const getStationLineToStationsAndStationToLinesMap = () => {
  console.log("getStationLineToStationsAndStationToLinesMap");
  let stationLineToStationsMap = {} , stationToLinesMap = {}, stationIdToStationMap = {};
  Object
    .entries(stations)
    .reduce(
      ({stationLineToStationsMap, stationToLinesMap, stationIdToStationMap}, [stationName, linesObject], index) => {
        const station = {
          id: index + 1,
          name: stationName
        };
        const lineNames = [];

        Object
          .entries(linesObject)
          .reduce(
            ({stationLineToStationsMap, stationIdToStationMap}, [lineName, stationPositionsOnLine]) => {
              const stationWithLineName = {
                ...station,
                lineName
              };

              lineNames.push(lineName);

              if(!Array.isArray(stationPositionsOnLine)) {
                stationPositionsOnLine = [stationPositionsOnLine];
              }

              stationPositionsOnLine.forEach(position => {
                const st = {
                  ...stationWithLineName,
                  position
                };

                stationLineToStationsMap[lineName] = [
                  ...(stationLineToStationsMap[lineName] || []),
                  st
                ];

                stationIdToStationMap[st.id] = st;

              });

              return {stationLineToStationsMap, stationIdToStationMap};
            },
            {stationLineToStationsMap, stationIdToStationMap}
          );

        stationToLinesMap[stationName] = lineNames;
        return {stationLineToStationsMap, stationToLinesMap, stationIdToStationMap};
      },
      {stationLineToStationsMap, stationToLinesMap, stationIdToStationMap}
    );

  console.log("getStationLineToStationsAndStationToLinesMap finished");

  return {
    stationToLinesMap,
    stationLineToStationsMap,
    stationIdToStationMap
  };
};

export const getStationToNeighboursMap = (allLineStations) => {
  // {
  //   "Eunos_id": {
  //     "payalebar_id": {
  //       ...payalebar details
  //     },
  //     "kembangan_id": {
  //         ...kembangan details
  //     }
  //   }
  // }

  console.log("getStationToNeighboursMap");
  const stationToNeighboursMap = {};

  allLineStations.reduce((stationToNeighboursMap, lineStations) => {
    lineStations.sort((station1, station2) => station1.position - station2.position); // Sort Line Stations by position

    let prevStationOnLine = null;

    lineStations.reduce((stationToAdjacentsMap, station) => {
      if(prevStationOnLine === null) {
        prevStationOnLine = station;
        return stationToAdjacentsMap;
      }

      if(!stationToAdjacentsMap[station.id] || !stationToAdjacentsMap[station.id][prevStationOnLine.id]) {
        stationToAdjacentsMap[station.id] = {
          ...stationToAdjacentsMap[station.id],
          [prevStationOnLine.id]: prevStationOnLine.id
        };
      }

      if(!stationToAdjacentsMap[prevStationOnLine.id] || !stationToAdjacentsMap[prevStationOnLine.id][station.id]) {
        stationToAdjacentsMap[prevStationOnLine.id] = {
          ...stationToAdjacentsMap[prevStationOnLine.id],
          [station.id] : station.id
        };
      }
      prevStationOnLine = station;
      return stationToAdjacentsMap;
    }, stationToNeighboursMap);

    return stationToNeighboursMap;
  }, stationToNeighboursMap);

  console.log("getStationToNeighboursMap finished");
  return stationToNeighboursMap;
};

const getRoutesUtil = (source, destination, route, visited, stationsData, result) => {
  // station with same id but different position(loop stations), must be marked as visited no matter which position was visited. Hence visited key is the ID of station.
  if(route.length > (stationsData.maxLength || 10)) {
    return;
  }
  visited[source.id] = true;

  if(source.id === destination.id) { // it could be same stations but with different positions on same stations. Hence check Id.
    if(result.shortestRoute.length === 0 || result.shortestRoute.length > route.length) {
      result.shortestRoute.length = 0;
      result.shortestRoute.push(...route)
    }

    result.allRoutes.push([...route]);
    visited[source.id] = false;
    return;
  }

  const adjacentStationsIds = Object.values(stationsData.stationToNeighboursMap[source.id]);

  adjacentStationsIds.forEach(adjacentStationId => {
    if(!visited[adjacentStationId]) {
      const adjStation = stationsData.stationIdToStationMap[adjacentStationId];
      route.push(adjStation.id);

      getRoutesUtil(
        adjStation,
        destination,
        route,
        visited,
        stationsData,
        result
      );

      const ind = route.indexOf(adjStation);
      route.splice(ind, 1);
    }
  });

  visited[source.id] = false;
};

// const updateDirectRouteStatus = (route, stationsData) => {
//   const lastStation = stationsData.stationIdToStationMap[route[route.length-2]];
//   const secondLastStation = stationsData.stationIdToStationMap[route[route.length-1]];
//
//   if(lastStation && secondLastStation) {
//     lastStation.lineName
//   }
//
//
// };


/*

Objectives:
1. Find Direct route
2. Find the 2 smallest routes excluding direct route
3. Find Route with minimum line changes.
4. Only find the routes, with number of stations less than a particular threshold.
5. Only find the routes which take less than a threshold time to travel.
6. Shortest time route.

The below function(and the recursive function called from it) are optimised to find a solution to achieve objectives.
Hence a number of other variables are used to track the state of routes to achieve above objectives.

*/

export const getRoutes = (sourceStationId, destinationStationId, stationToNeighboursMap, stationIdToStationMap) => {
  console.log("getRoutes");
  const visited = {};
  const route = [];
  route.isDirect = true;
  const allRoutes = [];
  const directRoute = {};
  // allRoutes.smallestLength = 0;
  // allRoutes.secondSmallestLength = 0;
  // allRoutes.thirdSmallestLength = 0;

  const shortestRoute = [];

  const source = stationIdToStationMap[sourceStationId];
  const destination = stationIdToStationMap[destinationStationId];

  route.push(source.id);

  console.log("Source:", source);
  console.log("Destination:", destination);
  console.log("Station Map:", stationIdToStationMap);
  console.log("Adjacency list:", stationToNeighboursMap);
  debugger

  getRoutesUtil(
    source,
    destination,
    route,
    visited,
    {stationToNeighboursMap, stationIdToStationMap, maxLength: 30},
    {shortestRoute, allRoutes, directRoute});

  console.log("All Routes: ", allRoutes);
  console.log("Shortest Route:", shortestRoute);
  console.log("getRoutes End");
};





