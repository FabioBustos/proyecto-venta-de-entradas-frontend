"use client";

import { useState } from "react";
import {
  Search,
  X,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventFiltersProps {
  totalEvents: number;
}

const categorias = [
  "Todos",
  "Música",
  "Tecnología",
  "Arte",
  "Deportes",
  "Gastronomía",
  "Teatro",
];

const ciudades = [
  { value: "todas", label: "Todas las ciudades" },
  { value: "cdmx", label: "Ciudad de México" },
  { value: "monterrey", label: "Monterrey" },
  { value: "guadalajara", label: "Guadalajara" },
  { value: "puebla", label: "Puebla" },
  { value: "tijuana", label: "Tijuana" },
];

const fechaOpciones = [
  { value: "todas", label: "Cualquier fecha" },
  { value: "hoy", label: "Hoy" },
  { value: "manana", label: "Mañana" },
  { value: "esta-semana", label: "Esta semana" },
  { value: "este-mes", label: "Este mes" },
  { value: "proximo-mes", label: "Próximo mes" },
];

export function EventFilters({ totalEvents }: EventFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedCity, setSelectedCity] = useState("todas");
  const [selectedFecha, setSelectedFecha] = useState("todas");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("fecha");
  const [showFilters, setShowFilters] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(true);

  const activeFiltersCount = [
    selectedCategory !== "todos",
    selectedCity !== "todas",
    selectedFecha !== "todas",
    priceRange[0] > 0 || priceRange[1] < 5000,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("todos");
    setSelectedCity("todas");
    setSelectedFecha("todas");
    setPriceRange([0, 5000]);
    setSortBy("fecha");
    setSearchQuery("");
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#e2e8f0]">
              Todos los eventos
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">
              {totalEvents} eventos disponibles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="search"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg text-sm text-[#e2e8f0] placeholder:text-[#94a3b8]/60 w-full sm:w-64 focus:outline-none focus:border-[#94a3b8]"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg text-sm text-[#e2e8f0] focus:outline-none focus:border-[#94a3b8]"
            >
              {ciudades.map((ciudad) => (
                <option key={ciudad.value} value={ciudad.value}>
                  {ciudad.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg text-sm text-[#e2e8f0] focus:outline-none focus:border-[#94a3b8]"
            >
              <option value="fecha">Fecha</option>
              <option value="precio-asc">Precio: Menor</option>
              <option value="precio-desc">Precio: Mayor</option>
              <option value="popularidad">Popularidad</option>
            </select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-[#3f444c] text-[#e2e8f0] hover:bg-[#24282e]"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-[#e2e8f0] text-zinc-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-[#1a1d21] border border-[#3f444c]/30 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3f444c]/30">
              <h3 className="font-semibold text-[#e2e8f0]">Filtros avanzados</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4 text-[#94a3b8]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#e2e8f0]">Rango de precio</span>
                  </div>
                  {isPriceOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                  )}
                </button>
                {isPriceOpen && (
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94a3b8]">Min:</span>
                      <span className="text-sm text-[#e2e8f0] font-medium">
                        {formatPrice(priceRange[0])}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94a3b8]">Max:</span>
                      <span className="text-sm text-[#e2e8f0] font-medium">
                        {formatPrice(priceRange[1])}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Gratis", range: [0, 0] as [number, number] },
                        { label: "Hasta $500", range: [0, 500] as [number, number] },
                        { label: "$500 - $1,000", range: [500, 1000] as [number, number] },
                        { label: "$1,000 - $2,500", range: [1000, 2500] as [number, number] },
                        { label: "Más de $2,500", range: [2500, 5000] as [number, number] },
                      ].map((option) => (
                        <button
                          key={option.label}
                          onClick={() => setPriceRange(option.range)}
                          className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                            priceRange[0] === option.range[0] && priceRange[1] === option.range[1]
                              ? "bg-[#e2e8f0] text-zinc-900"
                              : "bg-[#24282e]/50 text-[#94a3b8] hover:bg-[#24282e]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#94a3b8]" />
                    <span className="text-sm font-medium text-[#e2e8f0]">Ubicación</span>
                  </div>
                  {isLocationOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                  )}
                </button>
                {isLocationOpen && (
                  <div className="pt-4">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#24282e]/50 border border-[#3f444c]/30 rounded-lg text-sm text-[#e2e8f0] focus:outline-none"
                    >
                      {ciudades.map((ciudad) => (
                        <option key={ciudad.value} value={ciudad.value}>
                          {ciudad.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4 text-[#94a3b8]" />
                  <span className="text-sm font-medium text-[#e2e8f0]">Fecha</span>
                </div>
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {fechaOpciones.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFecha(option.value)}
                      className={`px-2 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedFecha === option.value
                          ? "bg-[#e2e8f0] text-zinc-900"
                          : "bg-[#24282e]/50 text-[#94a3b8] hover:bg-[#24282e]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#3f444c]/30">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-[#3f444c] text-[#94a3b8] hover:bg-[#24282e] hover:text-[#e2e8f0]"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="bg-[#e2e8f0] text-zinc-900 hover:bg-[#cbd5e1]"
              >
                Aplicar filtros
                {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
              </Button>
            </div>
          </div>
        )}

        {activeFiltersCount > 0 && !showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#94a3b8]">Filtros activos:</span>
            {selectedCategory !== "todos" && (
              <button
                onClick={() => setSelectedCategory("todos")}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[#24282e]/50 text-[#e2e8f0] rounded-lg"
              >
                {selectedCategory}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedCity !== "todas" && (
              <button
                onClick={() => setSelectedCity("todas")}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[#24282e]/50 text-[#e2e8f0] rounded-lg"
              >
                {ciudades.find((c) => c.value === selectedCity)?.label}
                <X className="h-3 w-3" />
              </button>
            )}
            {selectedFecha !== "todas" && (
              <button
                onClick={() => setSelectedFecha("todas")}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-[#24282e]/50 text-[#e2e8f0] rounded-lg"
              >
                {fechaOpciones.find((f) => f.value === selectedFecha)?.label}
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-[#94a3b8] hover:text-[#e2e8f0] underline"
            >
              Limpiar todo
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === cat.toLowerCase()
                  ? "bg-[#e2e8f0] text-zinc-900 font-medium"
                  : "bg-[#24282e]/50 text-[#94a3b8] hover:bg-[#24282e] hover:text-[#e2e8f0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
