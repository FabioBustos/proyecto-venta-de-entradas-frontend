"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { downgradeHeadings, upgradeHeadings } from "@/components/html-content";
import { RichTextEditor } from "@/components/rich-text-editor";
import { CalendarioEventoConfiguracion } from "./CalendarioEventoConfiguracion";
import { DateRangeInput } from "@/components/ui/date-range-input";
import { REGIONES, COMUNAS_CHILE } from "@/lib/comunas-chile";
import {
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  ImageIcon,
  Globe,
  Video,
  Mail,
  Shield,
  Plus,
  X,
  Ticket,
  CreditCard,
  Settings,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";

const CATEGORIAS = [
  { value: "musica", label: "Música" },
  { value: "deportes", label: "Deportes" },
  { value: "teatro", label: "Teatro" },
  { value: "comedia", label: "Comedia" },
  { value: "feria", label: "Feria" },
  { value: "conferencia", label: "Conferencia" },
  { value: "otro", label: "Otro" },
];

const TIPOS_EVENTO = [
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "Online" },
  { value: "hibrido", label: "Híbrido" },
];

const VISIBILIDAD_EVENTO = [
  { value: "publico", label: "Público" },
  { value: "privado", label: "Privado" },
];

const RESTRICCIONES_EDAD = [
  { value: "todo_publico", label: "Todo público" },
  { value: "menores18", label: "Mayores de 18 años" },
  { value: "menores21", label: "Mayores de 21 años" },
];

