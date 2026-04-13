"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Loader2,
  Users,
  Ticket,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  ChevronRight,
  Building2,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Eye,
  FileCheck,
  BarChart3,
} from "lucide-react";

interface Productor {
  _id: string;
  tipoContribuyente: string;
  nombre: string;
  apellido: string;
  nombreEmpresa?: string;
  rut: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
  estadoVerificacion: string;
  createdAt: string;
}

interface Stats {
  productores: {
    total: number;
    pendientes: number;
    verificados: number;
    rechazados: number;
  };
  eventos: {
    total: number;
    activos: number;
  };
  ventas: {
    totalEntradas: number;
    totalRevenue: number;
    comprasPagadas: number;
    comprasPendientes: number;
    comprasCanceladas: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [productores, setProductores] = useState<Productor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "pending" | "all">("overview");
  const [selectedProductor, setSelectedProductor] = useState<Productor | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.roles?.includes("admin")) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, productoresRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/admin/estadisticas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/productor/perfiles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (productoresRes.ok) {
          const productoresData = await productoresRes.json();
          setProductores(productoresData);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated, token, router, user]);

  const pendientes = productores.filter((p) => p.estadoVerificacion === "pendiente");

  const handleVerificacion = async (id: string, estado: "verificado" | "rechazado") => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/productor/perfiles/${id}/verificacion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estadoVerificacion: estado }),
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/productor/perfiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProductores(await res.json());
      }
      setSelectedProductor(null);
    } catch {
      // ignore
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-sm text-muted-foreground">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.roles?.includes("admin")) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Panel de Control</h1>
              <p className="text-xs text-muted-foreground">VentaEntradas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-foreground">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Total</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.productores.total || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Productores registrados</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">{stats?.productores.pendientes || 0}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.productores.pendientes || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Pendientes de revision</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">{stats?.productores.verificados || 0}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.productores.verificados || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Verificados</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                    <XCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">{stats?.productores.rechazados || 0}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.productores.rechazados || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Rechazados</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.eventos.total || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Eventos creados</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                    <Ticket className="h-4 w-4 text-violet-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.ventas.totalEntradas || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Entradas vendidas</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">${(stats?.ventas.totalRevenue || 0).toLocaleString('es-CL')}</p>
                <p className="text-xs text-muted-foreground mt-1">Ingresos totales</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">{stats?.ventas.comprasPendientes || 0}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats?.ventas.comprasPagadas || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Ventas confirmadas</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Navegacion</h3>
              <div className="space-y-1">
                <button
                  onClick={() => router.push("/sistema/panel")}
                  className="w-full flex items-center gap-3 rounded-lg p-2 text-sm text-foreground hover:bg-accent transition-colors bg-primary/5"
                >
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Dashboard
                </button>
                <button
                  onClick={() => router.push("/sistema/verificar")}
                  className="w-full flex items-center justify-between rounded-lg p-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-4 w-4 text-amber-500" />
                    Verificar Productores
                  </div>
                  {stats?.productores.pendientes ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-xs font-medium text-amber-600">
                      {stats.productores.pendientes}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Acciones Rapidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/sistema/verificar")}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                >
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-foreground">Ver pendientes</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Distribucion</h3>
              <div className="space-y-3">
                {[
                  { label: "Verificados", count: stats?.productores.verificados || 0, total: stats?.productores.total || 0, color: "bg-green-500" },
                  { label: "Pendientes", count: stats?.productores.pendientes || 0, total: stats?.productores.total || 0, color: "bg-amber-500" },
                  { label: "Rechazados", count: stats?.productores.rechazados || 0, total: stats?.productores.total || 0, color: "bg-destructive" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all`}
                        style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}