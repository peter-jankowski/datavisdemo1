import React, { useState, useMemo, useEffect, useRef } from 'react';
// import {render} from 'react-dom';
import mapboxgl from 'mapbox-gl';
import ControlPanel from './control-panel';

import {updatePercentiles} from './utils';

mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

export default function App() {

  const mapContainer = useRef(null);
    const [time, setTime] = useState(900);
    const [allData, setAllData] = useState(null);
    const [lng] = useState(-71.1160);
    const [lat] = useState(42.3752);
    const [zoom] = useState(16.22);
    let hoveredStateId = useState(null);


  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday'
  ];

  const data = useMemo(() => {
    return allData && updatePercentiles(allData, f => f.properties.monday[time]);
  }, [allData, time]);

  console.log(data)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
      center: [lng, lat],
      zoom: zoom
    });

    fetch(
      'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
    )
      .then(resp => resp.json())
      .then(json => setAllData(json));

    // const filters = ['==', 'day', 'monday'];
    // map.setFilter('earthquake-circles', filters);

    map.on('load', () => {
      map.addSource('buildings', {
        'type': 'geojson',
        'data': 'https://peter-jankowski.github.io/datavisdemo1/harvardbuildings.geojson',
        'generateId': true
      });

      map.addLayer({
        'id': 'building-data',
        'type': 'line',
        'source': 'buildings',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#ff69b4',
          'line-width': 3
        }
      });

      // map.addLayer({
      //   'id': 'buildings-fills',
      //   'type': 'fill',
      //   'source': 'buildings',
      //   'layout': {},
      //   'paint': {
      //     'fill-color': '#627BC1',
      //     'fill-opacity': [
      //       'case',
      //       ['boolean', ['feature-state', 'hover'], false],
      //       1,
      //       0.5
      //     ]
      //   }
      // });

      map.addLayer({
        'id': 'buildings-fills',
        'type': 'fill',
        'source': 'buildings',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': ['get', 'monday']// 0.5
        }
      });

      map.on('mousemove', 'buildings-fills', (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'buildings', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: 'buildings', id: hoveredStateId },
            { hover: true }
          );
        }
      });

      map.on('mouseleave', 'buildings-fills', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'buildings', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });

    });
    
  });


  return (
    <div>
      {/* <ControlPanel time={time} onChange={value => setTime(value)} /> */}
      <div ref={mapContainer} className="map-container">
        </div>
        <div class="map-overlay top">
        <div class="map-overlay-inner">
        <h2>Significant earthquakes in 2015</h2>
        <label id="month"></label>
        <input id="slider" type="range" min="0" max="11" step="1" value="0"></input>
        </div>
        <div class="map-overlay-inner">
        <div id="legend" class="legend">
        <div class="bar"></div>
        <div>Magnitude (m)</div>
        </div>
        </div>
      </div>
    </div>
  );
}