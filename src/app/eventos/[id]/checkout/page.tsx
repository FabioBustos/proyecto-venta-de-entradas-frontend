"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Loader2,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { useEvento, usePago } from "@/lib/hooks";
import { EventoDetailSkeleton } from "@/components/ui/evento-detail-skeleton";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEventoId = params?.id;
  const eventoId = (rawEventoId && rawEventoId !== 'undefined') ? rawEventoId as string : null;
  const { isAuthenticated, user, token } = useAuthStore();
  const { data: evento, isLoading, error } = useEvento(eventoId);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [sesionId, setSesionId] = useState<string | null>(null);
  const [diaSeleccionada, setDiaSeleccionada] = useState<number | null>(null);
  const [entradasUsuario, setEntradasUsuario] = useState(0);
  const [limiteCompra, setLimiteCompra] = useState(10);
  const [puedeComprar, setPuedeComprar] = useState(true);
  const [ready, setReady] = useState(false);

  const { iniciarPago, isLoading: buying, error: pagoError } = usePago({
    token: token || undefined,
    onError: (err) => {},
  });

  useEffect(() => {
    const sid = searchParams.get('sesion');
    const dia = searchParams.get('dia');
    if (sid) setSesionId(sid);
    if (dia) setDiaSeleccionada(parseInt(dia));
  }, [searchParams]);

  useEffect(() => {
    if (!eventoId) return;
    fetch(`/api/sesiones?eventoId=${eventoId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setSesiones(data || []);
        const sid = searchParams.get('sesion');
        const dia = searchParams.get('dia');
        if (sid) {
          setSesionId(sid);
        } else if (dia && data?.length > 0) {
          const sesionForDia = data.find((s: any) => {
            const sesionFecha = String(s.fecha).split('T')[0];
            const diaObj = (evento as any)?.dias?.[parseInt(dia)];
            if (!diaObj) return false;
            const diaFecha = String(diaObj.fecha).split('T')[0];
            return sesionFecha === diaFecha;
          });
          if (sesionForDia) setSesionId(sesionForDia._id);
        } else if (data.length > 0) {
          setSesionId(data[0]._id);
        }
      })
      .catch(() => {});
  }, [eventoId, searchParams, evento]);

  useEffect(() => {
    if (!eventoId || !token) return;
    const url = sesionId
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'}/compras/validar-limite/${eventoId}?sesion=${sesionId}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'}/compras/validar-limite/${eventoId}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setEntradasUsuario(data.entradasActuales);
          setLimiteCompra(data.limite);
          setPuedeComprar(data.puedeComprar);
        }
      })
      .catch(() => {});
  }, [eventoId, token, sesionId]);

  useEffect(() => {
    if (!eventoId) {
      router.push('/eventos');
      return;
    }
    if (!isAuthenticated) {
      localStorage.setItem('returnUrl', `/eventos/${eventoId}/checkout`);
      router.push(`/login?returnUrl=/eventos/${eventoId}/checkout`);
      return;
    }
    if (evento && (evento.gratuito || evento.entradaLiberada)) {
      router.push(`/eventos/${eventoId}`);
      return;
    }
    if (evento && !isLoading && !error) {
      setReady(true);
    }
  }, [eventoId, isAuthenticated, evento, isLoading, error, router]);

  useEffect(() => {
    if (!ready || !evento) return;
    if (!puedeComprar) {
      router.push(`/eventos/${eventoId}`);
    }
  }, [ready, puedeComprar, evento, router, eventoId]);

  const precioUnitario = sesionId
    ? ((evento as any)?.sesiones?.find((s: any) => s._id === sesionId)?.precio ?? evento?.precio ?? 0)
    : (evento?.precio || 0);

  const total = precioUnitario * cantidad;

  const disponibles = evento?.capacidad ? evento.capacidad - evento.entradasVendidas : 10;
  const maxCantidad = puedeComprar ? Math.min(limiteCompra - entradasUsuario, disponibles) : 0;

  useEffect(() => {
    if (1 > maxCantidad && maxCantidad > 0) {
      setCantidad(maxCantidad);
    }
  }, [maxCantidad]);

  if (!eventoId || !isAuthenticated || isLoading || error || !evento) {
    return <EventoDetailSkeleton />;
  }

  if (evento.gratuito || evento.entradaLiberada) {
    return null;
  }

  if (!ready) {
    return <EventoDetailSkeleton />;
  }

  const handlePagar = () => {
    if (cantidad < 1 || cantidad > maxCantidad) {
      alert(`Debes seleccionar entre 1 y ${maxCantidad} entrada(s). Tienes ${cantidad} seleccionada(s).`);
      return;
    }
    iniciarPago({ ...evento, precio: precioUnitario, sesionId: sesionId || undefined, diaIndex: diaSeleccionada || undefined }, cantidad);
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

  const fechaMostrar = (() => {
    if (sesionId && (evento as any).sesiones) {
      const sesion = (evento as any).sesiones.find((s: any) => s._id === sesionId);
      return sesion ? formatFecha(sesion.fecha) : formatFecha(evento.fecha);
    }
    if (diaSeleccionada !== null && evento.esMultipleDias && evento.dias?.length > 0) {
      const dia = evento.dias[diaSeleccionada];
      return dia ? formatFecha(dia.fecha) : formatFecha(evento.fecha);
    }
    return formatFecha(evento.fecha);
  })();

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href={`/eventos/${eventoId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al evento
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resumen del evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{evento.nombre}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{evento.categoria}</Badge>
                    {evento.esMultipleDias && evento.dias?.length > 1 && (
                      <Badge variant="outline">Múltiples fechas</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{fechaMostrar}</span>
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
                        {evento.comuna && evento.region && (
                          <span className="text-muted-foreground"> — {evento.comuna}, {evento.region}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {evento.capacidad ? evento.capacidad - evento.entradasVendidas : '—'} entradas disponibles
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Comprar entradas</h3>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Precio unitario</p>
                  <p className="text-3xl font-bold">
                    {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(precioUnitario)}
                  </p>
                </div>

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
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={cantidad >= maxCantidad}
                      onClick={() => setCantidad(c => c + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entradasUsuario > 0 ? (
                      <span>Ya tienes {entradasUsuario} entrada(s). Puedes comprar hasta {maxCantidad} más</span>
                    ) : (
                      <>Máximo {maxCantidad} por compra</>
                    )}
{evento.limitePorUsuario && evento.limitePorUsuario > 1 && (
          <span> (límite: {evento.limitePorUsuario})</span>
        )}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cantidad} × {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(precioUnitario)}
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total)}</span>
                  </div>
                </div>

                {maxCantidad <= 0 && !puedeComprar && (
                  <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Ya compraste el límite permitido de {limiteCompra} entrada(s) para este evento</span>
                  </div>
                )}

                {maxCantidad <= 0 && disponibles <= 0 && puedeComprar && (
                  <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Este evento no tiene entradas disponibles</span>
                  </div>
                )}

                {pagoError && (
                  <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{pagoError.message}</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!evento.activo || buying || maxCantidad <= 0 || cantidad < 1 || cantidad > maxCantidad}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePagar();
                  }}
                >
                  {buying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirigiendo a Webpay...
                    </>
                  ) : !evento.activo ? (
                    "No disponible"
                  ) : maxCantidad <= 0 && !puedeComprar ? (
                    "Límite alcanzado"
                  ) : maxCantidad <= 0 ? (
                    "Agotado"
                  ) : (
                    "Pagar con Webpay"
                  )}
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Pago seguro con Webpay Plus
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
