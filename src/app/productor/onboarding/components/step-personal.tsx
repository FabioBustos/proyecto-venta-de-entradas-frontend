"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  FileText,
  Phone,
  MapPin,
  Globe,
  User,
  Mail,
  ChevronDown,
} from "lucide-react";
import { OnboardingFormData } from "@/lib/onboarding-types";

const fieldBorder = (filled: boolean) =>
  filled ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500";

interface StepPersonalProps {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
  isValidRut: boolean;
  validPhone: boolean;
  canNext: boolean;
  missingFields: string[];
  filteredComunas: { comuna: string; region: string }[];
  showComunaDropdown: boolean;
  setShowComunaDropdown: (v: boolean) => void;
  comunaSearch: string;
  setComunaSearch: (v: string) => void;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
  formatRut: (v: string) => string;
  formatPhone: (v: string) => string;
  regiones: string[];
  onNext: () => void;
}

export function StepPersonal({
  formData,
  setFormData,
  isValidRut,
  validPhone,
  canNext,
  missingFields,
  filteredComunas,
  showComunaDropdown,
  setShowComunaDropdown,
  comunaSearch,
  setComunaSearch,
  dropdownRef,
  formatRut,
  formatPhone,
  regiones,
  onNext,
}: StepPersonalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Datos del Productor</h2>
        <p className="text-sm text-muted-foreground mt-1">Informacion basica sobre ti o tu organizacion</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Tipo de contribuyente *</Label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoContribuyente: "natural", nombreEmpresa: "" })}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                formData.tipoContribuyente === "natural"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Persona Natural</span>
              <span className="text-xs text-muted-foreground">RUT personal</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoContribuyente: "empresa" })}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                formData.tipoContribuyente === "empresa"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Empresa</span>
              <span className="text-xs text-muted-foreground">RUT empresa</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nombre"
                className={`pl-10 ${fieldBorder(!!formData.nombre)}`}
                placeholder="Juan"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="apellido">Apellido *</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="apellido"
                className={`pl-10 ${fieldBorder(!!formData.apellido)}`}
                placeholder="Perez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>
          </div>
        </div>

        {formData.tipoContribuyente === "empresa" && (
          <>
            <div>
              <Label htmlFor="nombreEmpresa">Nombre de la empresa *</Label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nombreEmpresa"
                  className={`pl-10 ${fieldBorder(!!formData.nombreEmpresa)}`}
                  placeholder="Eventos SA"
                  value={formData.nombreEmpresa}
                  onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="nombreFantasia">Nombre de fantasia</Label>
              <Input
                id="nombreFantasia"
                placeholder="Mi Evento"
                value={formData.nombreFantasia}
                onChange={(e) => setFormData({ ...formData, nombreFantasia: e.target.value })}
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="rut">RUT *</Label>
          <div className="relative mt-1">
            <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="rut"
              className={`pl-10 ${fieldBorder(isValidRut)}`}
              placeholder={formData.tipoContribuyente === "empresa" ? "76.123.456-7" : "12.345.678-9"}
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: formatRut(e.target.value) })}
              maxLength={12}
            />
          </div>
          {formData.rut && !isValidRut && (
            <p className="mt-1 text-xs text-red-500">RUT invalido. Verifica el digito verificador</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Formato: XX.XXX.XXX-X</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className={`pl-10 ${fieldBorder(!!formData.email)}`}
                placeholder="correo@ejemplo.cl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="telefono">Telefono *</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="telefono"
                className={`pl-10 ${fieldBorder(validPhone)}`}
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: formatPhone(e.target.value) })}
                maxLength={17}
              />
            </div>
            {formData.telefono && !validPhone && (
              <p className="mt-1 text-xs text-red-500">El telefono debe tener al menos 9 digitos</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="region">Region *</Label>
          <select
            id="region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value, comuna: "" })}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${fieldBorder(!!formData.region)}`}
          >
            <option value="">Seleccionar region</option>
            {regiones.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {formData.region && (
          <div className="relative" ref={dropdownRef}>
            <Label htmlFor="comuna">Comuna *</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="comuna"
                className={`flex h-10 w-full rounded-md border bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${fieldBorder(!!formData.comuna)}`}
                placeholder="Buscar comuna..."
                value={formData.comuna || comunaSearch}
                onChange={(e) => {
                  setComunaSearch(e.target.value);
                  if (!formData.comuna) setFormData({ ...formData, comuna: "" });
                  setShowComunaDropdown(true);
                }}
                onFocus={() => setShowComunaDropdown(true)}
              />
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {showComunaDropdown && filteredComunas.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-popover p-1 shadow-md">
                {filteredComunas.map((c) => (
                  <button
                    key={c.comuna}
                    type="button"
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setFormData({ ...formData, comuna: c.comuna });
                      setShowComunaDropdown(false);
                      setComunaSearch("");
                    }}
                  >
                    {c.comuna}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="direccion">Direccion *</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="direccion"
              className={`pl-10 ${fieldBorder(!!formData.direccion)}`}
              placeholder="Av. Libertador 1234"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
          </div>
        </div>

        {formData.tipoContribuyente === "empresa" && (
          <div>
            <Label htmlFor="sitioWeb">Sitio web</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="sitioWeb"
                className="pl-10"
                placeholder="www.ejemplo.cl"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="descripcion">Descripcion</Label>
          <Textarea
            id="descripcion"
            placeholder={formData.tipoContribuyente === "empresa"
              ? "Describe brevemente tu empresa y tipo de eventos que organizas..."
              : "Describe brevemente tu experiencia organizando eventos..."
            }
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {!canNext && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Campos requeridos pendientes:</p>
          <ul className="mt-2 text-xs text-amber-700 list-disc list-inside">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onNext} disabled={!canNext} className="w-full">
        Siguiente
      </Button>
    </div>
  );
}
