"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Ticket,
} from "lucide-react";
import type { Evento, HeroSectionProps } from "@/types/index";

export type { HeroSectionProps };

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  
  const cleanDate = dateString.split("T")[0];
  const date = new Date(cleanDate + "T00:00:00Z");
  
  if (isNaN(date.getTime())) return "";
  
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  
  return `${day} ${month}`;
};

const getFechasString = (evento: Evento | undefined) => {
  if (!evento) return "Fechas por confirmar";
  
  if (evento.esMultipleDias && evento.dias && evento.dias.length > 0) {
    const fechas = evento.dias
      .filter((d) => d.fecha)
      .map((d) => formatDate(d.fecha))
      .filter(Boolean)
      .slice(0, 3);
    
    if (fechas.length === 0) return "Fechas por confirmar";
    if (evento.dias.length > 3) {
      return `${fechas.join(" · ")} +${evento.dias.length - 3}`;
    }
    return fechas.join(" · ");
  }
  
  if (evento.fecha) {
    return formatDate(evento.fecha);
  }
  
  return "Fechas por confirmar";
};

const getUbicacion = (evento: Evento | undefined) => {
  if (!evento) return "Ubicación por confirmar";
  const parts = [evento.comuna, evento.region].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Ubicación por confirmar";
};

const getPrecio = (evento: Evento | undefined) => {
  if (!evento) return 0;
  const precio = evento.precio ?? evento.precioGeneral ?? 0;
  return precio;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

export function HeroSection({ featuredEvents }: HeroSectionProps) {
  const events = featuredEvents || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || events.length === 0) return;
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length, mounted]);

  const currentEvent = events[currentSlide];

  const stats = [
    { icon: Ticket, value: "500+", label: "Eventos" },
    { icon: Users, value: "100K+", label: "Usuarios" },
    { icon: TrendingUp, value: "98%", label: "Satisfaccion" },
  ];

  if (!mounted || events.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="h-8 w-48 rounded-full bg-muted animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
                <div className="h-12 w-3/4 rounded-lg bg-muted animate-pulse" />
              </div>
              <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="h-96 rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">La plataforma #1 de eventos</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Descubre experiencias{" "}
                <span className="text-primary">inolvidables</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Encuentra los mejores conciertos, conferencias, festivales y eventos cerca de ti. 
                Compra tus entradas de forma segura y rapida.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar eventos, artistas, lugares..."
                  className="pl-11 h-12 bg-background/80 backdrop-blur-sm border-muted-foreground/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      window.location.href = `/eventos?search=${encodeURIComponent(e.currentTarget.value.trim())}`;
                    }
                  }}
                />
              </div>
              <Button size="lg" className="h-12 px-6" onClick={() => {
                const input = document.querySelector('input[type="search"]') as HTMLInputElement;
                if (input?.value.trim()) {
                  window.location.href = `/eventos?search=${encodeURIComponent(input.value.trim())}`;
                }
              }}>
                Buscar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl" />
            
            <div
              className={`relative rounded-2xl overflow-hidden bg-card border shadow-2xl transition-all duration-300 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="relative h-64 sm:h-72">
                <Image
                  src={currentEvent?.imagenUrl || "/placeholder.svg"}
                  alt={currentEvent?.nombre || "Evento destacado"}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Destacado
                  </Badge>
                </div>

                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {currentEvent?.categoria}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">
                    {currentEvent?.nombre}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {getFechasString(currentEvent)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {getUbicacion(currentEvent)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-muted-foreground line-clamp-2">
                  {stripHtml(currentEvent?.descripcion || "")}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Desde</p>
                    <p className="text-2xl font-bold text-primary">
                      ${getPrecio(currentEvent).toLocaleString("es-CL")} CLP
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/eventos/${currentEvent?._id}`}>
                      Ver evento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setCurrentSlide(index);
                          setIsAnimating(false);
                        }, 300);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Ir al evento ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Explora por categoria</h2>
            <Link 
              href="/eventos" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "Musica", icon: "🎵", color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20" },
              { name: "Tecnologia", icon: "💻", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20" },
              { name: "Arte", icon: "🎨", color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20" },
              { name: "Deportes", icon: "⚽", color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20" },
              { name: "Gastronomia", icon: "🍽️", color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20" },
              { name: "Teatro", icon: "🎭", color: "bg-red-500/10 hover:bg-red-500/20 border-red-500/20" },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/eventos?categoria=${category.name.toLowerCase()}`}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${category.color}`}
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
