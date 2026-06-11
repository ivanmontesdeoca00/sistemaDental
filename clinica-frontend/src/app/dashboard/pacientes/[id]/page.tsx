"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string | null;
}

export default function PacienteDetailPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const router = useRouter();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) return;

    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.obtenerPaciente(pacienteId);
        setPaciente(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el paciente");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [pacienteId]);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Paciente</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Información detallada y acceso rápido a historia clínica.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.back()} className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver
            </button>
            <Link href={`/dashboard/pacientes/${pacienteId}/historia`} className="rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              Ver Historia Clínica
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#d58ce0] border-t-transparent"></div>
          </div>
        ) : paciente ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49]">Datos personales</h3>
              <div className="mt-6 space-y-4 text-sm text-[#5f4a68]">
                <div>
                  <span className="font-semibold text-[#3e2a49]">Nombre:</span> {paciente.nombre} {paciente.apellido}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Email:</span> {paciente.email}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Teléfono:</span> {paciente.telefono || "No registrado"}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Dirección:</span> {paciente.direccion || "No registrada"}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Fecha de nacimiento:</span> {paciente.fecha_nacimiento || "No registrada"}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49]">Acciones</h3>
              <div className="mt-6 space-y-4 text-sm text-[#5f4a68]">
                <p>Desde aquí puedes revisar la historia clínica del paciente o volver al panel.</p>
                <Link href={`/dashboard/pacientes/${pacienteId}/historia`} className="block rounded-full bg-[#d58ce0] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#be78ce]">
                  Abrir historia clínica
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-sm text-[#8b3e4e]">
            No se encontró el paciente solicitado.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
