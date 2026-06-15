"use client";

import InformePlaceholder from "../logs-incorrectos/InformePlaceholder";

const reports = [
    {
        id: "snapshot",
        title: "Snapshot de carga",
        subtitle: "Foto en tiempo real del contenido y la ocupacion del transporte",
        cardDescription: "Foto en tiempo real del contenido y la ocupacion d...",
        icon: "pi pi-box",
        theme: "mint",
        metrics: [
            { label: "Pallets activos", value: "1.126", helper: "en seguimiento" },
            { label: "Ocupacion", value: "87%", helper: "media por ruta" },
            { label: "SKU visibles", value: "64", helper: "catalogo reciente" },
            { label: "Alertas", value: "8", helper: "pendientes de revision" },
        ],
        chart: { series: [180, 212, 208, 224, 219, 237, 243, 248, 240, 236, 250, 264, 271, 266, 258, 245, 236, 242, 248, 252, 247, 239, 244, 251], caption: "30 dias · pico 271", highlightIndex: 12 },
        distribution: [
            { label: "Pallet completo", percent: 82, value: "820 · 82%", color: "#22c55e" },
            { label: "Carga parcial", percent: 11, value: "110 · 11%", color: "#38bdf8" },
            { label: "Mixto", percent: 5, value: "50 · 5%", color: "#f59e0b" },
            { label: "Sin clasificar", percent: 2, value: "20 · 2%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar pallet, producto o cliente",
            filters: ["Todos", "Completos", "Parciales", "Mixtos", "Recientes", "Alertas"],
            columns: ["Pallet", "Producto", "Cliente", "Cantidad", "Peso", "PDF"],
            rows: [
                ["NEAT-00001", "Salmon fresco", "Murcia", "24", "960 kg", { type: "pdf" }],
                ["NEAT-00002", "Helado vainilla", "Madrid", "18", "720 kg", { type: "pdf" }],
                ["NEAT-00003", "Yogur", "Valencia", "36", "540 kg", { type: "pdf" }],
                ["NEAT-00004", "Vacuna A-12", "Bilbao", "12", "120 kg", { type: "pdf" }],
            ],
        },
    },
    {
        id: "sku",
        title: "Trazabilidad de SKU",
        subtitle: "Recorrido de cada SKU entre pallets, lotes y clientes",
        cardDescription: "Recorrido de cada SKU entre pallets, lotes y...",
        icon: "pi pi-search",
        theme: "blue",
        metrics: [
            { label: "SKU trazados", value: "61", helper: "rastreables extremo a extremo" },
            { label: "Lotes", value: "143", helper: "en ventana analizada" },
            { label: "Incidencias", value: "4", helper: "quiebres detectados" },
            { label: "Coincidencia", value: "99.1%", helper: "lecturas enlazadas" },
        ],
        chart: { series: [120, 128, 132, 137, 145, 151, 149, 156, 160, 162, 168, 170, 167, 171, 175, 178, 181, 180, 184, 186, 190, 188, 192, 196], caption: "30 dias · pico 196", highlightIndex: 23 },
        distribution: [
            { label: "SKU estables", percent: 84, value: "84%", color: "#2563eb" },
            { label: "Lote compartido", percent: 9, value: "9%", color: "#38bdf8" },
            { label: "Con desvio", percent: 5, value: "5%", color: "#fb7185" },
            { label: "Pendiente", percent: 2, value: "2%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar SKU, lote o referencia",
            filters: ["Todos", "Estables", "Compartidos", "Desvios", "Pendientes"],
            columns: ["SKU", "Lote", "Origen", "Destino", "Estado", "PDF"],
            rows: [
                ["SKU-4402", "LT-2026-18", "Valencia", "Murcia", { type: "badge", value: "OK" }, { type: "pdf" }],
                ["SKU-7710", "LT-2026-21", "Huelva", "Madrid", { type: "badge", value: "Aviso" }, { type: "pdf" }],
                ["SKU-9031", "LT-2026-30", "Sevilla", "Bilbao", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "cold",
        title: "Cadena de frio",
        subtitle: "Cumplimiento de rangos termicos y excursiones detectadas",
        cardDescription: "Cumplimiento de rangos termicos y excursiones...",
        icon: "pi pi-sun",
        theme: "cyan",
        metrics: [
            { label: "Pallets bajo cadena", value: "1.090", helper: "" },
            { label: "Cumplimiento", value: "98,4%", helper: "+0,3 pt vs sem ant." },
            { label: "Excursiones 24 h", value: "17", helper: "4 criticas" },
            { label: "Tiempo fuera medio", value: "12 min", helper: "por excursion" },
        ],
        chart: { series: [110, 138, 141, 132, 160, 131, 135, 111, 120, 126, 131, 189, 176, 229, 183, 134, 140, 119, 138, 136, 131, 170, 140, 152, 118, 111, 102, 105, 144, 151], caption: "30 dias · pico 372", highlightIndex: 13 },
        distribution: [
            { label: "Congelado (-18 C)", percent: 5, value: "380 · 5%", color: "#1d4ed8" },
            { label: "Refrigerado (0-4 C)", percent: 7, value: "520 · 7%", color: "#0ea5e9" },
            { label: "Fresco (4-8 C)", percent: 2, value: "140 · 2%", color: "#22d3ee" },
            { label: "Ambiente controlado", percent: 1, value: "50 · 1%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar pallet, producto o cliente",
            filters: ["Todos", "Criticas", "Recientes", "Congelado", "Refrigerado", "Fresco"],
            columns: ["Pallet", "Producto", "Rango", "Temp actual", "Excursiones", "Tiempo fuera", "Estado", "PDF"],
            rows: [
                ["NEAT-00001", "Salmon fresco", "0-4 C", "+2,4 C", "3", "28 min", { type: "badge", value: "Critico", tone: "danger" }, { type: "pdf" }],
                ["NEAT-00002", "Helado vainilla", "-18 C", "-17,8 C", "1", "9 min", { type: "badge", value: "OK" }, { type: "pdf" }],
                ["NEAT-00003", "Yogur", "0-4 C", "+3,1 C", "0", "—", { type: "badge", value: "OK" }, { type: "pdf" }],
                ["NEAT-00004", "Vacuna A-12", "2-8 C", "+5,2 C", "2", "14 min", { type: "badge", value: "Aviso", tone: "warning" }, { type: "pdf" }],
                ["NEAT-00005", "Carne porcina", "-2-2 C", "+0,4 C", "0", "—", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "fefo",
        title: "Caducidad y FEFO",
        subtitle: "Productos proximos a caducar y rotacion FEFO priorizada",
        cardDescription: "Productos proximos a caducar y rotacion FEFO...",
        icon: "pi pi-clock",
        theme: "amber",
        metrics: [
            { label: "Lotes FEFO", value: "143", helper: "en control" },
            { label: "Proximos a caducar", value: "11", helper: "menos de 7 dias" },
            { label: "Rotacion", value: "96,2%", helper: "cumplimiento FEFO" },
            { label: "Bloqueos", value: "2", helper: "revision manual" },
        ],
        chart: { series: [96, 92, 94, 97, 99, 101, 98, 102, 104, 108, 103, 106, 111, 109, 115, 110, 113, 117, 119, 116, 121, 124, 126, 129], caption: "30 dias · pico 129", highlightIndex: 23 },
        distribution: [
            { label: "Dentro de fecha", percent: 86, value: "86%", color: "#f59e0b" },
            { label: "Atencion", percent: 9, value: "9%", color: "#fb923c" },
            { label: "Urgente", percent: 4, value: "4%", color: "#ef4444" },
            { label: "Bloqueado", percent: 1, value: "1%", color: "#94a3b8" },
        ],
        table: {
            searchPlaceholder: "Buscar lote, SKU o cliente",
            filters: ["Todos", "Urgentes", "Atencion", "Bloqueados", "FEFO"],
            columns: ["Lote", "Producto", "Caduca", "Cliente", "Estado", "PDF"],
            rows: [
                ["LT-2026-91", "Frutos rojos mix", "18/06/2026", "Barcelona", { type: "badge", value: "Urgente", tone: "danger" }, { type: "pdf" }],
                ["LT-2026-88", "Helado vainilla", "21/06/2026", "Madrid", { type: "badge", value: "Atencion", tone: "warning" }, { type: "pdf" }],
                ["LT-2026-72", "Yogur", "29/06/2026", "Murcia", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "anomalias",
        title: "Anomalias de contenido",
        subtitle: "Discrepancias entre la carga declarada y la detectada por sensores",
        cardDescription: "Discrepancias entre la carga declarada y la detectada p...",
        icon: "pi pi-exclamation-triangle",
        theme: "rose",
        metrics: [
            { label: "Anomalias", value: "23", helper: "en la ventana activa" },
            { label: "Impacto", value: "3,1%", helper: "sobre expediciones" },
            { label: "Pendientes", value: "7", helper: "sin resolver" },
            { label: "Resueltas", value: "16", helper: "ultimos 30 dias" },
        ],
        chart: { series: [8, 10, 9, 12, 13, 12, 11, 15, 14, 13, 16, 18, 17, 16, 15, 14, 16, 18, 17, 19, 20, 18, 17, 16], caption: "30 dias · pico 20", highlightIndex: 20 },
        distribution: [
            { label: "Peso", percent: 42, value: "42%", color: "#f87171" },
            { label: "Cantidad", percent: 28, value: "28%", color: "#fb7185" },
            { label: "Producto", percent: 18, value: "18%", color: "#fca5a5" },
            { label: "Otros", percent: 12, value: "12%", color: "#cbd5e1" },
        ],
        table: {
            searchPlaceholder: "Buscar envio, lote o incidencia",
            filters: ["Todos", "Peso", "Cantidad", "Producto", "Pendientes"],
            columns: ["Envio", "Tipo", "Descripcion", "Estado", "PDF"],
            rows: [
                ["NEAT-00231", "Peso", "Diferencia de 42 kg", { type: "badge", value: "Pendiente", tone: "warning" }, { type: "pdf" }],
                ["NEAT-00237", "Producto", "SKU no esperado", { type: "badge", value: "Critico", tone: "danger" }, { type: "pdf" }],
                ["NEAT-00241", "Cantidad", "2 bultos menos", { type: "badge", value: "Resuelto" }, { type: "pdf" }],
            ],
        },
    },
    {
        id: "rotacion",
        title: "Rotacion de inventario",
        subtitle: "Velocidad de salida y productos lentos por familia",
        cardDescription: "Velocidad de salida y productos lentos por...",
        icon: "pi pi-history",
        theme: "violet",
        metrics: [
            { label: "SKU lentas", value: "14", helper: "bajo umbral de giro" },
            { label: "Rotacion media", value: "7,8x", helper: "anualizada" },
            { label: "Cobertura", value: "19 dias", helper: "stock medio" },
            { label: "Mejora", value: "+4%", helper: "vs periodo anterior" },
        ],
        chart: { series: [72, 70, 73, 75, 77, 74, 78, 80, 79, 81, 82, 84, 83, 85, 86, 87, 89, 88, 90, 91, 92, 91, 93, 95], caption: "30 dias · pico 95", highlightIndex: 23 },
        distribution: [
            { label: "Alta rotacion", percent: 48, value: "48%", color: "#8b5cf6" },
            { label: "Media", percent: 31, value: "31%", color: "#a78bfa" },
            { label: "Lenta", percent: 17, value: "17%", color: "#c4b5fd" },
            { label: "Parada", percent: 4, value: "4%", color: "#cbd5e1" },
        ],
        table: {
            searchPlaceholder: "Buscar SKU o familia",
            filters: ["Todos", "Lentas", "Paradas", "Alta rotacion"],
            columns: ["SKU", "Familia", "Giro", "Cobertura", "Estado", "PDF"],
            rows: [
                ["SKU-9910", "Congelado", "2,1x", "41 dias", { type: "badge", value: "Lento", tone: "warning" }, { type: "pdf" }],
                ["SKU-9921", "Fresco", "0,8x", "73 dias", { type: "badge", value: "Parado", tone: "danger" }, { type: "pdf" }],
                ["SKU-4402", "Refrigerado", "9,3x", "12 dias", { type: "badge", value: "OK" }, { type: "pdf" }],
            ],
        },
    },
];

export default function EnvioContenido() {
    return <InformePlaceholder reports={reports} initialReportId="cold" />;
}
