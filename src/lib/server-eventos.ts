import type { Evento, FiltrosEventos, ResponsePaginada } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';

export async function fetchEventosServer(
  filtros?: FiltrosEventos,
  page = 1,
  limit = 12
): Promise<ResponsePaginada<Evento>> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());

  if (filtros) {
    if (filtros.search) params.set('search', filtros.search);
    if (filtros.categoria) params.set('categoria', filtros.categoria);
    if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta);
    if (filtros.precioMin) params.set('precioMin', filtros.precioMin.toString());
    if (filtros.precioMax) params.set('precioMax', filtros.precioMax.toString());
  }

  const response = await fetch(`${API_URL}/eventos/publicos?${params}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch eventos');
  }

  return response.json();
}

export async function fetchEventoById(id: string): Promise<Evento> {
  const response = await fetch(`${API_URL}/eventos/${id}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch evento');
  }

  return response.json();
}

export async function fetchAllCategorias(): Promise<string[]> {
  return ['Conciertos', 'Teatro', 'Deportes', 'Festivales'];
}
