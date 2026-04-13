'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Evento } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardCompactProps {
  evento: Evento;
  className?: string;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80",
];

function getPlaceholderImage(id: string): string {
  const index = id.charCodeAt(0) % placeholderImages.length;
  return placeholderImages[index];
}

export function EventCardCompact({ evento, className }: EventCardCompactProps) {
  const [imgError, setImgError] = useState(false);
  
  const imageUrl = evento.imagenUrl || (evento as any).imagen || getPlaceholderImage(evento._id);
  const location = (evento as any).ubicacion || evento.espacio || 'TBD';
  const fechaObj = new Date(evento.fecha || '');
  
  const dia = fechaObj.getDate();
  const mes = fechaObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();

  const entradasDisponibles = (evento.capacidad || 0) - evento.entradasVendidas;
  const estaAgotado = entradasDisponibles <= 0;

  return (
    <div
      className={cn(
        'group flex gap-4 p-3 rounded-xl bg-surface border border-outline/10 hover:border-primary/30 transition-all cursor-pointer',
        className
      )}
    >
      <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={evento.nombre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="112px"
          onError={() => setImgError(true)}
          unoptimized
        />
        <div className="absolute top-1 left-1 flex flex-col items-center bg-white/95 rounded px-1 py-0.5 shadow">
          <span className="text-xs font-bold text-zinc-900 leading-none">{dia}</span>
          <span className="text-[8px] font-medium text-zinc-600 leading-none">{mes}</span>
        </div>
        {estaAgotado && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white uppercase">Agotado</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
          {evento.categoria}
        </span>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
          {evento.nombre}
        </h3>
        <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
          {location}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-zinc-900">
            ${(evento.precio || 0).toLocaleString('es-CL')}
          </span>
          <button
            className={cn(
              'text-[10px] font-medium px-3 py-1 rounded-full transition-colors',
              estaAgotado
                ? 'bg-zinc-200 text-zinc-400'
                : 'bg-zinc-900 text-white group-hover:bg-primary'
            )}
            disabled={estaAgotado}
          >
            {estaAgotado ? 'Agotado' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
