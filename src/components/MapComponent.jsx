import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import './MapComponent.css'; // Assurez-vous d'importer le fichier CSS

const MapComponent = () => {
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [route, setRoute] = useState([]);
    
    const handleSearch = async (address, setLocation) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setLocation([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert("Aucune localisation trouvée.");
            }
        } catch (error) {
            console.error("Erreur lors de la recherche de localisation:", error);
        }
    };

    const handleValidate = () => {
        if (startLocation && endLocation) {
            setRoute([startLocation, endLocation]);
        } else {
            alert("Veuillez sélectionner les deux localisations.");
        }
    };

    const CenterMap = ({ location }) => {
        const map = useMap();
        if (location) {
            map.flyTo(location, 13);
        }
        return null;
    };

    return (
        <div className="map-container">
            <MapContainer center={[36.8065, 10.1815]} zoom={13} className="leaflet-container">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {startLocation && <Marker position={startLocation} />}
                {endLocation && <Marker position={endLocation} />}
                {route.length > 0 && <Polyline positions={route} color="blue" />}
                <CenterMap location={startLocation || endLocation} />
            </MapContainer>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Entrez la localisation de départ"
                    onBlur={(e) => handleSearch(e.target.value, setStartLocation)}
                />
                <input
                    type="text"
                    placeholder="Entrez la localisation d'arrivée"
                    onBlur={(e) => handleSearch(e.target.value, setEndLocation)}
                />
                <button onClick={handleValidate}>Valider</button>
            </div>
        </div>
    );
};

export default MapComponent;
