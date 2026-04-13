"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  QrCode,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useEntradas } from "@/lib/hooks";

interface CompraEntrada {
  _id: string;
  codigo: string;
  cantidad: number;
  total: number;
  precioUnitario: number;
  estado: string;
  usada: boolean;
  createdAt: string;
  evento: {
    _id: string;
    nombre: string;
    fecha: string;
    hora?: string;
    espacio?: string;
    direccion?: string;
    comuna?: string;
    region?: string;
    imagenUrl?: string;
  } | null;
}

function formatFecha(fecha: string | undefined) {
  if (!fecha) return "Fecha por confirmar";
  return new Date(fecha).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrecio(precio: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(precio);
}

function EntradaCard({ entrada }: { entrada: CompraEntrada }) {
  const evento = entrada.evento;

  return (
    <Card className="overflow-hidden border-border hover:border-border/80 transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {evento?.imagenUrl && (
            <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
              <img
                src={evento.imagenUrl}
                alt={evento.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {evento?.nombre || "Evento no disponible"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={entrada.usada ? "secondary" : "default"}
                    className={
                      entrada.usada
                        ? "bg-gray-600/20 text-muted-foreground"
                        : "bg-green-600/20 text-green-400 border-green-600/30"
                    }
                  >
                    {entrada.usada ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Usada
                      </>
                    ) : (
                      <>
                        <Ticket className="h-3 w-3 mr-1" />
                        Válida
                      </>
                    )}
                  </Badge>
                  {entrada.estado !== "pagada" && (
                    <Badge variant="outline">{entrada.estado}</Badge>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-foreground">
                  {formatPrecio(entrada.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {entrada.cantidad} {entrada.cantidad === 1 ? "entrada" : "entradas"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
              {evento?.fecha && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>{formatFecha(evento.fecha)}</span>
                </div>
              )}
              {evento?.hora && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{evento.hora} hrs</span>
                </div>
              )}
              {(evento?.espacio || evento?.direccion) && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {evento.espacio}
                    {evento.direccion && `, ${evento.direccion}`}
                  </span>
                </div>
              )}
              {evento?.comuna && evento?.region && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {evento.comuna}, {evento.region}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono text-muted-foreground">
                  {entrada.codigo}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Comprado el{" "}
                {new Date(entrada.createdAt).toLocaleDateString("es-CL")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <Ticket className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No tienes entradas aún
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Cuando compres entradas para eventos, aparecerán aquí. Explora nuestros
        eventos disponibles y consigue las tuyas.
      </p>
      <Button asChild size="lg">
        <Link href="/eventos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Explorar eventos
        </Link>
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4" />
              <div className="h-4 bg-muted rounded w-1/4 mb-6" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="h-px bg-border my-4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MisEntradasPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = 10;

  const pageParam = searchParams.get('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam) || 1) : 1;

  const {
    data: entradasData,
    isLoading,
    isError,
    error,
  } = useEntradas(token || undefined, page, limit);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.setItem("returnUrl", "/mis-entradas");
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page');
    }
    router.replace(`/mis-entradas?${params.toString()}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mis Entradas
            </h1>
            <p className="text-muted-foreground">
              Gestiona las entradas que has comprado
            </p>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <Card className="border-destructive/30">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Error al cargar entradas
                </h2>
                <p className="text-muted-foreground mb-6">
                  {error instanceof Error
                    ? error.message
                    : "No se pudieron cargar tus entradas"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Intentar de nuevo
                </Button>
              </CardContent>
            </Card>
          ) : !entradasData?.data || entradasData.data.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {entradasData.pagination.total}{" "}
                {entradasData.pagination.total === 1 ? "entrada encontrada" : "entradas encontradas"} - 
                Página {entradasData.pagination.page} de {entradasData.pagination.totalPages}
              </p>
              {entradasData.data.map((entrada: CompraEntrada) => (
                <EntradaCard key={entrada._id} entrada={entrada} />
              ))}

              {entradasData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {entradasData.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(page + 1)}
                    disabled={page >= entradasData.pagination.totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";
