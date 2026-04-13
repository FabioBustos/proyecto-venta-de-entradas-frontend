"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  ChevronLeft,
  Search,
  Filter,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  LogOut,
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
  direccion?: string;
  estadoVerificacion: string;
  createdAt: string;
}

export default function VerificarProductoresPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [productores, setProductores] = useState<Productor[]>([]);
  const [selectedProductor, setSelectedProductor] = useState<Productor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user?.roles?.includes("admin")) {
      router.push("/");
      return;
    }

    fetchProductores();
  }, [authLoading, isAuthenticated, user, router]);

  const fetchProductores = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/productor/perfiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProductores(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const pendientes = productores.filter((p) => p.estadoVerificacion === "pendiente");

  const filteredProductores = pendientes.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      (p.nombreEmpresa || `${p.nombre} ${p.apellido}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rut.includes(searchTerm);
    const tipoNormalizado = p.tipoContribuyente === "natural" ? "persona_natural" : p.tipoContribuyente;
    const matchesTipo = filterTipo === "" || tipoNormalizado === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const handleVerificacion = async (id: string, estado: "verificado" | "rechazado") => {
    setProcessing(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/productor/perfiles/${id}/verificacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estadoVerificacion: estado }),
        }
      );
      await fetchProductores();
      setSelectedProductor(null);
    } catch {
      // ignore
    } finally {
      setProcessing(false);
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
          <p className="mt-3 text-sm text-muted-foreground">Cargando...</p>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/sistema/panel")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                Verificar Productores
              </h1>
              <p className="text-xs text-muted-foreground">
                {pendientes.length} pendientes de revision
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {selectedProductor ? (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedProductor(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver a la lista
            </button>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-amber-500/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                    <Building2 className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedProductor.nombreEmpresa ||
                        `${selectedProductor.nombre} ${selectedProductor.apellido}`}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedProductor.tipoContribuyente === "empresa"
                        ? "Empresa"
                        : "Persona Natural"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Informacion Personal
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">RUT</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedProductor.rut}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nombre</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedProductor.nombre} {selectedProductor.apellido}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">
                          {selectedProductor.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">
                          {selectedProductor.telefono}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">
                          Registrado el {formatDate(selectedProductor.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ubicacion
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Region</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedProductor.region}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Comuna</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedProductor.comuna}
                        </p>
                      </div>
                      {selectedProductor.direccion && (
                        <div>
                          <p className="text-xs text-muted-foreground">Direccion</p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedProductor.direccion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-muted/30 px-6 py-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() =>
                      handleVerificacion(selectedProductor._id, "verificado")
                    }
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Aprobar Productor
                  </Button>
                  <Button
                    onClick={() =>
                      handleVerificacion(selectedProductor._id, "rechazado")
                    }
                    disabled={processing}
                    variant="outline"
                    className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    {processing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : filteredProductores.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Todo al dia
            </h3>
            <p className="text-sm text-muted-foreground">
              No hay productores pendientes de revision
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="empresa">Empresa</option>
                <option value="persona_natural">Persona Natural</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProductores.map((p) => (
                <button
                  key={p._id}
                  onClick={() => setSelectedProductor(p)}
                  className="rounded-xl border border-border bg-card p-5 text-left hover:border-amber-500/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <Building2 className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {p.nombreEmpresa ||
                          `${p.nombre} ${p.apellido}`}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {p.tipoContribuyente === "empresa"
                          ? "Empresa"
                          : "Persona Natural"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="truncate">{p.email}</p>
                    <p>{p.region}, {p.comuna}</p>
                    <p className="text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pendiente desde {formatDate(p.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}