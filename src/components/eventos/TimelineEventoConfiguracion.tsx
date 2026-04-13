"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TimelineData {
  fechaEvento: string;
  preventa?: {
    inscripcionInicio: string;
    inscripcionFin: string;
    compraInicio: string;
    compraFin: string;
  };
  ventaOnline: {
    inicio: string;
    fin: string;
  };
}

interface TimelinePreventaProps {
  data: TimelineData;
  onUpdate?: (field: string, value: string) => void;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

function getDaysDiff(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function TimelinePreventa({ data, onUpdate }: TimelinePreventaProps) {
  const {
    fechaEvento,
    preventa,
    ventaOnline
  } = data;

  const fechaEventoDate = parseDate(fechaEvento);
  const ventaInicioDate = parseDate(ventaOnline.inicio);
  const ventaFinDate = parseDate(ventaOnline.fin);

  const preventaInscripcionInicio = parseDate(preventa?.inscripcionInicio || "");
  const preventaInscripcionFin = parseDate(preventa?.inscripcionFin || "");
  const preventaCompraInicio = parseDate(preventa?.compraInicio || "");
  const preventaCompraFin = parseDate(preventa?.compraFin || "");

  const timelineData = useMemo(() => {
    if (!fechaEventoDate || !ventaInicioDate || !ventaFinDate) {
      return null;
    }

    const totalDays = getDaysDiff(ventaInicioDate, ventaFinDate) || 30;
    const startDate = preventaInscripcionInicio || ventaInicioDate;

    const calculatePosition = (date: Date | null) => {
      if (!date) return 0;
      const days = getDaysDiff(startDate, date);
      return Math.max(0, Math.min(100, (days / totalDays) * 100));
    };

    return {
      totalDays,
      startDate,
      positions: {
        inscripcionInicio: calculatePosition(preventaInscripcionInicio),
        inscripcionFin: calculatePosition(preventaInscripcionFin),
        compraInicio: calculatePosition(preventaCompraInicio),
        compraFin: calculatePosition(preventaCompraFin),
        ventaInicio: calculatePosition(ventaInicioDate),
        ventaFin: calculatePosition(ventaFinDate),
        evento: calculatePosition(fechaEventoDate),
      },
    };
  }, [fechaEventoDate, ventaInicioDate, ventaFinDate, preventa, preventaInscripcionInicio, preventaInscripcionFin, preventaCompraInicio, preventaCompraFin]);

  if (!timelineData) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
        Configura las fechas del evento y venta online para ver el timeline
      </div>
    );
  }

  const { positions, totalDays, startDate } = timelineData;

  const getDateFromPosition = (position: number): Date => {
    const days = (position / 100) * totalDays;
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Timeline de Fechas</h3>
        <span className="text-xs text-muted-foreground">
          {totalDays} días de actividad
        </span>
      </div>

      <div className="relative">
        <div className="h-8 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 relative overflow-hidden">
          <div className="absolute inset-0 flex">
            {preventa && (
              <>
                <div 
                  className="h-full bg-blue-500/30 border-r border-blue-600/50"
                  style={{ width: `${positions.inscripcionFin - positions.inscripcionInicio}%`, left: `${positions.inscripcionInicio}%` }}
                />
                <div 
                  className="h-full bg-purple-500/30"
                  style={{ width: `${positions.compraFin - positions.compraInicio}%`, left: `${positions.compraInicio}%` }}
                />
              </>
            )}
            <div 
              className="h-full bg-green-500/30"
              style={{ width: `${positions.ventaFin - positions.ventaInicio}%`, left: `${positions.ventaInicio}%` }}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-between px-2">
            {preventa && preventaInscripcionInicio && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-medium text-blue-700">Inscripción</span>
                <span className="text-[8px] text-blue-600">{formatDate(preventa.inscripcionInicio)}</span>
              </div>
            )}
            {preventa && preventaCompraFin && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium text-purple-700">Pre-venta</span>
                <span className="text-[8px] text-purple-600">{formatDate(preventa.compraFin)}</span>
              </div>
            )}
            <div className="flex flex-col items-center ml-auto">
              <span className="text-[10px] font-medium text-green-700">Venta</span>
              <span className="text-[8px] text-green-600">{formatDate(ventaOnline.fin)}</span>
            </div>
          </div>
        </div>

        <div className="relative h-6 mt-1">
          {preventa && preventaInscripcionInicio && (
            <div 
              className="absolute w-3 h-3 bg-blue-600 rounded-full -top-1 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `calc(${positions.inscripcionInicio}% - 6px)` }}
              title={`Inicio inscripción: ${formatDate(preventa.inscripcionInicio)}`}
              onClick={() => onUpdate?.("fechaInscripcionPreVentaInicio", preventa.inscripcionInicio)}
            />
          )}
          {preventa && preventaInscripcionFin && (
            <div 
              className="absolute w-3 h-3 bg-blue-800 rounded-full -top-1 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `calc(${positions.inscripcionFin}% - 6px)` }}
              title={`Fin inscripción: ${formatDate(preventa.inscripcionFin)}`}
              onClick={() => onUpdate?.("fechaInscripcionPreVentaFin", preventa.inscripcionFin)}
            />
          )}
          {preventa && preventaCompraInicio && (
            <div 
              className="absolute w-3 h-3 bg-purple-600 rounded-full -top-1 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `calc(${positions.compraInicio}% - 6px)` }}
              title={`Inicio compra: ${formatDate(preventa.compraInicio)}`}
              onClick={() => onUpdate?.("fechaInicioPreVenta", preventa.compraInicio)}
            />
          )}
          {preventa && preventaCompraFin && (
            <div 
              className="absolute w-3 h-3 bg-purple-800 rounded-full -top-1 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `calc(${positions.compraFin}% - 6px)` }}
              title={`Fin preventa: ${formatDate(preventa.compraFin)}`}
              onClick={() => onUpdate?.("fechaFinPreVenta", preventa.compraFin)}
            />
          )}
          {ventaInicioDate && (
            <div 
              className="absolute w-3 h-3 bg-green-600 rounded-full -top-1 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `calc(${positions.ventaInicio}% - 6px)` }}
              title={`Inicio venta: ${formatDate(ventaOnline.inicio)}`}
              onClick={() => onUpdate?.("ventaOnlineFechaInicio", ventaOnline.inicio)}
            />
          )}
          {fechaEventoDate && (
            <div 
              className="absolute w-4 h-4 bg-red-600 rounded-full -top-1.5 cursor-pointer hover:scale-125 transition-transform border-2 border-white shadow-md"
              style={{ left: `calc(${positions.evento}% - 8px)` }}
              title={`Fecha evento: ${formatDate(fechaEvento)}`}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {preventa && (
          <>
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <div className="font-medium text-blue-800">Inscripción</div>
              <div className="text-blue-600">{formatDate(preventa.inscripcionInicio)} - {formatDate(preventa.inscripcionFin)}</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border border-purple-200">
              <div className="font-medium text-purple-800">Pre-venta</div>
              <div className="text-purple-600">{formatDate(preventa.compraInicio)} - {formatDate(preventa.compraFin)}</div>
            </div>
          </>
        )}
        <div className="p-2 bg-green-50 rounded border border-green-200">
          <div className="font-medium text-green-800">Venta Online</div>
          <div className="text-green-600">{formatDate(ventaOnline.inicio)} - {formatDate(ventaOnline.fin)}</div>
        </div>
        <div className="p-2 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-800">Fecha Evento</div>
          <div className="text-red-600">{formatDate(fechaEvento)}</div>
        </div>
      </div>
    </div>
  );
}