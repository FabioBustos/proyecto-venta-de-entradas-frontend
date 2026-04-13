"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('🔍 GoogleCallback rendered, searchParams:', searchParams?.toString());

  const handleCallback = useCallback(() => {
    if (!searchParams) {
      console.log('⏳ searchParams es null, saliendo');
      return;
    }

    const token = searchParams.get("token");
    const userJson = searchParams.get("user");
    const returnUrlParam = searchParams.get("returnUrl");
    const returnUrlStorage = localStorage.getItem('returnUrl');
    
    const returnUrl = returnUrlParam || returnUrlStorage;
    
    console.log('🔍 Token:', !!token, 'User:', !!userJson, 'returnUrl:', returnUrl);

    if (!token || !userJson) {
      console.log('❌ Faltan datos');
      setError("Faltan datos");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userJson));
      console.log('🔍 User parseado:', user);
      setAuth(user, token);
      
      if (user.metodoRegistro === 'google') {
        const password = user.password || '';
        const isGoogleDefaultPassword = password.startsWith('google-oauth-');
        
        if (isGoogleDefaultPassword) {
          console.log('🔑 Cuenta nueva de Google, redirigiendo a set-password');
          setIsRedirecting(true);
          router.push('/set-password');
          return;
        }
      }
      
      if (returnUrl) {
        console.log('➡️ Redirigiendo a:', returnUrl);
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else if (user.rol === 'productor') {
        router.push('/productor/dashboard');
      } else if (user.rol === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/eventos');
      }
    } catch (e) {
      console.error("❌ Error:", e);
      setError("Error al procesar datos");
    }
  }, [searchParams, setAuth, router]);

  useEffect(() => {
    console.log('🔍 useEffect ejecutado');
    handleCallback();
  }, [handleCallback]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <a href="/login" className="mt-4 text-blue-500 underline">Volver</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Iniciando sesión...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
