// import React, { useState, useMemo, useEffect, useRef } from 'react';
// // import {render} from 'react-dom';
// import mapboxgl from 'mapbox-gl';
// import ControlPanel from './control-panel';
// import {useData} from './useData';

// import {updatePercentiles} from './utils';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

// export default function App() {

//   const mapContainer = useRef(null);
//     const [time, setTime] = useState(900);
//     // const [allData, setAllData] = useState(null);
//     const [lng] = useState(-71.1160);
//     const [lat] = useState(42.3752);
//     const [zoom] = useState(16.22);
//     let hoveredStateId = useState(null);


//   const days = [
//     'monday',
//     'tuesday',
//     'wednesday',
//     'thursday',
//     'friday'
//   ];

//   const allData = useData();
//   console.log(allData);

//   // const data = -> {
//   //   return allData && updatePercentiles(allData, f => f.properties.monday[time]);
//   // };

//   // console.log(data)

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
//       center: [lng, lat],
//       zoom: zoom
//     });

//     // fetch(
//     //   'https://peter-jankowski.github.io/datavisdemo1/harvardbuildings.geojson'
//     // )
//     //   .then(resp => resp.json())
//     //   .then(json => setAllData(json));
  

//     // const filters = ['==', 'day', 'monday'];
//     // map.setFilter('earthquake-circles', filters);

//     // allData.filter(f => f.properties === 'To do')

//     map.on('load', () => {
//       map.addSource('buildings', {
//         'type': 'geojson',
//         'data': allData,
//         'generateId': true
//       });

//       map.addLayer({
//         'id': 'building-data',
//         'type': 'line',
//         'source': 'buildings',
//         'layout': {
//           'line-join': 'round',
//           'line-cap': 'round'
//         },
//         'paint': {
//           'line-color': '#ff69b4',
//           'line-width': 3
//         }
//       });

//       // map.addLayer({
//       //   'id': 'buildings-fills',
//       //   'type': 'fill',
//       //   'source': 'buildings',
//       //   'layout': {},
//       //   'paint': {
//       //     'fill-color': '#627BC1',
//       //     'fill-opacity': [
//       //       'case',
//       //       ['boolean', ['feature-state', 'hover'], false],
//       //       1,
//       //       0.5
//       //     ]
//       //   }
//       // });

//       map.addLayer({
//         'id': 'buildings-fills',
//         'type': 'fill',
//         'source': 'buildings',
//         'layout': {},
//         'paint': {
//           'fill-color': '#627BC1',
//           'fill-opacity': ["get", "900", ["get", "monday"]] / 567
//         }
//       });

//       map.on('mousemove', 'buildings-fills', (e) => {
//         if (e.features.length > 0) {
//           if (hoveredStateId !== null) {
//             map.setFeatureState(
//               { source: 'buildings', id: hoveredStateId },
//               { hover: false }
//             );
//           }
//           hoveredStateId = e.features[0].id;
//           map.setFeatureState(
//             { source: 'buildings', id: hoveredStateId },
//             { hover: true }
//           );
//         }
//       });

//       map.on('mouseleave', 'buildings-fills', () => {
//         if (hoveredStateId !== null) {
//           map.setFeatureState(
//             { source: 'buildings', id: hoveredStateId },
//             { hover: false }
//           );
//         }
//         hoveredStateId = null;
//       });

//     });
    
//   });

  


//   return (
//     <div>
//       <ControlPanel time={time} onChange={value => setTime(value)} />
//       <div ref={mapContainer} className="map-container">
//       </div>
//     </div>
//   );
// }



   
import * as React from 'react';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import ControlPanel from './control-panel';
import {useData} from './useData';

import {dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';

const MAPBOX_TOKEN ='pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g';

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0
  });
  const [year, setYear] = useState(900);
  const [hoverInfo, setHoverInfo] = useState(null);

  const allData = useData();
  console.log(allData);


  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
        : null
    );
  }, []);

  const data = useMemo(() => {
    return allData && updatePercentiles(allData, f => f.properties.monday[year]);
  }, [allData, year]);

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onHover={onHover}
      >
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>State: {hoverInfo.feature.properties.name}</div>
            <div>Median Household Income: {hoverInfo.feature.properties.value}</div>
            <div>Percentile: {(hoverInfo.feature.properties.percentile / 8) * 100}</div>
          </div>
        )}
      </MapGL>

      <ControlPanel year={year} onChange={value => setYear(value)} />
    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}