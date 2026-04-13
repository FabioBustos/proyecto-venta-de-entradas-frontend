"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface CalendarioData {
  fechaEvento: string;
  preventa?: {
    inscripcionInicio: string;
    inscripcionFin: string;
    horaInscripcionInicio?: string;
    horaInscripcionFin?: string;
    compraInicio: string;
    compraFin: string;
    horaCompraInicio?: string;
    horaCompraFin?: string;
  };
  ventaOnline: {
    inicio: string;
    fin: string;
    horaInicio?: string;
    horaFin?: string;
  };
}

interface CalendarioEventoConfiguracionProps {
  data: CalendarioData;
  onUpdate?: (field: string, value: string) => void;
  eventoId?: string;
}

interface CalendarioEventoConfiguracionProps {
  data: CalendarioData;
  onUpdate?: (field: string, value: string) => void;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

function formatDateTime(dateStr: string, timeStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "";
  const dateStr2 = date.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
  if (timeStr) {
    return `${dateStr2} ${timeStr}`;
  }
  return dateStr2;
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

type PhaseType = 'none' | 'inscripcion' | 'preventa' | 'ventaOnline' | 'preventa_venta' | 'evento';

function getPhaseForDate(
  date: Date,
  fechaEventoDate: Date | null,
  preventa: CalendarioData['preventa'],
  ventaOnline: CalendarioData['ventaOnline']
): PhaseType {
  if (fechaEventoDate && isSameDay(date, fechaEventoDate)) {
    return 'evento';
  }

  const isInInscripcion = preventa && (() => {
    const inicio = parseDate(preventa.inscripcionInicio);
    const fin = parseDate(preventa.inscripcionFin);
    return inicio && fin && date >= inicio && date <= fin;
  })();

  const isInPreventa = preventa && (() => {
    const inicio = parseDate(preventa.compraInicio);
    const fin = parseDate(preventa.compraFin);
    return inicio && fin && date >= inicio && date <= fin;
  })();

  const isInVentaOnline = (() => {
    const inicio = parseDate(ventaOnline.inicio);
    const fin = parseDate(ventaOnline.fin);
    return inicio && fin && date >= inicio && date <= fin;
  })();

  if (isInInscripcion) {
    return 'inscripcion';
  }

  if (isInPreventa && isInVentaOnline) {
    return 'preventa_venta';
  }

  if (isInPreventa) {
    return 'preventa';
  }

  if (isInVentaOnline) {
    return 'ventaOnline';
  }

  return 'none';
}

const phaseConfig = {
  none: { bg: 'bg-gray-50', text: 'text-gray-400', label: '' },
  inscripcion: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Insc' },
  preventa: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Prev' },
  ventaOnline: { bg: 'bg-green-100', text: 'text-green-700', label: 'Venta' },
  preventa_venta: { bg: 'bg-gradient-to-r from-purple-100 to-green-100', text: 'text-green-700', label: 'Prev+V' },
  evento: { bg: 'bg-red-500', text: 'text-white', label: '★' },
};

const phaseLabels = {
  inscripcion: 'Inscripción WL',
  preventa: 'Pre-venta',
  ventaOnline: 'Venta Online',
  preventa_venta: 'Pre-venta + Venta',
  evento: 'Fecha Evento',
};

export function CalendarioEventoConfiguracion({ data, onUpdate }: CalendarioEventoConfiguracionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fechaEventoDate = parseDate(data.fechaEvento);
    if (fechaEventoDate) {
      setCurrentDate(new Date(fechaEventoDate.getFullYear(), fechaEventoDate.getMonth(), 1));
    }
  }, [data.fechaEvento]);

  useEffect(() => {
    if (data.preventa?.inscripcionInicio) {
      const inscDate = parseDate(data.preventa.inscripcionInicio);
      if (inscDate) {
        setCurrentDate(new Date(inscDate.getFullYear(), inscDate.getMonth(), 1));
      }
    }
  }, [data.preventa?.inscripcionInicio, data.preventa?.compraInicio]);

