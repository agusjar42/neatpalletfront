import React, { useEffect, useState } from "react";
import QRCode from 'qrcode';

const CodigoQR = ({ url }) => {
    const [urlQR, setUrlQR] = useState('');
    useEffect(() => {
        // Genera el QR code a partir del texto recibido
        async function mostrarQR() {
            try {
                const options = {
                    errorCorrectionLevel: 'H',
                    //type: 'image/jpeg',
                    quality: 0.3,
                    margin: 1,
                    scale: 2.5,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF"
                    }
                }
                const _url = await QRCode.toDataURL(url, options);
                setUrlQR(_url);
            } catch (err) {
                console.error('Error generando QR Code:', err);
            }
        }
        mostrarQR();
    }, []);


    return (
            <img src={urlQR} alt="Código QR" />
            
    );
}
export default CodigoQR;