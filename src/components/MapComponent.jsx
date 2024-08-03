import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import MapboxAutocomplete from 'react-mapbox-autocomplete';

// Helper component to control map panning and zooming
const PanToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
};

const MapComponent = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  const handleCalculateFare = async () => {
    if (!startLocation || !endLocation) return;

    try {
      // Replace with your OpenRouteService API key
      const apiKey = '5b3ce3597851110001cf6248fc53145ef9374070a0963ce3c33388f7';
      const startCoords = startLocation.split(',').map(coord => parseFloat(coord));
      const endCoords = endLocation.split(',').map(coord => parseFloat(coord));
      
      const response = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`);
      
      const route = response.data.routes[0];
      setRouteData({
        distance: route.summary.distance / 1000, // Convert meters to kilometers
        fare: (route.summary.distance / 1000) * 10 // Calculate fare based on 10 DT per kilometer
      });

      // Extract the coordinates for the Polyline
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRouteCoordinates(coordinates);

    } catch (error) {
      console.error('Error calculating fare or fetching route:', error);
    }
  };

  const onStartLocationSelected = (result, lat, lng, text) => {
    const startCoords = `${lng},${lat}`;
    setStartLocation(startCoords);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13);
    }
  };

  const onEndLocationSelected = (result, lat, lng, text) => {
    const endCoords = `${lng},${lat}`;
    setEndLocation(endCoords);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', maxWidth: '800px', margin: 'auto' }}>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '500px', width: '100%', marginBottom: '20px' }}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {startLocation && (
          <>
            <Marker
              position={startLocation.split(',').reverse().map(coord => parseFloat(coord))}
              icon={new L.Icon.Default()}
            />
            <PanToLocation 
              lat={parseFloat(startLocation.split(',')[1])} 
              lng={parseFloat(startLocation.split(',')[0])} 
            />
          </>
        )}
        {endLocation && (
          <>
            <Marker
              position={endLocation.split(',').reverse().map(coord => parseFloat(coord))}
              icon={new L.Icon.Default()}
            />
            <PanToLocation 
              lat={parseFloat(endLocation.split(',')[1])} 
              lng={parseFloat(endLocation.split(',')[0])} 
            />
          </>
        )}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" />
        )}
      </MapContainer>

      <div style={{ marginBottom: '20px' }}>
        <MapboxAutocomplete
          publicKey='pk.eyJ1IjoiYWNocmVmaGFqc2FsZW01MTc1eiIsImEiOiJjbHBmeWE2ZDYxbXF1MmprN2VuemIzdzIzIn0.mDZ6ldZURrYNE2YDUk62Kw
'  // Replace with your actual Mapbox API key
          inputClass='form-control search'
          onSuggestionSelect={onStartLocationSelected}
          country='us'
          placeholder='Enter start location'
        />
        <MapboxAutocomplete
          publicKey='pk.eyJ1IjoiYWNocmVmaGFqc2FsZW01MTc1eiIsImEiOiJjbHBmeWE2ZDYxbXF1MmprN2VuemIzdzIzIn0.mDZ6ldZURrYNE2YDUk62Kw
'  // Replace with your actual Mapbox API key
          inputClass='form-control search'
          onSuggestionSelect={onEndLocationSelected}
          country='us'
          placeholder='Enter end location'
        />
      </div>

      <button 
        onClick={handleCalculateFare} 
        style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        disabled={!startLocation || !endLocation}
      >
        Calculate Fare
      </button>

      {routeData && (
        <div style={{ marginTop: '20px' }}>
          <p>Distance: {routeData.distance.toFixed(2)} km</p>
          <p>Fare: ${routeData.fare.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
