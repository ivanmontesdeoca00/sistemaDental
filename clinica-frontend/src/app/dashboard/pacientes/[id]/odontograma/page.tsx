"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Diente {
  id: number;
  paciente_id: number;
  diente_numero: number;
  estado: string;
  anotaciones?: string;
}

const estados = [
  { value: "sano", label: "Sano", color: "bg-green-100 text-green-700" },
  { value: "obturado", label: "Obturado", color: "bg-yellow-100 text-yellow-700" },
  { value: "caries", label: "Caries", color: "bg-red-100 text-red-700" },
  { value: "extraido", label: "Extraído", color: "bg-slate-100 text-slate-700" },
];

export default function OdontogramaPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const [dientes, setDientes] = useState<Diente[]>([]);
  const [selected, setSelected] = useState<Diente | null>(null);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("sano");
  const [anotaciones, setAnotaciones] = useState("");

  useEffect(() => {
    if (!pacienteId) return;

    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.obtenerOdontograma(pacienteId);
        setDientes(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el odontograma");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [pacienteId]);

  const selectDiente = (diente: Diente) => {
    setSelected(diente);
    setEstado(diente.estado || "sano");
    setAnotaciones(diente.anotaciones || "");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    try {
      const updated = await apiClient.actualizarDiente(pacienteId, selected.diente_numero, {
        estado,
        anotaciones,
      });
      setDientes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      toast.success(`Diente ${selected.diente_numero} actualizado`);
    } catch (error) {
      console.error(error);
      toast.error("Error actualizando el diente");
    }
  };

  const resetOdontograma = async () => {
    try {
      const data = await apiClient.resetOdontograma(pacienteId);
      setDientes(data);
      setSelected(null);
      toast.success("Odontograma restablecido");
    } catch (error) {
      console.error(error);
      toast.error("Error reiniciando el odontograma");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Odontograma</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Visualiza y marca el estado de cada diente del paciente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al menú principal
            </Link>
            <Link href={`/dashboard/pacientes/${pacienteId}`} className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">
              Volver al paciente
            </Link>
            <button
              onClick={resetOdontograma}
              className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]"
            >
              Reiniciar odontograma
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#d58ce0] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_360px]">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Dientes del paciente</h3>
              <div className="grid grid-cols-4 gap-3">
                {dientes.map((diente) => (
                  <button
                    key={diente.diente_numero}
                    onClick={() => selectDiente(diente)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${diente.estado === "caries" ? "border-red-200 bg-red-50 text-red-700" : diente.estado === "obturado" ? "border-yellow-200 bg-yellow-50 text-yellow-700" : diente.estado === "extraido" ? "border-slate-200 bg-slate-50 text-slate-700" : "border-green-200 bg-green-50 text-green-700"}`}
                  >
                    <div className="font-semibold">Diente {diente.diente_numero}</div>
                    <div className="mt-1 text-xs">{diente.estado}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
              <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Editar diente</h3>
              {selected ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[#3e2a49]">Diente {selected.diente_numero}</p>
                  </div>
                  <label className="block text-sm text-[#5f4a68]">
                    Estado
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                    >
                      {estados.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-[#5f4a68]">
                    Anotaciones
                    <textarea
                      value={anotaciones}
                      onChange={(e) => setAnotaciones(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                      rows={5}
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]"
                  >
                    Guardar diente
                  </button>
                </form>
              ) : (
                <p className="text-sm text-[#6f5a75]">Selecciona un diente para ver sus detalles y actualizar su estado.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
