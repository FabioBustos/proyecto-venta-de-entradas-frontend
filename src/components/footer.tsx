import Link from "next/link"
import {
  Ticket,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const navegacion = {
  eventos: [
    { nombre: "Conciertos", href: "/eventos?categoria=conciertos" },
    { nombre: "Teatro", href: "/eventos?categoria=teatro" },
    { nombre: "Deportes", href: "/eventos?categoria=deportes" },
    { nombre: "Festivales", href: "/eventos?categoria=festivales" },
    { nombre: "Conferencias", href: "/eventos?categoria=conferencias" },
    { nombre: "Todos los eventos", href: "/eventos" },
  ],
  empresa: [
    { nombre: "Sobre Nosotros", href: "/nosotros" },
    { nombre: "Equipo", href: "/equipo" },
    { nombre: "Carreras", href: "/carreras" },
    { nombre: "Blog", href: "/blog" },
    { nombre: "Prensa", href: "/prensa" },
  ],
  soporte: [
    { nombre: "Centro de Ayuda", href: "/ayuda" },
    { nombre: "Contacto", href: "/contacto" },
    { nombre: "Preguntas Frecuentes", href: "/faq" },
    { nombre: "Estado del Servicio", href: "/estado" },
  ],
  legal: [
    { nombre: "Terminos y Condiciones", href: "/terminos" },
    { nombre: "Politica de Privacidad", href: "/privacidad" },
    { nombre: "Politica de Cookies", href: "/cookies" },
    { nombre: "Politica de Reembolsos", href: "/reembolsos" },
    { nombre: "Aviso Legal", href: "/aviso-legal" },
  ],
  organizadores: [
    { nombre: "Vende tus Entradas", href: "/vender" },
    { nombre: "Herramientas para Organizadores", href: "/organizadores" },
    { nombre: "API para Desarrolladores", href: "/api" },
    { nombre: "Casos de Exito", href: "/casos-exito" },
  ],
}

const redesSociales = [
  { nombre: "Facebook", href: "https://facebook.com", icon: Facebook },
  { nombre: "Twitter", href: "https://twitter.com", icon: Twitter },
  { nombre: "Instagram", href: "https://instagram.com", icon: Instagram },
  { nombre: "YouTube", href: "https://youtube.com", icon: Youtube },
  { nombre: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Newsletter Section */}
      <div className="border-b border-border bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-primary-foreground">
                Suscribete a nuestro Newsletter
              </h3>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Recibe las ultimas novedades y ofertas exclusivas directamente en tu correo.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="bg-primary-foreground text-foreground placeholder:text-muted-foreground"
              />
              <Button variant="secondary" type="submit">
                Suscribirse
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Logo & Contact Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Ticket className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">EventosApp</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu plataforma de confianza para descubrir y comprar entradas para los mejores eventos de tu ciudad.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Av. Principal 123, Piso 5<br />
                  Ciudad de Mexico, CP 06600
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href="tel:+525512345678"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  +52 55 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a
                  href="mailto:contacto@eventosapp.com"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  contacto@eventosapp.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Lun - Vie: 9:00 - 18:00
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {redesSociales.map((red) => (
                <a
                  key={red.nombre}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <red.icon className="h-4 w-4" />
                  <span className="sr-only">{red.nombre}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Eventos */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Eventos</h4>
            <ul className="mt-4 space-y-2">
              {navegacion.eventos.map((item) => (
                <li key={item.nombre}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
            <ul className="mt-4 space-y-2">
              {navegacion.empresa.map((item) => (
                <li key={item.nombre}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Soporte</h4>
            <ul className="mt-4 space-y-2">
              {navegacion.soporte.map((item) => (
                <li key={item.nombre}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 text-sm font-semibold text-foreground">
              Para Organizadores
            </h4>
            <ul className="mt-4 space-y-2">
              {navegacion.organizadores.map((item) => (
                <li key={item.nombre}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-2">
              {navegacion.legal.map((item) => (
                <li key={item.nombre}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EventosApp. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/terminos"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terminos
            </Link>
            <Link
              href="/privacidad"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacidad
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cookies
            </Link>
            <Link
              href="/accesibilidad"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Accesibilidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
