"use client";

import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(247,219,234,0.9),_rgba(255,243,224,0.9),_rgba(255,255,255,1))] text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-10 sm:px-10">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-white/60 bg-white/80 px-6 py-8 shadow-[0_24px_80px_-48px_rgba(146,88,189,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-[#f8d8e0] px-4 py-1 text-sm font-semibold text-[#7f4e7f] shadow-sm">
              Clínica Fuenzalida
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#3e2a49] sm:text-5xl">
              Od. Vanessa Fuenzalida y Od. Camila Mardones
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#6f5a75] sm:text-lg">
              Gestión dental simple para tu clínica: pacientes, citas y bienestar en un espacio visual amable y profesional.
            </p>
          </div>

          <div className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center rounded-full bg-[#f4e3ff] px-6 py-3 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]"
            >
              Ver servicios
            </button>
            {/* ACA PONER NUMERO DE WHATSAPP O LINK */}
            <a
              href="http://wa.me/+56935130026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#ffe9d9] px-6 py-3 text-sm font-semibold text-[#7d4d61] transition hover:bg-[#ffe0c8]"
            >
              Contáctanos
            </a>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_22px_60px_-40px_rgba(57,44,88,0.4)]">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#f9dde7] px-4 py-2 text-sm font-medium text-[#7f4e7f]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#d58ce0]" />
              Bienvenido a tu nueva clínica
            </div>
            <h2 className="text-3xl font-semibold text-[#422d56]">Un espacio amable para pacientes y equipos</h2>
            <p className="text-base leading-7 text-[#6a5871]">
              Organiza tu flujo de trabajo desde un solo lugar. Controla pacientes, agenda citas y lleva un registro seguro mientras conservas una estética cálida y profesional.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#fff1e5] p-5">
                <p className="text-2xl">🦷</p>
                <h3 className="mt-3 font-semibold text-[#583d5a]">Cuidado dental acogedor</h3>
                <p className="mt-2 text-sm leading-6 text-[#7e667b]">Diseño pensado para transmitir calma durante el proceso clínico.</p>
              </div>
              <div className="rounded-3xl bg-[#f7e4ff] p-5">
                <p className="text-2xl">✨</p>
                <h3 className="mt-3 font-semibold text-[#583d5a]">Interfaz clara</h3>
                <p className="mt-2 text-sm leading-6 text-[#7e667b]">Flujos sencillos y botones suaves para un uso diario más agradable.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#fdf6f0] p-8 shadow-[0_22px_60px_-40px_rgba(190,119,150,0.35)]">
            <div className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-[#ffeaea] p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">Modo Dental</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#4d3750]">Paleta pastel para un cuidado amistoso</h3>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#f7d9f1] text-2xl">💜</div>
            </div>
            <div className="mt-8 space-y-5">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#8b5f6a]">Sonrisas al detalle</p>
                <p className="mt-2 text-sm leading-6 text-[#6f5a75]">Registra pacientes con datos esenciales y mantén un seguimiento claro de cada historia clínica.</p>
              </div>
              <div className="rounded-3xl bg-[#fff2da] p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#8b5f6a]">Acceso rápido</p>
                <p className="mt-2 text-sm leading-6 text-[#6f5a75]">Usa rutas seguras con autenticación para proteger la información de tu clínica.</p>
              </div>
              <div className="rounded-3xl bg-[#f5e3ff] p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#8b5f6a]">Experiencia suave</p>
                <p className="mt-2 text-sm leading-6 text-[#6f5a75]">Colores delicados y tipografía clara para una experiencia más cómoda.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="mt-10 rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_22px_80px_-48px_rgba(146,88,189,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">Contacto</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#3c2a49]">Haz de tu clínica dental un lugar más amable.</h2>
            </div>
            <a
              href="mailto:contacto@clinicadental.com"
              className="inline-flex items-center justify-center rounded-full bg-[#f5d1e8] px-6 py-3 text-sm font-semibold text-[#6d3f6e] transition hover:bg-[#edc4de]"
            >
              Escríbenos
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-[#6f5a75]">
            Pronto podemos integrar tu clínica con una app que gestione pacientes y citas con una imagen cálida y fácil de usar.
          </p>
        </section>

        {showModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b5f6a]">Nuestros servicios</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#3e2a49]">Servicios disponibles</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full bg-[#f4e3ff] px-4 py-2 text-sm font-semibold text-[#5f3d7d] transition hover:bg-[#e7d2ff]"
                >
                  Cerrar
                </button>
              </div>
              <ul className="mt-6 space-y-3 text-[#6f5a75]">
                <li className="rounded-3xl bg-[#fff2da] p-4 text-base font-medium text-[#583d5a]">• Pediatría</li>
                <li className="rounded-3xl bg-[#f7e4ff] p-4 text-base font-medium text-[#583d5a]">• Primeras consultas</li>
                <li className="rounded-3xl bg-[#fff1e5] p-4 text-base font-medium text-[#583d5a]">• Cirugías</li>
                <li className="rounded-3xl bg-[#ffe9d9] p-4 text-base font-medium text-[#583d5a]">• Endodoncias</li>
                <li className="rounded-3xl bg-[#f8d8e0] p-4 text-base font-medium text-[#583d5a]">• Extracciones dentales</li>
                <li className="rounded-3xl bg-[#f5e3ff] p-4 text-base font-medium text-[#583d5a]">• Operatorias dentales</li>
              </ul>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
