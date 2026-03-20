"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const buildNumberedIcon = (numero, tipo = "normal") =>
    L.divIcon({
        className: "map-number-marker",
        html: `<div style="
            width: 30px;
            height: 30px;
            border-radius: 999px;
            border: 2px solid #ffffff;
            background: ${tipo === "edge" ? "#0f766e" : "#334155"};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 13px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        ">${numero}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });

const MapView = ({ routePoints, plannedRoute, realRoute, center = [39.4699, -0.3763] }) => {
    const puntos = useMemo(() => {
        if (Array.isArray(routePoints) && routePoints.length > 0) return routePoints;
        if (Array.isArray(realRoute) && realRoute.length > 0) return realRoute;
        if (Array.isArray(plannedRoute) && plannedRoute.length > 0) return plannedRoute;
        return [];
    }, [routePoints, realRoute, plannedRoute]);

    if (puntos.length < 2) {
        return null;
    }

    const centerFinal = center ?? puntos[0];

    return (
        <MapContainer
            center={centerFinal}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "520px", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {puntos.map((punto, index) => {
                const esPrimero = index === 0;
                const esUltimo = index === puntos.length - 1;
                const titulo = esPrimero ? "Punto A" : esUltimo ? "Punto B" : `Punto ${index + 1}`;
                return (
                    <Marker
                        key={`point-${index}`}
                        position={punto}
                        icon={buildNumberedIcon(index + 1, esPrimero || esUltimo ? "edge" : "normal")}
                    >
                        <Popup>
                            <div style={{ minWidth: "150px" }}>
                                <strong>{titulo}</strong>
                                <br />
                                Lat: {Number(punto[0]).toFixed(5)}
                                <br />
                                Lng: {Number(punto[1]).toFixed(5)}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapView;
