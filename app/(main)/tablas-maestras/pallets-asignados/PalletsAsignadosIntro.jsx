"use client";

const PalletsAsignadosIntro = ({ pallets = [], empresas = [], estadoPorPallet }) => {
    const total = pallets.length;
    const asignados = pallets.filter((pallet) => estadoPorPallet?.get(String(pallet?.id))?.asignacionActual).length;
    const disponibles = Math.max(total - asignados, 0);
    const porcentajeAsignados = total > 0 ? Math.round((asignados / total) * 100) : 0;
    const empresasConStock = new Set(
        pallets
            .map((pallet) => estadoPorPallet?.get(String(pallet?.id))?.asignacionActual?.empresaId)
            .filter((empresaId) => empresaId !== undefined && empresaId !== null)
    ).size;

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Pallets asignados</h1>
                <p>
                    Asigna o libera pallets entre empresas cliente. Los pallets sin empresa aparecen disponibles para reasignar.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de pallets asignados">
                <div className="neat-summary-item">
                    <span>Pallets totales</span>
                    <strong>{total}</strong>
                    <small>en circulación</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Asignados</span>
                    <strong>{asignados}</strong>
                    <small>{porcentajeAsignados}% del total</small>
                </div>
                <div className="neat-summary-item">
                    <span>Disponibles</span>
                    <strong>{disponibles}</strong>
                    <small>listos para asignar</small>
                </div>
                <div className="neat-summary-item">
                    <span>Empresas con stock</span>
                    <strong>{empresasConStock}</strong>
                    <small>de {empresas.length} configuradas</small>
                </div>
            </div>
        </section>
    );
};

export default PalletsAsignadosIntro;
