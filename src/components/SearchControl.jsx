import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

const SearchControl = ({ onLocationSelected, placeholder }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      autoComplete: true,
      autoCompleteDelay: 250,
      searchLabel: placeholder,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result) => {
      const location = {
        lat: result.location.y,
        lng: result.location.x,
      };
      onLocationSelected(location);
      map.setView(location, 13); // Navigue vers la position sélectionnée
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelected, placeholder]);

  return null;
};

export default SearchControl;
