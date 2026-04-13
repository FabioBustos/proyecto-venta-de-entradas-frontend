"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavProductor } from "@/components/nav-productor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Ticket,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Bell,
  Key,
} from "lucide-react";
import type { Evento } from "@/types";

export default function ProductorEventoDetallePage() {
  const router = useRouter();
  const params = useParams();
  const eventoId = params?.id as string;
  const { token, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [ventasStats, setVentasStats] = useState<any>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const [comprasPagination, setComprasPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [comprasLoading, setComprasLoading] = useState(false);
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [sesiones, setSesiones] = useState<any[]>([]);
  const [sesionesLoading, setSesionesLoading] = useState(false);
  const [showAddSesion, setShowAddSesion] = useState(false);
  const [newSesion, setNewSesion] = useState({ fecha: "", hora: "", capacidad: "", precio: "" });
  const [activeTab, setActiveTab] = useState<"general" | "compras" | "waitinglist" | "sesiones">("general");
  const [sesionSeleccionada, setSesionSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/"); return; }
    const checkPerfil = async () => {
      try {
        const res = await fetch('/api/productor/perfil', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data?.estadoVerificacion === "verificado") { setPerfil(data); }
          else { router.push("/productor/onboarding"); return; }
        } else { router.push("/productor/onboarding"); return; }
      } catch { router.push("/productor/onboarding"); return; }
      finally { setLoading(false); }
    };
    checkPerfil();
  }, [authLoading, isAuthenticated, token, router]);

  useEffect(() => {
    if (!token || !perfil || !eventoId) return;
    const cargarEvento = async () => {
      try {
        const res = await fetch(`/api/productor/eventos/${eventoId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { setEvento(await res.json()); }
        else { router.push("/productor/dashboard"); }
      } catch { router.push("/productor/dashboard"); }
    };
    cargarEvento();
  }, [token, perfil, eventoId, router]);

  useEffect(() => {
    if (!token || !eventoId) return;
    const fetchVentasStats = async () => {
      try {
        const res = await fetch(`/api/productor/eventos/compras/stats?eventoId=${eventoId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { setVentasStats(await res.json()); }
      } catch (error) { console.error("Error fetching ventas stats:", error); }
    };
    fetchVentasStats();
  }, [token, eventoId]);

  useEffect(() => {
    if (!token || !eventoId || activeTab !== "compras") return;
    const fetchCompras = async () => {
      setComprasLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("eventoId", eventoId);
        params.set("page", String(comprasPagination.page));
        params.set("limit", "10");
        params.set("estado", "pagada");
        if (sesionSeleccionada) {
          if (sesionSeleccionada === 'fecha_principal') {
            params.set("sesionId", "sin_sesion");
          } else {
            params.set("sesionId", sesionSeleccionada);
          }
        }
        const res = await fetch(`/api/productor/eventos/compras?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setCompras(data.data || []);
          setComprasPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        }
      } catch (error) { console.error("Error fetching compras:", error); }
      finally { setComprasLoading(false); }
    };
    fetchCompras();
  }, [token, eventoId, activeTab, comprasPagination.page, sesionSeleccionada]);

  useEffect(() => {
    if (!token || !eventoId || activeTab !== "waitinglist") return;
    const fetchWaitingList = async () => {
      try {
        const res = await fetch(`/api/productor/eventos/waiting-list/${eventoId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { setWaitingList(await res.json() || []); }
      } catch (error) { console.error("Error fetching waiting list:", error); }
    };
    fetchWaitingList();
  }, [token, eventoId, activeTab]);

  useEffect(() => {
    if (!token || !eventoId) return;
    const fetchSesiones = async () => {
      try {
        const res = await fetch(`/api/productor/eventos/${eventoId}/sesiones`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { setSesiones(await res.json() || []); }
      } catch (error) { console.error("Error fetching sesiones:", error); }
    };
    fetchSesiones();
  }, [token, eventoId]);

  useEffect(() => {
    if (!token || !eventoId || activeTab !== "sesiones") return;
    const fetchSesiones = async () => {
      setSesionesLoading(true);
      try {
        const res = await fetch(`/api/productor/eventos/${eventoId}/sesiones`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) { setSesiones(await res.json() || []); }
      } catch (error) { console.error("Error fetching sesiones:", error); }
      finally { setSesionesLoading(false); }
    };
    fetchSesiones();
  }, [token, eventoId, activeTab]);

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DIAS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MESES_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const formatFechaLocal = (fechaStr: string, short = false) => {
    if (!fechaStr) return '';

    let y: number, m: number, d: number;

    // Formato YYYY-MM-DD
    const dateOnly = String(fechaStr).split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      [y, m, d] = parts.map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const date = new Date(y, m - 1, d);
        if (short) return `${DIAS_SHORT[date.getDay()]}, ${d} ${MESES_SHORT[date.getMonth()]}`;
        return `${DIAS[date.getDay()]} ${d} de ${MESES[date.getMonth()]} de ${y}`;
      }
    }

    // Formato "Wed Apr 29 2026 ..." (Date.toString())
    const match = fechaStr.match(/(\w+)\s+(\w+)\s+(\d+)\s+(\d{4})/);
    if (match) {
      const [, , mesStr, diaStr, anioStr] = match;
      const mesMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const mesIdx = mesMap[mesStr];
      if (mesIdx !== undefined) {
        d = parseInt(diaStr);
        y = parseInt(anioStr);
        const date = new Date(y, mesIdx, d);
        if (short) return `${DIAS_SHORT[date.getDay()]}, ${d} ${MESES_SHORT[mesIdx]}`;
        return `${DIAS[date.getDay()]} ${d} de ${MESES[mesIdx]} de ${y}`;
      }
    }

    return fechaStr;
  };

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(precio);
  };

  if (authLoading || loading || !evento) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const disponibilidad = Math.max(0, (evento.capacidad || 0) - (evento.entradasVendidas || 0));
  const porcentajeVendido = evento.capacidad ? Math.min(100, Math.round(((evento.entradasVendidas || 0) / evento.capacidad) * 100)) : 0;

  const fetchSesionesList = async () => {
    const res = await fetch(`/api/productor/eventos/${eventoId}/sesiones`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setSesiones(await res.json()); }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavProductor />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button onClick={() => router.push("/productor/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{evento.nombre}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" }) : "-"}</span>
              {evento.hora && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{evento.hora} hrs</span>}
              {(evento.espacio || evento.comuna) && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{evento.espacio}{evento.comuna ? `, ${evento.comuna}` : ""}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/eventos/${eventoId}`)}><Eye className="mr-2 h-4 w-4" />Ver público</Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/productor/eventos/${eventoId}/editar`)}><Pencil className="mr-2 h-4 w-4" />Editar</Button>
          </div>
        </div>

        {sesiones.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            <select 
              value={sesionSeleccionada || ""} 
              onChange={(e) => setSesionSeleccionada(e.target.value || null)}
              className="px-3 py-2 rounded-md border bg-background text-sm"
            >
              <option value="">Todas las fechas</option>
              <option value="sin_sesion">Sin sesión asignada</option>
              {sesiones.map((sesion: any) => (
                <option key={sesion._id} value={sesion._id}>
                  {formatFechaLocal(sesion.fecha, true)} 
                  {sesion.hora ? ` - ${sesion.hora}` : ""}
                  {sesion.capacidad ? ` (${sesion.capacidad})` : ""}
                </option>
              ))}
            </select>
            {sesionSeleccionada && (
              <Button variant="outline" size="sm" onClick={() => setSesionSeleccionada(null)}>Limpiar filtro</Button>
            )}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b">
          {(["general", "compras", "waitinglist", "sesiones"] as const).map((tab) => {
            const labels: Record<string, string> = { general: "General", compras: "Compras", waitinglist: `Lista de Espera (${waitingList.length})`, sesiones: `Fechas (${sesiones.length})` };
            if (tab === "waitinglist" && !evento.configWaitingList?.habilitado) return null;
            return (
              <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab(tab)}>
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {activeTab === "general" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100"><Ticket className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Entradas Vendidas</p><p className="text-2xl font-bold text-foreground">{ventasStats?.entradasVendidas || evento.entradasVendidas || 0}</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100"><DollarSign className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">Ingresos</p><p className="text-2xl font-bold text-foreground">{formatPrecio(ventasStats?.ingresosTotales || 0)}</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100"><TrendingUp className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-muted-foreground">Total Ventas</p><p className="text-2xl font-bold text-foreground">{ventasStats?.totalVentas || 0}</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100"><Users className="h-5 w-5 text-orange-600" /></div><div><p className="text-sm text-muted-foreground">Disponibles</p><p className="text-2xl font-bold text-foreground">{evento.gratuitoSinLimite ? "Ilimitado" : disponibilidad.toLocaleString()}</p></div></div></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card><CardHeader><CardTitle className="text-lg">Progreso de Venta</CardTitle></CardHeader><CardContent>
                {evento.gratuitoSinLimite ? (
                  <div className="flex items-center justify-center py-8"><Badge variant="secondary" className="text-sm">Evento sin límite de capacidad</Badge></div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha principal {evento.fecha ? formatFechaLocal(evento.fecha, true) : ''}
                        </span>
                        {evento.capacidad ? (
                          <Badge variant="outline">{Math.max(0, evento.capacidad - (evento.entradasVendidas || 0))}/{evento.capacidad}</Badge>
                        ) : (
                          <Badge variant="outline">Sin límite</Badge>
                        )}
                      </div>
                      {evento.capacidad ? (
                        <>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${porcentajeVendido}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">{porcentajeVendido}% vendido ({evento.entradasVendidas || 0} entradas)</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground text-right">{evento.entradasVendidas || 0} entradas vendidas</p>
                      )}
                    </div>
                    
                    {sesiones.length > 0 && sesiones.map((sesion: any) => {
                      const capacidadSesion = sesion.capacidad || 0;
                      const vendidasSesion = sesion.entradasVendidas || 0;
                      const disponiblesSesion = Math.max(0, capacidadSesion - vendidasSesion);
                      const porcentajeSesion = capacidadSesion > 0 ? Math.min(100, Math.round((vendidasSesion / capacidadSesion) * 100)) : 0;
                      
                      return (
                        <div key={sesion._id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              {formatFechaLocal(sesion.fecha, true)}
                              {sesion.hora && ` - ${sesion.hora}`}
                              <Badge variant="outline" className="text-blue-600 border-blue-200">{Math.max(0, disponiblesSesion)}/{capacidadSesion}</Badge>
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${porcentajeSesion}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground text-right">{porcentajeSesion}% vendido ({vendidasSesion} entradas)</p>
                        </div>
                      );
                    })}
                    
                    {sesiones.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay sesiones adicionales</p>
                    )}
                  </div>
                )}
              </CardContent></Card>
              <Card><CardHeader><CardTitle className="text-lg">Configuración del Evento</CardTitle></CardHeader><CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estado</span><Badge variant={evento.estado === "publicado" ? "default" : "secondary"}>{evento.estado}</Badge></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tipo</span><span className="font-medium">{evento.tipoEvento || "presencial"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gratuito</span><span className="font-medium">{evento.gratuito ? "Sí" : "No"}</span></div>
                  {!evento.gratuito && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Precio</span><span className="font-medium">{formatPrecio(evento.precio || evento.precioGeneral || 0)}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Venta online</span><span className="font-medium">{evento.ventaOnlineHabilitada ? "Habilitada" : "Deshabilitada"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Venta presencial</span><span className="font-medium">{evento.ventaPresencialHabilitada ? "Habilitada" : "Deshabilitada"}</span></div>
                  {evento.configWaitingList?.habilitado && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Lista de espera</span><span className="font-medium">{evento.configWaitingList.preVenta ? "Pre-venta" : ""}{evento.configWaitingList.preVenta && evento.configWaitingList.postVenta ? ", " : ""}{evento.configWaitingList.postVenta ? "Post-venta" : ""}</span></div>}
                </div>
              </CardContent></Card>
            </div>
          </>
        )}

        {activeTab === "compras" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">Historial de Compras</CardTitle>
                {sesiones.length > 0 && (
                  <select 
                    value={sesionSeleccionada || ""} 
                    onChange={(e) => setSesionSeleccionada(e.target.value || null)}
                    className="px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="">Todas las fechas</option>
                    {evento.fecha && (
                      <option value="fecha_principal">
                        Fecha principal {formatFechaLocal(evento.fecha, true)}
                      </option>
                    )}
                    {sesiones.map((sesion: any) => (
                      <option key={sesion._id} value={sesion._id}>
                        {formatFechaLocal(sesion.fecha, true)} 
                        {sesion.hora ? ` - ${sesion.hora}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {comprasLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : compras.length === 0 ? (
              <div className="text-center py-8"><Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No hay compras registradas</p></div>
            ) : (
              <div className="space-y-3">
                {compras.map((compra: any) => (
                  <div key={compra._id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
                      <div>
                        <p className="font-medium text-sm">Usuario {compra.usuario?._id?.slice(-8) || compra.usuario?.nombre?.slice(0, 1) + "***" || "Anonimizado"}</p>
                        <p className="text-xs text-muted-foreground">Compra #{compra._id?.slice(-6) || ""}</p>
                        <p className="text-xs text-muted-foreground">{new Date(compra.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        {compra.sesion?.fecha ? (
                          <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatFechaLocal(compra.sesion.fecha, true)}
                            {compra.sesion.hora ? ` - ${compra.sesion.hora}` : ""}
                          </p>
                        ) : evento.fecha ? (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Fecha principal {formatFechaLocal(evento.fecha, true)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatPrecio(compra.total)}</p>
                      <p className="text-xs text-muted-foreground">{compra.cantidad} {compra.cantidad === 1 ? "entrada" : "entradas"}</p>
                      <Badge variant={compra.estado === "pagada" ? "default" : "secondary"} className="mt-1">{compra.estado}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {comprasPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">{((comprasPagination.page - 1) * comprasPagination.limit) + 1} - {Math.min(comprasPagination.page * comprasPagination.limit, comprasPagination.total)} de {comprasPagination.total}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={comprasPagination.page <= 1} onClick={() => setComprasPagination(prev => ({ ...prev, page: prev.page - 1 }))}>Anterior</Button>
                  <Button variant="outline" size="sm" disabled={comprasPagination.page >= comprasPagination.totalPages} onClick={() => setComprasPagination(prev => ({ ...prev, page: prev.page + 1 }))}>Siguiente</Button>
                </div>
              </div>
            )}
          </CardContent></Card>
        )}

        {activeTab === "waitinglist" && (
          <div className="space-y-6">
            {evento.configWaitingList?.preVenta && (
              <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-600" />Pre-Venta<Badge variant="default" className="ml-auto">{waitingList.filter((wl: any) => wl.tipo === "preVenta").length}</Badge></CardTitle></CardHeader><CardContent>
                {waitingList.filter((wl: any) => wl.tipo === "preVenta").length === 0 ? (
                  <div className="text-center py-8"><Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No hay suscripciones en pre-venta</p></div>
                ) : (
                  <div className="space-y-3">
                    {waitingList.filter((wl: any) => wl.tipo === "preVenta").map((wl: any) => (
                      <div key={wl._id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div><p className="font-medium text-sm">Usuario {wl._id?.slice(-8) || "Anonimizado"}</p><p className="text-xs text-muted-foreground">Suscrito el {new Date(wl.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })}</p></div>
                        <div className="text-right"><Badge variant="outline" className="text-xs">Pre-Venta</Badge></div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent></Card>
            )}
            {evento.configWaitingList?.postVenta && (
              <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-orange-600" />Post-Venta<Badge variant="secondary" className="ml-auto">{waitingList.filter((wl: any) => wl.tipo === "postVenta").length}</Badge></CardTitle></CardHeader><CardContent>
                {waitingList.filter((wl: any) => wl.tipo === "postVenta").length === 0 ? (
                  <div className="text-center py-8"><Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No hay suscripciones en post-venta</p></div>
                ) : (
                  <div className="space-y-3">
                    {waitingList.filter((wl: any) => wl.tipo === "postVenta").map((wl: any) => (
                      <div key={wl._id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div><p className="font-medium text-sm">Usuario {wl._id?.slice(-8) || "Anonimizado"}</p><p className="text-xs text-muted-foreground">Suscrito el {new Date(wl.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })}</p></div>
                        <div className="text-right"><Badge variant="outline" className="text-xs">Post-Venta</Badge></div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent></Card>
            )}
          </div>
        )}

        {activeTab === "sesiones" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-lg font-semibold text-foreground">Fechas del Evento</h2><p className="text-sm text-muted-foreground">Gestiona las fechas y capacidades de cada sesión</p></div>
              <Button onClick={() => setShowAddSesion(!showAddSesion)}><Plus className="mr-2 h-4 w-4" />Agregar Fecha</Button>
            </div>
            {showAddSesion && (
              <Card><CardHeader><CardTitle className="text-base">Nueva Fecha</CardTitle></CardHeader><CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Fecha *</label><Input type="date" value={newSesion.fecha} onChange={(e) => setNewSesion(prev => ({ ...prev, fecha: e.target.value }))} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Hora</label><Input type="time" value={newSesion.hora} onChange={(e) => setNewSesion(prev => ({ ...prev, hora: e.target.value }))} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Capacidad *</label><Input type="number" min="1" value={newSesion.capacidad} onChange={(e) => setNewSesion(prev => ({ ...prev, capacidad: e.target.value }))} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Precio (opcional)</label><Input type="number" min="0" value={newSesion.precio} onChange={(e) => setNewSesion(prev => ({ ...prev, precio: e.target.value }))} placeholder="Usa precio del evento" /></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={async () => {
                    if (!newSesion.fecha || !newSesion.capacidad) return;
                    try {
                      const res = await fetch(`/api/productor/eventos/${eventoId}/sesiones`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ eventoId, fecha: newSesion.fecha, hora: newSesion.hora || undefined, capacidad: parseInt(newSesion.capacidad), precio: newSesion.precio ? parseFloat(newSesion.precio) : undefined }) });
                      if (res.ok) { setNewSesion({ fecha: "", hora: "", capacidad: "", precio: "" }); setShowAddSesion(false); await fetchSesionesList(); }
                    } catch (error) { console.error("Error creating sesion:", error); }
                  }}>Crear Fecha</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddSesion(false)}>Cancelar</Button>
                </div>
              </CardContent></Card>
            )}
            {sesionesLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : sesiones.length === 0 ? (
              <Card><CardContent className="text-center py-12"><Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-medium text-foreground mb-2">No hay fechas creadas</h3><p className="text-muted-foreground mb-4">Agrega fechas para vender entradas independientes por sesión</p><Button onClick={() => setShowAddSesion(true)}><Plus className="mr-2 h-4 w-4" />Agregar primera fecha</Button></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {sesiones.map((sesion: any) => {
                  const disp = sesion.capacidad - sesion.entradasVendidas;
                  const pct = sesion.capacidad ? Math.round((sesion.entradasVendidas / sesion.capacidad) * 100) : 0;
                  return (
                    <Card key={sesion._id}><CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{formatFechaLocal(sesion.fecha, true)}{sesion.hora && ` — ${sesion.hora} hrs`}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{sesion.entradasVendidas} / {sesion.capacidad} vendidas</span>
                              <span>{disp} disponibles</span>
                              {sesion.precio && <span className="font-medium text-green-600">{formatPrecio(sesion.precio)}</span>}
                            </div>
                            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={sesion.activo ? "default" : "secondary"}>{sesion.activo ? "Activa" : "Inactiva"}</Badge>
                          {sesion.notificado && <Badge variant="outline" className="text-green-600 border-green-600"><Bell className="h-3 w-3 mr-1" />Notificada</Badge>}
                          {sesion.prioridadActiva && <Badge variant="outline" className="text-blue-600 border-blue-600"><Key className="h-3 w-3 mr-1" />Prioridad</Badge>}
                          <Button variant="ghost" size="icon" onClick={async () => { try { await fetch(`/api/productor/eventos/${eventoId}/sesiones/${sesion._id}/estado`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }); await fetchSesionesList(); } catch {} }}>
                            {sesion.activo ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={async () => { try { await fetch(`/api/productor/eventos/${eventoId}/sesiones/${sesion._id}/notificar`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); await fetchSesionesList(); } catch {} }} title="Notificar lista de espera">
                            <Bell className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={async () => { 
                            const confirm = window.confirm(`¿Dar prioridad a lista de espera para esta fecha? Cada usuario podrá reservar hasta 2 entradas por 2 horas.`);
                            if (!confirm) return;
                            try { 
                              const res = await fetch(`/api/productor/eventos/${eventoId}/sesiones/${sesion._id}/abrir-prioridad`, { 
                                method: "POST", 
                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ cantidadEntradasPorUsuario: 2, horasExpiracion: 2 }) 
                              });
                              if (res.ok) {
                                const data = await res.json();
                                alert(`Prioridad abierta a ${data.total} usuarios`);
                                await fetchSesionesList();
                              }
                            } catch {} 
                          }} title="Dar prioridad a lista de espera">
                            <Key className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent></Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
