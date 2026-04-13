import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users, ImageOff, Bell, ArrowRight, Ticket, CheckCircle, CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Evento, EventoCardProps, ConfigWaitingList } from "@/types/index";

export type { EventoCardProps };

export function EventoCard({ evento, priority = false }: EventoCardProps) {
  const [imageError, setImageError] = useState(false);
  const imagenUrl = evento.imagenUrl || evento.imagenes?.[0];

  const esEntradaLiberada = evento.entradaLiberada;
  const esGratuito = evento.gratuito;

  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return '';
    const dateOnly = String(fecha).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const parseFecha = (fechaStr: string): Date => {
    const dateOnly = String(fechaStr).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(fechaStr);
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechasFuturas = (() => {
    if (evento.esMultipleDias && evento.dias?.length > 0) {
      return evento.dias
        .map((dia: any) => parseFecha(dia.fecha))
        .filter(d => d >= hoy)
        .sort((a, b) => a.getTime() - b.getTime());
    }
    if (evento.fecha) {
      const fecha = parseFecha(evento.fecha);
      return fecha >= hoy ? [fecha] : [];
    }
    return [];
  })();

  const todasFechasPasadas = fechasFuturas.length === 0;
  const primeraFecha = fechasFuturas[0];
  const fechasRestantes = fechasFuturas.length - 1;

  const capacidadBase = evento.capacidad || 0;
  const numFechasFuturas = fechasFuturas.length;
  const capacidadTotal = capacidadBase * (numFechasFuturas > 0 ? numFechasFuturas : 1);
  const tieneCapacidad = capacidadBase > 0;
  const disponibilidad = tieneCapacidad ? capacidadTotal - evento.entradasVendidas : 0;
  const porcentajeVendido = tieneCapacidad && capacidadTotal > 0 ? Math.round(
    (evento.entradasVendidas / capacidadTotal) * 100
  ) : 0;

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

const tieneSesiones = (evento as any).tieneSesiones;
const disponibilidadSesion = tieneSesiones ? (evento as any).sesionDisponible : null;
const sesionCapacidad = (evento as any).sesionCapacidad;

const configWaitingList = evento.configWaitingList as ConfigWaitingList | undefined;
const tieneWaitingListConPreVenta = configWaitingList?.habilitado && configWaitingList?.preVenta;

const estaEnPeriodoInscripcion = configWaitingList?.fechaInscripcionPreVentaInicio && configWaitingList?.fechaInscripcionPreVentaFin
? (() => {
  const inicio = new Date(configWaitingList.fechaInscripcionPreVentaInicio);
  const fin = new Date(configWaitingList.fechaInscripcionPreVentaFin);
  return hoy >= inicio && hoy <= fin;
})()
: false;

const mostrarWaitingList = tieneWaitingListConPreVenta && estaEnPeriodoInscripcion;

const formatFechaCorta = (fecha: string | undefined) => {
  if (!fecha) return '';
  const dateOnly = String(fecha).split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    });
  }
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
};

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg h-full min-h-[420px]">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imagenUrl && !imageError ? (
          <Image
            src={imagenUrl}
            alt={evento.nombre}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-xs font-medium">{evento.categoria}</span>
          </div>
        )}
<div className="absolute top-3 left-3 flex gap-2">
<Badge variant="secondary" className="bg-background/90 backdrop-blur">
  {evento.categoria}
