// context/AuthContext.tsx - Contexto global de autenticación

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Usuario {
  id?: number;
  email: string;
  rol: string;
  is_active?: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (email: string, password: string, rol: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar si hay token en localStorage al montar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const usuarioGuardado = localStorage.getItem("usuario");

      if (token && usuarioGuardado) {
        try {
          setUsuario(JSON.parse(usuarioGuardado));
        } catch (error) {
          console.error("Error al parsear usuario:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("usuario");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password);

      const usuarioData: Usuario = {
        email,
        rol: "Dentista",
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioData));
      setUsuario(usuarioData);
      toast.success("Sesión iniciada correctamente");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error en login:", error);
      toast.error(
        error.response?.data?.detail || "Error al iniciar sesión"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (email: string, password: string, rol: string) => {
    try {
      setIsLoading(true);
      await apiClient.registrarUsuario(email, password, rol);

      const usuarioData: Usuario = { email, rol };
      localStorage.setItem("usuario", JSON.stringify(usuarioData));
      setUsuario(usuarioData);

      toast.success("Registro exitoso");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error en registro:", error);
      toast.error(
        error.response?.data?.detail || "Error al registrarse"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    toast.success("Sesión cerrada");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoading,
        isAuthenticated: !!usuario,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
