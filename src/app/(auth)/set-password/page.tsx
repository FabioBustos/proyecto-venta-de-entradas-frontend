"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import {
  Eye,
  EyeOff,
  Lock,
  Ticket,
  Loader2,
  Check,
  X,
} from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al establecer la contrasena');
      }

      setSuccess(true);

      setTimeout(() => {
        if (user?.rol === 'productor') {
          router.push('/productor/dashboard');
        } else {
          router.push('/eventos');
        }
      }, 2000);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Error al establecer la contrasena' });
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
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
              <Ticket className="h-6 w-6 text-background" />
            </div>
            <span className="text-xl font-bold">EventosApp</span>
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Establece tu contrasena</h1>
            <p className="mt-2 text-muted-foreground">
              Tu cuenta fue creada con Google. Ahora puedes crear una contrasena para acceder tambien con email.
            </p>
          </div>

          {success ? (
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Contrasena establecida!</h3>
              <p className="mt-1 text-sm text-green-700">
                Ahora puedes iniciar sesion con tu email y contrasena.
              </p>
              <p className="mt-3 text-xs text-green-600">Redirigiendo...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contrasena</Label>
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
                    Guardando contrasena...
                  </>
                ) : (
                  "Establecer contrasena"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Tambien puedes{" "}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="text-foreground underline hover:no-underline"
                >
                  volver al login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="mb-4 text-center text-3xl font-bold text-balance">
            Acceso flexible
          </h2>
          <p className="max-w-md text-center text-lg text-white/80 text-balance">
            Establece una contrasena y accede a tu cuenta como prefieras: con Google o con email.
          </p>
        </div>
      </div>
    </div>
  );
}
