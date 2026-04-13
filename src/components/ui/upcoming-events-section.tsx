'use client';

import { useState, useCallback, useTransition } from 'react';
import { useEventos } from '@/lib/hooks';
import type { Evento } from '@/types';
import { EventCardStich } from './event-card-stich';

const categorias = ['Todos', 'Conciertos', 'Teatro', 'Deportes', 'Festivales'];

export const UpcomingEventsSection = () => {
  const [categoria, setCategoria] = useState<string>('Todos');
  const [isPending, startTransition] = useTransition();

  const queryParams = categoria === 'Todos'
    ? {}
    : { categoria };

  const { eventos, isLoading } = useEventos({ filtros: queryParams });

  const showEmptyState = !isLoading && (!eventos || eventos.length === 0);

  const handleCategoriaChange = useCallback((cat: string) => {
    startTransition(() => {
      setCategoria(cat);
    });
  }, []);

  return (
    <section className="px-6 md:px-12 py-20 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <h2 className="font-headline text-5xl font-light text-primary mb-6 tracking-tight">The Weekly Pulse</h2>
          <p className="text-on-surface-variant font-body font-light leading-relaxed">
            Refined selections for the discerning seeker. Verified experiences currently occurring within your locale.
          </p>
        </div>
        <div className="flex gap-2 border-b border-outline/20 pb-4 md:pb-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`font-body text-[10px] uppercase tracking-[0.2em] px-6 py-2 transition-colors ${
                categoria === cat 
                  ? 'text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              onClick={() => handleCategoriaChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading || isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="group border-b border-outline/20 pb-10 animate-pulse">
              <div className="relative aspect-[4/3] overflow-hidden mb-8 bg-surface-container border border-outline/10"></div>
              <div className="h-4 bg-surface-container-high rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-surface-container-high rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-container-high rounded w-full mb-8"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                <div className="h-6 bg-surface-container-high rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <p className="text-center max-w-sm">No events available at the moment.</p>
        </div>
      ) : eventos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {eventos.map((evento: any, index: number) => (
            <div
              key={evento._id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <EventCardStich evento={evento} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
