"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Consentimiento {
  id: number;
  paciente_id: number;
  tipo: string;
  texto: string;
  firmado: boolean;
  firma_digital?: string;
  observaciones?: string;
}

export default function ConsentimientosPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const [items, setItems] = useState<Consentimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [firmandoId, setFirmandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ tipo: "consentimiento_general", texto: "", firmado: true, observaciones: "", firma_digital: "" });

  useEffect(() => {
    if (!pacienteId) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.listarConsentimientos(pacienteId);
        setItems(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los consentimientos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [pacienteId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const nuevo = await apiClient.crearConsentimiento(pacienteId, { ...form, firma_digital: form.firma_digital || undefined });
      setItems((prev) => [nuevo, ...prev]);
      setForm({ tipo: "consentimiento_general", texto: "", firmado: true, observaciones: "", firma_digital: "" });
      toast.success("Consentimiento guardado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el consentimiento");
    }
  };

  const handleFirmar = async (id: number) => {
    try {
      setFirmandoId(id);
      const actualizado = await apiClient.firmarConsentimiento(id, "firma-digital-demo");
      setItems((prev) => prev.map((item) => (item.id === id ? actualizado : item)));
      toast.success("Consentimiento firmado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo firmar el consentimiento");
    } finally {
      setFirmandoId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Consentimientos</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Gestiona los consentimientos informados del paciente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">Volver al dashboard</Link>
            <Link href={`/dashboard/pacientes/${pacienteId}`} className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">Volver al paciente</Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Registrar consentimiento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-[#5f4a68]">
                Tipo
                <input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
              </label>
              <label className="block text-sm text-[#5f4a68]">
                Texto
                <textarea value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} className="mt-2 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" rows={5} required />
              </label>
              <label className="flex items-center gap-2 text-sm text-[#5f4a68]">
                <input type="checkbox" checked={form.firmado} onChange={(e) => setForm({ ...form, firmado: e.target.checked })} />
                Firmado
              </label>
              <label className="block text-sm text-[#5f4a68]">
                Observaciones
                <textarea value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} className="mt-2 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" rows={3} />
              </label>
              <label className="block text-sm text-[#5f4a68]">
                Firma digital (opcional)
                <input value={form.firma_digital} onChange={(e) => setForm({ ...form, firma_digital: e.target.value })} className="mt-2 w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]" />
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">Guardar consentimiento</button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Resumen</h3>
            <p className="text-sm text-[#6f5a75]">Guarda y revisa los consentimientos informados para cada paciente en un solo lugar.</p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
          <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Consentimientos registrados</h3>
          {loading ? (
            <div className="py-8 text-center text-sm text-[#6f5a75]">Cargando consentimientos...</div>
          ) : items.length === 0 ? (
            <p className="text-sm text-[#6f5a75]">No hay consentimientos registrados aún.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#f0e4f6] bg-[#fcf7ff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#3e2a49]">{item.tipo}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.firmado ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.firmado ? "Firmado" : "Pendiente"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#6f5a75]">{item.texto}</p>
                  {item.observaciones && <p className="mt-2 text-xs text-[#8b5f6a]">{item.observaciones}</p>}
                  {item.firma_digital && <p className="mt-2 text-xs text-[#8b5f6a]">Firma: {item.firma_digital}</p>}
                  {!item.firmado && (
                    <button onClick={() => handleFirmar(item.id)} disabled={firmandoId === item.id} className="mt-3 rounded-full bg-[#d58ce0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      {firmandoId === item.id ? "Firmando..." : "Firmar"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
