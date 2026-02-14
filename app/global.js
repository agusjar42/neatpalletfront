// AutoLogout.js
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import Swal from 'sweetalert2';
import { useAuth } from "@/app/auth/AuthContext";

const AutoLogout = () => {
  //const dispatch = useDispatch();
  const { logout } = useAuth();
  const timeoutId = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    const resetearTiempo = () => {
      // Siempre limpia el temporizador existente (por ejemplo tras logout manual)
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      //
      //Si el usuario esta logeado entonces se ejecuta el temporizador
      //
      if (localStorage.getItem('userDataNeatpallet')) {
        // Tiempo de inactividad permitido en milisegundos (por ejemplo, 1 hora)
        let inactivityTimeout = 5 * 60 * 1000; // 5 minutos
        const tiempoEsperaMinutos = localStorage.getItem('tiempoDeEsperaInactividad')
        if (tiempoEsperaMinutos) {
          inactivityTimeout = tiempoEsperaMinutos * 60 * 1000; // Convertimos el tiempo Real de inactividad configurado a milisegundos
        }
        // Inicia un nuevo temporizador
        timeoutId.current = setTimeout(() => {
          // Muestra el swal antes de cerrar sesión
          Swal.fire({
            title: intl.formatMessage({ id: 'Sesión cerrada por inactividad' }),
            text: intl.formatMessage({ id: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' }),
            icon: 'info',
            showConfirmButton: false,
            timer: 5000, // Opcional: Cierra automáticamente el swal después de 5 segundos
            allowOutsideClick: false // Opcional: No permite cerrar el swal haciendo clic fuera de él
          }).then(() => {
            // Cierro la sesión usando el método del AuthContext
            logout()
          });
        }, inactivityTimeout);
      }
    }
    // Eventos que reinician el temporizador
    const eventos = ['mousemove', 'keydown', 'scroll', 'click'];
    eventos.forEach((event) => {
      window.addEventListener(event, resetearTiempo);
    });

    const handleLoggedOut = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
    window.addEventListener('authLoggedOut', handleLoggedOut);

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
      window.removeEventListener('authLoggedOut', handleLoggedOut);
    };
  }, [logout, intl]);

  return null;
};

export default AutoLogout;
