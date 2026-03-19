"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const PlannedRoute = ({ plannedRoute }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !plannedRoute || plannedRoute.length < 2) {
            return;
        }

        const routingControl = L.Routing.control({
            waypoints: plannedRoute.map(([lat, lng]) => L.latLng(lat, lng)),
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
            }),
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: false,
            lineOptions: {
                styles: [{ color: "#2563eb", weight: 5, opacity: 0.85 }],
            },
            createMarker: () => null,
        });

        routingControl.addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, plannedRoute]);

    return null;
};

export default PlannedRoute;
