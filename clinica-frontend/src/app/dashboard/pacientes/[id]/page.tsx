"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
  edad?: number | null;
  lugar_origen?: string | null;
  contacto_emergencia?: string | null;
  patologias?: string | null;
}

interface PacienteForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: string;
  edad: string;
  lugar_origen: string;
  contacto_emergencia: string;
  patologias: string;
}

export default function PacienteDetailPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const router = useRouter();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [form, setForm] = useState<PacienteForm>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    edad: "",
    lugar_origen: "",
    contacto_emergencia: "",
    patologias: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          email: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          fecha_nacimiento: data.fecha_nacimiento ? String(data.fecha_nacimiento) : "",
          edad: data.edad ? String(data.edad) : "",
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

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const guardarPaciente = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      const datos = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
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
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Paciente</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Información detallada y acceso rápido a historia clínica, odontograma y finanzas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.back()} className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver
            </button>
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al dashboard
            </Link>
            <Link href="/" className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Menú principal
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/historia`} className="rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              Ver Historia Clínica
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/consentimientos`} className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Ver Consentimientos
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/archivos`} className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Ver Archivos
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/odontograma`} className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">
              Ver Odontograma
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}/finanzas`} className="rounded-full bg-[#f6f0ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7e0ff]">
              Ver Finanzas
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#d58ce0] border-t-transparent"></div>
          </div>
        ) : paciente ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49]">Ficha rápida del paciente</h3>
              <div className="mt-6 grid gap-3 text-sm text-[#5f4a68] sm:grid-cols-2">
                <div><span className="font-semibold text-[#3e2a49]">Nombre:</span> {paciente.nombre} {paciente.apellido}</div>
                <div><span className="font-semibold text-[#3e2a49]">Email:</span> {paciente.email}</div>
                <div><span className="font-semibold text-[#3e2a49]">Teléfono:</span> {paciente.telefono || "No registrado"}</div>
                <div><span className="font-semibold text-[#3e2a49]">Edad:</span> {paciente.edad ?? "No registrada"}</div>
                <div><span className="font-semibold text-[#3e2a49]">Origen:</span> {paciente.lugar_origen || "No registrado"}</div>
                <div><span className="font-semibold text-[#3e2a49]">Contacto de emergencia:</span> {paciente.contacto_emergencia || "No registrado"}</div>
                <div className="sm:col-span-2"><span className="font-semibold text-[#3e2a49]">Dirección:</span> {paciente.direccion || "No registrada"}</div>
                <div className="sm:col-span-2"><span className="font-semibold text-[#3e2a49]">Fecha de nacimiento:</span> {paciente.fecha_nacimiento || "No registrada"}</div>
                <div className="sm:col-span-2"><span className="font-semibold text-[#3e2a49]">Patologías o enfermedades de base:</span> {paciente.patologias || "No registradas"}</div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49]">Editar paciente</h3>
              <form onSubmit={guardarPaciente} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Nombre</span>
                    <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" required />
                  </label>
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Apellido</span>
                    <input name="apellido" value={form.apellido} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" required />
                  </label>
                </div>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" required />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Edad</span>
                    <input type="number" min="0" name="edad" value={form.edad} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                  </label>
                  <label className="space-y-2 text-sm text-[#5f4a68]">
                    <span className="font-semibold text-[#3e2a49]">Origen</span>
                    <input name="lugar_origen" value={form.lugar_origen} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                  </label>
                </div>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Teléfono</span>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                </label>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Contacto de emergencia</span>
                  <input name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                </label>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Dirección</span>
                  <input name="direccion" value={form.direccion} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                </label>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Fecha de nacimiento</span>
                  <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                </label>
                <label className="space-y-2 text-sm text-[#5f4a68]">
                  <span className="font-semibold text-[#3e2a49]">Patologías o enfermedades de base</span>
                  <textarea name="patologias" value={form.patologias} onChange={handleChange} rows={4} className="w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
                </label>
                <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4] disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? "Guardando..." : "Guardar cambios"}
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
