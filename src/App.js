import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

export default function App() {

  const mapContainer = useRef(null);
    const [lng] = useState(-71.1160);
    const [lat] = useState(42.3752);
    const [zoom] = useState(16.22);
    let hoveredStateId = useState(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
      center: [lng, lat],
      zoom: zoom
    });

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
          'fill-opacity': 0.5
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
      <div ref={mapContainer} className="map-container" 
        />
    </div>
  );
}