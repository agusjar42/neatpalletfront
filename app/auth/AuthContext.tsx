"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextProps {
  usuarioAutenticado: boolean;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const token = Cookies.get('authToken');
    //Si usuario esta autenticado o esta en la pagina de publica de autenticacion, se le permite el acceso
    if (token || pathname.includes('/auth/')) {
      setUsuarioAutenticado(true);
    } else {
      setUsuarioAutenticado(false);
      router.push('/auth/login');
    }
  }, [router]);

  const login = (token: string, rememberMe: boolean) => {
    Cookies.set('authToken', token, { expires: rememberMe ? 7 : undefined });
    setUsuarioAutenticado(true);
    router.push('/tablas-maestras/empresa');
  };

  const logout = () => {
    Cookies.remove('authToken');
    setUsuarioAutenticado(false);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ usuarioAutenticado, login, logout }}>
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
