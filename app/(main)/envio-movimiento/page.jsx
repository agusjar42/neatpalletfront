"use client";

import InformePlaceholder from "../logs-incorrectos/InformePlaceholder";

const reports = [
    {
        id: "rutas",
        title: "Rutas completadas",
        subtitle: "Trayectos finalizados con kilometros, duracion y estado",
        cardDescription: "Trayectos finalizados con kilometros, duracion y...",
        icon: "pi pi-arrow-right-arrow-left",
        theme: "green",
        metrics: [
            { label: "Rutas hoy", value: "342", helper: "+18 vs ayer" },
            { label: "Km recorridos", value: "48.290", helper: "media 141 km/ruta" },
            { label: "Duracion media", value: "3 h 24 m", helper: "− 6 m vs sem ant." },
            { label: "Cumplimiento ETA", value: "94,1%", helper: "+1,2 pt" },
        ],
        chart: { series: [132, 128, 168, 144, 160, 121, 96, 94, 93, 118, 129, 126, 166, 138, 154, 124, 106, 127, 123, 169, 154, 188, 151, 116, 112, 94, 102, 108, 111, 146], caption: "30 dias · pico 362", highlightIndex: 21 },
        distribution: [
            { label: "Nacional corta", percent: 2, value: "185 · 2%", color: "#166534" },
            { label: "Nacional larga", percent: 1, value: "88 · 1%", color: "#10b981" },
            { label: "Internacional UE", percent: 1, value: "42 · 1%", color: "#0ea5e9" },
            { label: "Internacional ext.", percent: 0.5, value: "18 · 0%", color: "#8b5cf6" },
            { label: "Urbana", percent: 0.2, value: "9 · 0%", color: "#84cc16" },
        ],
        table: {
            searchPlaceholder: "Buscar pallet, origen o destino..",
            filters: ["Todos", "Nacional", "Internacional", "Urbana", "Retrasos", "En curso"],
            columns: ["Servicio", "Pallet", "Origen", "Destino", "Distancia", "Duracion", "Estado", "PDF"],
            rows: [
                ["MV-94821", "NEAT-00001", "Valencia, ES", "Murcia, ES", "148 km", "2 h 18 m", { type: "badge", value: "En curso" }, { type: "pdf" }],
                ["MV-94820", "NEAT-00002", "Bilbao, ES", "Madrid, ES", "396 km", "4 h 42 m", { type: "badge", value: "Completado" }, { type: "pdf" }],
                ["MV-94819", "NEAT-00003", "Sevilla, ES", "Granada, ES", "252 km", "3 h 06 m", { type: "badge", value: "Retraso", tone: "warning" }, { type: "pdf" }],
                ["MV-94818", "NEAT-00004", "Göteborg, SE", "Stockholm, SE", "471 km", "5 h 35 m", { type: "badge", value: "Completado" }, { type: "pdf" }],
                ["MV-94817", "NEAT-00005", "Lisboa, PT", "Madrid, ES", "626 km", "7 h 04 m", { type: "badge", value: "En curso" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "transito",
        title: "Tiempos de transito",
        subtitle: "Tiempo previsto vs real entre origen y destino, y puntos intermedios",
        cardDescription: "Tiempo previsto vs real entre origen y destino,...",
        icon: "pi pi-clock",
        theme: "blue",
        metrics: [
            { label: "Media real", value: "3 h 31 m", helper: "sobre 30 dias" },
            { label: "Desviacion", value: "+7 m", helper: "vs previsto" },
            { label: "P95", value: "6 h 12 m", helper: "tramos largos" },
            { label: "En ventana", value: "91,7%", helper: "dentro de tolerancia" },
        ],
        chart: { series: [101, 105, 103, 108, 112, 110, 115, 117, 121, 118, 122, 126, 124, 129, 133, 130, 136, 139, 137, 141, 144, 146, 143, 148], caption: "30 dias · pico 148", highlightIndex: 23 },
        distribution: [
            { label: "En tiempo", percent: 76, value: "76%", color: "#2563eb" },
            { label: "Leve retraso", percent: 16, value: "16%", color: "#38bdf8" },
            { label: "Retraso", percent: 6, value: "6%", color: "#f59e0b" },
            { label: "Critico", percent: 2, value: "2%", color: "#ef4444" },
        ],
        table: {
            searchPlaceholder: "Buscar ruta o cliente",
            filters: ["Todos", "En tiempo", "Leve retraso", "Retraso", "Critico"],
            columns: ["Servicio", "Origen", "Destino", "Previsto", "Real", "Estado", "PDF"],
            rows: [
                ["TR-2019", "Valencia", "Murcia", "2 h 10 m", "2 h 18 m", { type: "badge", value: "Leve" }, { type: "pdf" }],
                ["TR-2022", "Bilbao", "Madrid", "4 h 20 m", "4 h 42 m", { type: "badge", value: "Retraso", tone: "warning" }, { type: "pdf" }],
                ["TR-2024", "Lisboa", "Madrid", "6 h 55 m", "7 h 04 m", { type: "badge", value: "Leve" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "desviaciones",
        title: "Desviaciones de ruta",
        subtitle: "Salidas del corredor, exceso de velocidad y cambios no autorizados",
        cardDescription: "Salidas del corredor, exceso de velocidad y cambios no...",
        icon: "pi pi-exclamation-triangle",
        theme: "amber",
        metrics: [
            { label: "Desvios", value: "29", helper: "detectados" },
            { label: "Corredor", value: "95,9%", helper: "cumplimiento medio" },
            { label: "Velocidad", value: "7", helper: "casos fuera de umbral" },
            { label: "Replanificados", value: "4", helper: "con causa registrada" },
        ],
        chart: { series: [22, 24, 23, 25, 26, 24, 27, 29, 31, 30, 28, 32, 33, 31, 35, 34, 33, 36, 38, 37, 39, 41, 40, 38], caption: "30 dias · pico 41", highlightIndex: 21 },
        distribution: [
            { label: "Corredor", percent: 62, value: "62%", color: "#f59e0b" },
            { label: "Velocidad", percent: 19, value: "19%", color: "#fb923c" },
            { label: "Parada", percent: 11, value: "11%", color: "#38bdf8" },
            { label: "Otros", percent: 8, value: "8%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar servicio o incidencia",
            filters: ["Todos", "Corredor", "Velocidad", "Parada", "Otros"],
            columns: ["Servicio", "Tipo", "Descripcion", "Estado", "PDF"],
            rows: [
                ["MV-94819", "Corredor", "Salida no autorizada de 11 km", { type: "badge", value: "Aviso", tone: "warning" }, { type: "pdf" }],
                ["MV-94817", "Velocidad", "Pico de 98 km/h", { type: "badge", value: "Critico", tone: "danger" }, { type: "pdf" }],
                ["MV-94821", "Parada", "Parada extra de 23 min", { type: "badge", value: "Revisado" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "paradas",
        title: "Paradas no planificadas",
        subtitle: "Paradas fuera de los puntos previstos y su impacto en la ruta",
        cardDescription: "Paradas fuera de los puntos previstos y su impacto en l...",
        icon: "pi pi-stop-circle",
        theme: "rose",
        metrics: [
            { label: "Paradas", value: "41", helper: "sin plan" },
            { label: "Impacto medio", value: "13 min", helper: "por evento" },
            { label: "Criticas", value: "6", helper: "fuera de zona segura" },
            { label: "Con justificacion", value: "58%", helper: "registradas" },
        ],
        chart: { series: [17, 18, 20, 19, 21, 23, 22, 24, 26, 25, 27, 29, 28, 30, 31, 29, 32, 34, 33, 31, 30, 29, 28, 27], caption: "30 dias · pico 34", highlightIndex: 17 },
        distribution: [
            { label: "Segura", percent: 54, value: "54%", color: "#fb7185" },
            { label: "Revisar", percent: 28, value: "28%", color: "#f59e0b" },
            { label: "Critica", percent: 12, value: "12%", color: "#ef4444" },
            { label: "Desconocida", percent: 6, value: "6%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar ruta o parada",
            filters: ["Todos", "Segura", "Revisar", "Critica"],
            columns: ["Servicio", "Ubicacion", "Tiempo", "Motivo", "Estado", "PDF"],
            rows: [
                ["MV-94821", "Area A-7 km 312", "18 min", "Sin registro", { type: "badge", value: "Revisar", tone: "warning" }, { type: "pdf" }],
                ["MV-94817", "Poligono Norte", "31 min", "Sin registro", { type: "badge", value: "Critica", tone: "danger" }, { type: "pdf" }],
                ["MV-94818", "Stockholm Sur", "9 min", "Control", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "eficiencia",
        title: "Eficiencia de flota",
        subtitle: "Utilizacion por vehiculo, kilometros y servicios por jornada",
        cardDescription: "Utilizacion por vehiculo, kilometros y servicios...",
        icon: "pi pi-wave-pulse",
        theme: "cyan",
        metrics: [
            { label: "Vehiculos activos", value: "62", helper: "ultimos 30 dias" },
            { label: "Utilizacion", value: "82,7%", helper: "media diaria" },
            { label: "Km por vehiculo", value: "779", helper: "en periodo" },
            { label: "Servicios", value: "5,5", helper: "media por jornada" },
        ],
        chart: { series: [54, 58, 60, 57, 62, 65, 63, 66, 68, 70, 69, 71, 74, 73, 75, 78, 79, 77, 80, 82, 81, 83, 84, 85], caption: "30 dias · pico 85", highlightIndex: 23 },
        distribution: [
            { label: "Alta", percent: 49, value: "49%", color: "#06b6d4" },
            { label: "Media", percent: 33, value: "33%", color: "#38bdf8" },
            { label: "Baja", percent: 14, value: "14%", color: "#94a3b8" },
            { label: "Inactiva", percent: 4, value: "4%", color: "#cbd5e1" },
        ],
        table: {
            searchPlaceholder: "Buscar vehiculo o servicio",
            filters: ["Todos", "Alta", "Media", "Baja", "Inactiva"],
            columns: ["Vehiculo", "Servicios", "Km", "Utilizacion", "Estado", "PDF"],
            rows: [
                ["VH-1201", "7", "1.024 km", "91%", { type: "badge", value: "Alta" }, { type: "pdf" }],
                ["VH-1188", "5", "812 km", "77%", { type: "badge", value: "Media" }, { type: "pdf" }],
                ["VH-1152", "2", "214 km", "31%", { type: "badge", value: "Baja", tone: "warning" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "recogidas",
        title: "Recogidas y entregas",
        subtitle: "Movimientos de carga y descarga registrados por tramo y cliente",
        cardDescription: "Movimientos de carga/descarga registrado...",
        icon: "pi pi-box",
        theme: "violet",
        metrics: [
            { label: "Operaciones", value: "614", helper: "carga y descarga" },
            { label: "Entrega completa", value: "97,2%", helper: "sin incidencias" },
            { label: "Retrasos", value: "14", helper: "mas de 15 min" },
            { label: "Ventana media", value: "22 min", helper: "por operacion" },
        ],
        chart: { series: [36, 38, 37, 41, 43, 42, 46, 48, 50, 49, 53, 54, 56, 57, 55, 58, 59, 61, 60, 63, 64, 66, 67, 69], caption: "30 dias · pico 69", highlightIndex: 23 },
        distribution: [
            { label: "Recogidas", percent: 44, value: "44%", color: "#8b5cf6" },
            { label: "Entregas", percent: 39, value: "39%", color: "#a78bfa" },
            { label: "Mixto", percent: 12, value: "12%", color: "#c4b5fd" },
            { label: "Incidencia", percent: 5, value: "5%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar cliente o operacion",
            filters: ["Todos", "Recogidas", "Entregas", "Mixto", "Incidencias"],
            columns: ["Operacion", "Cliente", "Tipo", "Ventana", "Estado", "PDF"],
            rows: [
                ["OP-2101", "Frutas del Sur", "Entrega", "19 min", { type: "badge", value: "OK" }, { type: "pdf" }],
                ["OP-2102", "Logistica Norte", "Recogida", "34 min", { type: "badge", value: "Retraso", tone: "warning" }, { type: "pdf" }],
                ["OP-2103", "Mercabarna", "Mixto", "22 min", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
];

export default function EnvioMovimiento() {
    return <InformePlaceholder reports={reports} initialReportId="rutas" />;
}
