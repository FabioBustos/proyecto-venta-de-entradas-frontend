"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventoCard } from "@/components/evento-card";
import { HeroSection } from "@/components/hero-section";
import { EventFilters } from "@/components/event-filters";
import { mockEventos } from "@/lib/mock-eventos";

export const metadata = {
  title: "Eventos | Descubre los mejores eventos",
  description:
    "Explora nuestra seleccion de eventos de musica, tecnologia, arte, deportes y mas.",
};

const ITEMS_PER_PAGE = 9;

export default function EventosPage() {
  const eventosActivos = mockEventos.filter((evento) => evento.activo);
  const featuredEvents = eventosActivos.slice(0, 3);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(eventosActivos.length / ITEMS_PER_PAGE);
  const displayedEvents = eventosActivos.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = currentPage < totalPages;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection featuredEvents={featuredEvents} />

      {/* Events Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <EventFilters totalEvents={eventosActivos.length} />

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {displayedEvents.map((evento, index) => (
            <EventoCard key={evento._id} evento={evento} priority={index < 3} />
          ))}
        </div>

        {displayedEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium">No hay eventos disponibles</p>
            <p className="text-muted-foreground">
              Vuelve pronto para ver nuevos eventos
            </p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" onClick={handleLoadMore}>
              Cargar mas eventos
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
