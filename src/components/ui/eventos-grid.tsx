'use client';

import { useState, useCallback, useTransition, useEffect } from 'react';
import type { Evento, FiltrosEventos } from '@/types';
import { EventCard } from '@/components/ui/event-card';
import { EventCardCompact } from '@/components/ui/event-card-compact';
import { EventCardFeatured } from '@/components/ui/event-card-featured';

const categorias = ['Todos', 'Conciertos', 'Teatro', 'Deportes', 'Festivales'];

type ViewMode = 'grid' | 'compact' | 'featured';

interface EventosGridProps {
  initialData: {
    data: Evento[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export function EventosGrid({ initialData }: EventosGridProps) {
  const [categoria, setCategoria] = useState<string>('Todos');
  const [search, setSearch] = useState<string>('');
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(100000);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetchFilteredData().finally(() => setIsInitialLoading(false));
  }, []);

  const queryParams: FiltrosEventos = {};
  if (categoria !== 'Todos') queryParams.categoria = categoria;
  if (search) queryParams.search = search;
  if (precioMin > 0) queryParams.precioMin = precioMin;
  if (precioMax < 100000) queryParams.precioMax = precioMax;

  const fetchFilteredData = useCallback(async () => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '12');
    if (categoria !== 'Todos') params.set('categoria', categoria);
    if (search) params.set('search', search);
    if (precioMin > 0) params.set('precioMin', precioMin.toString());
    if (precioMax < 100000) params.set('precioMax', precioMax.toString());

    const response = await fetch(`/api/eventos?${params}`);
    if (response.ok) {
      const newData = await response.json();
      setData(newData);
    }
  }, [categoria, search, precioMin, precioMax, page]);

  const handleCategoriaChange = useCallback((cat: string) => {
    startTransition(() => {
      setCategoria(cat);
      setPage(1);
      fetchFilteredData();
    });
  }, [fetchFilteredData]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setPage(1);
      fetchFilteredData();
    });
  }, [fetchFilteredData]);

  const handlePageChange = useCallback((newPage: number) => {
    startTransition(() => {
      setPage(newPage);
      fetchFilteredData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [fetchFilteredData]);

  const handleFilterChange = useCallback((type: 'min' | 'max', value: number) => {
    startTransition(() => {
      if (type === 'min') setPrecioMin(value);
      else setPrecioMax(value);
      setPage(1);
      fetchFilteredData();
    });
  }, [fetchFilteredData]);

  const eventos: Evento[] = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const isLoading = isPending || isInitialLoading;

  const showEmptyState = !isLoading && (!eventos || eventos.length === 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-surface border border-outline/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        <div className="flex gap-4 items-center">
          <select
            value={precioMin}
            onChange={(e) => handleFilterChange('min', Number(e.target.value))}
            className="px-4 py-3 bg-surface border border-outline/20 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value={0}>Precio mínimo</option>
            <option value={10000}>$10.000</option>
            <option value={20000}>$20.000</option>
            <option value={30000}>$30.000</option>
            <option value={50000}>$50.000</option>
          </select>

          <select
            value={precioMax}
            onChange={(e) => handleFilterChange('max', Number(e.target.value))}
            className="px-4 py-3 bg-surface border border-outline/20 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value={100000}>Precio máximo</option>
            <option value={10000}>$10.000</option>
            <option value={20000}>$20.000</option>
            <option value={30000}>$30.000</option>
            <option value={50000}>$50.000</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
        <div className="flex gap-2 border-b border-outline/20 pb-4 md:pb-0 md:border-none overflow-x-auto w-full md:w-auto">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`font-body text-sm uppercase tracking-wider px-6 py-2 whitespace-nowrap transition-colors ${
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

        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-outline/20">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Grid"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'compact' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Lista Compacta"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('featured')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'featured' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Destacado"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === 'compact' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/2] bg-surface rounded-2xl mb-4"></div>
              <div className="h-4 bg-surface rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-surface rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">No se encontraron eventos</p>
          <p className="text-sm mt-2">Intenta con otros filtros de búsqueda</p>
        </div>
      ) : (
        <>
          {viewMode === 'featured' && eventos.length > 0 && (
            <div className="mb-8">
<EventCardFeatured
evento={{
  ...eventos[0],
  espacio: eventos[0].espacio,
}}
/>
            </div>
          )}

          <div className={viewMode === 'compact' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
            {(viewMode === 'featured' ? eventos.slice(1) : eventos).map((evento, index) => (
              <div
                key={evento._id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
{viewMode === 'compact' ? (
<EventCardCompact
evento={evento}
/>
) : (
<EventCard
evento={evento}
/>
)}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-outline/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface transition-colors"
              >
                Anterior
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      page === p
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline/20 hover:bg-surface'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-outline/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
