"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { obtenerRolDashboard } from "@/app/api-endpoints/rol";
import Cookies from 'js-cookie';
import { devuelveBasePath, emptyCache } from '../utility/Utils';
import jwt from "@/app/auth/jwt/useJwt";
import { getEmpresa } from "@/app/api-endpoints/empresa";
import { postLogUsuario } from "@/app/api-endpoints/log_usuario";
import { getIdioma } from "@/app/api-endpoints/idioma";
import { getVistaEmpresaRol } from "@/app/api-endpoints/rol";
import { obtenerTodosLosPermisos } from "@/app/components/shared/componentes";
interface AuthContextProps {
  usuarioAutenticado: boolean;
  isInitialized: boolean;
  login: (token: string, rememberMe: boolean, data: any) => void;
  logout: (mensaje?: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const config = jwt.jwtConfig;
  const isLoggingOutRef = useRef(false);

  // Verificar si el usuario está autenticado al inicializar la aplicación
  useEffect(() => {
    const verificarAutenticacion = () => {
      const token = Cookies.get('authToken');
      const userData = localStorage.getItem('userDataNeatpallet');
      
      if (token && userData) {
        // Verificar que el token no haya expirado (opcional)
        try {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData) {
            setUsuarioAutenticado(true);
          }
        } catch (error) {
          // Si hay error al parsear los datos, limpiar y mantener como no autenticado
          Cookies.remove('authToken');
          localStorage.removeItem('userDataNeatpallet');
          setUsuarioAutenticado(false);
        }
      } else {
        setUsuarioAutenticado(false);
      }
      setIsInitialized(true);
    };

    verificarAutenticacion();
  }, []);

  // Redirigir a login si no está autenticado y está en una ruta protegida
  useEffect(() => {
    if (isInitialized) {
      const rutasPublicas = [
        '/auth/login',
        '/auth/register',
        '/auth/forgotpassword',
        '/auth/verification',
        '/auth/newpassword',
        '/forgot-password',
        '/reset-password',
        '/landing',
        '/pages/notfound',
        '/not-found',
      ];
      const esRutaPublica = rutasPublicas.some(ruta => pathname.startsWith(ruta));
      
      if (!usuarioAutenticado && !esRutaPublica) {
        router.replace('/auth/login');
      }
    }
  }, [usuarioAutenticado, isInitialized, pathname, router]);

