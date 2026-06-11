"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function NuevoPacientePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await apiClient.crearPaciente(form);
      toast.success("Paciente creado correctamente");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Agregar Paciente</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Registra un nuevo paciente para empezar a llevar su historia clínica.</p>
          </div>
          <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
            Volver al dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#5f4a68]">
              <span className="font-semibold text-[#3e2a49]">Nombre</span>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-[#5f4a68]">
              <span className="font-semibold text-[#3e2a49]">Apellido</span>
              <input
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#5f4a68]">
              <span className="font-semibold text-[#3e2a49]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-[#5f4a68]">
              <span className="font-semibold text-[#3e2a49]">Teléfono</span>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-[#5f4a68]">
            <span className="font-semibold text-[#3e2a49]">Dirección</span>
            <input
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
            />
          </label>

          <label className="space-y-2 text-sm text-[#5f4a68]">
            <span className="font-semibold text-[#3e2a49]">Fecha de nacimiento</span>
            <input
              type="date"
                value={form.fecha_nacimiento}
                onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                className="w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
              />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Guardando..." : "Crear paciente"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
