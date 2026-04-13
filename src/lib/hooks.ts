import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { FiltrosEventos, ResponsePaginada, Evento } from '@/types';

const API_BASE = '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    fetch(`${API_BASE}/api/auth`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ token: string; user: any }>(r)),
};

export const eventosApi = {
  getAll: (filtros?: FiltrosEventos, page = 1, limit = 10) => {
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

    return fetch(`${API_BASE}/api/eventos?${params}`).then((r) =>
      handleResponse<ResponsePaginada<Evento>>(r)
    );
  },
};

export const comprasApi = {
  getAll: (token?: string) =>
    fetch(`${API_BASE}/api/compras`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((r) => handleResponse<any[]>(r)),

  create: (data: any, token?: string) =>
    fetch(`${API_BASE}/api/compras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<any>(r)),
};

export const pagosApi = {
  create: (data: any, token?: string) =>
    fetch(`${API_BASE}/api/pagos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<any>(r)),
};

export const entradasApi = {
  getAll: (token?: string) =>
    fetch(`${API_BASE}/api/entradas`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((r) => handleResponse<any[]>(r)),
};

export function useEventos(filtros?: FiltrosEventos, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['eventos', filtros, page, limit],
    queryFn: () => eventosApi.getAll(filtros, page, limit),
  });
}

export function useCompras(token?: string) {
  return useQuery({
    queryKey: ['compras', token],
    queryFn: () => comprasApi.getAll(token) as Promise<any[]>,
    enabled: !!token,
  });
}

export function useEntradas(token?: string) {
  return useQuery({
    queryKey: ['entradas', token],
    queryFn: () => entradasApi.getAll(token) as Promise<any[]>,
    enabled: !!token,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useCreateCompra(token?: string) {
  return useMutation({
    mutationFn: (data: any) => comprasApi.create(data, token),
  });
}

export function useCreatePago(token?: string) {
  return useMutation({
    mutationFn: (data: any) => pagosApi.create(data, token),
  });
}

export function useEventFilters(initialValues?: Partial<{
  searchQuery: string;
  selectedCategory: string;
  selectedCity: string;
  selectedComuna: string;
  selectedFecha: string;
  priceRange: [number, number];
  sortBy: string;
}>) {
  const [searchQuery, setSearchQuery] = useState(initialValues?.searchQuery || "");
  const [selectedCategory, setSelectedCategory] = useState(initialValues?.selectedCategory || "todos");
  const [selectedCity, setSelectedCity] = useState(initialValues?.selectedCity || "todas");
  const [selectedComuna, setSelectedComuna] = useState(initialValues?.selectedComuna || "todas");
  const [selectedFecha, setSelectedFecha] = useState(initialValues?.selectedFecha || "todas");
  const [priceRange, setPriceRange] = useState<[number, number]>(initialValues?.priceRange || [0, 5000]);
  const [sortBy, setSortBy] = useState(initialValues?.sortBy || "fecha");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const activeFiltersCount = 
    (selectedCategory !== "todos" ? 1 : 0) +
    (selectedCity !== "todas" ? 1 : 0) +
    (selectedComuna !== "todas" ? 1 : 0) +
    (selectedFecha !== "todas" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("todos");
    setSelectedCity("todas");
    setSelectedComuna("todas");
    setSelectedFecha("todas");
    setPriceRange([0, 5000]);
    setSortBy("fecha");
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return {
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedComuna,
    selectedFecha,
    priceRange,
    sortBy,
    activeFiltersCount,
    isFiltersOpen,
    isPriceOpen,
    isLocationOpen,
    isDateOpen,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCity,
    setSelectedComuna,
    setSelectedFecha,
    setPriceRange,
    setSortBy,
    setIsFiltersOpen,
    setIsPriceOpen,
    setIsLocationOpen,
    setIsDateOpen,
    clearFilters,
    formatPrice,
  };
}
