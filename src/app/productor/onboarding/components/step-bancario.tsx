"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, CreditCard, Loader2 } from "lucide-react";
import { OnboardingFormData } from "@/lib/onboarding-types";

const fieldBorder = (filled: boolean) =>
  filled ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500";

interface StepBancarioProps {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
  canSubmit: boolean;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepBancario({
  formData,
  setFormData,
  canSubmit,
  isLoading,
  onBack,
  onSubmit,
}: StepBancarioProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Datos Bancarios</h2>
        <p className="text-sm text-muted-foreground mt-1">Para recibir los pagos de las entradas vendidas</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="banco">Banco *</Label>
          <div className="relative mt-1">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="banco"
              className={`pl-10 ${fieldBorder(!!formData.banco)}`}
              placeholder="Banco de Chile"
              value={formData.banco}
              onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Tipo de cuenta *</Label>
          <div className="grid grid-cols-3 gap-3 mt-1">
            {["Cuenta Corriente", "Cuenta Vista", "Cuenta de Ahorro"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFormData({ ...formData, tipoCuenta: tipo })}
                className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                  formData.tipoCuenta === tipo
                    ? "border-green-500"
                    : formData.tipoCuenta
                    ? "border-gray-300"
                    : "border-gray-400"
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="numeroCuenta">Numero de cuenta *</Label>
          <div className="relative mt-1">
            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="numeroCuenta"
              className={`pl-10 ${fieldBorder(!!formData.numeroCuenta)}`}
              placeholder="1234567890"
              value={formData.numeroCuenta}
              onChange={(e) => setFormData({ ...formData, numeroCuenta: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="titularBanco">Titular de la cuenta *</Label>
          <Input
            id="titularBanco"
            className={fieldBorder(!!formData.titularBanco)}
            placeholder="Nombre completo del titular"
            value={formData.titularBanco}
            onChange={(e) => setFormData({ ...formData, titularBanco: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-accent/50 p-4">
        <p className="text-sm text-foreground">
          <strong>Importante:</strong> Los datos bancarios se utilizan exclusivamente para depositar las ganancias de tus eventos.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Atras
        </Button>
        <Button onClick={onSubmit} disabled={!canSubmit || isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
      </div>
    </div>
  );
}
