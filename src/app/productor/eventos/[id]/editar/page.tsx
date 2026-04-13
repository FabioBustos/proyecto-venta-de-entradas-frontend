"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { NavProductor } from "@/components/nav-productor";
import { EventoForm } from "@/components/eventos/evento-form";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params?.id as string;
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const checkPerfil = async () => {
      try {
        const res = await fetch('/api/productor/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.estadoVerificacion === "verificado") {
            setPerfil(data);
          } else {
            router.push("/productor/onboarding");
          }
        } else {
          router.push("/productor/onboarding");
        }
      } catch {
        router.push("/productor/onboarding");
      }
    };

    checkPerfil();
  }, [authLoading, isAuthenticated, token, router]);

  useEffect(() => {
    if (!token || !eventoId || !perfil) return;

    const cargarEvento = async () => {
      try {
        const res = await fetch(`/api/productor/eventos/${eventoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Evento API status:', res.status);
        console.log('Evento API response:', data);
        if (res.ok) {
          setEvento(data);
        } else {
          console.error('Error al cargar evento:', data);
        }
      } catch (error) {
        console.error("Error cargando evento:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarEvento();
  }, [token, eventoId, perfil]);

  if (authLoading || !perfil || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavProductor />

      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="rounded-xl border bg-card p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Editar Evento
            </h1>
            {evento && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                evento.estado === 'publicado' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {evento.estado === 'publicado' ? 'Publicado' : 'Borrador'}
              </span>
            )}
          </div>

          <EventoForm 
            initialData={evento} 
            eventoId={eventoId} 
            esEdicion={true} 
          />
        </div>
      </div>
    </div>
  );
}
