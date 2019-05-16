import stations from '../static/stations.json';


/*
Objectives:
1. Find Direct route
2. Find Route with minimum line changes.
3. Shortest time route.
3. Only find the routes, with number of stations less than a particular threshold.
4. Only find the routes which take less than a threshold time to travel.

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
  return visited;
};

const markNodeNotVisited = (node, visited, stationNameToStationIdsMap) => {
  const sameStationIds = stationNameToStationIdsMap[node.name];
  sameStationIds.forEach(stationId => visited[stationId] = false);
  return visited;
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

const getPathsUtil = (source, destination, route, visited, stationsData, result) => {
  if(route.path.length > (stationsData.maxLength || 10)) {
    return;
  }

  if(route.time > stationsData.maxTime) {
    return;
  }

  markNodeVisited(source, visited, stationsData.stationNameToStationIdsMap);

  if(isDestinationReached(source, destination, stationsData.stationIdToStationMap, stationsData.stationNameToStationIdsMap)) {
    if(result.shortestRoute.path.length === 0 || result.shortestRoute.path.length > route.length) {
      result.shortestRoute = {
        ...route,
        path: [...route.path]
      };
    }

    result.allRoutes.push([{
      ...route,
      path: [...route.path]
    }]);

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

export const getPaths = (
    sourceStationId,
    destinationStationId,
    stationToNeighboursMap,
    stationIdToStationMap,
    stationNameToStationIdsMap,
    maxStations,
    maxTime
  ) => {

  const visited = {};
  const result = {
    allRoutes: [],
    shortestRoute: {
      path: [],
      time: 0,
      lineChangesCount: 0
    }
  };

  const route = {
    path: [],
    time: 0,
    lineChangesCount: 0
  };

  const stationsData = {
    stationToNeighboursMap,
    stationIdToStationMap,
    stationNameToStationIdsMap,
    maxLength: maxStations || 10,
    maxTime: maxTime || 60
  };

  const source = stationIdToStationMap[sourceStationId];
  const destination = stationIdToStationMap[destinationStationId];

  route.path.push(source.id);

  getPathsUtil(
    source,
    destination,
    route,
    visited,
    stationsData,
    result
  );

  return result;
};

export const processStationsData = () => {
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


export const createAdjacencyList = (stationLineToStationsMap) => {

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

  return stationToNeighboursMap;
};