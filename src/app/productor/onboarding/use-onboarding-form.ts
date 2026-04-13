"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { formatRut, validateRut } from "@/lib/rut-utils";
import { formatPhone, isValidPhone as checkValidPhone } from "@/lib/phone-utils";
import { COMUNAS_CHILE, REGIONES } from "@/lib/comunas-chile";
import { INITIAL_FORM_DATA, OnboardingFormData } from "@/lib/onboarding-types";

export type Step = "empresa" | "fiscal" | "bancario" | "enviado" | "pendiente";

export function useOnboardingForm() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [step, setStep] = useState<Step>("empresa");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [perfilExistente, setPerfilExistente] = useState<any>(null);
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [showComunaDropdown, setShowComunaDropdown] = useState(false);
  const [comunaSearch, setComunaSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowComunaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombre: user.nombre || prev.nombre,
        apellido: user.apellido || prev.apellido,
        email: user.email || prev.email,
      }));
    }

    const checkPerfil = async () => {
      try {
        const res = await fetch('/api/productor/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPerfilExistente(data);
            if (data.estadoVerificacion === "verificado") {
              router.push("/productor/dashboard");
            } else if (data.estadoVerificacion === "pendiente") {
              setStep("pendiente");
            } else if (data.estadoVerificacion === "rechazado") {
              setFormData({
                tipoContribuyente: data.tipoContribuyente || "",
                nombre: data.nombre || "",
                apellido: data.apellido || "",
                nombreEmpresa: data.nombreEmpresa || "",
                nombreFantasia: data.nombreFantasia || "",
                rut: data.rut || "",
                email: data.email || "",
                telefono: data.telefono || "",
                region: data.region || "",
                comuna: data.comuna || "",
                direccion: data.direccion || "",
                sitioWeb: data.sitioWeb || "",
                descripcion: data.descripcion || "",
                banco: data.datosBancarios?.banco || "",
                tipoCuenta: data.datosBancarios?.tipoCuenta || "",
                numeroCuenta: data.datosBancarios?.numeroCuenta || "",
                titularBanco: data.datosBancarios?.titular || "",
              });
              setStep("empresa");
            }
          }
        }
      } catch {
        // No profile exists, continue
      }
    };

    checkPerfil();
  }, [isAuthenticated, token, router, user, authLoading]);

  const isValidRut = validateRut(formData.rut);
  const validPhone = checkValidPhone(formData.telefono);

  const filteredComunas = formData.region
    ? COMUNAS_CHILE.filter(
        (c) =>
          c.region === formData.region &&
          c.comuna.toLowerCase().includes(comunaSearch.toLowerCase())
      )
    : [];

  const canNextEmpresa = Boolean(
    formData.tipoContribuyente &&
    formData.nombre &&
    formData.apellido &&
    isValidRut &&
    formData.email &&
    validPhone &&
    formData.region &&
    formData.comuna &&
    formData.direccion &&
    (formData.tipoContribuyente === "empresa" ? formData.nombreEmpresa : true)
  );

  const canSubmit = Boolean(formData.banco && formData.tipoCuenta && formData.numeroCuenta && formData.titularBanco);

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formData.tipoContribuyente) missing.push("Tipo de contribuyente");
    if (!formData.nombre) missing.push("Nombre");
    if (!formData.apellido) missing.push("Apellido");
    if (formData.tipoContribuyente === "empresa" && !formData.nombreEmpresa) missing.push("Nombre de la empresa");
    if (!isValidRut) missing.push("RUT valido");
    if (!formData.email) missing.push("Email");
    if (!validPhone) missing.push("Telefono de contacto");
    if (!formData.region) missing.push("Region");
    if (!formData.comuna) missing.push("Comuna");
    if (!formData.direccion) missing.push("Direccion");
    return missing;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const body: any = {
        tipoContribuyente: formData.tipoContribuyente,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono,
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion,
      };

      if (formData.tipoContribuyente === "empresa" && formData.nombreEmpresa) {
        body.nombreEmpresa = formData.nombreEmpresa;
        if (formData.nombreFantasia) body.nombreFantasia = formData.nombreFantasia;
        if (formData.sitioWeb) body.sitioWeb = formData.sitioWeb;
      }
      if (formData.descripcion) body.descripcion = formData.descripcion;
      if (formData.banco) {
        body.banco = formData.banco;
        body.tipoCuenta = formData.tipoCuenta;
        body.numeroCuenta = formData.numeroCuenta;
        body.titularBanco = formData.titularBanco;
      }

      const response = await fetch('/api/productor/perfil', {
        method: perfilExistente ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Error al enviar el formulario");
      }
      setStep("enviado");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    router,
    authLoading,
    isAuthenticated,
    step,
    setStep,
    isLoading,
    error,
    setError,
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
  };
}
