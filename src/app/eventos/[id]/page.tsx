"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Ticket,
  Share2,
  LogIn,
  UserPlus,
  Loader2,
  Globe,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HtmlContent } from "@/components/html-content";
import { useAuthStore } from "@/store/auth-store";
import { useEvento } from "@/lib/hooks";
import { EventoDetailSkeleton } from "@/components/ui/evento-detail-skeleton";
import type { Evento } from "@/types";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";

export default function EventoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventoId = params.id as string;
  const { isAuthenticated, user, token } = useAuthStore();
  const { data: evento, isLoading, error } = useEvento(eventoId);

  const [waitingListTipo, setWaitingListTipo] = useState<"preVenta" | "postVenta">("preVenta");
  const [waitingListSubmitting, setWaitingListSubmitting] = useState(false);
  const [waitingListSuccess, setWaitingListSuccess] = useState(false);
  const [waitingListError, setWaitingListError] = useState<string | null>(null);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState<string | null>(null);
  const [diaSeleccionada, setDiaSeleccionada] = useState<number>(0);
  const [entradasUsuario, setEntradasUsuario] = useState(0);
  const [limiteCompra, setLimiteCompra] = useState(10);
  const [puedeComprar, setPuedeComprar] = useState(true);
  const [limiteCargado, setLimiteCargado] = useState(false);
  const [faseVenta, setFaseVenta] = useState<{
    fase: string;
    puedeComprar: boolean;
    puedeSuscribirse: boolean;
    usuarioEnWaitingList: boolean;
    usuarioSuscrito: boolean;
    precioActual: number;
    precioPreVenta?: number;
    precioGeneral: number;
    mensaje: string;
    esPreVenta: boolean;
  } | null>(null);

  useEffect(() => {
    if (!eventoId) return;
    fetch(`/api/sesiones?eventoId=${eventoId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setSesiones(data || []);
        if (data && data.length > 0) setSesionSeleccionada(data[0]._id);
      })
      .catch(() => { });
  }, [eventoId]);

  useEffect(() => {
    if (!eventoId || !isAuthenticated || !token) {
      setLimiteCargado(true);
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'}/eventos/${eventoId}/fase-venta?userId=${user?.id}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setFaseVenta(data);
      })
      .catch(() => { });
  }, [eventoId, isAuthenticated, token, user]);

  useEffect(() => {
    if (!eventoId || !isAuthenticated || !token) {
      setLimiteCargado(true);
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'}/compras/validar-limite/${eventoId}`;
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
      .catch(() => { })
      .finally(() => setLimiteCargado(true));
  }, [eventoId, isAuthenticated, token]);

  if (isLoading) {
    return <EventoDetailSkeleton />;
  }

  if (error || !evento) {
    router.push('/404');
    return null;
  }

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DIAS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MESES_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const formatFechaLocal = (fechaStr: string) => {
    if (!fechaStr) return '';

    // Formato YYYY-MM-DD
    const dateOnly = String(fechaStr).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const date = new Date(y, m - 1, d);
        return `${DIAS_SHORT[date.getDay()]}, ${d} ${MESES_SHORT[date.getMonth()]}`;
      }
    }

    // Formato "Wed Apr 29 2026 ..." (Date.toString())
    const match = fechaStr.match(/(\w+)\s+(\w+)\s+(\d+)\s+(\d{4})/);
    if (match) {
      const [, , mesStr, diaStr, anioStr] = match;
      const mesMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const mesIdx = mesMap[mesStr];
      if (mesIdx !== undefined) {
        const d = parseInt(diaStr);
        const y = parseInt(anioStr);
        const date = new Date(y, mesIdx, d);
        return `${DIAS_SHORT[date.getDay()]}, ${d} ${MESES_SHORT[mesIdx]}`;
      }
    }

    return fechaStr;
  };

  const handleBuy = () => {
    if (!evento) return;
    if (isAuthenticated && !puedeComprar) return;
    const queryParams = new URLSearchParams();
    if (sesionSeleccionada) queryParams.set('sesion', sesionSeleccionada);
    if (evento.esMultipleDias && evento.dias?.length > 1) {
      queryParams.set('dia', diaSeleccionada.toString());
    }
    router.push(`/eventos/${eventoId}/checkout?${queryParams.toString()}`);
  };

  const sesionActiva = sesiones.length > 0 ? sesiones.find((s: any) => s._id === sesionSeleccionada) : null;
  const disponibilidad = sesionActiva
    ? sesionActiva.capacidad - sesionActiva.entradasVendidas
    : (evento.capacidad || 0) - evento.entradasVendidas;
  const capacidadTotal = sesionActiva ? sesionActiva.capacidad : (evento.capacidad || 0);
  const entradasVendidas = sesionActiva ? sesionActiva.entradasVendidas : (evento.entradasVendidas || 0);
  const porcentajeVendido = capacidadTotal
    ? Math.round((entradasVendidas / capacidadTotal) * 100)
    : 0;

  const hayDisponibilidad = sesiones.length > 0
    ? sesiones.some((s: any) => (s.capacidad - s.entradasVendidas) > 0)
    : disponibilidad > 0;

  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    const dateOnly = String(fecha).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const date = new Date(Date.UTC(y, m - 1, d));
        const DIAS_UTC = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const MESES_UTC = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${DIAS_UTC[date.getUTCDay()]}, ${d} de ${MESES_UTC[date.getUTCMonth()]} de ${y}`;
      }
    }
    return new Date(fecha).toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatFechaCorta = (fecha: string | undefined) => {
    if (!fecha) return '';
    const dateOnly = String(fecha).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const date = new Date(Date.UTC(y, m - 1, d));
        const MESES_UTC = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${d} ${MESES_UTC[date.getUTCMonth()]}`;
      }
    }
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    });
  };

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

  const formatoFechaRange = (fecha: string | undefined) => {
    if (!fecha) return '';
    const dateOnly = String(fecha).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const date = new Date(Date.UTC(y, m - 1, d));
        const MESES_UTC = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${d} ${MESES_UTC[date.getUTCMonth()]}`;
      }
    }
    return '';
  };

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : url;
  };

  const handleWaitingList = async (tipo: "preVenta" | "postVenta") => {
    if (!isAuthenticated) {
      localStorage.setItem("returnUrl", `/eventos/${eventoId}`);
      router.push(`/login?returnUrl=/eventos/${eventoId}`);
      return;
    }

    setWaitingListSubmitting(true);
    setWaitingListError(null);
    setWaitingListTipo(tipo);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/waiting-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventoId, tipo }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setWaitingListSuccess(true);
          setWaitingListError(null);
        } else {
          setWaitingListError(data.message || "Error al suscribirse");
        }
        return;
      }

      setWaitingListSuccess(true);
    } catch {
      setWaitingListError("Error de conexión");
    } finally {
      setWaitingListSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Image with Parallax */}
      <div
        className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${evento.imagenUrl || evento.imagenes?.[0] || "/placeholder.svg"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/eventos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        {/* Share button */}
        <div className="absolute top-4 right-4">
          <Button variant="secondary" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className={evento.gratuito && !evento.entradaLiberada ? "lg:col-span-2" : "lg:col-span-2"}>
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge>{evento.categoria}</Badge>
                  {evento.gratuito && (
                    <Badge variant="secondary">Evento Gratuito</Badge>
                  )}
                  {porcentajeVendido >= 90 && (
                    <Badge variant="destructive">Casi agotado</Badge>
                  )}
                  {!evento.activo && (
                    <Badge variant="secondary">No disponible</Badge>
                  )}
                </div>

                <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-balance">
                  {evento.nombre}
                </h1>

<div className="mb-6 grid gap-3 text-muted-foreground sm:grid-cols-2">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {evento.esMultipleDias && evento.dias?.length > 1 ? "Fechas" : "Fecha"}
                </p>
                {evento.esMultipleDias && evento.dias?.length > 1 ? (
                  <ul className="mt-1 space-y-0.5">
                    {evento.dias.map((dia: any, index: number) => (
                      <li key={index} className="text-xs capitalize text-foreground/80">
                        {formatFecha(dia.fecha)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm capitalize">
                    {formatFecha(evento.fecha)}
                  </p>
                )}
              </div>
            </div>

            {evento.hora && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Hora
                        </p>
                        <p className="text-sm">{evento.hora} hrs</p>
                      </div>
                    </div>
                  )}

{(evento.espacio || evento.direccion) && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Lugar
                  </p>
                  <p className="text-sm">
                    {evento.espacio}
                    {evento.direccion && (
                      <>
                        <br />
                        {evento.direccion}
                      </>
                    )}
                    {evento.comuna && evento.region && (
                      <>
                        <br />
                        {evento.comuna}, {evento.region}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            {!(evento.gratuito || evento.entradaLiberada) && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Capacidad
                  </p>
                  <p className="text-sm">
                    {(evento.capacidad || 0).toLocaleString()} personas
                  </p>
                </div>
              </div>
            )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="mb-3 text-lg font-semibold">
                    Acerca del evento
                  </h2>
                  <HtmlContent html={evento.descripcion || ""} />
                </div>



                {evento.videoYoutube && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="mb-3 text-lg font-semibold">
                        Video del evento
                      </h2>
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYoutubeId(evento.videoYoutube)}`}
                          title="Video del evento"
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </>
                )}


                {evento.ventaOnlineHabilitada && (
                  <div>
                    <Separator className="my-6" />
                    <h2 className="mb-4 text-lg font-semibold">
                      Periodos de Venta y Precios
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {evento.configWaitingList?.habilitado && (
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Pre-venta</p>
                              <Badge variant="secondary" className="text-xs">Lista de Espera</Badge>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>Inscripción:</span>
                            </div>
                            <p className="text-xs pl-5 text-foreground font-medium">
                              {formatFecha(evento.configWaitingList.fechaInscripcionPreVentaInicio)} - {formatFecha(evento.configWaitingList.fechaInscripcionPreVentaFin)}
                            </p>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                              <Ticket className="h-3.5 w-3.5" />
                              <span>Venta:</span>
                            </div>
                            <p className="text-xs pl-5 text-foreground font-medium">
                              {formatFecha(evento.configWaitingList.fechaInicioPreVenta)} - {formatFecha(evento.configWaitingList.fechaFinPreVenta)}
                            </p>
                            {evento.configWaitingList.precioPreVenta !== undefined && (
                              <>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                  <span className="text-xs">Precio:</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {evento.configWaitingList.precioPreVenta === 0
                                    ? formatPrecio(evento.precio || 0)
                                    : formatPrecio(evento.configWaitingList.precioPreVenta)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {evento.ventaOnlineHabilitada && (
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Venta Online</p>
                              <Badge variant="secondary" className="text-xs">General</Badge>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            {evento.esMultipleDias && evento.dias?.length > 0 ? (
                              <>
                                {(evento.ventaOnlineFechaInicio || evento.ventaOnlineFechaFin) && (
                                  <div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span className="text-xs font-medium">Período de venta:</span>
                                    </div>
                                    <p className="text-xs pl-5 text-foreground font-medium mt-1">
                                      {(() => {
                                        const inicio = formatoFechaRange(evento.ventaOnlineFechaInicio);
                                        const fin = formatoFechaRange(evento.ventaOnlineFechaFin);
                                        if (inicio === fin) return inicio;
                                        return `${inicio} - ${fin}`;
                                      })()}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Fechas del evento:</span>
                                  </div>
                                  <p className="text-xs pl-5 text-foreground font-medium mt-1">
                                    {evento.dias.map((d: any, i: number) => {
                                      const dateOnly = String(d.fecha).split('T')[0];
                                      const parts = dateOnly.split('-');
                                      if (parts.length === 3) {
                                        const [y, m, dNum] = parts.map(Number);
                                        if (!isNaN(y) && !isNaN(m) && !isNaN(dNum)) {
                                          const DIAS_SHORT_UTC = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
                                          const MESES_UTC = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                                          const date = new Date(Date.UTC(y, m - 1, dNum));
                                          return `${DIAS_SHORT_UTC[date.getUTCDay()]}, ${dNum} ${MESES_UTC[date.getUTCMonth()]}`;
                                        }
                                      }
                                      return d.fecha;
                                    }).join(' · ')}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  <span className="text-xs font-medium">Fechas:</span>
                                </div>
                                <p className="text-xs pl-5 text-foreground font-medium">
                                  {(() => {
                                    const inicio = formatoFechaRange(evento.ventaOnlineFechaInicio);
                                    const fin = formatoFechaRange(evento.ventaOnlineFechaFin);
                                    if (inicio === fin) return inicio;
                                    return `${inicio} - ${fin}`;
                                  })()}
                                </p>
                              </>
                            )}
                            {evento.precio && (
                              <>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                  <span className="text-xs">Precio:</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {formatPrecio(evento.precio)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {evento.ventaPresencialHabilitada && (
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Store className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Venta Presencial</p>
                              <Badge variant="secondary" className="text-xs">Física</Badge>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              <span>Inventario:</span>
                            </div>
                            <p className="text-xs pl-5 text-foreground font-medium">
                              {evento.ventaPresencialInventario?.toLocaleString() || 'N/A'} entradas
                            </p>
                            {evento.ventaPresencialPrecio && (
                              <>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                  <span className="text-xs">Precio:</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                  {formatPrecio(evento.ventaPresencialPrecio)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {!evento.configWaitingList?.habilitado && !evento.ventaOnlineHabilitada && !evento.ventaPresencialHabilitada && (
                      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
                        <p className="text-muted-foreground">No hay información de periodos de venta disponible.</p>
                      </div>
                    )}
                  </div>
                )}

                {evento.esMultipleDias && evento.dias?.length > 1 && sesiones.length === 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        Fechas del evento
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {evento.dias.map((dia: any, index: number) => {
                          const isSelected = diaSeleccionada === index;
                          const fechaCompleta = dia.fecha
                            ? (() => {
                              const dateOnly = String(dia.fecha).split('T')[0];
                              const parts = dateOnly.split('-');
                              if (parts.length === 3) {
                                const [y, m, d] = parts.map(Number);
                                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                                  const date = new Date(y, m - 1, d);
                                  return `${DIAS[date.getDay()]}, ${d} de ${MESES[date.getMonth()]} de ${y}`;
                                }
                              }
                              return dia.fecha;
                            })()
                            : '';
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setDiaSeleccionada(index)}
                              className={`text-left p-4 rounded-lg border transition-all ${isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:bg-accent/50"
                                }`}
                            >
                              <div className="space-y-1">
                                <p className="font-medium text-foreground">{fechaCompleta}</p>
                                {dia.nombre && (
                                  <p className="text-sm text-muted-foreground">{dia.nombre}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

{(sesiones.length > 0 || evento.fecha) && (
  <>
    <Separator className="my-6" />
    <div>
      <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        Fechas del Evento
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {evento.fecha && (() => {
          const fechaMain = evento.fecha;
          const dateOnly = String(fechaMain).split('T')[0];
          const parts = dateOnly.split('-');
          let fechaMainStr = fechaMain;
          if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
              const date = new Date(y, m - 1, d);
              fechaMainStr = `${DIAS[date.getDay()]}, ${d} de ${MESES[date.getMonth()]} de ${y}`;
            }
          }
          const capacidadMain = evento.capacidad || 0;
          const vendidasMain = evento.entradasVendidas || 0;
          const dispMain = capacidadMain - vendidasMain;
          const agotadaMain = dispMain <= 0;
          const esSelectedMain = !sesionSeleccionada;
          return (
            <button
              key="fecha-principal"
              type="button"
              onClick={() => setSesionSeleccionada(null)}
              className={`text-left p-4 rounded-lg border transition-all ${esSelectedMain
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
              } ${agotadaMain ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{fechaMainStr}</p>
                  {evento.hora && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {evento.hora} hrs
                    </p>
                  )}
                </div>
                <Badge variant={agotadaMain ? "destructive" : "default"} className={!agotadaMain ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}>
                  {agotadaMain ? "Agotado" : `${dispMain} disponibles`}
                </Badge>
              </div>
            </button>
          );
        })()}
        {sesiones.map((sesion: any) => {
          const disp = sesion.capacidad - sesion.entradasVendidas;
          const isSelected = sesionSeleccionada === sesion._id;
          const fechaCompleta = sesion.fecha
            ? (() => {
                const dateOnly = String(sesion.fecha).split('T')[0];
                const parts = dateOnly.split('-');
                if (parts.length === 3) {
                  const [y, m, d] = parts.map(Number);
                  if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    const date = new Date(y, m - 1, d);
                    return `${DIAS[date.getDay()]}, ${d} de ${MESES[date.getMonth()]} de ${y}`;
                  }
                }
                return sesion.fecha;
              })()
            : '';
          const agotada = disp <= 0 || !sesion.activo;
          return (
            <button
              key={sesion._id}
              type="button"
              onClick={() => setSesionSeleccionada(sesion._id)}
              className={`text-left p-4 rounded-lg border transition-all ${isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
              } ${agotada ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{fechaCompleta}</p>
                  {sesion.hora && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {sesion.hora} hrs
                    </p>
                  )}
                </div>
                <Badge variant={agotada ? "destructive" : "default"} className={!agotada ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}>
                  {agotada ? "Agotado" : `${disp} disponibles`}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </>
)}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ticket Card */}
          {!evento.gratuito && !evento.entradaLiberada && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-20">
                <CardContent className="p-6">
                  {faseVenta?.esPreVenta ? (
                    <div className="mb-4 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Entradas Pre-venta</h3>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Entradas</h3>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="text-3xl font-bold">
                      {formatPrecio(faseVenta?.precioActual ?? evento.precio ?? 0)}
                    </p>
                    {faseVenta?.esPreVenta && faseVenta.precioPreVenta !== undefined && faseVenta.precioPreVenta > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Precio pre-venta</p>
                    )}
                  </div>

                      {evento.esMultipleDias && evento.dias?.length > 1 && sesiones.length === 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-foreground">Selecciona una fecha</p>
                          <div className="space-y-2">
                            {evento.dias.map((dia: any, index: number) => {
                              const isSelected = diaSeleccionada === index;
                              const fechaStr = dia.fecha
                                ? (() => {
                                  const dateOnly = String(dia.fecha).split('T')[0];
                                  const parts = dateOnly.split('-');
                                  if (parts.length === 3) {
                                    const [y, m, d] = parts.map(Number);
                                    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                                      const date = new Date(y, m - 1, d);
                                      return `${DIAS_SHORT[date.getDay()]}, ${d} ${MESES_SHORT[date.getMonth()]}`;
                                    }
                                  }
                                  return dia.fecha;
                                })()
                                : '';
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setDiaSeleccionada(index)}
                                  className={`w-full text-left p-3 rounded-lg border transition-colors ${isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {fechaStr}
                                      </p>
                                      {dia.nombre && (
                                        <p className="text-xs text-muted-foreground">{dia.nombre}</p>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {sesiones.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-foreground">Selecciona una fecha</p>
                          <div className="space-y-2">
                            {sesiones.map((sesion: any) => {
                              const disp = sesion.capacidad - sesion.entradasVendidas;
                              const isSelected = sesionSeleccionada === sesion._id;
                              return (
                                <button
                                  key={sesion._id}
                                  onClick={() => setSesionSeleccionada(sesion._id)}
                                  className={`w-full text-left p-3 rounded-lg border transition-colors ${isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    } ${!sesion.activo || disp <= 0 ? "opacity-50 pointer-events-none" : ""}`}
                                  disabled={!sesion.activo || disp <= 0}
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground">
                                      {formatFechaLocal(sesion.fecha)}
                                      {sesion.hora && ` — ${sesion.hora} hrs`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {disp} disponibles
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">Disponibilidad</span>
                          <span className="font-medium">
                            {disponibilidad.toLocaleString()} de{" "}
                            {capacidadTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${porcentajeVendido}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {porcentajeVendido}% vendido
                        </p>
                      </div>

                      {isAuthenticated ? (
                    <>
                      {!limiteCargado ? (
                        <Button className="w-full" size="lg" disabled>
                          Cargando...
                        </Button>
                      ) : !puedeComprar ? (
                        <>
                          <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Ya tienes {entradasUsuario} entrada(s) para este evento. Límite alcanzado ({limiteCompra}).</span>
                          </div>
                          <Button className="w-full" size="lg" disabled>
                            Límite alcanzado
                          </Button>
                        </>
                      ) : faseVenta?.puedeComprar ? (
                        <Button
                          className="w-full"
                          size="lg"
                          disabled={!evento.activo}
                          onClick={handleBuy}
                        >
                          {evento.activo ? (
                            faseVenta.esPreVenta 
                              ? `Comprar (Pre-venta) - ${formatPrecio(faseVenta.precioActual)}`
                              : `Comprar entradas - ${formatPrecio(faseVenta.precioActual)}`
                          ) : (
                            "No disponible"
                          )}
                        </Button>
                      ) : (
                        <div className="rounded-lg bg-muted/50 border border-border p-3 text-sm text-muted-foreground text-center">
                          {faseVenta?.mensaje || "Venta no disponible"}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href={`/login?returnUrl=/eventos/${eventoId}`}
                        onClick={() => localStorage.setItem('returnUrl', `/eventos/${eventoId}`)}
                      >
                        <Button className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Iniciar sesión para comprar
                        </Button>
                      </Link>
                      <Link
                        href={`/register?returnUrl=/eventos/${eventoId}`}
                        className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => localStorage.setItem('returnUrl', `/eventos/${eventoId}`)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear cuenta
                      </Link>
                      <p className="text-center text-xs text-muted-foreground">
                        Inicia sesión o regístrate para comprar
                      </p>
                    </div>
                  )}

                  {isAuthenticated && faseVenta?.puedeComprar && (
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Compra segura y garantizada
                    </p>
                  )}

                  {faseVenta?.puedeSuscribirse && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-medium">Lista de Espera</h4>
                        </div>
                        {waitingListSuccess ? (
                          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Te has suscrito correctamente</span>
                          </div>
                        ) : (
                          <>
                            {waitingListError && (
                              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{waitingListError}</span>
                              </div>
                            )}
                            <div className="space-y-2">
                              {evento.configWaitingList?.preVenta && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={waitingListSubmitting}
                                  onClick={() => handleWaitingList("preVenta")}
                                >
                                  {waitingListSubmitting && waitingListTipo === "preVenta" ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : (
                                    <Mail className="mr-2 h-3 w-3" />
                                  )}
                                  Suscribirse a pre-venta
                                </Button>
                              )}
                              {evento.configWaitingList?.postVenta && !hayDisponibilidad && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={waitingListSubmitting}
                                  onClick={() => handleWaitingList("postVenta")}
                                >
                                  {waitingListSubmitting && waitingListTipo === "postVenta" ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : (
                                    <Mail className="mr-2 h-3 w-3" />
                                  )}
                                  Suscribirse a post-venta
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {evento.entradaLiberada && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-20">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Entrada Liberada</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Este evento no requiere entrada. Solo necesitas presentarte en el lugar.
                  </p>

                  <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 text-sm text-green-800 dark:text-green-200">
                    Acceso libre y gratuito. No se necesita registro ni compra.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar - Evento Gratuito */}
          {evento.gratuito && !evento.entradaLiberada && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-20">
                <CardContent className="p-6">
                  {faseVenta?.esPreVenta ? null : (
                    <div className="mb-4 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Entradas Gratuitas</h3>
                    </div>
                  )}

                  {faseVenta?.esPreVenta ? null : (
                    <>
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground">Precio</p>
                        <p className="text-3xl font-bold text-green-600">Gratis</p>
                      </div>

                      {evento.gratuitoSinLimite ? (
                        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 text-sm text-green-800 dark:text-green-200">
                          Evento gratuito sin límite de capacidad.
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <div className="mb-2 flex justify-between text-sm">
                              <span className="text-muted-foreground">Disponibilidad</span>
                              <span className="font-medium">
                                {disponibilidad.toLocaleString()} de{" "}
                                {capacidadTotal.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-green-600 transition-all"
                                style={{ width: `${porcentajeVendido}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {porcentajeVendido}% obtenido
                            </p>
                          </div>
{evento.limitePorUsuario && evento.limitePorUsuario > 1 && (
  <div className="mb-4 rounded-lg bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
    Máximo <span className="font-semibold text-foreground">{evento.limitePorUsuario}</span> {evento.limitePorUsuario === 1 ? "entrada" : "entradas"} por usuario en el evento
  </div>
)}
                        </>
                      )}

                      {sesiones.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-sm font-medium text-foreground">Selecciona una fecha</p>
                          <div className="space-y-2">
                            {sesiones.map((sesion: any) => {
                              const disp = sesion.capacidad - sesion.entradasVendidas;
                              const isSelected = sesionSeleccionada === sesion._id;
                              return (
                                <button
                                  key={sesion._id}
                                  type="button"
                                  onClick={() => setSesionSeleccionada(sesion._id)}
                                  className={`w-full text-left p-3 rounded-lg border transition-colors ${isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    } ${!sesion.activo || disp <= 0 ? "opacity-50 pointer-events-none" : ""}`}
                                  disabled={!sesion.activo || disp <= 0}
                                >
                                  <p className="text-sm font-medium text-foreground">
                                    {formatFechaLocal(sesion.fecha)}
                                    {sesion.hora && ` — ${sesion.hora} hrs`}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {isAuthenticated ? (
                    !limiteCargado ? (
                      <Button className="w-full" size="lg" disabled>
                        Cargando...
                      </Button>
                    ) : !puedeComprar ? (
                      <>
                        <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>Ya tienes {entradasUsuario} entrada(s) para este evento. Límite alcanzado ({limiteCompra}).</span>
                        </div>
                        <Button className="w-full" size="lg" disabled>
                          Límite alcanzado
                        </Button>
                      </>
                    ) : faseVenta?.puedeComprar ? (
                      <Link href={`/eventos/${eventoId}/checkout-gratuito${sesionSeleccionada ? `?sesion=${sesionSeleccionada}` : ''}`}>
                        <Button className="w-full" size="lg" disabled={!evento.activo}>
                          {evento.activo ? "Obtener entrada" : "No disponible"}
                        </Button>
                      </Link>
                    ) : (
                      <div className="rounded-lg bg-muted/50 border border-border p-3 text-sm text-muted-foreground text-center">
                        {faseVenta?.mensaje || "Venta no disponible"}
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href={`/login?returnUrl=/eventos/${eventoId}/checkout-gratuito`}
                        onClick={() => localStorage.setItem('returnUrl', `/eventos/${eventoId}/checkout-gratuito`)}
                      >
                        <Button className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Iniciar sesión para obtener entrada
                        </Button>
                      </Link>
                      <Link
                        href={`/register?returnUrl=/eventos/${eventoId}/checkout-gratuito`}
                        className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => localStorage.setItem('returnUrl', `/eventos/${eventoId}/checkout-gratuito`)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear cuenta
                      </Link>
                      <p className="text-center text-xs text-muted-foreground">
                        Inicia sesión o regístrate para obtener tu entrada
                      </p>
                    </div>
                  )}

                  {faseVenta?.puedeSuscribirse && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-medium">Lista de Espera</h4>
                        </div>
                        {waitingListSuccess ? (
                          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Te has suscrito correctamente</span>
                          </div>
                        ) : (
                          <>
                            {waitingListError && (
                              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{waitingListError}</span>
                              </div>
                            )}
                            <div className="space-y-2">
                              {evento.configWaitingList?.preVenta && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={waitingListSubmitting}
                                  onClick={() => handleWaitingList("preVenta")}
                                >
                                  {waitingListSubmitting && waitingListTipo === "preVenta" ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : (
                                    <Mail className="mr-2 h-3 w-3" />
                                  )}
                                  Suscribirse a pre-venta
                                </Button>
                              )}
                              {evento.configWaitingList?.postVenta && !hayDisponibilidad && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  disabled={waitingListSubmitting}
                                  onClick={() => handleWaitingList("postVenta")}
                                >
                                  {waitingListSubmitting && waitingListTipo === "postVenta" ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : (
                                    <Mail className="mr-2 h-3 w-3" />
                                  )}
                                  Suscribirse a post-venta
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
