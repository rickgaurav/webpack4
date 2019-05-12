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






const getStationNeighbours = (station, stationToNeighboursMap, stationNameToStationIdsMap) => {
  const sameNameStationIds = stationNameToStationIdsMap[station.name] || [];
  if(sameNameStationIds.length <= 1) {
    return Object.values(stationToNeighboursMap[station.id]);
  }
  return sameNameStationIds.map(stationId => Object.values(stationToNeighboursMap[stationId])).flat();
};

const markNodeVisited = (node, visited, stationNameToStationIdsMap) => {
  const sameStationIds = stationNameToStationIdsMap[node.name];
  sameStationIds.forEach(stationId => visited[stationId] = true);
};

const markNodeNotVisited = (node, visited, stationNameToStationIdsMap) => {
  const sameStationIds = stationNameToStationIdsMap[node.name];
  sameStationIds.forEach(stationId => visited[stationId] = false);
};

const isDestinationReached = (source, destination, stationIdToStationMap, stationNameToStationIdsMap) => {
  const sameNameSourceStationIds = stationNameToStationIdsMap[source.name];
  const sameNameDestinationStationIds = stationNameToStationIdsMap[destination.name];
  return sameNameDestinationStationIds.every(destinationId => sameNameSourceStationIds.indexOf(destinationId) >= 0);
};

const updateRoute = (route, newStationId, stationIdToStationMap) => {
  const lastStation = stationIdToStationMap[route.path[route.path.length-1]];
  const newStation = stationIdToStationMap[newStationId];
  route.path.push(newStationId);

  if(lastStation.lineName !== newStation.lineName) {
    route.lineChangesCount += 1;
    route.time += 4;
    return route;
  }

  route.time += 2;
  return route;
};

const removeLastNodeFromPath = (route, stationIdToStationMap) => {
  const removedNodeId = route.path.splice(route.path.length - 1, 1); // Remove the last node, since its already counted in path.
  const lastNodeIdAfterRemoval = route.path[route.path.length - 1];
  if(stationIdToStationMap[removedNodeId].lineName !== stationIdToStationMap[lastNodeIdAfterRemoval].lineName) {
    route.lineChangesCount -= 1;
    route.time -= 4;
    return;
  }

  route.time -= 2;
};


/*
  source: Source Station.
  destination: Destination station.
  route: Route from source to destination.
  visited: Tracks the visited nodes of a route on a graph.
  stationsData: Contains various info related to station hashtables.
  result: contains the resultant routes etc.
*/
const getPathsUtil = (source, destination, route, visited, stationsData, result) => {
  debugger
  if(route.path.length > (stationsData.maxLength || 10)) {
    return;
  }

  markNodeVisited(source, visited, stationsData.stationNameToStationIdsMap);

  if(isDestinationReached(source, destination, stationsData.stationIdToStationMap, stationsData.stationNameToStationIdsMap)) {
    if(result.shortestRoute.length === 0 || result.shortestRoute.length > route.length) {
      result.shortestRoute.length = 0;
      result.shortestRoute.push(...route.path)
    }

    result.allRoutes.push([...route.path]);
    markNodeNotVisited(source, visited, stationsData.stationNameToStationIdsMap);
    return;
  }

  const adjacentStationsIds = getStationNeighbours(source, stationsData.stationToNeighboursMap, stationsData.stationNameToStationIdsMap);

  adjacentStationsIds.forEach(adjacentStationId => {
    if(!visited[adjacentStationId]) {
      const adjStation = stationsData.stationIdToStationMap[adjacentStationId];

      updateRoute(route, adjacentStationId, stationsData.stationIdToStationMap);

      getPathsUtil(
        adjStation,
        destination,
        route,
        visited,
        stationsData,
        result
      );

      removeLastNodeFromPath(route, stationsData.stationIdToStationMap);
    }
  });

  markNodeNotVisited(source, visited, stationsData.stationNameToStationIdsMap);
};

