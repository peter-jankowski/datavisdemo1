
// HOOKS BASED IMPLEMENTATION ✅

import React, {useRef, useState, useEffect} from 'react';
import {render} from 'react-dom';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

export default function App() {
  const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-71.1160);
    const [lat, setLat] = useState(42.3752);
    const [zoom, setZoom] = useState(16.22);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" 
        />
    </div>
  );
}


// import React, {useRef, useState, useEffect} from 'react';
// import {render} from 'react-dom';
// import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

// export default function App() {
//   const [viewport, setViewport] = useState({
//     latitude: 40,
//     longitude: -100,
//     zoom: 3,
//     bearing: 0,
//     pitch: 0
//   });

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
//       center: [lng, lat],
//       zoom: zoom
//     });
//   });

//   return (
//     <div>
//       <div ref={mapContainer} className="map-container" 
//         />
//     </div>
//   );
// }



// CLASS BASED IMPLEMENTATION ✅
// import React, { Component } from "react";
// import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g';

// class App extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       lng: -71.1160,
//       lat:  42.3752,
//       zoom: 16.22
//     };
//   }

//   componentDidMount() {
//     const { lng, lat, zoom } = this.state;

//     const map = new mapboxgl.Map({
//       container: this.mapContainer,
//       style: 'mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo',
//       center: [lng, lat],
//       zoom
//     });
		
//      map.on('move', () => {
//       const { lng, lat } = map.getCenter();

//       this.setState({
//         lng: lng.toFixed(4),
//         lat: lat.toFixed(4),
//         zoom: map.getZoom().toFixed(2)
//       });
//     });
//   }

//   render() {
//     const { lng, lat, zoom } = this.state;

//     return (
//       <div>
//         <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
//           <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
//         </div>
//         <div id="map" style={{width: "100vw", height: "100vh"}} ref={el => this.mapContainer = el} className="absolute top right left bottom" />
//       </div>
//     );
//   }
// }

// export default App;