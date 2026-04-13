"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowLeft, Ticket } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, token: authToken } = useAuthStore();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);

  const handleCallback = useCallback(async (token: string, compraId: string | null) => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      console.log('📡 Calling confirmar-transaccion with:', { token, compraId });

      const response = await fetch(`${API_URL}/pagos/confirmar-transaccion`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ token, compraId }),
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);
      
      setResult(data);
    } catch (err) {
      console.error('❌ Error al confirmar:', err);
      setError("Error al confirmar la transacción");
    }
  }, [authToken]);

  useEffect(() => {
    if (!searchParams || mountedRef.current) return;
    
    const processPayment = async () => {
      const token_ws = searchParams.get("token_ws");
      const tbkToken = searchParams.get("TBK_TOKEN");
      const tbkOrdenCompra = searchParams.get("TBK_ORDEN_COMPRA");
      let compraId = searchParams.get("compraId");

      if (!compraId) {
        compraId = localStorage.getItem('webpay_compra_id');
      }

      console.log('🔍 Payment return params:', { token_ws, tbkToken, tbkOrdenCompra, compraId });

      if (tbkToken) {
        await handleCallback(tbkToken, compraId);
      } else if (token_ws) {
        await handleCallback(token_ws, compraId);
      } else if (tbkOrdenCompra) {
        mountedRef.current = true;
        setError("Tiempo de transacción agotado. Por favor intenta nuevamente.");
      }
    };

    processPayment();
  }, [searchParams, handleCallback]);

  // Show loading until we have a result OR error
  if (!result && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold">Verificando pago...</h2>
            <p className="text-muted-foreground mt-2">Por favor espera</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show final state - success or error (never intermediate)
  const isSuccess = result?.response_code === 0 || result?.status === 'AUTHORIZED';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {isSuccess ? (
            <>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">¡Pago exitoso!</h2>
              <p className="text-muted-foreground mt-2">
                Tu transacción ha sido procesada correctamente
              </p>
              {result && (
                <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                  <p className="text-sm"><strong>Orden:</strong> {result.buy_order}</p>
                  <p className="text-sm"><strong>Monto:</strong> ${result.amount?.toLocaleString('es-CL')}</p>
                  <p className="text-sm"><strong>Fecha:</strong> {new Date().toLocaleDateString('es-CL')}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Pago fallido</h2>
              <p className="text-muted-foreground mt-2">
                {error || result?.status_detail || "Hubo un problema con tu pago"}
              </p>
            </>
          )}

          <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={() => router.push('/eventos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a eventos
            </Button>
            {isAuthenticated && (
              <Button variant="outline" className="w-full" onClick={() => router.push('/mis-entradas')}>
                <Ticket className="mr-2 h-4 w-4" />
                Ver mis entradas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
