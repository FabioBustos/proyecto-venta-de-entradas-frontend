"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavProductor } from "@/components/nav-productor";
import {
  Ticket,
  Loader2,
  Plus,
  Calendar,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  Mail,
  BarChart3,
} from "lucide-react";
import type { Evento } from "@/types";

const CATEGORIAS = [
  { value: "", label: "Todas" },
  { value: "Música", label: "Música" },
  { value: "Deportes", label: "Deportes" },
  { value: "Teatro", label: "Teatro" },
  { value: "Comedia", label: "Comedia" },
  { value: "Feria", label: "Feria" },
  { value: "Conferencia", label: "Conferencia" },
  { value: "Cultura", label: "Cultura" },
  { value: "Gastronomía", label: "Gastronomía" },
  { value: "Arte", label: "Arte" },
  { value: "otro", label: "Otro" },
];

const TIPOS_EVENTO = [
  { value: "", label: "Todos" },
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "Online" },
  { value: "hibrido", label: "Híbrido" },
];

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "publicado", label: "Publicado" },
  { value: "borrador", label: "Borrador" },
  { value: "cancelado", label: "Cancelado" },
  { value: "completado", label: "Completado" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ total: 0, publicados: 0, borradores: 0, cancelados: 0, entradasVendidas: 0, capacidadTotal: 0 });
  const [ventasStats, setVentasStats] = useState({ totalVentas: 0, entradasVendidas: 0, ingresosTotales: 0, porEvento: [] as any[] });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const doFetch = async (page = 1, filters?: { search?: string; categoria?: string; estado?: string; tipoEvento?: string; fechaDesde?: string; fechaHasta?: string }) => {
    setLoadingEventos(true);
    try {
      const s = filters?.search ?? search;
      const c = filters?.categoria ?? categoria;
      const e = filters?.estado ?? estado;
      const t = filters?.tipoEvento ?? tipoEvento;
      const fd = filters?.fechaDesde ?? fechaDesde;
      const fh = filters?.fechaHasta ?? fechaHasta;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (s) params.set("search", s);
      if (c) params.set("categoria", c);
      if (e) params.set("estado", e);
      if (t) params.set("tipoEvento", t);
      if (fd) params.set("fechaDesde", fd);
      if (fh) params.set("fechaHasta", fh);

      const res = await fetch(`/api/productor/eventos?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEventos(data.data || []);
        setPagination(data.pagination || { page, limit: 10, total: 0, totalPages: 0 });
      }
    } catch (error) {
      console.error("Error fetching eventos:", error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/productor/eventos/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchVentasStats = async () => {
    try {
      const res = await fetch('/api/productor/eventos/compras/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVentasStats(data);
      }
    } catch (error) {
      console.error("Error fetching ventas stats:", error);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const checkPerfil = async () => {
      try {
        const res = await fetch('/api/productor/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.estadoVerificacion === "verificado") {
            setPerfil(data);
          } else {
            router.push("/productor/onboarding");
            return;
          }
        } else {
          router.push("/productor/onboarding");
          return;
        }
      } catch {
        router.push("/productor/onboarding");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkPerfil();
  }, [authLoading, isAuthenticated, token, router]);

  useEffect(() => {
    if (!token || !perfil) return;
    doFetch(1);
    fetchStats();
    fetchVentasStats();
  }, [token, perfil]);

  const handleSearch = () => {
    setSearch(searchInput);
    doFetch(1, { search: searchInput });
  };

  const handleFilterChange = () => {
    doFetch(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategoria("");
    setEstado("");
    setTipoEvento("");
    setFechaDesde("");
    setFechaHasta("");
    doFetch(1, { search: "", categoria: "", estado: "", tipoEvento: "", fechaDesde: "", fechaHasta: "" });
  };

  const hasActiveFilters = search || categoria || estado || tipoEvento || fechaDesde || fechaHasta;

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { icon: any; label: string; className: string }> = {
      publicado: { icon: CheckCircle, label: "Publicado", className: "bg-green-100 text-green-800" },
      borrador: { icon: Clock, label: "Borrador", className: "bg-yellow-100 text-yellow-800" },
      cancelado: { icon: XCircle, label: "Cancelado", className: "bg-red-100 text-red-800" },
      completado: { icon: CheckCircle, label: "Completado", className: "bg-gray-100 text-gray-800" },
    };
    
    const cfg = config[estado] || config.borrador;
    const Icon = cfg.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavProductor />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus eventos y revisa tus estadísticas
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Eventos</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publicados</p>
                <p className="text-2xl font-bold text-foreground">{stats.publicados}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Borradores</p>
                <p className="text-2xl font-bold text-foreground">{stats.borradores}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entradas Vendidas</p>
                <p className="text-2xl font-bold text-foreground">{stats.entradasVendidas}</p>
              </div>
            </div>
          </div>
        </div>

        {ventasStats.ingresosTotales > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-foreground">{formatPrecio(ventasStats.ingresosTotales)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ventas</p>
                  <p className="text-2xl font-bold text-foreground">{ventasStats.totalVentas}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entradas Vendidas</p>
                  <p className="text-2xl font-bold text-foreground">{ventasStats.entradasVendidas}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {ventasStats.porEvento && ventasStats.porEvento.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Ventas por Evento</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ventasStats.porEvento.map((pe: any) => (
                <div key={pe.eventoId} className="rounded-lg border bg-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{pe.nombreEvento}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ventas</span>
                      <span className="font-medium text-foreground">{pe.totalVentas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entradas</span>
                      <span className="font-medium text-foreground">{pe.entradasVendidas}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Ingresos</span>
                      <span className="font-bold text-green-600">{formatPrecio(pe.ingresosTotales)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-foreground">Mis Eventos</h2>
            <Button onClick={() => router.push("/productor/eventos/crear")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear evento
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              Buscar
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  {ESTADOS.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                <select
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                >
                  {TIPOS_EVENTO.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Desde</label>
                <Input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Hasta</label>
                <Input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={() => doFetch(1)} className="w-full">
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>

        {loadingEventos ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : eventos.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron eventos
            </h2>
            <p className="text-muted-foreground mb-6">
              {hasActiveFilters ? "Intenta cambiar los filtros de búsqueda" : "Crea tu primer evento y comienza a vender entradas"}
            </p>
            <Button size="lg" onClick={() => router.push("/productor/eventos/crear")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear evento
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Evento</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Entradas</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {eventos.map((evento) => (
                    <tr key={evento._id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {evento.imagenUrl ? (
                            <img 
                              src={evento.imagenUrl} 
                              alt={evento.nombre}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{evento.nombre}</p>
                            <p className="text-xs text-muted-foreground">{evento.categoria}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">
                          {evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) : "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">{evento.hora || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        {getEstadoBadge(evento.estado)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ 
                                width: `${evento.capacidad ? Math.min(100, ((evento.entradasVendidas || 0) / evento.capacidad) * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {evento.entradasVendidas || 0} / {evento.capacidad || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/productor/eventos/${evento._id}`)}
                            title="Ver estadísticas"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/eventos/${evento._id}`)}
                            title="Ver evento"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/productor/eventos/${evento._id}/editar`)}
                            title="Editar evento"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => doFetch(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => {
                      if (pagination.totalPages <= 7) return true;
                      if (p === 1 || p === pagination.totalPages) return true;
                      if (Math.abs(p - pagination.page) <= 1) return true;
                      return false;
                    })
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <div key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
                          <Button
                            variant={p === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => doFetch(p)}
                            className="min-w-[2rem]"
                          >
                            {p}
                          </Button>
                        </div>
                      );
                    })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => doFetch(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