  const login = async (token: string, rememberMe: boolean, data: any) => {
    Cookies.set('authToken', token, { expires: rememberMe ? 7 : undefined });
    isLoggingOutRef.current = false;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('np_logging_out');
    }
    setUsuarioAutenticado(true);
    await almacenarLogin(data);
    router.push(await obtenerRolDashboard());
  };
  //Obtenemos el menu lateral a en base a los permisos del usuario
  const getMenuLateral = async () => {
    type MenuItem = {
      label: string;
      path: string;
      icon: string;
      permisoControlador: string;
    };

    const jsonRutas: MenuItem[] = [
      { label: "Empresa",                       path: "/tablas-maestras/empresa",           icon: "pi pi-building",             permisoControlador: "Empresas" },
      { label: "Roles",                         path: "/tablas-maestras/rol",               icon: "pi pi-bars",                 permisoControlador: "Roles" },
      { label: "Permisos",                      path: "/tablas-maestras/permiso",           icon: "pi pi-key",                  permisoControlador: "Permisos" },
      { label: "Paises",                        path: "/tablas-maestras/pais",              icon: "pi pi-globe",                permisoControlador: "Paises" },
      { label: "Parametros del Palet",          path: "/parametro",                         icon: "pi pi-wrench",               permisoControlador: "Parametro" },
      { label: "Idiomas",                       path: "/tablas-maestras/idioma",            icon: "pi pi-language",             permisoControlador: "Idiomas" },
      { label: "Traducciones",                  path: "/tablas-maestras/traduccion",        icon: "pi pi-bars",                 permisoControlador: "Traducciones" },
      { label: "Tipos de sensores",             path: "/tipo-sensor",                       icon: "pi pi-circle",               permisoControlador: "Tipo Sensor" },
      { label: "Configuracion",                 path: "/eventos-configuracion",             icon: "pi pi-bell",                 permisoControlador: "Eventos Configuración" },
      { label: "Pallets de Neat",               path: "/pallet",                            icon: "pi pi-th-large",             permisoControlador: "Pallet" },
      { label: "Pallets asignados",             path: "/tablas-maestras/pallets-asignados", icon: "pi pi-sitemap",              permisoControlador: "Pallets Asignados" },
      { label: "Informes contenido",            path: "/proximamente",                      icon: "pi pi-refresh",              permisoControlador: "Envio Contenido" },
      { label: "Informes movimientos",          path: "/proximamente",                      icon: "pi pi-arrow-right",          permisoControlador: "Envio Movimiento" },
      { label: "Informes Pallets",              path: "/proximamente",                      icon: "pi pi-refresh",              permisoControlador: "Envio Pallets" },
      { label: "Logs de sistema",               path: "/logs-incorrectos",                  icon: "pi pi-exclamation-triangle", permisoControlador: "Logs incorrectos" },
      { label: "Logs de usuario",               path: "/tablas-maestras/log_usuario",       icon: "pi pi-history",              permisoControlador: "Logs de usuarios" },
    ];

    // Obtener los permisos del usuario actual de "Acceder"
    const permisos = await obtenerTodosLosPermisos('Acceder');
    const permisosControlador = new Set(
      Array.isArray(permisos) ? permisos.map((permiso) => permiso.permisoControlador) : []
    );

    // Declaramos el objeto que sera el menu final y le ponemos un titulo de menu
    const jsonPermisos: {
      label: string;
      icon: string;
      items: { label: string; icon: string; to: string; }[];
    } = {
      label: "Menu",
      icon: "pi pi-fw pi-minus",
      items: []
    };

    for (const item of jsonRutas) {
      if (permisosControlador.has(item.permisoControlador)) {
        jsonPermisos['items'].push({
          label: item.label,
          icon: item.icon,
          to: item.path,
        });
      }
    }

    localStorage.setItem('menuLateral', JSON.stringify([jsonPermisos]));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('menuLateralUpdated'));
    }
  }

  const almacenarLogin = async (data: any) => {
    localStorage.setItem(config.storageTokenKeyName, (data.accessToken));
    localStorage.setItem('userDataNeatpallet', JSON.stringify({ ...data }));
    localStorage.setItem('empresa', data.empresaId);

    //Obtiene el idioma del usuario
    if (data && data.idiomaId) {
      const idioma = await getIdioma(data.idiomaId);
      localStorage.setItem('idioma', idioma.iso || '');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('idioma-changed', { detail: idioma.iso || '' }));
      }
    }

    //Obtiene el timer de la empresa del usuario
    const empresa = await getEmpresa(data.empresaId);
    if (empresa?.tiempoInactividad && empresa?.tiempoInactividad > 0) {
      localStorage.setItem('tiempoDeEsperaInactividad', '' + empresa?.tiempoInactividad);
    }
    if (await compruebaRolUsuario({ ...data })) {
      //Si tiene que mostrar la empresa, obtenemos el logo
      localStorage.setItem('logoEmpresaUrl', empresa.logo || `${(devuelveBasePath())}/multimedia/sistemaNP/imagen-no-disponible.jpeg`);
    }

    //Obtiene la ip del usuario usando la API de ipify, es de codigo abierto y tiene usos infinitos
    const response = await fetch('https://api.ipify.org?format=json');
    const ip = (await response.json()).ip;

    //Sube el log del login al servidor
    const objLogUsuario = {
      usuarioId: data.id,
      ip: ip,
      masDatos: 'login',
      usuCreacion: data.id,
      fechaRegistro: new Date(),
    }
    await postLogUsuario(objLogUsuario);
    await getMenuLateral();
  }

  const compruebaRolUsuario = async (usuario: any) => {
    const queryParamsRol = {
      where: {
        and: {
          id: usuario.rolId
        }
      },
    };
    const rol = await getVistaEmpresaRol(JSON.stringify(queryParamsRol));
    //setMuestraEmpresa(rol[0].muestraEmpresa === 'S')
    return Array.isArray(rol) && rol[0]?.muestraEmpresa === 'S';
  }

  const logout = (mensaje?: string) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('np_logging_out', '1');
    }

    //Vaciamos localStorage y cookies
    Cookies.remove('authToken');
    localStorage.clear();

    // Vacía la caché en segundo plano (sin recargar la página)
    if (typeof mensaje === 'string' && mensaje) {
      localStorage.setItem('toastMensaje', mensaje);
    }

    setUsuarioAutenticado(false);
    router.replace('/auth/login');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authLoggedOut'));
    }

    emptyCache({ reload: false }).catch((error) => {
      console.error("Error al vaciar el cache: ", error)
    });

  };

  return (
    <AuthContext.Provider value={{ usuarioAutenticado, isInitialized, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
