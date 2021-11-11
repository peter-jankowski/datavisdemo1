import {useState, useEffect} from 'react';
import { json } from 'd3';

const jsonUrl =
  'https://peter-jankowski.github.io/datavisdemo1/harvardbuildings.geojson';

export const useData = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    json(jsonUrl).then(setData);
  }, []);

  return data;
};