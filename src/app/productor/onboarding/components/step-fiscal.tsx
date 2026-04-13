"use client";

import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/lib/onboarding-types";

interface StepFiscalProps {
  formData: OnboardingFormData;
  onBack: () => void;
  onNext: () => void;
}

export function StepFiscal({ formData, onBack, onNext }: StepFiscalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Datos Fiscales</h2>
        <p className="text-sm text-muted-foreground mt-1">Resumen de la informacion fiscal ingresada</p>
      </div>

      <div className="rounded-lg border bg-accent/50 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tipo:</span>
          <span className="font-medium text-foreground capitalize">
            {formData.tipoContribuyente === "empresa" ? "Empresa" : "Persona Natural"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Nombre:</span>
          <span className="font-medium text-foreground">{formData.nombre} {formData.apellido}</span>
        </div>
        {formData.tipoContribuyente === "empresa" && formData.nombreEmpresa && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Empresa:</span>
            <span className="font-medium text-foreground">{formData.nombreEmpresa}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">RUT:</span>
          <span className="font-medium text-foreground">{formData.rut}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium text-foreground">{formData.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Telefono:</span>
          <span className="font-medium text-foreground">{formData.telefono}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Region:</span>
          <span className="font-medium text-foreground">{formData.region}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Comuna:</span>
          <span className="font-medium text-foreground">{formData.comuna}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Direccion:</span>
          <span className="font-medium text-foreground">{formData.direccion}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Atras
        </Button>
        <Button onClick={onNext} className="flex-1">
          Siguiente
        </Button>
      </div>
    </div>
  );
}
