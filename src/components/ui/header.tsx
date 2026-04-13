"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Menu, 
  Ticket, 
  Search, 
  X,
  Calendar,
  Music,
  Theater,
  Sparkles,
  Mic2,
  Trophy,
  ChevronRight,
  LogOut,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

const categorias = [
  { nombre: "Conciertos", href: "/eventos?categoria=conciertos", icon: Music },
  { nombre: "Teatro", href: "/eventos?categoria=teatro", icon: Theater },
  { nombre: "Deportes", href: "/eventos?categoria=deportes", icon: Trophy },
  { nombre: "Festivales", href: "/eventos?categoria=festivales", icon: Sparkles },
  { nombre: "Conferencias", href: "/eventos?categoria=conferencias", icon: Mic2 },
]

const menuItems = [
  { nombre: "Inicio", href: "/" },
  { nombre: "Eventos", href: "/eventos" },
  { nombre: "Nosotros", href: "/nosotros" },
  { nombre: "Contacto", href: "/contacto" },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategorias, setShowCategorias] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1113]/90 backdrop-blur-md border-b border-[#3f444c]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e2e8f0]">
              <Ticket className="h-5 w-5 text-zinc-900" />
            </div>
            <span className="text-xl font-bold text-[#e2e8f0]">VentaEntradas</span>
          </Link>

          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.nombre}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#e2e8f0] transition-colors rounded-lg hover:bg-[#24282e]/50"
              >
                {item.nombre}
              </Link>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setShowCategorias(!showCategorias)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#e2e8f0] transition-colors rounded-lg hover:bg-[#24282e]/50"
              >
                Categorías
                <ChevronRight className={`h-4 w-4 transition-transform ${showCategorias ? 'rotate-90' : ''}`} />
              </button>
              
              {showCategorias && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1d21] border border-[#3f444c]/30 rounded-xl p-2 shadow-xl">
                  {categorias.map((categoria) => {
                    const Icon = categoria.icon
                    return (
                      <Link
                        key={categoria.nombre}
                        href={categoria.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#24282e]/50 rounded-lg transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {categoria.nombre}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg px-3">
                <Search className="h-4 w-4 text-[#94a3b8]" />
                <input
                  type="search"
                  placeholder="Buscar eventos..."
                  className="bg-transparent border-none focus:ring-0 text-sm text-[#e2e8f0] placeholder:text-[#94a3b8]/60 w-48"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4 text-[#94a3b8] hover:text-[#e2e8f0]" />
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-[#94a3b8] hover:text-[#e2e8f0]"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 text-sm text-[#94a3b8] hidden sm:inline">
                  <User className="h-4 w-4 inline mr-1" />
                  {user?.nombre}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 inline mr-1" />
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium border border-[#3f444c] text-[#e2e8f0] hover:bg-[#24282e] rounded-lg transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-[#e2e8f0] text-zinc-900 hover:bg-[#cbd5e1] rounded-lg transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#94a3b8] hover:text-[#e2e8f0]"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#94a3b8] hover:text-[#e2e8f0]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-[#3f444c]/30 py-3 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="search"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg text-[#e2e8f0] placeholder:text-[#94a3b8]/60"
                autoFocus
              />
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#3f444c]/30 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.nombre}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#24282e]/50 rounded-lg"
                >
                  {item.nombre}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#3f444c]/30">
                <p className="px-3 py-2 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Categorías
                </p>
                {categorias.map((categoria) => {
                  const Icon = categoria.icon
                  return (
                    <Link
                      key={categoria.nombre}
                      href={categoria.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#24282e]/50 rounded-lg"
                    >
                      <Icon className="h-4 w-4" />
                      {categoria.nombre}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#3f444c]/30 mt-4 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-medium text-[#94a3b8] border border-[#3f444c] rounded-lg hover:bg-[#24282e]/50"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-medium bg-[#e2e8f0] text-zinc-900 rounded-lg hover:bg-[#cbd5e1]"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
