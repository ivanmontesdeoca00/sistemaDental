"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Historia {
  id: number;
  paciente_id: number;
  motivo?: string;
  diagnostico?: string;
  tratamientos?: string;
  medicamentos?: string;
  notas?: string;
  anexos?: any;
  fecha: string;
}

export default function HistoriaPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);

  const [historias, setHistorias] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ motivo: "", diagnostico: "", tratamientos: "", medicamentos: "", notas: "" });

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.listarHistorias(pacienteId);
        setHistorias(data);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando historias");
      } finally {
        setLoading(false);
      }
    };
    if (pacienteId) cargar();
  }, [pacienteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nueva = await apiClient.crearHistoria(pacienteId, form);
      setHistorias((s) => [nueva, ...s]);
      setForm({ motivo: "", diagnostico: "", tratamientos: "", medicamentos: "", notas: "" });
      toast.success("Historia clínica guardada");
    } catch (error) {
      console.error(error);
      toast.error("Error creando historia");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Historia Clínica</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Registra y revisa el seguimiento médico dental del paciente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al menú principal
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}`} className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al paciente
            </Link>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Agregar nueva historia</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#3e2a49]">
                Motivo
                <textarea
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  className="mt-2 h-24 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] p-3 text-sm text-[#3e2a49]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#3e2a49]">
                Diagnóstico
                <textarea
                  value={form.diagnostico}
                  onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
                  className="mt-2 h-24 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] p-3 text-sm text-[#3e2a49]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#3e2a49]">
                Tratamientos
                <textarea
                  value={form.tratamientos}
                  onChange={(e) => setForm({ ...form, tratamientos: e.target.value })}
                  className="mt-2 h-20 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] p-3 text-sm text-[#3e2a49]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#3e2a49]">
                Medicamentos
                <textarea
                  value={form.medicamentos}
                  onChange={(e) => setForm({ ...form, medicamentos: e.target.value })}
                  className="mt-2 h-20 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] p-3 text-sm text-[#3e2a49]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#3e2a49]">
                Notas adicionales
                <textarea
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  className="mt-2 h-20 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] p-3 text-sm text-[#3e2a49]"
                />
              </label>
              <button type="submit" className="rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
                Guardar historia
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49] mb-3">Últimas historias</h3>
              {loading ? (
                <div className="py-12 text-center text-sm text-[#6f5a75]">Cargando historias...</div>
              ) : historias.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d8c5e7] bg-[#fbf5ff] p-6 text-sm text-[#6f5a75]">No hay historias registradas aún.</div>
              ) : (
                <div className="space-y-4">
                  {historias.map((h) => (
                    <article key={h.id} className="rounded-3xl border border-[#e9d6f1] bg-[#fff8ff] p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-[#3e2a49]">{h.motivo || "Historia sin motivo"}</h4>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5f6a]">{new Date(h.fecha).toLocaleDateString()}</p>
                        </div>
                        <span className="rounded-full bg-[#f4e3ff] px-3 py-1 text-xs font-semibold text-[#6f3a7d]">ID {h.id}</span>
                      </div>
                      <div className="mt-4 grid gap-3 text-sm text-[#5f4a68]">
                        {h.diagnostico && (
                          <p><span className="font-semibold text-[#3e2a49]">Diagnóstico:</span> {h.diagnostico}</p>
                        )}
                        {h.tratamientos && (
                          <p><span className="font-semibold text-[#3e2a49]">Tratamientos:</span> {h.tratamientos}</p>
                        )}
                        {h.medicamentos && (
                          <p><span className="font-semibold text-[#3e2a49]">Medicamentos:</span> {h.medicamentos}</p>
                        )}
                        {h.notas && (
                          <p><span className="font-semibold text-[#3e2a49]">Notas:</span> {h.notas}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
