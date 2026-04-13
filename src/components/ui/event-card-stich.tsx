'use client';

import { Evento } from '@/types';

interface EventCardStichProps {
    evento: Evento;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
];

function getPlaceholderImage(id: string): string {
  const index = id.charCodeAt(0) % placeholderImages.length;
  return placeholderImages[index];
}

export const EventCardStich: React.FC<EventCardStichProps> = ({ evento }) => {
const imageUrl = evento.imagenUrl || (evento as any).imagen || getPlaceholderImage(evento._id);
const location = evento.espacio || (evento as any).lugar || 'TBD';

    return (
        <div className="group border-b border-outline/20 pb-10 transition-all cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden mb-8 border border-outline/10">
                <img 
                    alt={evento.nombre}
                    className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                    src={imageUrl}
                />
                <div
                    className="absolute top-0 right-0 bg-background/80 backdrop-blur-sm border-b border-l border-outline/20 px-4 py-2 text-[10px] tracking-[0.2em] font-bold text-primary">
                    {(evento.precio || 0) > 0 ? `$${(evento.precio || 0).toFixed(2)}` : 'FREE'}
                </div>
            </div>
            <div
                className="flex items-center gap-3 mb-4 text-[10px] uppercase tracking-[0.2em] font-medium text-secondary">
                <span>{new Date(evento.fecha || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="w-1 h-1 bg-outline rounded-full"></span>
                <span>{evento.hora || new Date(evento.fecha || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            </div>
            <h3 className="font-headline text-3xl font-light text-primary mb-4 group-hover:italic transition-all line-clamp-2">
                {evento.nombre}</h3>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 line-clamp-2">
                {evento.descripcion}
            </p>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-secondary uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span> {location}
                </span>
                <button
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">add_circle</button>
            </div>
        </div>
    );
};
