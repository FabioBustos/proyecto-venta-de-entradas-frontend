"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-[150px] font-bold text-muted/20 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <Search className="h-10 w-10 text-destructive" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground max-w-md">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/eventos">
              <Search className="mr-2 h-4 w-4" />
              Explorar eventos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}