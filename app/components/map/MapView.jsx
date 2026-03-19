"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import PlannedRoute from "./PlannedRoute";
import RealRoute from "./RealRoute";

const MapView = ({ plannedRoute, realRoute, center = [39.4699, -0.3763] }) => {
    const markerIcon = useMemo(
        () =>
            L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            }),
        []
    );

    if (!plannedRoute?.length || !realRoute?.length) {
        return null;
    }

    const checkpoints = plannedRoute.slice(1, -1);
    const startPoint = plannedRoute[0];
    const destinationPoint = plannedRoute[plannedRoute.length - 1];

    return (
        <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "520px", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <PlannedRoute plannedRoute={plannedRoute} />
            <RealRoute realRoute={realRoute} />
            <Marker position={startPoint} icon={markerIcon}>
                <Popup>Start</Popup>
            </Marker>
            {checkpoints.map((point, index) => (
                <Marker key={`checkpoint-${index}`} position={point} icon={markerIcon}>
                    <Popup>{`Checkpoint ${index + 1}`}</Popup>
                </Marker>
            ))}
            <Marker position={destinationPoint} icon={markerIcon}>
                <Popup>Destination</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;
