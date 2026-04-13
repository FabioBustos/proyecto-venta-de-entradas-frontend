import { HeroSection } from "@/components/hero-section";
import { fetchEventosServer } from "@/lib/server-eventos";
import { EventosPageContent } from "@/components/eventos-page-content";

export const metadata = {
  title: "Eventos | Descubre los mejores eventos",
  description:
    "Explora nuestra seleccion de eventos de musica, tecnologia, arte, deportes y mas.",
};

export default async function EventosPage() {
  const { data: eventos = [], pagination } = await fetchEventosServer({}, 1, 9);
  const eventosActivos = eventos.filter((evento) => evento.activo);
  const featuredEvents = eventosActivos.slice(0, 3);

  return (
    <div className="bg-background">
      <HeroSection featuredEvents={featuredEvents} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EventosPageContent
          initialEventos={eventosActivos}
          initialPagination={pagination}
        />
      </section>
    </div>
  );
}
