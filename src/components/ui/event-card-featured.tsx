'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Evento } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardFeaturedProps {
  evento: Evento;
  className?: string;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
];

function getPlaceholderImage(id: string): string {
  const index = id.charCodeAt(0) % placeholderImages.length;
  return placeholderImages[index];
}

export function EventCardFeatured({ evento, className }: EventCardFeaturedProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
const imageUrl = evento.imagenUrl || (evento as any).imagen || getPlaceholderImage(evento._id);
const location = (evento as any).ubicacion || evento.espacio || 'TBD';
const fechaObj = new Date(evento.fecha || '');
  
  const dia = fechaObj.getDate();
  const mes = fechaObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  const anio = fechaObj.getFullYear();

  const entradasDisponibles = (evento.capacidad || 0) - evento.entradasVendidas;
  const estaAgotado = entradasDisponibles <= 0;

  return (
    <div
      className={cn(
        'group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={imageUrl}
        alt={evento.nombre}
        fill
        className={cn(
          'object-cover transition-all duration-700',
          isHovered ? 'scale-110' : 'scale-100'
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setImgError(true)}
        unoptimized
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute top-4 left-4 flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-lg">
        <span className="text-2xl font-black text-zinc-900 leading-none">{dia}</span>
        <span className="text-xs font-bold text-zinc-600 leading-none">{mes}</span>
        <span className="text-[10px] font-medium text-zinc-500 leading-none">{anio}</span>
      </div>

      {!evento.activo && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <span className="bg-zinc-800 px-4 py-2 rounded-full text-sm font-semibold text-white">
            Finalizado
          </span>
        </div>
      )}

      {estaAgotado && evento.activo && (
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white uppercase">
            Agotado
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block bg-primary/90 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-3">
          {evento.categoria}
        </span>
        
        <h3 className={cn(
          'font-headline text-3xl font-light text-white mb-2 transition-all',
          isHovered ? 'translate-x-2' : ''
        )}>
          {evento.nombre}
        </h3>
        
        <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {location}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
<p className="text-white/50 text-xs line-through">
${Math.round((evento.precio || 0) * 1.2).toLocaleString('es-CL')}
</p>
<p className="text-3xl font-bold text-white">
${(evento.precio || 0).toLocaleString('es-CL')}
</p>
          </div>
          
          <button
            className={cn(
              'px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all',
              estaAgotado || !evento.activo
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-white text-zinc-900 hover:bg-primary hover:text-white'
            )}
            disabled={estaAgotado || !evento.activo}
          >
            {estaAgotado ? 'Agotado' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
