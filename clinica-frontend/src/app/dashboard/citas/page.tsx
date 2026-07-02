"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Cita {
  id: number;
  paciente_id: number;
  dentista_id: number;
  fecha_hora: string;
  estado: string;
  motivo?: string;
  notas?: string;
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    paciente_id: "",
    dentista_id: "",
    fecha_hora: "",
    motivo: "",
    notas: "",
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await apiClient.listarCitas();
        setCitas(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar las citas");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const nueva = await apiClient.crearCita({
        paciente_id: Number(form.paciente_id),
        dentista_id: Number(form.dentista_id),
        fecha_hora: form.fecha_hora,
        motivo: form.motivo,
        notas: form.notas,
      });
      setCitas((prev) => [nueva, ...prev]);
      toast.success("Cita creada correctamente");
      setForm({ paciente_id: "", dentista_id: "", fecha_hora: "", motivo: "", notas: "" });
    } catch (error) {
      console.error(error);
      toast.error("Error creando la cita");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Agenda de Citas</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Administra la agenda general de la clínica y programa nuevas consultas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al dashboard
            </Link>
            <Link href="/" className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Menú principal
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Programar nueva cita</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  value={form.paciente_id}
                  onChange={(e) => setForm({ ...form, paciente_id: e.target.value })}
                  placeholder="ID Paciente"
                  className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                  required
                />
                <input
                  type="number"
                  value={form.dentista_id}
                  onChange={(e) => setForm({ ...form, dentista_id: e.target.value })}
                  placeholder="ID Dentista"
                  className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                  required
                />
              </div>
              <input
                type="datetime-local"
                value={form.fecha_hora}
                onChange={(e) => setForm({ ...form, fecha_hora: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                required
              />
              <textarea
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Motivo" 
                className="w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
              />
              <textarea
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                placeholder="Notas adicionales"
                className="w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]"
              >
                Crear cita
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Resumen rápido</h3>
            <p className="text-sm text-[#6f5a75]">Ingresa el paciente y dentista para ver la agenda y evitar solapamientos de horarios.</p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
          <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Citas registradas</h3>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#d58ce0] border-t-transparent"></div>
            </div>
          ) : citas.length === 0 ? (
            <p className="text-sm text-[#6f5a75]">No hay citas programadas.</p>
          ) : (
            <div className="space-y-4">
              {citas.map((cita) => (
                <div key={cita.id} className="rounded-3xl border border-[#f0e4f6] bg-[#fcf7ff] p-4">
                  <p className="text-sm font-semibold text-[#3e2a49]">Paciente #{cita.paciente_id} · Dentista #{cita.dentista_id}</p>
                  <p className="mt-2 text-sm text-[#6f5a75]">Fecha: {new Date(cita.fecha_hora).toLocaleString()}</p>
                  <p className="text-sm text-[#6f5a75]">Estado: {cita.estado}</p>
                  {cita.motivo && <p className="text-sm text-[#6f5a75]">Motivo: {cita.motivo}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
