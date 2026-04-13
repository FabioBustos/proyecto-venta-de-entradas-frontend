"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, TrendingUp, Ticket, DollarSign, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

interface Venta {
  _id: string;
  codigo: string;
  cantidad: number;
  total: number;
  estado: string;
  createdAt: string;
  evento: {
    _id: string;
    nombre: string;
    fecha: string;
    hora?: string;
    espacio?: string;
    comuna?: string;
    region?: string;
  };
  usuario: {
    nombre: string;
    email: string;
  };
}

interface StatsData {
  totalVentas: number;
  entradasVendidas: number;
  ingresosTotales: number;
  porEvento: {
    eventoId: string;
    nombreEvento: string;
    totalVentas: number;
    entradasVendidas: number;
    ingresosTotales: number;
  }[];
}

export default function ProductorVentasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuthStore();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.rol !== "productor" && user?.rol !== "admin") {
      router.push("/");
      return;
    }
  }, [token, user, router]);

  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "20");
    if (filtroEstado) params.set("estado", filtroEstado);
    if (filtroEvento) params.set("eventoId", filtroEvento);

    Promise.all([
      fetch(`${API_BASE}/productor/eventos/compras?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${API_BASE}/productor/eventos/compras/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ]).then(([comprasRes, statsRes]) => {
      setVentas(comprasRes.data || []);
      setTotalPages(comprasRes.totalPages || 1);
      setStats(statsRes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, page, filtroEstado, filtroEvento]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const estadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pagada: "default",
      pendiente: "secondary",
      cancelada: "destructive",
      reembolsada: "outline",
    };
    return (
      <Badge variant={variants[estado] || "secondary"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/productor/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Ventas</h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total ventas</p>
                    <p className="text-2xl font-bold">{stats.totalVentas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entradas vendidas</p>
                    <p className="text-2xl font-bold">{stats.entradasVendidas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos totales</p>
                    <p className="text-2xl font-bold">{formatPrecio(stats.ingresosTotales)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Estado</label>
                <select
                  className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPage(1); }}
                >
                  <option value="">Todos</option>
                  <option value="pagada">Pagada</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="reembolsada">Reembolsada</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Registro de ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ventas.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Ticket className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p className="text-lg font-medium">No hay ventas registradas</p>
                <p className="text-sm">Las ventas de tus eventos aparecerán aquí</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-left font-medium text-muted-foreground">Código</th>
                        <th className="py-3 px-2 text-left font-medium text-muted-foreground">Evento</th>
                        <th className="py-3 px-2 text-left font-medium text-muted-foreground">Comprador</th>
                        <th className="py-3 px-2 text-center font-medium text-muted-foreground">Cant.</th>
                        <th className="py-3 px-2 text-right font-medium text-muted-foreground">Total</th>
                        <th className="py-3 px-2 text-center font-medium text-muted-foreground">Estado</th>
                        <th className="py-3 px-2 text-right font-medium text-muted-foreground">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((venta) => (
                        <tr key={venta._id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-mono text-xs">{venta.codigo}</td>
                          <td className="py-3 px-2">
                            <p className="font-medium">{venta.evento?.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {venta.evento?.comuna}{venta.evento?.region ? `, ${venta.evento.region}` : ''}
                            </p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium">{venta.usuario?.nombre}</p>
                            <p className="text-xs text-muted-foreground">{venta.usuario?.email}</p>
                          </td>
                          <td className="py-3 px-2 text-center">{venta.cantidad}</td>
                          <td className="py-3 px-2 text-right font-medium">
                            {venta.total === 0 ? (
                              <span className="text-green-600">Gratis</span>
                            ) : (
                              formatPrecio(venta.total)
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">{estadoBadge(venta.estado)}</td>
                          <td className="py-3 px-2 text-right text-muted-foreground">
                            {formatFecha(venta.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Página {page} de {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
