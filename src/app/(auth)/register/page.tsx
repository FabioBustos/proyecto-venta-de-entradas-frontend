"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Ticket,
  Loader2,
  Check,
  X,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const returnUrl = searchParams.get('returnUrl') || '';

  useEffect(() => {
    // Guardar returnUrl de inmediato al cargar
    const params = new URLSearchParams(window.location.search);
    const url = params.get('returnUrl');
    if (url) {
      localStorage.setItem('returnUrl', url);
      console.log('✅ Guardado returnUrl en localStorage:', url);
    }
  }, []);

  // Password strength checker
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-destructive";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email valido";
    }

    if (!formData.password) {
      newErrors.password = "La contrasena es requerida";
    } else if (passwordStrength < 3) {
      newErrors.password = "La contrasena es muy debil";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contrasena";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contrasenas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los terminos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la cuenta');
      }

      if (data.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }

      setAuth(data.user, data.token);
      
      if (returnUrl) {
        router.push(returnUrl);
      } else if (data.user.rol === 'productor') {
        router.push('/productor/dashboard');
      } else if (data.user.rol === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/eventos');
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Error al crear la cuenta' });
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCheck = ({
    passed,
    label,
  }: {
    passed: boolean;
    label: string;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={passed ? "text-green-500" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );

  return (
    <>
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
          <Ticket className="h-6 w-6 text-background" />
        </div>
        <span className="text-xl font-bold">EventosApp</span>
      </Link>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Crea tu cuenta</h1>
        <p className="mt-2 text-muted-foreground">
          Unete a miles de usuarios que disfrutan eventos increibles
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Juan Perez"
              className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Contrasena</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Crea una contrasena segura"
              className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password strength */}
          {formData.password && (
            <div className="space-y-3 pt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordStrength
                        ? getPasswordStrengthColor()
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <PasswordCheck
                  passed={passwordChecks.length}
                  label="8+ caracteres"
                />
                <PasswordCheck
                  passed={passwordChecks.uppercase}
                  label="Una mayuscula"
                />
                <PasswordCheck
                  passed={passwordChecks.lowercase}
                  label="Una minuscula"
                />
                <PasswordCheck passed={passwordChecks.number} label="Un numero" />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contrasena"
              className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptTerms: checked as boolean })
              }
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
              Acepto los{" "}
              <Link href="/terminos" className="text-foreground underline hover:no-underline">
                terminos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="text-foreground underline hover:no-underline">
                politica de privacidad
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={formData.acceptMarketing}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptMarketing: checked as boolean })
              }
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label htmlFor="marketing" className="text-sm font-normal leading-tight cursor-pointer">
              Quiero recibir ofertas exclusivas y novedades por email
            </Label>
          </div>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errors.submit}
          </div>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>

        {/* Google login */}
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          disabled={isLoading}
          onClick={() => {
            const url = searchParams.get('returnUrl') || '';
            // Guardar en cookie para que persista
            document.cookie = `returnUrl=${encodeURIComponent(url)}; path=/; max-age=3600`;
            const googleUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'}/auth/google`;
            window.location.href = googleUrl;
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Registrate con Google
        </Button>

      </form>

      {/* Login link */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Inicia sesion
        </Link>
      </p>
    </>
  );
}

function RegisterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
