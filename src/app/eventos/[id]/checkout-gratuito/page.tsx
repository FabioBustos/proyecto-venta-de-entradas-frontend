"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { useEvento, useCompraGratuita } from "@/lib/hooks";
import { EventoDetailSkeleton } from "@/components/ui/evento-detail-skeleton";
import { useState } from "react";

export default function CheckoutGratuitoPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventoId = params?.id;
  const eventoId = (rawEventoId && rawEventoId !== 'undefined') ? rawEventoId as string : undefined;
  const { isAuthenticated, token } = useAuthStore();
  const { data: evento, isLoading, error } = useEvento(eventoId || '');
  const [cantidad, setCantidad] = useState(1);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [codigoCompra, setCodigoCompra] = useState<string | null>(null);
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const sesionId = searchParams?.get('sesion') || null;

  const { mutate: iniciarCompraGratuita, isPending: buying, error: compraError } = useCompraGratuita({
    token: token || undefined,
    onSuccess: (compra: any) => {
      setCompraExitosa(true);
      setCodigoCompra(compra.codigo);
    },
    onError: () => {},
  });

  if (!eventoId) {
    router.push('/eventos');
    return null;
  }

  if (!isAuthenticated) {
    localStorage.setItem('returnUrl', `/eventos/${eventoId}/checkout-gratuito`);
    router.push(`/login?returnUrl=/eventos/${eventoId}/checkout-gratuito`);
    return null;
  }

  if (isLoading) {
    return <EventoDetailSkeleton />;
  }

  if (error || !evento) {
    router.push('/404');
    return null;
  }

  if (!evento.gratuito) {
    router.push(`/eventos/${eventoId}`);
    return null;
  }

  if (evento.entradaLiberada) {
    router.push(`/eventos/${eventoId}`);
    return null;
  }

  const esSinLimite = evento.gratuitoSinLimite;
  const tieneSesiones = (evento as any).tieneSesiones;
  const disponibilidadSesion = (evento as any).sesionDisponible;
  const sesionCapacidad = (evento as any).sesionCapacidad;
  const disponibles = tieneSesiones && sesionCapacidad 
    ? disponibilidadSesion 
    : (evento.capacidad ? evento.capacidad - evento.entradasVendidas : 0);
  const maxCantidad = esSinLimite ? 1 : Math.min(evento.limitePorUsuario || 10, disponibles);

  const handleConfirmar = () => {
    if (!isAuthenticated) {
      localStorage.setItem('returnUrl', `/eventos/${eventoId}/checkout-gratuito`);
      router.push(`/login?returnUrl=/eventos/${eventoId}/checkout-gratuito`);
      return;
    }
    iniciarCompraGratuita({ eventoId, cantidad: esSinLimite ? 1 : cantidad, sesionId: sesionId || undefined });
  };

  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (compraExitosa) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Entrada obtenida!</h1>
            <p className="text-muted-foreground mb-6">
              Tu entrada gratuita para <strong>{evento.nombre}</strong> ha sido confirmada.
            </p>

            <div className="rounded-lg bg-muted p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Código de compra</p>
              <p className="text-xl font-mono font-bold">{codigoCompra}</p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <p>
                <CalendarDays className="inline h-4 w-4 mr-1" />
                {formatFecha(tieneSesiones ? (evento as any).proximaFechaDisponible : evento.fecha)}
              </p>
              {evento.hora && (
                <p>
                  <Clock className="inline h-4 w-4 mr-1" />
                  {evento.hora} hrs
                </p>
              )}
              {(evento.espacio || evento.direccion) && (
                <p>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {evento.espacio}{evento.direccion ? `, ${evento.direccion}` : ''}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/mis-entradas">Ver mis entradas</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/eventos">Explorar más eventos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href={`/eventos/${eventoId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al evento
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Event Summary */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resumen del evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{evento.nombre}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">Evento Gratuito</Badge>
                    {esSinLimite && (
                      <Badge variant="outline">Sin límite de capacidad</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{formatFecha(tieneSesiones ? (evento as any).proximaFechaDisponible : evento.fecha)}</span>
                  </div>
                  {evento.hora && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{evento.hora} hrs</span>
                    </div>
                  )}
                  {(evento.espacio || evento.direccion) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {evento.espacio}
                        {evento.direccion && `, ${evento.direccion}`}
                      </span>
                    </div>
                  )}
                </div>

                {!esSinLimite && evento.capacidad && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3 text-sm">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {disponibles} entradas disponibles
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Panel */}
          <div className="md:col-span-2">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Obtener entrada</h3>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Precio</p>
                  <p className="text-3xl font-bold text-green-600">Gratis</p>
                </div>

                {!esSinLimite && (
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Cantidad de entradas
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={cantidad <= 1}
                        onClick={() => setCantidad(c => c - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={cantidad >= maxCantidad}
                        onClick={() => setCantidad(c => c + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Máximo {maxCantidad} por compra
                    </p>
                  </div>
                )}

                {esSinLimite && (
                  <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-xs text-green-800 dark:text-green-200">
                    1 entrada por cuenta
                  </div>
                )}

                {compraError && (
                  <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{compraError.message}</span>
                  </div>
                )}

                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!evento.activo || buying}
                    onClick={handleConfirmar}
                  >
                    {buying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : evento.activo ? (
                      "Confirmar entrada gratuita"
                    ) : (
                      "No disponible"
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleConfirmar}
                    >
                      Iniciar sesión para obtener entrada
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Necesitas una cuenta para obtener tu entrada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
