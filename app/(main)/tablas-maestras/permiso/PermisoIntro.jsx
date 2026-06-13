"use client";

const PermisoIntro = ({ permisos = [], roles = [] }) => {
    const secciones = permisos.filter((permiso) => !permiso?.seccion?.includes("-"));
    const acciones = [...new Set(
        permisos
            .filter((permiso) => permiso?.seccion?.includes("-"))
            .map((permiso) => permiso.seccion.split("-").pop())
            .filter(Boolean)
    )];
    const permisosDefinidos = secciones.length * acciones.length * roles.length;

    return (
        <section className="neat-page-intro">
            <div className="neat-page-heading">
                <h1>Permisos</h1>
                <p>
                    Matriz de permisos por rol. Marca qué puede hacer cada rol en cada sección de la plataforma - Acceder, Ver, crear, actualizar o borrar registros.
                </p>
            </div>

            <div className="neat-page-summary" aria-label="Resumen de permisos">
                <div className="neat-summary-item">
                    <span>Secciones</span>
                    <strong>{secciones.length}</strong>
                    <small>cubiertas por la matriz</small>
                </div>
                <div className="neat-summary-item">
                    <span>Acciones por sección</span>
                    <strong>{acciones.length}</strong>
                    <small>{acciones.join(" · ")}</small>
                </div>
                <div className="neat-summary-item neat-summary-success">
                    <span>Roles activos</span>
                    <strong>{roles.length}</strong>
                    <small>columnas en la matriz</small>
                </div>
                <div className="neat-summary-item">
                    <span>Permisos definidos</span>
                    <strong>{permisosDefinidos}</strong>
                    <small>celdas editables</small>
                </div>
            </div>
        </section>
    );
};

export default PermisoIntro;
