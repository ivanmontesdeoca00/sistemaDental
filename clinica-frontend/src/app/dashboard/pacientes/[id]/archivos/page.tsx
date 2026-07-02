"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface ArchivoPaciente {
  id: number;
  nombre_archivo: string;
  tipo: string;
  ruta: string;
  mime_type?: string;
}

export default function ArchivosPage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const [items, setItems] = useState<ArchivoPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!pacienteId) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await apiClient.obtenerArchivos(pacienteId);
        setItems(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar los archivos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [pacienteId]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const nuevo = await apiClient.subirArchivo(pacienteId, file, "radiografia");
      setItems((prev) => [nuevo, ...prev]);
      toast.success("Archivo subido");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo subir el archivo");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await apiClient.eliminarArchivo(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Archivo eliminado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el archivo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Archivos del paciente</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Sube radiografías y documentos asociados al expediente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d58ce0] px-5 py-2 text-sm font-semibold text-[#6f3f78] transition hover:bg-[#f7e5ff]">Volver al dashboard</Link>
            <Link href={`/dashboard/pacientes/${pacienteId}`} className="rounded-full bg-[#f4e3ff] px-5 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]">Volver al paciente</Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold text-[#3e2a49]">Gestionar archivos</h3>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#d58ce0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#c77dd4]">
              {uploading ? "Subiendo..." : "Subir archivo"}
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-[#6f5a75]">Cargando archivos...</div>
          ) : items.length === 0 ? (
            <p className="text-sm text-[#6f5a75]">No hay archivos subidos todavía.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#f0e4f6] bg-[#fcf7ff] p-4">
                  <p className="text-sm font-semibold text-[#3e2a49]">{item.nombre_archivo}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8c6d96]">{item.tipo}</p>
                  <div className="mt-3 flex gap-2">
                    <a href={`http://127.0.0.1:8000/archivos/${item.id}/download`} className="inline-flex rounded-full bg-[#f4e3ff] px-4 py-2 text-sm font-semibold text-[#5f3d7d] hover:bg-[#e7d2ff]" target="_blank" rel="noreferrer">
                      Descargar
                    </a>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60">
                      {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