  const fechaEventoDate = parseDate(data.fechaEvento);

  const monthDays = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToEventoMonth = () => {
    if (fechaEventoDate) {
      setCurrentDate(new Date(fechaEventoDate.getFullYear(), fechaEventoDate.getMonth(), 1));
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Vista Calendario</h3>
          </div>
        </div>
        <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Vista Calendario</h3>
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 hover:bg-muted rounded"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="font-semibold">{monthNames[currentDate.getMonth()]}</div>
          <div className="text-xs text-muted-foreground">{currentDate.getFullYear()}</div>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 hover:bg-muted rounded"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {dayNames.map((day) => (
          <div key={day} className="font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const phase = getPhaseForDate(date, fechaEventoDate, data.preventa, data.ventaOnline);
          const config = phaseConfig[phase];
          const isToday = isSameDay(date, new Date());

          return (
            <button
              type="button"
              key={date.toISOString()}
              onClick={() => {
                if (onUpdate) {
                  const dateStr = date.toISOString().split('T')[0];
                  if (phase === 'inscripcion') {
                    if (date <= (parseDate(data.preventa?.inscripcionFin || '') || date)) {
                      onUpdate('fechaInscripcionPreVentaInicio', dateStr);
                    }
                  } else if (phase === 'preventa') {
                    if (date <= (parseDate(data.preventa?.compraFin || '') || date)) {
                      onUpdate('fechaInicioPreVenta', dateStr);
                    }
                  } else if (phase === 'ventaOnline') {
                    onUpdate('ventaOnlineFechaInicio', dateStr);
                  }
                }
              }}
              className={cn(
                "h-10 rounded-md text-xs font-medium transition-all",
                config.bg,
                config.text,
                isToday && "ring-2 ring-offset-1 ring-blue-500",
                "hover:opacity-80"
              )}
            >
              <div>{date.getDate()}</div>
              {config.label && (
                <div className="text-[8px] leading-none">{config.label}</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-xs pt-2">
        {Object.entries(phaseLabels).map(([phase, label]) => {
          if (phase === 'none') return null;
          const config = phaseConfig[phase as PhaseType];
          return (
            <div
              key={phase}
              className={cn("flex items-center gap-1 px-2 py-1 rounded", config.bg, config.text)}
            >
              <div className={cn("w-2 h-2 rounded-full", phase === 'evento' ? 'bg-white' : 'bg-current')} />
              {label}
            </div>
          );
        })}
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-muted-foreground">
          <div className="w-2 h-2 rounded-full ring-2 ring-blue-500 ring-offset-1" />
          Hoy
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-4 p-3 bg-muted/30 rounded-lg">
        <div>
          <div className="font-medium text-muted-foreground">Inscripción WL</div>
          {data.preventa?.inscripcionInicio && (
            <div className="text-blue-600">
              {formatDateTime(data.preventa.inscripcionInicio, data.preventa.horaInscripcionInicio)} - {formatDateTime(data.preventa.inscripcionFin, data.preventa.horaInscripcionFin)}
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-muted-foreground">Pre-venta</div>
          {data.preventa?.compraInicio && (
            <div className="text-purple-600">
              {formatDateTime(data.preventa.compraInicio, data.preventa.horaCompraInicio)} - {formatDateTime(data.preventa.compraFin, data.preventa.horaCompraFin)}
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-muted-foreground">Venta Online</div>
          <div className="text-green-600">
            {formatDateTime(data.ventaOnline.inicio, data.ventaOnline.horaInicio)} - {formatDateTime(data.ventaOnline.fin, data.ventaOnline.horaFin)}
          </div>
        </div>
        <div>
          <div className="font-medium text-muted-foreground">Fecha Evento</div>
          <div className="text-red-600 font-medium">
            {formatDate(data.fechaEvento)}
          </div>
        </div>
      </div>
    </div>
  );
}