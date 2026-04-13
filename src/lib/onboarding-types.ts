export type TipoContribuyente = "empresa" | "natural" | "";

export interface OnboardingFormData {
  tipoContribuyente: TipoContribuyente;
  nombre: string;
  apellido: string;
  nombreEmpresa: string;
  nombreFantasia: string;
  rut: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
  direccion: string;
  sitioWeb: string;
  descripcion: string;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titularBanco: string;
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
  tipoContribuyente: "",
  nombre: "",
  apellido: "",
  nombreEmpresa: "",
  nombreFantasia: "",
  rut: "",
  email: "",
  telefono: "",
  region: "",
  comuna: "",
  direccion: "",
  sitioWeb: "",
  descripcion: "",
  banco: "",
  tipoCuenta: "",
  numeroCuenta: "",
  titularBanco: "",
};
