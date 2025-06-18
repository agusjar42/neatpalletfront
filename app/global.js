// AutoLogout.js
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import Swal from 'sweetalert2';
import { useAuth } from "@/app/auth/AuthContext";

const AutoLogout = () => {
  //const dispatch = useDispatch();
  const { logout } = useAuth();
  const timeoutId = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    //const inactivityTimeout = 1 * 60 * 1000; // 1 minuto
    const resetearTiempo = () => {
      //Si el usuario esta logeado entonces se ejecuta el temporizador
      if (localStorage.getItem('userDataNeatpallet')) {
        // Tiempo de inactividad permitido en milisegundos (por ejemplo, 1 hora)
        let inactivityTimeout = 5 * 60 * 1000; // 5 minutos
        const tiempoEsperaMinutos = localStorage.getItem('tiempoDeEsperaInactividad')
        if (localStorage.getItem('tiempoDeEsperaInactividad')) {
          inactivityTimeout = tiempoEsperaMinutos * 60 * 1000; // -> minutos * 60 segundos * 1000 milisegundos
        }
        // Limpia el temporizador existente
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        // Inicia un nuevo temporizador
        timeoutId.current = setTimeout(() => {
          // Cierra la sesión automáticamente después de inactividad
          // Muestra el swal antes de cerrar sesión
          Swal.fire({
            title: intl.formatMessage({ id: 'Sesión cerrada por inactividad' }),
            text: intl.formatMessage({ id: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }),
            icon: 'info',
            showConfirmButton: false,
            timer: 5000, // Opcional: Cierra automáticamente el swal después de 5 segundos
            allowOutsideClick: false // Opcional: No permite cerrar el swal haciendo clic fuera de él
          }).then(() => {
            // Lanza el dispatch para cerrar sesión
            //dispatch(logout());
            logout()
          });
        }, inactivityTimeout);
      }

    };

    // Eventos que reinician el temporizador
    const eventos = ['mousemove', 'keydown', 'scroll', 'click'];
    eventos.forEach((event) => {
      window.addEventListener(event, resetearTiempo);
    });

    // Inicia el temporizador por primera vez
    resetearTiempo();

    return () => {
      // Limpia el temporizador y los listeners al desmontar el componente
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      eventos.forEach((event) => {
        window.removeEventListener(event, resetearTiempo);
      });
    };
  },) //[dispatch]);

  return null; // No renderiza nada, ya que es un componente de inicialización
};

export default AutoLogout;
