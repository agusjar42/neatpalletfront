"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/app/components/map/MapView"), {
    ssr: false,
});

const plannedRoute = [
    [39.4699, -0.3763],
    [39.4720, -0.3810],
    [39.4750, -0.3900],
];

const realRoute = [
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
                    <h5 className="m-0 mb-3">Seguimiento de pallet (MVP)</h5>
                    <p className="mt-0 mb-4">
                        Ruta planificada con OSRM y ruta real simulada con puntos GPS.
                    </p>
                    <MapView
                        center={[39.4699, -0.3763]}
                        plannedRoute={plannedRoute}
                        realRoute={realRoute}
                    />
                    <div className="flex flex-wrap gap-4 mt-3">
                        <span className="inline-flex align-items-center gap-2">
                            <span
                                style={{
                                    width: "14px",
                                    height: "4px",
                                    background: "#2563eb",
                                    borderRadius: "999px",
                                    display: "inline-block",
                                }}
                            />
                            Ruta planificada
                        </span>
                        <span className="inline-flex align-items-center gap-2">
                            <span
                                style={{
                                    width: "14px",
                                    height: "4px",
                                    background: "#ef4444",
                                    borderRadius: "999px",
                                    display: "inline-block",
                                }}
                            />
                            Ruta real
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeguimientoRutasPage;
