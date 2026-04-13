export interface Evento {
  _id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  precio: number;
  categoria: string;
  imagen?: string;
  capacidad: number;
  entradasVendidas: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosEventos {
  search?: string;
  categoria?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  precioMin?: number;
  precioMax?: number;
}

export interface Paginacion {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResponsePaginada<T> {
  data: T[];
  pagination: Paginacion;
}