</Badge>
{esEntradaLiberada && (
  <Badge variant="secondary">
    <CheckCircle className="h-3 w-3 mr-1" />
    Entrada Liberada
  </Badge>
)}
{esGratuito && !esEntradaLiberada && (
  <Badge variant="secondary">
    <Ticket className="h-3 w-3 mr-1" />
    Gratuito
  </Badge>
)}
{mostrarWaitingList && (
  <Badge variant="secondary">
    <Bell className="h-3 w-3 mr-1" />
    Lista de Espera
  </Badge>
)}
</div>
        {!esEntradaLiberada && tieneCapacidad && porcentajeVendido >= 90 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive">Casi agotado</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-balance">
          {evento.nombre}
        </h3>

        <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
          {todasFechasPasadas ? (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="text-muted-foreground/60">Evento finalizado</span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 mt-1" />
              <div className="flex flex-wrap gap-1.5">
                {fechasFuturas.slice(0, 3).map((fecha: Date, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs px-2 py-0 h-6">
                    {formatFecha(fecha.toISOString())}
                  </Badge>
                ))}
                {fechasFuturas.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 h-6">
                    +{fechasFuturas.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}
          {evento.hora && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{evento.hora} hrs</span>
            </div>
          )}
          {/*{(evento.lugar || evento.ubicacion) && (*/}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              {evento.espacio}
              {evento.direccion && `, ${evento.direccion}`}
              {evento.comuna && `, ${evento.comuna}`}
              {evento.region && `, ${evento.region}`}
            </span>
          </div>
{/*)}*/}
</div>

{mostrarWaitingList && configWaitingList && (
<div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
    {estaEnPeriodoInscripcion ? (
      <span>Inscripción abierta</span>
    ) : (
      <span>Próximamente</span>
    )}
  </div>
  <div className="mt-2 space-y-1">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <CalendarDays className="h-3 w-3" />
        <span>{formatFechaCorta(configWaitingList.fechaInscripcionPreVentaInicio)}</span>
      </span>
      {configWaitingList.horaInscripcionPreVentaInicio && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{configWaitingList.horaInscripcionPreVentaInicio}</span>
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <CalendarDays className="h-3 w-3" />
        <span>{formatFechaCorta(configWaitingList.fechaInscripcionPreVentaFin)}</span>
      </span>
      {configWaitingList.horaInscripcionPreVentaFin && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{configWaitingList.horaInscripcionPreVentaFin}</span>
        </span>
      )}
    </div>
  </div>
</div>
)}

{!esEntradaLiberada && !esGratuito && tieneCapacidad && !mostrarWaitingList && (
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span>{evento.entradasVendidas.toLocaleString()} entradas vendidas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs">
                  {tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? (
                    <>
                      <span className="text-green-600">{disponibilidadSesion.toLocaleString()} disponibles</span>
                      <span className="text-green-600">{Math.round(((sesionCapacidad - disponibilidadSesion) / sesionCapacidad) * 100)}%</span>
                    </>
                  ) : (
                    <>
                      <span>{disponibilidad.toLocaleString()} disponibles</span>
                      <span>{porcentajeVendido}%</span>
                    </>
                  )}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? 'bg-green-600' : 'bg-primary'}`}
                    style={{ width: `${tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? Math.round(((sesionCapacidad - disponibilidadSesion) / sesionCapacidad) * 100) : porcentajeVendido}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!esEntradaLiberada && esGratuito && tieneCapacidad && !mostrarWaitingList && (
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span>{evento.entradasVendidas.toLocaleString()} entradas obtenidas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs">
                  {tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? (
                    <>
                      <span className="text-green-600">{disponibilidadSesion.toLocaleString()} disponibles</span>
                      <span className="text-green-600">{Math.round(((sesionCapacidad - disponibilidadSesion) / sesionCapacidad) * 100)}%</span>
                    </>
                  ) : (
                    <>
                      <span>{disponibilidad.toLocaleString()} disponibles</span>
                      <span>{porcentajeVendido}%</span>
                    </>
                  )}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? 'bg-green-600' : 'bg-green-600'}`}
                    style={{ width: `${tieneSesiones && disponibilidadSesion !== null && sesionCapacidad ? Math.round(((sesionCapacidad - disponibilidadSesion) / sesionCapacidad) * 100) : porcentajeVendido}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!esEntradaLiberada && esGratuito && !tieneCapacidad && !mostrarWaitingList && (

          <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{evento.entradasVendidas.toLocaleString()} entradas generadas</span>
          </div>

        )}
      </CardContent>

<CardFooter className="flex items-center justify-between border-t p-4 min-h-[84.67px]">
{mostrarWaitingList ? (
  <Badge variant="secondary" className="text-sm">
    <Bell className="h-3.5 w-3.5 mr-1.5" />
    Lista de Espera
  </Badge>
) : esEntradaLiberada ? (
  <Badge variant="secondary" className="text-sm">
    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
    Entrada Liberada
  </Badge>
) : esGratuito && !tieneCapacidad ? (
  <Badge variant="secondary" className="text-sm">
    <Ticket className="h-3.5 w-3.5 mr-1.5" />
    Gratuito - Acceso ilimitado
  </Badge>
) : esGratuito ? (
  <Badge variant="secondary" className="text-sm">
    <Ticket className="h-3.5 w-3.5 mr-1.5" />
    Gratuito
  </Badge>
) : (
  <div>
    <p className="text-xs text-muted-foreground">Desde</p>
    <p className="text-lg font-bold">{formatPrecio(evento.precio || 0)}</p>
  </div>
)}
<Button asChild variant={mostrarWaitingList ? "default" : "default"}>
<Link href={`/eventos/${evento._id}`}>
  {mostrarWaitingList ? (
    <>
      <Bell className="h-4 w-4 mr-2" />
      Apúntate a la lista
    </>
  ) : (
    <>
      <ArrowRight className="h-4 w-4 mr-2" />
      Ver detalles
    </>
  )}
</Link>
</Button>
</CardFooter>
    </Card>
  );
}
