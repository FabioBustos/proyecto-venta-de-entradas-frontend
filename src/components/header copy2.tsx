"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  Menu, 
  Ticket, 
  Search, 
  X,
  Home,
  Calendar,
  Users,
  Mail,
  Music,
  Theater,
  Trophy,
  Sparkles,
  Mic2,
  ChevronRight,
  User,
  LogIn
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const categorias = [
  { nombre: "Conciertos", href: "/eventos?categoria=conciertos", icon: Music },
  { nombre: "Teatro", href: "/eventos?categoria=teatro", icon: Theater },
  { nombre: "Deportes", href: "/eventos?categoria=deportes", icon: Trophy },
  { nombre: "Festivales", href: "/eventos?categoria=festivales", icon: Sparkles },
  { nombre: "Conferencias", href: "/eventos?categoria=conferencias", icon: Mic2 },
]

const menuItems = [
  { nombre: "Inicio", href: "/", icon: Home },
  { nombre: "Eventos", href: "/eventos", icon: Calendar },
  { nombre: "Nosotros", href: "/nosotros", icon: Users },
  { nombre: "Contacto", href: "/contacto", icon: Mail },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EventosApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      Inicio
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Eventos</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/eventos"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          >
                            <Ticket className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Todos los Eventos
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explora nuestra amplia seleccion de eventos disponibles.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {categorias.map((categoria) => (
                        <li key={categoria.nombre}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={categoria.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {categoria.nombre}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/nosotros" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      Nosotros
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contacto" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      Contacto
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Buscar eventos..."
                  className="w-64"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/login">Iniciar Sesion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-10 w-10"
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isSearchOpen ? "Cerrar busqueda" : "Abrir busqueda"}
              </span>
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm p-0" hideCloseButton>
                <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
                <SheetDescription className="sr-only">
                  Navega por las secciones del sitio
                </SheetDescription>
                
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-4">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <Ticket className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground">EventosApp</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cerrar menu</span>
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex h-[calc(100vh-65px)] flex-col">
                  {/* Search */}
                  <div className="border-b border-border p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar eventos..."
                        className="w-full pl-9"
                      />
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto">
                    <div className="p-2">
                      {/* Main Menu Items */}
                      {menuItems.filter(item => item.nombre !== "Eventos").map((item) => {
                        const Icon = item.icon
                        return (
                          <SheetClose asChild key={item.nombre}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              {item.nombre}
                              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Link>
                          </SheetClose>
                        )
                      })}

                      {/* Eventos Accordion */}
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="eventos" className="border-none">
                          <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:no-underline [&[data-state=open]>svg]:rotate-180">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1 text-left">Eventos</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0 pt-1">
                            <div className="ml-4 space-y-1 border-l border-border pl-4">
                              <SheetClose asChild>
                                <Link
                                  href="/eventos"
                                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                >
                                  <Ticket className="h-4 w-4 text-primary" />
                                  Todos los eventos
                                </Link>
                              </SheetClose>
                              {categorias.map((categoria) => {
                                const Icon = categoria.icon
                                return (
                                  <SheetClose asChild key={categoria.nombre}>
                                    <Link
                                      href={categoria.href}
                                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    >
                                      <Icon className="h-4 w-4" />
                                      {categoria.nombre}
                                    </Link>
                                  </SheetClose>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* Quick Stats */}
                    <div className="border-t border-border p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Estadisticas
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <p className="text-lg font-bold text-foreground">150+</p>
                          <p className="text-xs text-muted-foreground">Eventos</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <p className="text-lg font-bold text-foreground">50K+</p>
                          <p className="text-xs text-muted-foreground">Usuarios</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <p className="text-lg font-bold text-foreground">25</p>
                          <p className="text-xs text-muted-foreground">Ciudades</p>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* Auth Buttons */}
                  <div className="border-t border-border p-4">
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link href="/register" className="gap-2">
                            <User className="h-4 w-4" />
                            Registrarse
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/login" className="gap-2">
                            <LogIn className="h-4 w-4" />
                            Iniciar Sesion
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Al registrarte aceptas nuestros{" "}
                      <Link href="/terminos" className="underline hover:text-foreground">
                        Terminos y Condiciones
                      </Link>
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-border py-3 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar eventos..."
                className="w-full pl-9"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
