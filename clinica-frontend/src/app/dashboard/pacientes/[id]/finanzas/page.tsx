"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

interface Transaccion {
  id: number;
  paciente_id: number;
  tipo: string;
  monto: number;
  descripcion?: string;
  fecha: string;
}

interface EstadoCuenta {
  paciente_id: number;
  total_cargos: number;
  total_pagos: number;
  saldo: number;
}

export default function FinanzasPacientePage() {
  const params = useParams();
  const pacienteId = Number(params?.id);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [estadoCuenta, setEstadoCuenta] = useState<EstadoCuenta | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tipo: "cargo", monto: "", descripcion: "" });

  useEffect(() => {
    if (!pacienteId) return;

    const cargar = async () => {
      try {
        setLoading(true);
        const [txs, cuenta] = await Promise.all([
          apiClient.obtenerTransacciones(pacienteId),
          apiClient.obtenerEstadoCuenta(pacienteId),
        ]);
        setTransacciones(txs);
        setEstadoCuenta(cuenta);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar los datos financieros");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [pacienteId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const nueva = await apiClient.registrarTransaccion(pacienteId, {
        tipo: form.tipo,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion,
      });
      setTransacciones((prev) => [nueva, ...prev]);
      const cuenta = await apiClient.obtenerEstadoCuenta(pacienteId);
      setEstadoCuenta(cuenta);
      toast.success("Transacción registrada");
      setForm({ tipo: "cargo", monto: "", descripcion: "" });
    } catch (error) {
      console.error(error);
      toast.error("Error registrando la transacción");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#3e2a49]">Finanzas del paciente</h2>
            <p className="mt-1 text-sm text-[#6f5a75]">Registra pagos y cargos, y revisa el estado de cuenta individual.</p>
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

        <div className="grid gap-6 lg:grid-cols-[1.1fr_360px]">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Registrar transacción</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-[#5f4a68]">
                Tipo de transacción
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                >
                  <option value="cargo">Cargo</option>
                  <option value="pago">Pago</option>
                </select>
              </label>
              <label className="block text-sm text-[#5f4a68]">
                Monto
                <input
                  type="number"
                  step="0.01"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                  required
                />
              </label>
              <label className="block text-sm text-[#5f4a68]">
                Descripción
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e9d6f1] bg-[#faf5ff] px-4 py-3 text-sm text-[#3e2a49]"
                  rows={4}
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d58ce0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c77dd4]"
              >
                Guardar transacción
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
            <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Estado de cuenta</h3>
            {loading ? (
              <p className="text-sm text-[#6f5a75]">Cargando...</p>
            ) : estadoCuenta ? (
              <div className="space-y-3 text-sm text-[#5f4a68]">
                <div className="rounded-3xl border border-[#e9d6f1] bg-[#faf5ff] p-4">
                  <p className="font-semibold text-[#3e2a49]">Total pagos</p>
                  <p>${estadoCuenta.total_pagos.toFixed(2)}</p>
                </div>
                <div className="rounded-3xl border border-[#e9d6f1] bg-[#faf5ff] p-4">
                  <p className="font-semibold text-[#3e2a49]">Total cargos</p>
                  <p>${estadoCuenta.total_cargos.toFixed(2)}</p>
                </div>
                <div className={`rounded-3xl border border-[#d58ce0] bg-[#f9ecff] p-4 ${estadoCuenta.saldo >= 0 ? "text-green-700" : "text-red-700"}`}>
                  <p className="font-semibold text-[#3e2a49]">Saldo</p>
                  <p className="text-lg font-semibold">${estadoCuenta.saldo.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6f5a75]">No se encontraron movimientos.</p>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.35)]">
          <h3 className="text-xl font-semibold text-[#3e2a49] mb-4">Movimientos recientes</h3>
          {loading ? (
            <p className="text-sm text-[#6f5a75]">Cargando transacciones...</p>
          ) : transacciones.length === 0 ? (
            <p className="text-sm text-[#6f5a75]">No hay transacciones registradas.</p>
          ) : (
            <div className="space-y-3">
              {transacciones.map((tx) => (
                <div key={tx.id} className="rounded-3xl border border-[#f0e4f6] bg-[#fcf7ff] p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-[#3e2a49]">
                    <span>{tx.tipo.toUpperCase()}</span>
                    <span>${tx.monto.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6f5a75]">{tx.descripcion || "Descripción no disponible"}</p>
                  <p className="mt-1 text-xs text-[#8b5f6a]">{new Date(tx.fecha).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
