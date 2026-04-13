"use client";

import Image from "next/image";
import { Ticket, Users, Globe, Award, Heart, Shield, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Eventos realizados", value: "10,000+", icon: Ticket },
  { label: "Usuarios activos", value: "500,000+", icon: Users },
  { label: "Ciudades", value: "50+", icon: Globe },
  { label: "Anos de experiencia", value: "8+", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Pasion por los eventos",
    description:
      "Creemos que cada evento es una oportunidad unica para crear momentos inolvidables. Nos apasiona conectar a las personas con experiencias que transforman.",
  },
  {
    icon: Shield,
    title: "Confianza y seguridad",
    description:
      "La seguridad de nuestros usuarios es nuestra prioridad. Implementamos los mas altos estandares de proteccion de datos y transacciones seguras.",
  },
  {
    icon: Zap,
    title: "Innovacion continua",
    description:
      "Estamos constantemente mejorando nuestra plataforma para ofrecer la mejor experiencia posible, adoptando las ultimas tecnologias del mercado.",
  },
  {
    icon: Target,
    title: "Compromiso con la excelencia",
    description:
      "Nos esforzamos por superar las expectativas en cada interaccion, brindando un servicio de calidad excepcional a organizadores y asistentes.",
  },
];

const team = [
  {
    name: "Carlos Rodriguez",
    role: "CEO & Fundador",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    description: "Mas de 15 anos de experiencia en la industria de eventos y tecnologia.",
  },
  {
    name: "Maria Garcia",
    role: "Directora de Operaciones",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    description: "Experta en logistica y gestion de eventos a gran escala.",
  },
  {
    name: "Andres Martinez",
    role: "Director de Tecnologia",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    description: "Lider tecnico con experiencia en plataformas de alto rendimiento.",
  },
  {
    name: "Laura Sanchez",
    role: "Directora de Marketing",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    description: "Especialista en estrategias digitales y crecimiento de marca.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Conectando personas con experiencias inolvidables
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
              Somos la plataforma lider en venta de entradas para eventos en Latinoamerica. 
              Nuestra mision es hacer que descubrir y asistir a eventos sea simple, seguro y emocionante.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestra historia</h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  EventosPro nacio en 2016 con una vision clara: revolucionar la forma en que las personas 
                  descubren y acceden a eventos. Lo que comenzo como un pequeno proyecto en un garaje, 
                  hoy se ha convertido en la plataforma de referencia para miles de organizadores y 
                  millones de asistentes.
                </p>
                <p>
                  Desde conciertos masivos hasta talleres intimos, desde festivales de musica hasta 
                  conferencias empresariales, hemos sido testigos y facilitadores de innumerables 
                  momentos especiales.
                </p>
                <p>
                  Nuestro compromiso sigue siendo el mismo: hacer que cada evento sea accesible, 
                  cada compra sea segura, y cada experiencia sea memorable.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl lg:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
                alt="Equipo de EventosPro"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros valores</h2>
            <p className="mt-4 text-muted-foreground">
              Los principios que guian cada decision que tomamos
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-0 bg-background shadow-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestro equipo</h2>
            <p className="mt-4 text-muted-foreground">
              Conoce a las personas detras de EventosPro
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Se parte de nuestra comunidad
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Unete a miles de organizadores y millones de asistentes que confian en EventosPro
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/eventos"
                className="inline-flex items-center justify-center rounded-lg bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Explorar eventos
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/20 px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
