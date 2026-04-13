"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EventoCard } from "@/components/evento-card";
import type { Evento, EventFiltersValues } from "@/types";

interface EventosGridClientProps {
  initialEventos: Evento[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function EventosGridClient({
  initialEventos,
  initialPagination,
}: EventosGridClientProps) {
  const [eventos, setEventos] = useState(initialEventos);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EventFiltersValues | null>(null);

  const buildQuery = useCallback((filtros: EventFiltersValues, pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    params.set('limit', '9');
    if (filtros.searchQuery) params.set('search', filtros.searchQuery);
    if (filtros.selectedCategory && filtros.selectedCategory !== 'todos') {
      params.set('categoria', filtros.selectedCategory.toLowerCase());
    }
    if (filtros.selectedCity && filtros.selectedCity !== 'todas') {
      params.set('ciudad', filtros.selectedCity);
    }
    if (filtros.selectedComuna && filtros.selectedComuna !== 'todas') {
      params.set('comuna', filtros.selectedComuna);
    }
    if (filtros.selectedFecha && filtros.selectedFecha !== 'todas') {
      params.set('fecha', filtros.selectedFecha);
    }
    if (filtros.priceRange[0] > 0) {
      params.set('precioMin', filtros.priceRange[0].toString());
    }
    if (filtros.priceRange[1] < 5000) {
      params.set('precioMax', filtros.priceRange[1].toString());
    }
    if (filtros.sortBy) {
      params.set('sortBy', filtros.sortBy);
    }
    return params.toString();
  }, []);

  const fetchEventos = useCallback(async (filtros: EventFiltersValues, pageNum = 1) => {
    setLoading(true);
    try {
      const query = buildQuery(filtros, pageNum);
      const response = await fetch(`/api/eventos?${query}`);
      const data = await response.json();
      if (data?.data) {
        setEventos(pageNum === 1 ? data.data : [...eventos, ...data.data]);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, eventos]);

  useEffect(() => {
    if (filters) {
      fetchEventos(filters, 1);
    }
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: EventFiltersValues) => {
    setFilters(newFilters);
  }, []);

  const hasMore = pagination.page < pagination.totalPages;

  const loadMore = async () => {
    if (loading || !hasMore || !filters) return;
    fetchEventos(filters, pagination.page + 1);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {eventos.map((evento, index) => (
          <EventoCard
            key={evento._id}
            evento={evento}
            priority={index < 3}
          />
        ))}
      </div>

      {eventos.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No hay eventos disponibles</p>
          <p className="text-muted-foreground">
            Vuelve pronto para ver nuevos eventos
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">Cargando eventos...</p>
        </div>
      )}

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar mas eventos"}
          </Button>
        </div>
      )}

      {!hasMore && eventos.length > 0 && (
        <div className="mt-12 flex justify-center">
          <p className="text-muted-foreground text-sm">
            Has visto todos los eventos ({pagination.total} en total)
          </p>
        </div>
      )}
    </>
  );
}
