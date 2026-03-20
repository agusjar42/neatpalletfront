"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/app/components/map/MapView"), {
    ssr: false,
});

const routePoints = [
    [39.4699, -0.3763],
    [39.4705, -0.3775],
    [39.4718, -0.3801],
    [39.4730, -0.3830],
    [39.4750, -0.3900],
];

const SeguimientoRutasPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className="m-0 mb-3">Seguimiento de pallet</h5>
                    <p className="mt-0 mb-4">
                        Se muestran Punto A, Punto B y los puntos intermedios numerados.
                    </p>

                    <div className="grid">
                        <div className="col-12 lg:col-8">
                            <MapView center={routePoints[0]} routePoints={routePoints} />
                        </div>
                        <div className="col-12 lg:col-4">
                            <div className="surface-ground border-round p-3 h-full">
                                <h6 className="mt-0 mb-3">Panel de puntos</h6>
                                <div className="flex flex-column gap-2">
                                    {routePoints.map((point, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === routePoints.length - 1;
                                        const title = isFirst ? "Punto A" : isLast ? "Punto B" : `Punto ${index + 1}`;
                                        return (
                                            <div key={`route-point-${index}`} className="p-2 border-round surface-card border-1 border-200">
                                                <div className="font-semibold">{title}</div>
                                                <div className="text-sm text-700">Lat: {Number(point[0]).toFixed(5)}</div>
                                                <div className="text-sm text-700">Lng: {Number(point[1]).toFixed(5)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeguimientoRutasPage;