const TIPOS_TRAMO = [
  { value: "cantidad", label: "Por cantidad" },
  { value: "fecha", label: "Por fecha" },
  { value: "cantidad_fecha", label: "Cantidad y fecha" },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const defaultFormData = {
  nombre: "",
  descripcion: "",
  categoria: "",
  esMultipleDias: false,
  dias: [] as { fecha: string; nombre: string }[],
  esEntradaPorDia: false,
  capacidadPorDia: false,
  fecha: "",
  hora: "",
  tipoEvento: "presencial",
  region: "",
  comuna: "",
  direccion: "",
  espacio: "",
  linkOnline: "",
  videoYoutube: "",
  horaApertura: "",
  visibilidad: "borrador",
  estado: "borrador",
  visibilidadEvento: "publico",
  mostrarEnWeb: true,
  restriccionEdad: "todo_publico",
  imagenUrl: "",
  precio: 0,
  precioGeneral: 0,
  capacidad: 0,
  tieneZonas: false,
  zonas: [] as { id: string; nombre: string; descripcion: string; precioBase: number; capacidad: number; color: string; orden: number }[],
  tieneTramos: false,
  tramosAplicanPor: "evento",
  tramos: [] as { id: string; tipo: string; cantidadInicio: number; cantidadFin: number; fechaInicio: string; fechaFin: string; precio: number; zonaId: string; diaIndex: number; activo: boolean }[],
  ventaOnlineHabilitada: true,
  ventaOnlineFechaInicio: "",
  ventaOnlineFechaFin: "",
  ventaOnlineHoraInicio: "",
  ventaOnlineHoraFin: "",
  ventaPresencialHabilitada: false,
  ventaPresencialInventario: 0,
  ventaPresencialPrecio: 0,
  ventaPresencialHoraInicio: "",
  entradaNominal: false,
  permiteTransferencia: true,
  cambioNombreHabilitado: false,
  cambioNombreCosto: 0,
  limitePorUsuario: 1,
  gratuito: false,
  gratuitoSinLimite: false,
  entradaLiberada: false,
  codigosDescuento: [] as { id: string; codigo: string; tipo: string; valor: number; usosMaximos: number; fechaValidezInicio: string; fechaValidezFin: string; aplicableA: string; zonasAplicables: string[]; activo: boolean }[],
  configEnvio: {
    envioAutomatico: true,
    permitirReenvio: true,
    emailAsistente: false,
  },
  configWaitingList: {
    habilitado: false,
    preVenta: false,
    postVenta: false,
    maxSuscritosPreVenta: 0,
    precioPreVenta: 0,
    fechaInscripcionPreVentaInicio: "",
    fechaInscripcionPreVentaFin: "",
    horaInscripcionPreVentaInicio: "",
    horaInscripcionPreVentaFin: "",
    fechaInicioPreVenta: "",
    fechaFinPreVenta: "",
    horaInicioPreVenta: "",
    horaFinPreVenta: "",
  },
};

interface EventoFormProps {
  initialData?: typeof defaultFormData | null;
  eventoId?: string | null;
  esEdicion?: boolean;
}

function toISODate(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') {
    return value.includes('T') ? value.split('T')[0] : value;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return '';
}

function mergeEventData(data: any): typeof defaultFormData {
  const dias = Array.isArray(data?.dias) ? data.dias.map((d: any) => ({
    ...d,
    fecha: toISODate(d.fecha),
  })) : [];

  const tramos = Array.isArray(data?.tramos) ? data.tramos.map((t: any) => ({
    ...t,
    fechaInicio: toISODate(t.fechaInicio),
    fechaFin: toISODate(t.fechaFin),
  })) : [];

  const codigosDescuento = Array.isArray(data?.codigosDescuento) ? data.codigosDescuento.map((c: any) => ({
    ...c,
    fechaValidezInicio: toISODate(c.fechaValidezInicio),
    fechaValidezFin: toISODate(c.fechaValidezFin),
  })) : [];

  return {
    ...defaultFormData,
    ...data,
    descripcion: upgradeHeadings(data.descripcion || ""),
    fecha: toISODate(data?.fecha),
    ventaOnlineFechaInicio: toISODate(data?.ventaOnlineFechaInicio),
    ventaOnlineFechaFin: toISODate(data?.ventaOnlineFechaFin),
    configEnvio: {
      ...defaultFormData.configEnvio,
      ...(data?.configEnvio || {}),
    },
    configWaitingList: {
      ...defaultFormData.configWaitingList,
      ...(data?.configWaitingList || {}),
      fechaInscripcionPreVentaInicio: toISODate(data?.configWaitingList?.fechaInscripcionPreVentaInicio),
      fechaInscripcionPreVentaFin: toISODate(data?.configWaitingList?.fechaInscripcionPreVentaFin),
      fechaInicioPreVenta: toISODate(data?.configWaitingList?.fechaInicioPreVenta),
      fechaFinPreVenta: toISODate(data?.configWaitingList?.fechaFinPreVenta),
    },
    zonas: Array.isArray(data?.zonas) ? data.zonas : [],
    tramos,
    dias,
    codigosDescuento,
  };
}

export function EventoForm({ initialData, eventoId, esEdicion = false }: EventoFormProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrlOriginal, setImagenUrlOriginal] = useState<string>("");
  const [ventaOnlineFechaInicioOriginal, setVentaOnlineFechaInicioOriginal] = useState<string>("");
  const [wlInitialized, setWlInitialized] = useState(false);
  const [preVentaWasActive, setPreVentaWasActive] = useState(false);

  const [formData, setFormData] = useState(() => initialData ? mergeEventData(initialData) : defaultFormData);

  useEffect(() => {
    if (initialData && esEdicion) {
      setFormData(mergeEventData(initialData));
      setImagenFile(null);
      const urlOriginal = initialData.imagenUrl || (initialData as any).imagen || "";
      setImagenUrlOriginal(urlOriginal);
      
      const tienePreVentaActiva = !!(initialData.configWaitingList?.preVenta && initialData.configWaitingList?.fechaInicioPreVenta);
      setPreVentaWasActive(tienePreVentaActiva);
    }
  }, [initialData, esEdicion]);

  useEffect(() => {
    if (esEdicion && formData.configWaitingList.preVenta && !preVentaWasActive && !formData.configWaitingList.fechaInscripcionPreVentaInicio && !wlInitialized) {
      setWlInitialized(true);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);
      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

      let nuevaVentaOnline = dayAfterTomorrowStr;
      if (formData.ventaOnlineFechaInicio) {
        const ventaActual = new Date(formData.ventaOnlineFechaInicio + 'T00:00:00');
        const preventaFin = new Date(tomorrowStr + 'T00:00:00');
        if (ventaActual <= preventaFin) {
          nuevaVentaOnline = dayAfterTomorrowStr;
        } else {
          nuevaVentaOnline = formData.ventaOnlineFechaInicio;
        }
        setVentaOnlineFechaInicioOriginal(formData.ventaOnlineFechaInicio);
      }

      setFormData((prev) => ({
        ...prev,
        configWaitingList: {
          ...prev.configWaitingList,
          fechaInscripcionPreVentaInicio: todayStr,
          fechaInscripcionPreVentaFin: todayStr,
          horaInscripcionPreVentaInicio: prev.configWaitingList.horaInscripcionPreVentaInicio || "00:00",
          horaInscripcionPreVentaFin: prev.configWaitingList.horaInscripcionPreVentaFin || "23:59",
          fechaInicioPreVenta: tomorrowStr,
          fechaFinPreVenta: tomorrowStr,
          horaInicioPreVenta: prev.configWaitingList.horaInicioPreVenta || "00:00",
          horaFinPreVenta: prev.configWaitingList.horaFinPreVenta || "23:59",
        },
        ventaOnlineFechaInicio: nuevaVentaOnline
      }));
    }
  }, [esEdicion, formData.configWaitingList.preVenta, formData.configWaitingList.fechaInscripcionPreVentaInicio, preVentaWasActive]);

  useEffect(() => {
    if (!esEdicion && formData.fecha && !formData.entradaLiberada && !formData.gratuito && !formData.gratuitoSinLimite) {
      const today = new Date();
      const todayISO = today.toISOString().split('T')[0];
      const todayTime = today.toTimeString().slice(0, 5);

      setFormData((prev) => {
        const updates: any = {
          ventaOnlineFechaInicio: prev.ventaOnlineFechaInicio || todayISO,
          ventaOnlineFechaFin: prev.ventaOnlineFechaFin || prev.fecha,
          ventaOnlineHoraInicio: prev.ventaOnlineHoraInicio || todayTime,
          ventaOnlineHoraFin: prev.ventaOnlineHoraFin || "23:59",
        };

        if (prev.configWaitingList.preVenta) {
          const fechaEvento = new Date(prev.fecha);

          const fechaInscripcionInicio = new Date(fechaEvento);
          fechaInscripcionInicio.setDate(fechaEvento.getDate() - 10);

          const fechaInscripcionFin = new Date(fechaEvento);
          fechaInscripcionFin.setDate(fechaEvento.getDate() - 7);

          const fechaCompraInicio = new Date(fechaEvento);
          fechaCompraInicio.setDate(fechaEvento.getDate() - 5);

          const fechaCompraFin = new Date(fechaEvento);
          fechaCompraFin.setDate(fechaEvento.getDate() - 2);

          updates.configWaitingList = {
            ...prev.configWaitingList,
            fechaInscripcionPreVentaInicio: prev.configWaitingList.fechaInscripcionPreVentaInicio || fechaInscripcionInicio.toISOString().split('T')[0],
            fechaInscripcionPreVentaFin: prev.configWaitingList.fechaInscripcionPreVentaFin || fechaInscripcionFin.toISOString().split('T')[0],
            horaInscripcionPreVentaInicio: prev.configWaitingList.horaInscripcionPreVentaInicio || "00:00",
            horaInscripcionPreVentaFin: prev.configWaitingList.horaInscripcionPreVentaFin || "23:59",
            fechaInicioPreVenta: prev.configWaitingList.fechaInicioPreVenta || fechaCompraInicio.toISOString().split('T')[0],
            fechaFinPreVenta: prev.configWaitingList.fechaFinPreVenta || fechaCompraFin.toISOString().split('T')[0],
            horaInicioPreVenta: prev.configWaitingList.horaInicioPreVenta || "00:00",
            horaFinPreVenta: prev.configWaitingList.horaFinPreVenta || "23:59",
          };
        }

        return { ...prev, ...updates };
      });
    }
  }, [formData.fecha, formData.entradaLiberada, formData.gratuito, formData.gratuitoSinLimite, esEdicion]);

  const comunasFiltradas = (() => {
    if (!formData.region) return [];
    return COMUNAS_CHILE.filter((c) => c.region === formData.region).map((c) => c.comuna).sort();
  })();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => {
        const updates: Partial<typeof prev> = {
          [name]: value,
          ...(name === "region" ? { comuna: "" } : {}),
        };
        if (name === "fecha" && value && !prev.entradaLiberada && !prev.gratuito && !prev.gratuitoSinLimite) {
          updates.ventaOnlineFechaFin = value;
        }
        return { ...prev, ...updates };
      });
    }
  };

  const handleWaitingListChange = (campo: string, valor: string | number) => {
    setFormData((prev) => ({
      ...prev,
      configWaitingList: {
        ...prev.configWaitingList,
        [campo]: valor,
      },
    }));
  };

  const agregarDia = () => {
    setFormData((prev) => ({
      ...prev,
      dias: [...prev.dias, { fecha: "", nombre: "" }],
    }));
  };

  const eliminarDia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dias: prev.dias.filter((_, i) => i !== index),
    }));
  };

  const actualizarDia = (index: number, campo: string, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      dias: prev.dias.map((d, i) => i === index ? { ...d, [campo]: valor } : d),
    }));
  };

  const agregarZona = () => {
    setFormData((prev) => ({
      ...prev,
      tieneZonas: true,
      zonas: [
        ...prev.zonas,
        {
          id: generateId(),
          nombre: "",
          descripcion: "",
          precioBase: 0,
          capacidad: 0,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          orden: prev.zonas.length,
        },
      ],
    }));
  };

  const eliminarZona = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      zonas: prev.zonas.filter((z) => z.id !== id),
    }));
  };

  const actualizarZona = (id: string, campo: string, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      zonas: prev.zonas.map((z) => z.id === id ? { ...z, [campo]: valor } : z),
    }));
  };

  const agregarTramo = () => {
    setFormData((prev) => ({
      ...prev,
      tieneTramos: true,
      tramos: [
        ...prev.tramos,
        {
          id: generateId(),
          tipo: "fecha",
          cantidadInicio: 0,
          cantidadFin: 0,
          fechaInicio: "",
          fechaFin: "",
          precio: 0,
          zonaId: "",
          diaIndex: 0,
          activo: true,
        },
      ],
    }));
  };

  const eliminarTramo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tramos: prev.tramos.filter((t) => t.id !== id),
    }));
  };

  const actualizarTramo = (id: string, campo: string, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      tramos: prev.tramos.map((t) => t.id === id ? { ...t, [campo]: valor } : t),
    }));
  };

  const agregarCodigoDescuento = () => {
    setFormData((prev) => ({
      ...prev,
      codigosDescuento: [
        ...prev.codigosDescuento,
        {
          id: generateId(),
          codigo: "",
          tipo: "porcentaje",
          valor: 0,
          usosMaximos: 0,
          fechaValidezInicio: "",
          fechaValidezFin: "",
          aplicableA: "todo",
          zonasAplicables: [],
          activo: true,
        },
      ],
    }));
  };

  const eliminarCodigoDescuento = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      codigosDescuento: prev.codigosDescuento.filter((c) => c.id !== id),
    }));
  };

  const actualizarCodigoDescuento = (id: string, campo: string, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      codigosDescuento: prev.codigosDescuento.map((c) => c.id === id ? { ...c, [campo]: valor } : c),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent, visibilidad: string = "borrador") => {
    if (e) e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayISO = today.toISOString().split('T')[0];

    if (!formData.nombre || !formData.nombre.trim()) {
      alert('El nombre del evento es obligatorio');
      return;
    }
    if (!formData.categoria) {
      alert('La categoría del evento es obligatoria');
      return;
    }

    if (visibilidad === "publicado") {
      if (!formData.descripcion || !formData.descripcion.trim()) {
        alert('La descripción del evento es obligatoria para publicar');
        return;
      }
      if (formData.tipoEvento !== "online") {
        if (!formData.region) {
          alert('La región es obligatoria para publicar');
          return;
        }
        if (!formData.comuna) {
          alert('La comuna es obligatoria para publicar');
          return;
        }
        if (!formData.direccion) {
          alert('La dirección es obligatoria para publicar');
          return;
        }
        if (!formData.espacio) {
          alert('El espacio/venue es obligatorio para publicar');
          return;
        }
      }
      if (formData.tipoEvento !== "presencial") {
        if (!formData.linkOnline || !formData.linkOnline.trim()) {
          alert('El link de acceso al evento es obligatorio para publicar');
          return;
        }
      }
      if (!formData.esMultipleDias && !formData.fecha) {
        alert('La fecha del evento es obligatoria para publicar');
        return;
      }
      if (!formData.esMultipleDias && !formData.hora) {
        alert('La hora del evento es obligatoria para publicar');
        return;
      }
    }

    if (!formData.gratuito && !formData.gratuitoSinLimite && !formData.entradaLiberada) {
      if (formData.esMultipleDias) {
        for (const dia of formData.dias) {
          if (dia.fecha && dia.fecha < todayISO) {
            alert('La fecha del evento no puede ser anterior al día actual');
            return;
          }
        }
      } else {
        if (formData.fecha && formData.fecha < todayISO) {
          alert('La fecha del evento no puede ser anterior al día actual');
          return;
        }
      }
    }

    setLoading(true);

    let imagenUrlFinal = formData.imagenUrl;

    if (imagenFile) {
      try {
        if (esEdicion && imagenUrlOriginal) {
          try {
            const urlObj = new URL(imagenUrlOriginal);
            const pathname = urlObj.pathname;
            const key = pathname.startsWith('/') ? pathname.substring(1) : pathname;

            if (key && key.startsWith('eventos/')) {
              const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ key }),
              });
              const deleteData = await deleteRes.json();
              console.log('Imagen anterior eliminada:', deleteRes.status, deleteData);
            }
          } catch (deleteError) {
            console.warn("Error en eliminación:", deleteError);
          }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/presigned-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: imagenFile.name,
            contentType: imagenFile.type,
          }),
        });

        if (!res.ok) {
          throw new Error("Error al obtener URL de upload");
        }

        const { uploadUrl, publicUrl } = await res.json();

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": imagenFile.type },
          body: imagenFile,
        });

        imagenUrlFinal = publicUrl;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        alert("Error al subir la imagen. El evento se guardará sin imagen.");
      }
    }

    const estado = visibilidad === "publicado" ? "publicado" : "borrador";

    const toDateISO = (dateStr: string | undefined) => {
      if (!dateStr) return undefined;
      if (dateStr.includes('T')) return dateStr;
      return `${dateStr}T00:00:00.000Z`;
    };

    const payload = {
      ...formData,
      imagenUrl: imagenUrlFinal,
      descripcion: downgradeHeadings(formData.descripcion || ""),
      visibilidad,
      estado,
      precio: Number(formData.precioGeneral) || 0,
      capacidad: Number(formData.capacidad) || 0,
      precioGeneral: Number(formData.precioGeneral) || 0,
      limitePorUsuario: Number(formData.limitePorUsuario) || 1,
      ventaPresencialInventario: Number(formData.ventaPresencialInventario) || 0,
      ventaPresencialPrecio: Number(formData.ventaPresencialPrecio) || 0,
      cambioNombreCosto: Number(formData.cambioNombreCosto) || 0,
      fecha: toDateISO(formData.fecha),
      ventaOnlineFechaInicio: toDateISO(formData.ventaOnlineFechaInicio),
      ventaOnlineFechaFin: toDateISO(formData.ventaOnlineFechaFin),
      dias: formData.dias.map(d => ({
        ...d,
        fecha: toDateISO(d.fecha),
      })),
      tramos: formData.tramos.map(t => ({
        ...t,
        fechaInicio: toDateISO(t.fechaInicio),
        fechaFin: toDateISO(t.fechaFin),
      })),
      codigosDescuento: formData.codigosDescuento.map(c => ({
        ...c,
        fechaValidezInicio: toDateISO(c.fechaValidezInicio),
        fechaValidezFin: toDateISO(c.fechaValidezFin),
      })),
      configWaitingList: formData.configWaitingList ? {
        ...formData.configWaitingList,
        fechaInscripcionPreVentaInicio: toDateISO(formData.configWaitingList.fechaInscripcionPreVentaInicio),
        fechaInscripcionPreVentaFin: toDateISO(formData.configWaitingList.fechaInscripcionPreVentaFin),
        fechaInicioPreVenta: toDateISO(formData.configWaitingList.fechaInicioPreVenta),
        fechaFinPreVenta: toDateISO(formData.configWaitingList.fechaFinPreVenta),
      } : undefined,
    };

    console.log('fecha raw:', formData.fecha);
    console.log('fecha converted:', payload.fecha);
    console.log('payload fecha type:', typeof payload.fecha);

    const url = esEdicion && eventoId
      ? `/api/productor/eventos/${eventoId}`
      : '/api/productor/eventos';

    const method = esEdicion ? 'PUT' : 'POST';

    let imagenKeyTemporal = "";
    if (imagenFile && !esEdicion) {
      const urlObj = new URL(imagenUrlFinal);
      imagenKeyTemporal = urlObj.pathname.substring(1);
    }

    let eventoGuardado: any = null;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          imagenKeyTemporal: imagenKeyTemporal || undefined,
        }),
      });

      if (res.ok) {
        eventoGuardado = await res.json();
      } else {
        const error = await res.json();
        alert(error.error || error.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} evento`);
        setLoading(false);
        return;
      }
    } catch {
      alert(`Error al ${esEdicion ? 'actualizar' : 'crear'} evento`);
      setLoading(false);
      return;
    }

    if (imagenFile) {
      const eventoIdActual = esEdicion ? eventoId : eventoGuardado?._id;
      if (eventoIdActual && imagenUrlFinal) {
        try {
          const urlObj = new URL(imagenUrlFinal);
          const oldKey = urlObj.pathname.substring(1);
          const extension = oldKey.split('.').pop() || 'jpg';
          const newKey = `eventos/${eventoIdActual}.${extension}`;

          const renameRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/rename`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ oldKey, newKey }),
          });

          if (renameRes.ok) {
            const { publicUrl: nuevaUrl } = await renameRes.json();

            await fetch(`/api/productor/eventos/${eventoIdActual}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ imagenUrl: nuevaUrl }),
            });
          }
        } catch (renameError) {
          console.warn("No se pudo renombrar la imagen:", renameError);
        }
      }
    }

    router.push("/productor/dashboard");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-10">
      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Información Básica
        </Label>
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del evento *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Festival de Verano 2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <RichTextEditor
              value={formData.descripcion}
              onChange={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
              placeholder="Escribe la descripción de tu evento..."
              minHeight="150px"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoEvento">Tipo de evento *</Label>
              <select
                id="tipoEvento"
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                required
              >
                {TIPOS_EVENTO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibilidadEvento">Visibilidad *</Label>
              <select
                id="visibilidadEvento"
                name="visibilidadEvento"
                value={formData.visibilidadEvento}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                required
              >
                {VISIBILIDAD_EVENTO.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restriccionEdad">Restricción de edad *</Label>
              <select
                id="restriccionEdad"
                name="restriccionEdad"
                value={formData.restriccionEdad}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                required
              >
                {RESTRICCIONES_EDAD.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="entradaLiberada"
              name="entradaLiberada"
              checked={formData.entradaLiberada}
              onCheckedChange={(checked) => setFormData((prev) => ({
                ...prev,
                entradaLiberada: checked as boolean,
                gratuito: checked ? false : prev.gratuito,
                gratuitoSinLimite: checked ? false : prev.gratuitoSinLimite,
                tieneZonas: checked ? false : prev.tieneZonas,
                tieneTramos: checked ? false : prev.tieneTramos,
                ventaOnlineHabilitada: checked ? false : prev.ventaOnlineHabilitada,
                ventaPresencialHabilitada: checked ? false : prev.ventaPresencialHabilitada,
                codigosDescuento: checked ? [] : prev.codigosDescuento,
                configWaitingList: { ...prev.configWaitingList, habilitado: checked ? false : prev.configWaitingList.habilitado },
                entradaNominal: checked ? false : prev.entradaNominal,
                permiteTransferencia: checked ? false : prev.permiteTransferencia,
                cambioNombreHabilitado: checked ? false : prev.cambioNombreHabilitado,
                cambioNombreCosto: checked ? 0 : prev.cambioNombreCosto,
                limitePorUsuario: checked ? 1 : prev.limitePorUsuario,
                configEnvio: {
                  envioAutomatico: checked ? false : prev.configEnvio.envioAutomatico,
                  permitirReenvio: checked ? false : prev.configEnvio.permitirReenvio,
                  emailAsistente: checked ? false : prev.configEnvio.emailAsistente,
                },
              }))}
            />
            <Label htmlFor="entradaLiberada" className="font-normal">Entrada liberada (solo difusión, sin entradas ni venta)</Label>
          </div>
          {formData.entradaLiberada && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              Este evento aparecerá en la web como información. Los asistentes no necesitan entrada ni registro. Las secciones de precios, venta y entradas están ocultas.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fechas y Horario
        </Label>
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="esMultipleDias"
                name="esMultipleDias"
                checked={formData.esMultipleDias}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, esMultipleDias: checked as boolean }))}
              />
              <Label htmlFor="esMultipleDias" className="font-normal">Evento de múltiples días</Label>
            </div>
            {formData.esMultipleDias && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="esEntradaPorDia"
                    name="esEntradaPorDia"
                    checked={formData.esEntradaPorDia}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, esEntradaPorDia: checked as boolean }))}
                  />
                  <Label htmlFor="esEntradaPorDia" className="font-normal">Entrada por día específico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="capacidadPorDia"
                    name="capacidadPorDia"
                    checked={formData.capacidadPorDia}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, capacidadPorDia: checked as boolean }))}
                  />
                  <Label htmlFor="capacidadPorDia" className="font-normal">Capacidad independiente por día</Label>
                </div>
              </>
            )}
          </div>

          {formData.esMultipleDias ? (
            <div className="space-y-4">
              {formData.dias.map((dia, index) => (
                <div key={index} className="flex gap-4 items-end p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={dia.fecha}
                      onChange={(e) => actualizarDia(index, "fecha", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Nombre (opcional)</Label>
                    <Input
                      placeholder="Ej: Viernes"
                      value={dia.nombre}
                      onChange={(e) => actualizarDia(index, "nombre", e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => eliminarDia(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={agregarDia} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Día
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.fecha}
                  onChange={handleChange}
                  required={!formData.esMultipleDias}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora del evento *</Label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaApertura">Hora de apertura</Label>
                <Input
                  id="horaApertura"
                  name="horaApertura"
                  type="time"
                  value={formData.horaApertura}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {formData.tipoEvento === "online" ? "Acceso al evento" : formData.tipoEvento === "hibrido" ? "Ubicación y Acceso" : "Ubicación"}
        </Label>
        <div className="grid grid-cols-1 gap-4 pt-2">
          {formData.tipoEvento !== "online" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                  required={formData.tipoEvento !== "online"}
                >
                  <option value="">Selecciona una región</option>
                  {REGIONES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna *</Label>
                <select
                  id="comuna"
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                  required={formData.tipoEvento !== "online"}
                  disabled={!formData.region}
                >
                  <option value="">Selecciona una comuna</option>
                  {comunasFiltradas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.tipoEvento !== "online" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Av. Estadio Nacional 1234"
                  required={formData.tipoEvento !== "online"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="espacio">Espacio / Venue</Label>
                <Input
                  id="espacio"
                  name="espacio"
                  value={formData.espacio}
                  onChange={handleChange}
                  placeholder="Ej: Estadio Nacional"
                />
              </div>
            </div>
          )}

          {formData.tipoEvento !== "presencial" && (
            <div className="space-y-2">
              <Label htmlFor="linkOnline">Link de acceso al evento *</Label>
              <Input
                id="linkOnline"
                name="linkOnline"
                type="url"
                value={formData.linkOnline}
                onChange={handleChange}
                placeholder="https://zoom.us/j/... o https://meet.google.com/..."
                required={formData.tipoEvento !== "presencial"}
              />
              <p className="text-xs text-muted-foreground">Comparte el link de Zoom, Meet, YouTube Live u otra plataforma donde se realizará el evento</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Imagen y Video
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="imagenUrl">Imagen del evento</Label>
            <ImageUpload
              value={formData.imagenUrl}
              file={imagenFile}
              onFileChange={(file) => setImagenFile(file)}
              onChange={(url) => setFormData((prev) => ({ ...prev, imagenUrl: url }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoYoutube">Video de YouTube</Label>
            <Input
              id="videoYoutube"
              name="videoYoutube"
              type="url"
              value={formData.videoYoutube}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {!formData.entradaLiberada && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Precios y Capacidad
          </Label>
          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-center space-x-2 pb-2">
              <Checkbox
                id="gratuitoSinLimite"
                name="gratuitoSinLimite"
                checked={formData.gratuitoSinLimite}
                onCheckedChange={(checked) => setFormData((prev) => ({
                  ...prev,
                  gratuitoSinLimite: checked as boolean,
                  gratuito: checked ? true : prev.gratuito,
                  precioGeneral: checked ? 0 : prev.precioGeneral,
                  tieneTramos: checked ? false : prev.tieneTramos,
                  codigosDescuento: checked ? [] : prev.codigosDescuento,
                  configWaitingList: { ...prev.configWaitingList, habilitado: checked ? false : prev.configWaitingList.habilitado },
                }))}
              />
              <Label htmlFor="gratuitoSinLimite" className="font-normal">Gratuito sin límite de capacidad (se generan entradas ilimitadas)</Label>
            </div>

            <div className="flex items-center space-x-2 pb-4">
              <Checkbox
                id="tieneZonas"
                name="tieneZonas"
                checked={formData.tieneZonas}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, tieneZonas: checked as boolean }))}
                disabled={formData.gratuitoSinLimite}
              />
              <Label htmlFor="tieneZonas" className="font-normal">Activar zonas diferenciadas (VIP, Platea, General, etc.)</Label>
            </div>
            {formData.gratuitoSinLimite && (
              <p className="text-sm text-muted-foreground -mt-3 mb-2">No aplica: gratuito sin límite no usa zonas.</p>
            )}

            {formData.tieneZonas ? (
              <div className="space-y-4">
                {formData.zonas.map((zona) => (
                  <div key={zona.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">Zona</Label>
                      <Button type="button" variant="destructive" size="sm" onClick={() => eliminarZona(zona.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          placeholder="VIP"
                          value={zona.nombre}
                          onChange={(e) => actualizarZona(zona.id, "nombre", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio (CLP)</Label>
                        <Input
                          type="number"
                          placeholder="25000"
                          value={zona.precioBase}
                          onChange={(e) => actualizarZona(zona.id, "precioBase", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacidad</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={zona.capacidad}
                          onChange={(e) => actualizarZona(zona.id, "capacidad", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={zona.color}
                          onChange={(e) => actualizarZona(zona.id, "color", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={agregarZona} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Zona
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="precioGeneral">Precio (CLP) *</Label>
                  <Input
                    id="precioGeneral"
                    name="precioGeneral"
                    type="number"
                    min="0"
                    value={formData.precioGeneral}
                    onChange={handleChange}
                    placeholder="15000"
                    disabled={formData.gratuito || formData.gratuitoSinLimite}
                    required={!formData.gratuito && !formData.gratuitoSinLimite}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="gratuito"
                    name="gratuito"
                    checked={formData.gratuito}
                    onCheckedChange={(checked) => setFormData((prev) => ({
                      ...prev,
                      gratuito: checked as boolean,
                      gratuitoSinLimite: checked ? false : prev.gratuitoSinLimite,
                      precioGeneral: checked ? 0 : prev.precioGeneral,
                      ventaPresencialHabilitada: false,
                    }))}
                  />
                  <Label htmlFor="gratuito" className="font-normal">Evento gratuito</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="gratuitoSinLimite"
                    name="gratuitoSinLimite"
                    checked={formData.gratuitoSinLimite}
                    onCheckedChange={(checked) => setFormData((prev) => ({
                      ...prev,
                      gratuitoSinLimite: checked as boolean,
                      gratuito: checked ? true : prev.gratuito,
                      precioGeneral: checked ? 0 : prev.precioGeneral,
                      ventaPresencialHabilitada: false,
                    }))}
                  />
                  <Label htmlFor="gratuitoSinLimite" className="font-normal">Sin límite de capacidad</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad *</Label>
                  <Input
                    id="capacidad"
                    name="capacidad"
                    type="number"
                    min="1"
                    value={formData.capacidad}
                    onChange={handleChange}
                    placeholder="500"
                    disabled={formData.gratuitoSinLimite}
                    required={!formData.gratuitoSinLimite}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limitePorUsuario">Límite por usuario</Label>
                  <Input
                    id="limitePorUsuario"
                    name="limitePorUsuario"
                    type="number"
                    min="1"
                    value={formData.limitePorUsuario}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!formData.entradaLiberada && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Tramos de Precio
          </Label>
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tieneTramos"
                name="tieneTramos"
                checked={formData.tieneTramos}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, tieneTramos: checked as boolean }))}
                disabled={formData.gratuito || formData.gratuitoSinLimite}
              />
              <Label htmlFor="tieneTramos" className="font-normal">Activar tramos de precio (promociones por tiempo o cantidad)</Label>
            </div>
            {(formData.gratuito || formData.gratuitoSinLimite) && (
              <p className="text-sm text-muted-foreground">No aplica: eventos gratuitos no tienen tramos.</p>
            )}

            {formData.tieneTramos && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Los tramos aplican a:</Label>
                  <select
                    name="tramosAplicanPor"
                    value={formData.tramosAplicanPor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                  >
                    <option value="evento">Todo el evento</option>
                    <option value="dia">Cada día</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {formData.tramos.map((tramo) => (
                    <div key={tramo.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Tramo</Label>
                        <Button type="button" variant="destructive" size="sm" onClick={() => eliminarTramo(tramo.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <select
                            value={tramo.tipo}
                            onChange={(e) => actualizarTramo(tramo.id, "tipo", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          >
                            {TIPOS_TRAMO.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                        {tramo.tipo === "cantidad" || tramo.tipo === "cantidad_fecha" ? (
                          <>
                            <div className="space-y-2">
                              <Label>Cantidad desde</Label>
                              <Input
                                type="number"
                                value={tramo.cantidadInicio}
                                onChange={(e) => actualizarTramo(tramo.id, "cantidadInicio", parseInt(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Cantidad hasta</Label>
                              <Input
                                type="number"
                                value={tramo.cantidadFin}
                                onChange={(e) => actualizarTramo(tramo.id, "cantidadFin", parseInt(e.target.value))}
                              />
                            </div>
                          </>
                        ) : null}
                        {tramo.tipo === "fecha" || tramo.tipo === "cantidad_fecha" ? (
                          <>
                            <div className="space-y-2">
                              <Label>Fecha desde</Label>
                              <Input
                                type="datetime-local"
                                value={tramo.fechaInicio}
                                onChange={(e) => actualizarTramo(tramo.id, "fechaInicio", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Fecha hasta</Label>
                              <Input
                                type="datetime-local"
                                value={tramo.fechaFin}
                                onChange={(e) => actualizarTramo(tramo.id, "fechaFin", e.target.value)}
                              />
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Precio (CLP)</Label>
                          <Input
                            type="number"
                            value={tramo.precio}
                            onChange={(e) => actualizarTramo(tramo.id, "precio", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            checked={tramo.activo}
                            onCheckedChange={(checked) => actualizarTramo(tramo.id, "activo", checked)}
                          />
                          <Label className="font-normal">Activo</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={agregarTramo} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Tramo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!formData.entradaLiberada && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Venta Online
          </Label>
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ventaOnlineHabilitada"
                name="ventaOnlineHabilitada"
                checked={formData.ventaOnlineHabilitada}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ventaOnlineHabilitada: checked as boolean }))}
              />
              <Label htmlFor="ventaOnlineHabilitada" className="font-normal">Habilitar venta online</Label>
            </div>

            {formData.ventaOnlineHabilitada && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Período de venta preconfigurado: desde hoy hasta el día del evento. Puedes ajustar las fechas y horas.
                </p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <DateRangeInput
                    label="Venta Online"
                    fromLabel="Inicio"
                    toLabel="Fin"
                    fromDate={formData.ventaOnlineFechaInicio}
                    toDate={formData.ventaOnlineFechaFin}
                    fromTime={formData.ventaOnlineHoraInicio}
                    toTime={formData.ventaOnlineHoraFin}
                    showTime={true}
                    minDate={esEdicion ? undefined : new Date().toISOString().split('T')[0]}
                    onFromDateChange={(value) => setFormData((prev) => ({ ...prev, ventaOnlineFechaInicio: value }))}
                    onToDateChange={(value) => setFormData((prev) => ({ ...prev, ventaOnlineFechaFin: value }))}
                    onFromTimeChange={(value) => setFormData((prev) => ({ ...prev, ventaOnlineHoraInicio: value }))}
                    onToTimeChange={(value) => setFormData((prev) => ({ ...prev, ventaOnlineHoraFin: value }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!formData.entradaLiberada && !formData.gratuito && !formData.gratuitoSinLimite && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Venta Presencial (Puerta)
          </Label>
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ventaPresencialHabilitada"
                name="ventaPresencialHabilitada"
                checked={formData.ventaPresencialHabilitada}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ventaPresencialHabilitada: checked as boolean }))}
              />
              <Label htmlFor="ventaPresencialHabilitada" className="font-normal">Habilitar venta presencial el día del evento</Label>
            </div>

            {formData.ventaPresencialHabilitada && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label>Inventario disponible</Label>
                  <Input
                    type="number"
                    name="ventaPresencialInventario"
                    value={formData.ventaPresencialInventario}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio puerta (CLP)</Label>
                  <Input
                    type="number"
                    name="ventaPresencialPrecio"
                    value={formData.ventaPresencialPrecio}
                    onChange={handleChange}
                    placeholder="20000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora inicio venta</Label>
                  <Input
                    type="time"
                    name="ventaPresencialHoraInicio"
                    value={formData.ventaPresencialHoraInicio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!formData.entradaLiberada && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tipo de Entrada
          </Label>
          <div className="grid grid-cols-1 gap-4 pt-2 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="entradaNominal"
                  name="entradaNominal"
                  checked={formData.entradaNominal}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, entradaNominal: checked as boolean }))}
                />
                <Label htmlFor="entradaNominal" className="font-normal">Entradas nominales (requiere nombre del asistente)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permiteTransferencia"
                  name="permiteTransferencia"
                  checked={formData.permiteTransferencia}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, permiteTransferencia: checked as boolean }))}
                />
                <Label htmlFor="permiteTransferencia" className="font-normal">Permitir transferencia de entradas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cambioNombreHabilitado"
                  name="cambioNombreHabilitado"
                  checked={formData.cambioNombreHabilitado}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, cambioNombreHabilitado: checked as boolean }))}
                />
                <Label htmlFor="cambioNombreHabilitado" className="font-normal">Permitir cambio de nombre</Label>
              </div>

              {formData.cambioNombreHabilitado && (
                <div className="space-y-2 pl-6">
                  <Label>Costo por cambio de nombre (CLP)</Label>
                  <Input
                    type="number"
                    name="cambioNombreCosto"
                    value={formData.cambioNombreCosto}
                    onChange={handleChange}
                    placeholder="0 = gratis"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!formData.entradaLiberada && !formData.gratuito && !formData.gratuitoSinLimite && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Códigos de Descuento
          </Label>
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agregarDescuento"
                checked={formData.codigosDescuento.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    agregarCodigoDescuento();
                  } else {
                    setFormData((prev) => ({ ...prev, codigosDescuento: [] }));
                  }
                }}
              />
              <Label htmlFor="agregarDescuento" className="font-normal">Habilitar códigos de descuento</Label>
            </div>

            {formData.codigosDescuento.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay códigos de descuento agregados</p>
            ) : (
              <div className="space-y-4">
                {formData.codigosDescuento.map((codigo) => (
                  <div key={codigo.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">Código de descuento</Label>
                      <Button type="button" variant="destructive" size="sm" onClick={() => eliminarCodigoDescuento(codigo.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Código</Label>
                        <Input
                          placeholder="DESCUENTO20"
                          value={codigo.codigo}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "codigo", e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <select
                          value={codigo.tipo}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "tipo", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                        >
                          <option value="porcentaje">Porcentaje (%)</option>
                          <option value="monto">Monto fijo (CLP)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Valor</Label>
                        <Input
                          type="number"
                          value={codigo.valor}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "valor", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Usos máximos (0 = ilimitado)</Label>
                        <Input
                          type="number"
                          value={codigo.usosMaximos}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "usosMaximos", parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha inicio validez</Label>
                        <Input
                          type="datetime-local"
                          value={codigo.fechaValidezInicio}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "fechaValidezInicio", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha fin validez</Label>
                        <Input
                          type="datetime-local"
                          value={codigo.fechaValidezFin}
                          onChange={(e) => actualizarCodigoDescuento(codigo.id, "fechaValidezFin", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button type="button" variant="outline" onClick={agregarCodigoDescuento} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Código de Descuento
            </Button>
          </div>
        </div>
      )}

      {!formData.entradaLiberada && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envío de Entradas
          </Label>
          <div className="grid grid-cols-1 gap-4 pt-2 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="envioAutomatico"
                  checked={formData.configEnvio.envioAutomatico}
                  onCheckedChange={(checked) => setFormData((prev) => ({
                    ...prev,
                    configEnvio: { ...prev.configEnvio, envioAutomatico: checked as boolean }
                  }))}
                />
                <Label className="font-normal">Enviar entradas automáticamente al comprar</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permitirReenvio"
                  checked={formData.configEnvio.permitirReenvio}
                  onCheckedChange={(checked) => setFormData((prev) => ({
                    ...prev,
                    configEnvio: { ...prev.configEnvio, permitirReenvio: checked as boolean }
                  }))}
                />
                <Label className="font-normal">Permitir reenvío de entradas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailAsistente"
                  checked={formData.configEnvio.emailAsistente}
                  onCheckedChange={(checked) => setFormData((prev) => ({
                    ...prev,
                    configEnvio: { ...prev.configEnvio, emailAsistente: checked as boolean }
                  }))}
                />
                <Label className="font-normal">Solicitar email del asistente (diferente al comprador)</Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {!formData.entradaLiberada && !formData.gratuitoSinLimite && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Espera
          </Label>
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="waitingListHabilitado"
                checked={formData.configWaitingList.habilitado}
                onCheckedChange={(checked) => setFormData((prev) => ({
                  ...prev,
                  configWaitingList: { ...prev.configWaitingList, habilitado: checked as boolean }
                }))}
              />
              <Label htmlFor="waitingListHabilitado" className="font-normal">Habilitar lista de espera</Label>
            </div>

            {formData.configWaitingList.habilitado && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waitingListPreVenta"
                    checked={formData.configWaitingList.preVenta}
                    onCheckedChange={(checked) => {
                      const isChecked = checked as boolean;
                      const today = new Date();
                      const todayStr = today.toISOString().split('T')[0];

                      const tomorrow = new Date(today);
                      tomorrow.setDate(today.getDate() + 1);
                      const tomorrowStr = tomorrow.toISOString().split('T')[0];

                      const dayAfterTomorrow = new Date(today);
                      dayAfterTomorrow.setDate(today.getDate() + 2);
                      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

                      if (isChecked) {
                        if (!ventaOnlineFechaInicioOriginal && formData.ventaOnlineFechaInicio) {
                          setVentaOnlineFechaInicioOriginal(formData.ventaOnlineFechaInicio);
                        }

                        let nuevaVentaOnline = dayAfterTomorrowStr;
                        if (formData.ventaOnlineFechaInicio) {
                          const ventaActual = new Date(formData.ventaOnlineFechaInicio + 'T00:00:00');
                          const preventaFin = new Date(tomorrowStr + 'T00:00:00');
                          if (ventaActual <= preventaFin) {
                            nuevaVentaOnline = dayAfterTomorrowStr;
                          } else {
                            nuevaVentaOnline = formData.ventaOnlineFechaInicio;
                          }
                        }

                        setFormData((prev) => ({
                          ...prev,
                          configWaitingList: {
                            ...prev.configWaitingList,
                            preVenta: true,
                            fechaInscripcionPreVentaInicio: prev.configWaitingList.fechaInscripcionPreVentaInicio || todayStr,
                            fechaInscripcionPreVentaFin: prev.configWaitingList.fechaInscripcionPreVentaFin || todayStr,
                            horaInscripcionPreVentaInicio: prev.configWaitingList.horaInscripcionPreVentaInicio || "00:00",
                            horaInscripcionPreVentaFin: prev.configWaitingList.horaInscripcionPreVentaFin || "23:59",
                            fechaInicioPreVenta: prev.configWaitingList.fechaInicioPreVenta || tomorrowStr,
                            fechaFinPreVenta: prev.configWaitingList.fechaFinPreVenta || tomorrowStr,
                            horaInicioPreVenta: prev.configWaitingList.horaInicioPreVenta || "00:00",
                            horaFinPreVenta: prev.configWaitingList.horaFinPreVenta || "23:59",
                          },
                          ventaOnlineFechaInicio: nuevaVentaOnline
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          configWaitingList: {
                            ...prev.configWaitingList,
                            preVenta: false,
                            fechaInscripcionPreVentaInicio: "",
                            fechaInscripcionPreVentaFin: "",
                            horaInscripcionPreVentaInicio: "",
                            horaInscripcionPreVentaFin: "",
                            fechaInicioPreVenta: "",
                            fechaFinPreVenta: "",
                            horaInicioPreVenta: "",
                            horaFinPreVenta: "",
                          },
                          ventaOnlineFechaInicio: ventaOnlineFechaInicioOriginal || prev.ventaOnlineFechaInicio
                        }));
                        setVentaOnlineFechaInicioOriginal("");
                      }
                    }}
                  />
                  <Label htmlFor="waitingListPreVenta" className="font-normal">Pre-venta (suscribirse antes de que abra la venta)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waitingListPostVenta"
                    checked={formData.configWaitingList.postVenta}
                    onCheckedChange={(checked) => setFormData((prev) => ({
                      ...prev,
                      configWaitingList: { ...prev.configWaitingList, postVenta: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="waitingListPostVenta" className="font-normal">Post-venta (suscribirse cuando se agoten las entradas)</Label>
                </div>

                {formData.configWaitingList.preVenta && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="font-semibold">Configuración de Pre-venta</Label>

                    <div className="space-y-2">
                      <Label>Máximo suscriptores (0 = ilimitado)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.configWaitingList.maxSuscritosPreVenta}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          configWaitingList: { ...prev.configWaitingList, maxSuscritosPreVenta: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="precioPreVentaHabilitado"
                        checked={!!formData.configWaitingList.precioPreVenta && formData.configWaitingList.precioPreVenta > 0}
                        onCheckedChange={(checked) => setFormData((prev) => ({
                          ...prev,
                          configWaitingList: {
                            ...prev.configWaitingList,
                            precioPreVenta: checked ? (prev.configWaitingList.precioPreVenta || 1000) : 0
                          }
                        }))}
                      />
                      <Label htmlFor="precioPreVentaHabilitado" className="font-normal">Usar precio diferenciado para pre-venta</Label>
                    </div>

                    {formData.configWaitingList.precioPreVenta > 0 && (
                      <div className="space-y-1">
                        <Label className="text-sm">Precio pre-venta ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.configWaitingList.precioPreVenta}
                          onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            configWaitingList: { ...prev.configWaitingList, precioPreVenta: parseInt(e.target.value) || 0 }
                          }))}
                          placeholder="0"
                        />
                      </div>
                    )}

                    <Label className="text-sm font-medium">Fechas de Pre-venta</Label>

                    <DateRangeInput
                      label="Período de Inscripción"
                      fromLabel="Desde"
                      toLabel="Hasta"
                      fromDate={formData.configWaitingList.fechaInscripcionPreVentaInicio}
                      toDate={formData.configWaitingList.fechaInscripcionPreVentaFin}
                      fromTime={formData.configWaitingList.horaInscripcionPreVentaInicio}
                      toTime={formData.configWaitingList.horaInscripcionPreVentaFin}
                      showTime={true}
                      fromPlaceholder="Fecha inicio"
                      toPlaceholder="Fecha fin"
                      minDate={esEdicion ? undefined : new Date().toISOString().split('T')[0]}
                      onFromDateChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, fechaInscripcionPreVentaInicio: value }
                      }))}
                      onToDateChange={(value) => setFormData((prev) => {
                        const fechaFinWL = new Date(value + 'T00:00:00');
                        let nuevaFechaVenta = prev.ventaOnlineFechaInicio;

                        if (prev.ventaOnlineFechaInicio) {
                          const fechaVenta = new Date(prev.ventaOnlineFechaInicio + 'T00:00:00');
                          const preventaFin = new Date(fechaFinWL);
                          preventaFin.setDate(preventaFin.getDate() + 1);
                          if (fechaVenta <= preventaFin) {
                            nuevaFechaVenta = preventaFin.toISOString().split('T')[0];
                          }
                        }

                        return {
                          ...prev,
                          configWaitingList: {
                            ...prev.configWaitingList,
                            fechaInscripcionPreVentaFin: value,
                            fechaInicioPreVenta: prev.configWaitingList.fechaInicioPreVenta || nuevaFechaVenta,
                            fechaFinPreVenta: prev.configWaitingList.fechaFinPreVenta || nuevaFechaVenta
                          },
                          ventaOnlineFechaInicio: nuevaFechaVenta
                        };
                      })}
                      onFromTimeChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, horaInscripcionPreVentaInicio: value }
                      }))}
                      onToTimeChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, horaInscripcionPreVentaFin: value }
                      }))}
                    />

                    <DateRangeInput
                      label="Período de Compra Anticipada"
                      fromLabel="Desde"
                      toLabel="Hasta"
                      fromDate={formData.configWaitingList.fechaInicioPreVenta}
                      toDate={formData.configWaitingList.fechaFinPreVenta}
                      fromTime={formData.configWaitingList.horaInicioPreVenta}
                      toTime={formData.configWaitingList.horaFinPreVenta}
                      showTime={true}
                      fromPlaceholder="Fecha inicio"
                      toPlaceholder="Fecha fin"
                      minDate={formData.configWaitingList.fechaInscripcionPreVentaFin || (esEdicion ? undefined : new Date().toISOString().split('T')[0])}
                      onFromDateChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, fechaInicioPreVenta: value }
                      }))}
                      onToDateChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, fechaFinPreVenta: value }
                      }))}
                      onFromTimeChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, horaInicioPreVenta: value }
                      }))}
                      onToTimeChange={(value) => setFormData((prev) => ({
                        ...prev,
                        configWaitingList: { ...prev.configWaitingList, horaFinPreVenta: value }
                      }))}
                    />

                    {formData.configWaitingList.fechaInscripcionPreVentaFin && formData.configWaitingList.fechaInicioPreVenta &&
                      formData.configWaitingList.fechaInscripcionPreVentaFin > formData.configWaitingList.fechaInicioPreVenta && (
                        <p className="text-sm text-red-500">La inscripción debe terminar antes de la compra anticipada</p>
                      )}

                    {formData.configWaitingList.fechaFinPreVenta && formData.ventaOnlineFechaInicio &&
                      new Date(formData.configWaitingList.fechaFinPreVenta) >= new Date(formData.ventaOnlineFechaInicio) && (
                        <p className="text-sm text-orange-500">La preventa puede solaparse con la venta normal (las entradas no vendidas se liberarán)</p>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {formData.fecha && formData.ventaOnlineFechaInicio && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
          <CalendarioEventoConfiguracion
            data={{
              fechaEvento: formData.fecha,
              preventa: formData.configWaitingList.preVenta ? {
                inscripcionInicio: formData.configWaitingList.fechaInscripcionPreVentaInicio,
                inscripcionFin: formData.configWaitingList.fechaInscripcionPreVentaFin,
                horaInscripcionInicio: formData.configWaitingList.horaInscripcionPreVentaInicio,
                horaInscripcionFin: formData.configWaitingList.horaInscripcionPreVentaFin,
                compraInicio: formData.configWaitingList.fechaInicioPreVenta,
                compraFin: formData.configWaitingList.fechaFinPreVenta,
                horaCompraInicio: formData.configWaitingList.horaInicioPreVenta,
                horaCompraFin: formData.configWaitingList.horaFinPreVenta,
              } : undefined,
              ventaOnline: {
                inicio: formData.ventaOnlineFechaInicio,
                fin: formData.ventaOnlineFechaFin,
                horaInicio: formData.ventaOnlineHoraInicio,
                horaFin: formData.ventaOnlineHoraFin,
              },
            }}
            onUpdate={(field, value) => {
              const configKey = field as keyof typeof formData.configWaitingList;
              setFormData((prev) => ({
                ...prev,
                configWaitingList: {
                  ...prev.configWaitingList,
                  [configKey]: value,
                },
              }));
            }}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => handleSubmit(undefined, "borrador")}
          className="flex-1"
        >
          {esEdicion ? 'Guardar Cambios' : 'Guardar como Borrador'}
        </Button>
        <Button
          type="button"
          disabled={loading}
          className="flex-1"
          onClick={() => handleSubmit(undefined, "publicado")}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (esEdicion ? 'Actualizar Evento' : 'Publicar Evento')}
        </Button>
      </div>
    </form>
  );
}
