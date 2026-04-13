"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { EventoCard } from "@/components/evento-card";
import { EventosGridSkeleton } from "@/components/ui/eventos-grid-skeleton";
import { EventFilters } from "@/components/event-filters";
import type { Evento, EventFiltersValues } from "@/types";

const HeroSection = dynamic(() => import("@/components/hero-section").then(mod => mod.HeroSection), {
  loading: () => <div className="h-[400px] lg:h-[500px] bg-muted animate-pulse" />,
  ssr: false,
});

const ITEMS_PER_PAGE = 9;

const defaultFilters: EventFiltersValues = {
  searchQuery: "",
  selectedCategory: "todos",
  selectedCity: "todas",
  selectedComuna: "todas",
  selectedFecha: "todas",
  priceRange: [0, 5000],
  sortBy: "fecha",
};

export function EventosClient() {
  const searchParams = useSearchParams();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Evento[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<EventFiltersValues>(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategoria = searchParams.get('categoria') || '';
    const urlCiudad = searchParams.get('ciudad') || '';
    const urlComuna = searchParams.get('comuna') || '';
    const urlFecha = searchParams.get('fecha') || '';
    const urlSortBy = searchParams.get('sortBy') || '';
    const urlPrecioMin = searchParams.get('precioMin');
    const urlPrecioMax = searchParams.get('precioMax');

    return {
      searchQuery: urlSearch,
      selectedCategory: urlCategoria || 'todos',
      selectedCity: urlCiudad || 'todas',
      selectedComuna: urlComuna || 'todas',
      selectedFecha: urlFecha || 'todas',
      priceRange: [
        urlPrecioMin ? parseInt(urlPrecioMin) : 0,
        urlPrecioMax ? parseInt(urlPrecioMax) : 5000,
      ],
      sortBy: urlSortBy || 'fecha',
    };
  });

  const buildQueryParams = useCallback((pageNum: number, filtros: EventFiltersValues) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());
    
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

  useEffect(() => {
    const fetchEventos = async () => {
      if (page > 1) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const queryParams = buildQueryParams(page, filters);
        const response = await fetch(`/api/eventos?${queryParams}`);
        const data = await response.json() as { data: Evento[]; pagination: { totalPages: number } };

        if (!data?.data) {
          console.error("Invalid API response:", data);
          return;
        }

        setEventos((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
        setTotalPages(data.pagination.totalPages || 1);

        if (page === 1) {
          const activos = data.data.filter((e: Evento) => e.activo);
          setFeaturedEvents(activos.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching eventos:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchEventos();
  }, [page, filters, buildQueryParams]);

  const handleFiltersChange = useCallback((newFilters: EventFiltersValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection featuredEvents={featuredEvents} />

      {/* Events Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <EventFilters 
          totalEvents={totalPages * ITEMS_PER_PAGE} 
          onFiltersChange={handleFiltersChange}
        />

        {/* Events Grid */}
        {loading ? (
          <EventosGridSkeleton count={6} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {eventos.map((evento, index) => (
                <EventoCard key={evento._id} evento={evento} priority={index < 3} />
              ))}
            </div>
            {loadingMore && (
              <div className="mt-8">
                <EventosGridSkeleton count={3} />
              </div>
            )}
          </>
        )}

        {eventos.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium">No hay eventos disponibles</p>
            <p className="text-muted-foreground">
              Vuelve pronto para ver nuevos eventos
            </p>
          </div>
        )}

        {/* Load More */}
        {page < totalPages && !loading && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "Cargando..." : "Cargar mas eventos"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
