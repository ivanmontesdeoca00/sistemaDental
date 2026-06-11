// components/ProtectedRoute.tsx - Componente para proteger rutas privadas

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(247,219,234,0.9),_rgba(255,243,224,0.9),_rgba(255,255,255,1))]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#d58ce0] border-t-[#3e2a49]"></div>
          <p className="mt-4 text-[#3e2a49] font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
