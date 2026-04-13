"use client"

import { useState, memo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Evento, EventCardProps } from "@/types"

export type { EventCardProps }

const placeholderImages = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80",
]

function getPlaceholderImage(id: string): string {
  const index = id.charCodeAt(0) % placeholderImages.length
  return placeholderImages[index]
}

export const EventCard = memo(function EventCard({ evento, className, onComprar }: EventCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const fechaObj = new Date(evento.fecha || '')
  
  const dia = fechaObj.getDate()
  const mes = fechaObj.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()

const entradasDisponibles = (evento.capacidad || 0) - evento.entradasVendidas
const porcentajeVendidos = (evento.capacidad || 0) > 0
? (evento.entradasVendidas / (evento.capacidad || 1)) * 100
    : 0

  const estaAgotado = entradasDisponibles <= 0

const imageUrl = evento.imagenUrl && !imgError
? evento.imagenUrl
: getPlaceholderImage(evento._id)

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-zinc-900",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onComprar?.(evento)}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={imageUrl}
          alt={evento.nombre}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHovered && "scale-110"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          onError={() => setImgError(true)}
          unoptimized
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-0 top-0 p-3">
          <div className="flex flex-col items-center rounded-lg bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
            <span className="text-lg font-black text-zinc-900 leading-none">{dia}</span>
            <span className="text-[10px] font-bold text-zinc-600 leading-none">{mes}</span>
          </div>
        </div>

        {!evento.activo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white">
              Finalizado
            </span>
          </div>
        )}

        {estaAgotado && evento.activo && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <span className="mb-2 inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {evento.categoria}
        </span>

        <h3 className="mb-1 line-clamp-1 text-base font-bold text-zinc-900 dark:text-white">
          {evento.nombre}
        </h3>

        <div className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <svg width="12" height="12" className="shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{evento.espacio || 'TBD'}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
<p className="text-xs text-zinc-400 line-through">
${Math.round((evento.precio || 0) * 1.2)}
</p>
<p className="text-xl font-extrabold text-zinc-900 dark:text-white">
${evento.precio || 0}
</p>
          </div>

          <button
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              estaAgotado || !evento.activo
                ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            )}
            disabled={estaAgotado || !evento.activo}
          >
            {estaAgotado ? "Agotado" : "Comprar"}
          </button>
        </div>
      </div>
    </div>
  )
})
