"use client";

import { useMemo, useState } from "react";
import LogsSistemaTabs from "./LogsSistemaTabs";

const buildPath = (values) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const width = 760;
    const height = 180;
    const step = width / (values.length - 1);

    return values.map((value, index) => {
        const x = index * step;
        const ratio = max === min ? 0.5 : (value - min) / (max - min);
        const y = height - ratio * 140 - 20;
        return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
};

const ReportHero = ({ report, range }) => (
    <section className={`report-hero report-hero-${report.theme}`}>
        <div className="report-hero-copy">
            <span>Informes</span>
            <h1>{report.title}</h1>
            <p>{report.subtitle}</p>
        </div>
        <div className="report-hero-actions">
            <div className="report-range-group">
                {["Hoy", "Ultimos 7 dias", "Ultimos 30 dias", "Ultimos 90 dias"].map((label) => (
                    <button key={label} type="button" className={label === range ? "active" : ""}>
                        {label}
                    </button>
                ))}
            </div>
            <button type="button" className="report-download-button">
                <i className="pi pi-download" aria-hidden="true"></i>
                Descargar PDF
            </button>
        </div>
        <div className="report-hero-waves" aria-hidden="true"></div>
    </section>
);

const ReportTypeSelector = ({ reports, selectedId, onSelect }) => (
    <section className="report-type-section">
        <div className="report-type-header">
            <span>Tipo de informe</span>
            <small>{reports.length} disponibles</small>
        </div>
        <div className="report-type-grid">
            {reports.map((report) => (
                <button
                    key={report.id}
                    type="button"
                    className={`report-type-card ${report.id === selectedId ? "active" : ""}`}
                    onClick={() => onSelect(report.id)}
                >
                    <span className={`report-type-icon report-type-icon-${report.theme}`}>
                        <i className={report.icon} aria-hidden="true"></i>
                    </span>
                    <div>
                        <strong>{report.title}</strong>
                        <small>{report.cardDescription}</small>
                    </div>
                </button>
            ))}
        </div>
    </section>
);

const ReportSummary = ({ metrics }) => (
    <section className="report-summary-grid">
        {metrics.map((metric) => (
            <article key={metric.label} className="report-summary-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.helper}</small>
            </article>
        ))}
    </section>
);

const ReportChart = ({ chart, theme }) => {
    const path = useMemo(() => buildPath(chart.series), [chart.series]);

    return (
        <article className="report-panel report-chart-panel">
            <div className="report-panel-header">
                <h3>Evolucion temporal</h3>
                <small>{chart.caption}</small>
            </div>
            <svg viewBox="0 0 760 190" className="report-chart" aria-label="Grafico temporal">
                <defs>
                    <linearGradient id={`report-gradient-${theme}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d="M 0 160 H 760" className="report-chart-grid" />
                <path d="M 0 120 H 760" className="report-chart-grid" />
                <path d="M 0 80 H 760" className="report-chart-grid" />
                <path d="M 0 40 H 760" className="report-chart-grid" />
                <path d={`${path} L 760 190 L 0 190 Z`} fill={`url(#report-gradient-${theme})`} className={`report-chart-area report-chart-area-${theme}`} />
                <path d={path} className={`report-chart-line report-chart-line-${theme}`} />
                {chart.highlightIndex !== undefined && (
                    <circle
                        cx={(760 / (chart.series.length - 1)) * chart.highlightIndex}
                        cy={(() => {
                            const max = Math.max(...chart.series);
                            const min = Math.min(...chart.series);
                            const ratio = max === min ? 0.5 : (chart.series[chart.highlightIndex] - min) / (max - min);
                            return 180 - ratio * 140 - 20;
                        })()}
                        r="4"
                        className={`report-chart-dot report-chart-dot-${theme}`}
                    />
                )}
                <text x="0" y="188">-29d</text>
                <text x="370" y="188">-14d</text>
                <text x="742" y="188">hoy</text>
            </svg>
        </article>
    );
};

const ReportDistribution = ({ distribution }) => (
    <article className="report-panel report-distribution-panel">
        <div className="report-panel-header">
            <h3>Distribucion</h3>
        </div>
        <div className="report-distribution-list">
            {distribution.map((item) => (
                <div key={item.label} className="report-distribution-row">
                    <span className="report-distribution-label">
                        <i style={{ background: item.color }} aria-hidden="true"></i>
                        {item.label}
                    </span>
                    <div className="report-distribution-bar">
                        <b style={{ width: `${item.percent}%`, background: item.color }}></b>
                    </div>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </div>
    </article>
);

const ReportTable = ({ table, theme }) => (
    <section className="report-table-shell">
        <div className="report-table-toolbar">
            <div className="report-table-search">
                <i className="pi pi-search" aria-hidden="true"></i>
                <span>{table.searchPlaceholder}</span>
            </div>
            <div className="report-table-filters">
                {table.filters.map((filter, index) => (
                    <button key={filter} type="button" className={index === 0 ? `active active-${theme}` : ""}>
                        {filter}
                    </button>
                ))}
            </div>
        </div>
        <div className="report-table-wrap">
            <table className="report-table">
                <thead>
                    <tr>
                        {table.columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row, rowIndex) => (
                        <tr key={`${table.title || "row"}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                                <td key={`${rowIndex}-${cellIndex}`}>
                                    {typeof cell === "object" && cell !== null ? (
                                        cell.type === "badge" ? (
                                            <span className={`report-badge ${cell.tone || ""}`}>{cell.value}</span>
                                        ) : (
                                            <button type="button" className={`report-pdf-button report-pdf-button-${theme}`}>
                                                <i className="pi pi-download" aria-hidden="true"></i>
                                                PDF
                                            </button>
                                        )
                                    ) : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
);

const InformePlaceholder = ({ reports, initialReportId }) => {
    const [selectedId, setSelectedId] = useState(initialReportId ?? reports[0]?.id);
    const activeReport = reports.find((report) => report.id === selectedId) ?? reports[0];

    if (!activeReport) {
        return null;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <LogsSistemaTabs />
                <div className="report-dashboard-shell">
                    <ReportHero report={activeReport} range="Ultimos 30 dias" />
                    <ReportTypeSelector reports={reports} selectedId={selectedId} onSelect={setSelectedId} />
                    <ReportSummary metrics={activeReport.metrics} />
                    <div className="report-panels-grid">
                        <ReportChart chart={activeReport.chart} theme={activeReport.theme} />
                        <ReportDistribution distribution={activeReport.distribution} />
                    </div>
                    <ReportTable table={activeReport.table} theme={activeReport.theme} />
                </div>
            </div>
        </div>
    );
};

export default InformePlaceholder;
