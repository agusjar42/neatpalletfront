'use client';

import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';

const NotFoundPage = () => {
    const router = useRouter();

    const goHome = () => {
        router.push('/');
    };

    const goBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex align-items-center justify-content-center px-4">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    {/* Icono de error */}
                    <div className="mb-4">
                        <i className="pi pi-exclamation-triangle text-6xl text-orange-500"></i>
                    </div>

                    {/* Título */}
                    <h1 className="text-6xl font-bold text-900 mb-4">404</h1>
                    
                    {/* Subtítulo */}
                    <h2 className="text-xl text-600 mb-4">Página no encontrada</h2>
                    
                    {/* Descripción */}
                    <p className="text-500 mb-6 line-height-3">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-column gap-3 md:flex-row md:justify-content-center">
                        <Button 
                            label="Ir al inicio" 
                            icon="pi pi-home"
                            className="p-button-raised"
                            onClick={goHome}
                        />
                        <Button 
                            label="Volver atrás" 
                            icon="pi pi-arrow-left"
                            className="p-button-outlined"
                            onClick={goBack}
                        />
                    </div>

                    {/* Enlaces útiles */}
                    <div className="mt-6">
                        <p className="text-sm text-500 mb-2">Enlaces útiles:</p>
                        <div className="flex flex-wrap justify-content-center gap-2">
                            <Button 
                                label="Inicio" 
                                link
                                className="p-button-text text-xs"
                                onClick={goHome}
                            />
                            <Button 
                                label="Productos" 
                                link
                                className="p-button-text text-xs"
                                onClick={() => router.push('/producto')}
                            />
                            <Button 
                                label="Usuarios" 
                                link
                                className="p-button-text text-xs"
                                onClick={() => router.push('/usuarios')}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default NotFoundPage;