export const getPaths = (sourceStationId, destinationStationId, stationToNeighboursMap, stationIdToStationMap, stationNameToStationIdsMap) => {
  debugger;
  console.log("getPaths Start");
  const visited = {};
  // const route = [];
  // const allRoutes = [];
  // const shortestRoute = [];

  const result = {
    allRoutes: [],
    shortestRoute: [],
    minimumLineChangesRoute: []
  };

  const route = {
    path: [],
    time: 0,
    lineChangesCount: 0
  };

  const source = stationIdToStationMap[sourceStationId];
  const destination = stationIdToStationMap[destinationStationId];

  route.path.push(source.id);

  getPathsUtil(
    source,
    destination,
    route,
    visited,
    {stationToNeighboursMap, stationIdToStationMap, stationNameToStationIdsMap, maxLength: 10},
    result);



  console.log("All Routes: ", result.allRoutes);
  console.log("Shortest Route:", result.shortestRoute);
  console.log("getPaths End");
};

export const processStationsData = () => {
  console.log("processStationsData start");
  let stationLineToStationsMap = {} , stationIdToStationMap = {}, stationNameToStationIdsMap={};

  let id = 0;
  Object
    .entries(stations)
    .forEach(([stationName, linesObject]) => {
      Object
        .entries(linesObject)
        .forEach(([lineName, stationPositionsOnLine]) => {
          if (Array.isArray(stationPositionsOnLine)) {
            const station = {
              id,
              name: stationName,
              lineName
            };
            stationPositionsOnLine.forEach(position => {
              stationLineToStationsMap[lineName] = [
                ...(stationLineToStationsMap[lineName] || []),
                {
                  ...station,
                  position
                }
              ];
              stationIdToStationMap[station.id] = station;
            });

            stationNameToStationIdsMap[stationName] = [
              ...(stationNameToStationIdsMap[stationName] || []),
              station.id
            ];

            id++;
            return;
          }


          const station = {
            id: id++,
            name: stationName,
            lineName: lineName,
            position: stationPositionsOnLine
          };

          stationNameToStationIdsMap[stationName] = [
            ...(stationNameToStationIdsMap[stationName] || []),
            station.id
          ];

          stationLineToStationsMap[lineName] = [
            ...(stationLineToStationsMap[lineName] || []),
            station
          ];

          stationIdToStationMap[station.id] = station;
        });
    });

  console.log("processStationsData end");

  return {
    stationLineToStationsMap,
    stationIdToStationMap,
    stationNameToStationIdsMap
  };
};

const addNeighbours = (stationToNeighboursMap, currentStation, prevStation) => {
    stationToNeighboursMap[currentStation.id] = {
      ...(stationToNeighboursMap[currentStation.id] || {}),
      [prevStation.id] : prevStation.id
    };

    stationToNeighboursMap[prevStation.id] = {
      ...(stationToNeighboursMap[prevStation.id] || {}),
      [currentStation.id]: currentStation.id
    }
};


export const createAdjacencyList = () => {
  console.log("createAdjacencyList Start");

  const {
    stationLineToStationsMap,
    stationIdToStationMap,
    stationNameToStationIdsMap
  } = processStationsData();

  const stationToNeighboursMap = {};
  const allLineStations = Object.values(stationLineToStationsMap);

  allLineStations.forEach(lineStations => {
    lineStations.sort((station1, station2) => station1.position - station2.position); // Sort Line Stations by position
    let prevStationOnLine = null;

    lineStations.forEach(station => {
      if (prevStationOnLine === null) {
        prevStationOnLine = station;
        return;
      }

      addNeighbours(stationToNeighboursMap, station, prevStationOnLine);

      prevStationOnLine = station;
    });
  });

  console.log("createAdjacencyList End");
  console.log("StationIdToStation:", stationIdToStationMap);
  console.log("Line to stations:", stationLineToStationsMap);
  console.log("Interchange stations info:", stationNameToStationIdsMap);
  console.log("Station to neighbours:", stationToNeighboursMap);
  return stationToNeighboursMap;
};