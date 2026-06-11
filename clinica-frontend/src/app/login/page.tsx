// app/login/page.tsx - Página de autenticación (Login/Registro)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const { login, registrar, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rol: "Dentista",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await registrar(formData.email, formData.password, formData.rol);
      }
    } catch (error) {
      // El error ya fue mostrado por el toast en el contexto
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(247,219,234,0.9),_rgba(255,243,224,0.9),_rgba(255,255,255,1))] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-[0_24px_80px_-48px_rgba(146,88,189,0.45)]">
        <div className="mb-8 text-center">
          <p className="inline-flex rounded-full bg-[#f8d8e0] px-4 py-1 text-sm font-semibold text-[#7f4e7f] shadow-sm">
            Clínica Fuenzalida
          </p>
          <h1 className="mt-6 text-3xl font-semibold text-[#3e2a49]">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="mt-2 text-[#6f5a75]">
            {isLogin
              ? "Accede a tu panel de control"
              : "Crea una nueva cuenta en la clínica"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3e2a49] mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={isLoading}
              className="w-full rounded-full border border-[#e0d5e7] bg-[#f9f5fc] px-5 py-3 text-[#3e2a49] placeholder-[#b8afc4] transition focus:outline-none focus:ring-2 focus:ring-[#d58ce0] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3e2a49] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full rounded-full border border-[#e0d5e7] bg-[#f9f5fc] px-5 py-3 text-[#3e2a49] placeholder-[#b8afc4] transition focus:outline-none focus:ring-2 focus:ring-[#d58ce0] disabled:opacity-50"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#3e2a49] mb-2">
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-full border border-[#e0d5e7] bg-[#f9f5fc] px-5 py-3 text-[#3e2a49] transition focus:outline-none focus:ring-2 focus:ring-[#d58ce0] disabled:opacity-50"
              >
                <option value="Dentista">Dentista</option>
                <option value="Admin">Administrador</option>
                <option value="Recepcion">Recepción</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c76fd4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Cargando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#6f5a75]">
            {isLogin
              ? "¿No tienes cuenta? "
              : "¿Ya tienes cuenta? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: "", password: "", rol: "Dentista" });
              }}
              className="font-semibold text-[#d58ce0] hover:text-[#c76fd4]"
            >
              {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
