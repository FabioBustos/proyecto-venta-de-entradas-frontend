"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  ArrowLeft,
  Ticket,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useOnboardingForm } from "./use-onboarding-form";
import { StepPersonal } from "./components/step-personal";
import { StepFiscal } from "./components/step-fiscal";
import { StepBancario } from "./components/step-bancario";

function StatusVerificado() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Perfil de Productor</h1>
        <p className="mt-2 text-muted-foreground">
          Tu perfil esta verificado. Ya puedes crear y gestionar eventos.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button onClick={() => router.push("/productor/dashboard")} className="w-full">
            Ir al Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/eventos")} className="w-full">
            Ver Eventos
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusPendiente() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
          <AlertCircle className="h-10 w-10 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Perfil en Revision</h1>
        <p className="mt-2 text-muted-foreground">
          Tu perfil de productor esta siendo revisado. Te notificaremos cuando este verificado.
          Este proceso suele tardar entre 24 y 48 horas.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button variant="outline" onClick={() => router.push("/eventos")} className="w-full">
            Explorar Eventos
          </Button>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function OnboardingForm() {
  const {
    authLoading,
    isAuthenticated,
    step,
    setStep,
    isLoading,
    error,
    perfilExistente,
    formData,
    setFormData,
    showComunaDropdown,
    setShowComunaDropdown,
    comunaSearch,
    setComunaSearch,
    dropdownRef,
    isValidRut,
    validPhone,
    filteredComunas,
    canNextEmpresa,
    canSubmit,
    getMissingFields,
    handleSubmit,
    formatRut,
    formatPhone,
    REGIONES,
  } = useOnboardingForm();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (step === "enviado") return <StatusVerificado />;
  if (step === "pendiente") return <StatusPendiente />;

  const stepLabels = { empresa: "Empresa", fiscal: "Datos fiscales", bancario: "Datos bancarios" };
  const stepNumber = step === "empresa" ? 1 : step === "fiscal" ? 2 : 3;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Ticket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Registro de Productor</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Paso {stepNumber} de 3</span>
            <span>{stepLabels[step]}</span>
          </div>
          <div className="flex gap-2">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step === "empresa" || step === "fiscal" ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step === "fiscal" ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors bg-muted`} />
          </div>
        </div>

        {perfilExistente?.estadoVerificacion === "rechazado" && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Perfil rechazado</p>
                <p className="text-xs text-destructive/80 mt-1">
                  Motivo: {perfilExistente.motivoRechazo || "No especificado"}
                </p>
                <p className="text-xs text-destructive/70 mt-2">Corrige los datos y vuelve a enviar.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {step === "empresa" && (
          <StepPersonal
            formData={formData}
            setFormData={setFormData}
            isValidRut={isValidRut}
            validPhone={validPhone}
            canNext={canNextEmpresa}
            missingFields={getMissingFields()}
            filteredComunas={filteredComunas}
            showComunaDropdown={showComunaDropdown}
            setShowComunaDropdown={setShowComunaDropdown}
            comunaSearch={comunaSearch}
            setComunaSearch={setComunaSearch}
            dropdownRef={dropdownRef}
            formatRut={formatRut}
            formatPhone={formatPhone}
            regiones={REGIONES}
            onNext={() => setStep("fiscal")}
          />
        )}

        {step === "fiscal" && (
          <StepFiscal
            formData={formData}
            onBack={() => setStep("empresa")}
            onNext={() => setStep("bancario")}
          />
        )}

        {step === "bancario" && (
          <StepBancario
            formData={formData}
            setFormData={setFormData}
            canSubmit={canSubmit}
            isLoading={isLoading}
            onBack={() => setStep("fiscal")}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <OnboardingForm />;
}
