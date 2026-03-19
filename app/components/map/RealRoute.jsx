"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const RealRoute = ({ realRoute }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !realRoute || realRoute.length < 2) {
            return;
        }

        const realRouteLayer = L.polyline(realRoute, {
            color: "#ef4444",
            weight: 4,
            opacity: 0.9,
            dashArray: "8 10",
        }).addTo(map);

        return () => {
            map.removeLayer(realRouteLayer);
        };
    }, [map, realRoute]);

    return null;
};

export default RealRoute;
