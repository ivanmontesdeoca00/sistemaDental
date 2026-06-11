// app/dashboard/page.tsx - Dashboard principal (protegido)

"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import toast from "react-hot-toast";
import Link from "next/link";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

export default function DashboardPage() {
  const { usuario, logout } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.listarPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        toast.error("Error al cargar la lista de pacientes");
      } finally {
        setIsLoading(false);
      }
    };

    cargarPacientes();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(247,219,234,0.9),_rgba(255,243,224,0.9),_rgba(255,255,255,1))]">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/60">
          <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] font-semibold text-[#8b5f6a]">
                Clínica Fuenzalida
              </p>
              <h1 className="text-2xl font-semibold text-[#3e2a49]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3e2a49]">
                  {usuario?.email}
                </p>
                <p className="text-xs text-[#6f5a75]">{usuario?.rol}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-full bg-[#ffe9d9] px-4 py-2 text-sm font-semibold text-[#7d4d61] transition hover:bg-[#ffe0c8]"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-10">
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.4)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                Total Pacientes
              </p>
              <p className="mt-3 text-4xl font-bold text-[#3e2a49]">
                {pacientes.length}
              </p>
              <p className="mt-2 text-sm text-[#6f5a75]">
                Pacientes registrados en el sistema
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.4)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                Citas Hoy
              </p>
              <p className="mt-3 text-4xl font-bold text-[#3e2a49]">0</p>
              <p className="mt-2 text-sm text-[#6f5a75]">Próximamente: integración con agenda</p>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.4)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                Ingresos
              </p>
              <p className="mt-3 text-4xl font-bold text-[#3e2a49]">$0</p>
              <p className="mt-2 text-sm text-[#6f5a75]">Próximamente: módulo de finanzas</p>
            </div>
          </div>

          {/* Pacientes List */}
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.4)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                  Gestión
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#3e2a49]">
                  Pacientes
                </h2>
              </div>
              <Link
                href="/dashboard/pacientes/nuevo"
                className="rounded-full bg-[#f4e3ff] px-6 py-3 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]"
              >
                Agregar Paciente
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#d58ce0] border-t-[#3e2a49]"></div>
              </div>
            ) : pacientes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#6f5a75]">
                  No hay pacientes registrados aún.{" "}
                  <Link
                    href="/dashboard/pacientes/nuevo"
                    className="font-semibold text-[#d58ce0] hover:text-[#c76fd4]"
                  >
                    Agregar primero paciente
                  </Link>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e0d5e7]">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#3e2a49]">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#3e2a49]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#3e2a49]">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-[#3e2a49]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((paciente) => (
                      <tr
                        key={paciente.id}
                        className="border-b border-[#f0e8f5] hover:bg-[#f9f5fc] transition"
                      >
                        <td className="px-4 py-3 text-sm text-[#3e2a49] font-medium">
                          {paciente.nombre} {paciente.apellido}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6f5a75]">
                          {paciente.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6f5a75]">
                          {paciente.telefono || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/dashboard/pacientes/${paciente.id}`}
                            className="text-sm font-semibold text-[#d58ce0] hover:text-[#c76fd4]"
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Próximas funcionalidades */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                Próximas Características
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#6f5a75]">
                <li>✓ Historia Clínica Digital</li>
                <li>✓ Odontograma Interactivo</li>
                <li>✓ Agenda de Citas</li>
                <li>✓ Gestión Financiera</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">
                Estado del Sistema
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6f5a75]">Backend</span>
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    En línea
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6f5a75]">Base de Datos</span>
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Conectada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
