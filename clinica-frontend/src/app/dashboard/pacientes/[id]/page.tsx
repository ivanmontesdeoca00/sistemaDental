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
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    edad: "",
    lugar_origen: "",
    contacto_emergencia: "",
    patologias: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) return;

    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.obtenerPaciente(pacienteId);
        setPaciente(data);
        setForm({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          fecha_nacimiento: data.fecha_nacimiento || "",
          edad: data.edad?.toString() || "",
          lugar_origen: data.lugar_origen || "",
          contacto_emergencia: data.contacto_emergencia || "",
          patologias: data.patologias || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el paciente");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [pacienteId]);

  const guardarPaciente = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const datos: any = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        direccion: form.direccion,
        fecha_nacimiento: form.fecha_nacimiento || undefined,
        edad: form.edad ? Number(form.edad) : undefined,
        lugar_origen: form.lugar_origen,
        contacto_emergencia: form.contacto_emergencia,
        patologias: form.patologias,
      };
      const actualizado = await apiClient.actualizarPaciente(pacienteId, datos);
      setPaciente(actualizado);
      toast.success("Paciente actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error actualizando el paciente");
    }
  };

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
            <Link href="/dashboard" className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Menú principal
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/historia`} className="rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              Ver Historia Clínica
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/odontograma`} className="rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              Ver Odontograma
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/finanzas`} className="rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              Ver Finanzas
            </Link>
          </div>
          {paciente ? (
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
                <div>
                  <span className="font-semibold text-[#3e2a49]">Edad:</span> {paciente.edad ?? "No registrada"}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Origen:</span> {paciente.lugar_origen || "No registrado"}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Contacto emergencia:</span> {paciente.contacto_emergencia || "No registrado"}
                </div>
                <div>
                  <span className="font-semibold text-[#3e2a49]">Patologías:</span> {paciente.patologias || "No registradas"}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49]">Editar paciente</h3>
              <form onSubmit={guardarPaciente} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Nombre</span>
                    <input
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Apellido</span>
                    <input
                      value={form.apellido}
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                      className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Edad</span>
                    <input
                      type="number"
                      min="0"
                      value={form.edad}
                      onChange={(e) => setForm({ ...form, edad: e.target.value })}
                      className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Origen</span>
                    <input
                      value={form.lugar_origen}
                      onChange={(e) => setForm({ ...form, lugar_origen: e.target.value })}
                      className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    />
                  </label>
                </div>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Contacto emergencia</span>
                  <input
                    value={form.contacto_emergencia}
                    onChange={(e) => setForm({ ...form, contacto_emergencia: e.target.value })}
                    className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                  />
                </label>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Patologías</span>
                  <textarea
                    value={form.patologias}
                    onChange={(e) => setForm({ ...form, patologias: e.target.value })}
                    className="w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    rows={4}
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]"
                >
                  Guardar cambios
                </button>
              </form>
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
