"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useEventFilters } from "@/lib/hooks";
import { COMUNAS_CHILE, REGIONES } from "@/lib/comunas-chile";
import type { EventFiltersValues, EventFiltersProps } from "@/types";

export type { EventFiltersValues, EventFiltersProps };

const categorias = [
  "Todos",
  "Musica",
  "Tecnologia",
  "Arte",
  "Deportes",
  "Gastronomia",
  "Teatro",
];

const fechaOpciones = [
  { value: "todas", label: "Cualquier fecha" },
  { value: "hoy", label: "Hoy" },
  { value: "manana", label: "Manana" },
  { value: "esta-semana", label: "Esta semana" },
  { value: "este-mes", label: "Este mes" },
  { value: "proximo-mes", label: "Proximo mes" },
];

export function EventFilters({ totalEvents, onFiltersChange, initialValues }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedComuna,
    selectedFecha,
    priceRange,
    sortBy,
    activeFiltersCount,
    isFiltersOpen,
    isPriceOpen,
    isLocationOpen,
    isDateOpen,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCity,
    setSelectedComuna,
    setSelectedFecha,
    setPriceRange,
    setSortBy,
    setIsFiltersOpen,
    setIsPriceOpen,
    setIsLocationOpen,
    setIsDateOpen,
    clearFilters,
    formatPrice,
  } = useEventFilters(initialValues);

  const [searchDraft, setSearchDraft] = useState(searchQuery);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchDraft(searchQuery);
  }, [searchQuery]);

  const regionesOptions = useMemo(() => {
    return ["todas", ...REGIONES.sort()];
  }, []);

  const comunasOptions = useMemo(() => {
    if (selectedCity === "todas") {
      const uniqueComunas = Array.from(new Set(COMUNAS_CHILE.map(c => c.comuna))).sort();
      return ["todas", ...uniqueComunas];
    }
    return [
      "todas",
      ...COMUNAS_CHILE
        .filter(c => c.region === selectedCity)
        .map(c => c.comuna)
        .sort(),
    ];
  }, [selectedCity]);

  const commitSearch = () => {
    setSearchQuery(searchDraft);
  };

  const handleSearchChange = (value: string) => {
    setSearchDraft(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 500);
  };

  const handleRegionChange = (region: string) => {
    setSelectedCity(region);
    if (region !== "todas") {
      setSelectedComuna("todas");
    }
  };

  useEffect(() => {
    onFiltersChange?.({
      searchQuery,
      selectedCategory,
      selectedCity,
      selectedComuna,
      selectedFecha,
      priceRange,
      sortBy,
    });
  }, [searchQuery, selectedCategory, selectedCity, selectedComuna, selectedFecha, priceRange, sortBy, onFiltersChange]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'todos') params.set('categoria', selectedCategory);
    if (selectedCity && selectedCity !== 'todas') params.set('ciudad', selectedCity);
    if (selectedComuna && selectedComuna !== 'todas') params.set('comuna', selectedComuna);
    if (selectedFecha && selectedFecha !== 'todas') params.set('fecha', selectedFecha);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy && sortBy !== 'fecha') params.set('sortBy', sortBy);
    if (priceRange[0] > 0) params.set('precioMin', priceRange[0].toString());
    if (priceRange[1] < 5000) params.set('precioMax', priceRange[1].toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '/eventos';
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, selectedCity, selectedComuna, selectedFecha, searchQuery, sortBy, priceRange, router]);

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Todos los eventos
            </h2>
            <p className="text-muted-foreground mt-1">
              {totalEvents} eventos disponibles
            </p>
          </div>

          {/* Desktop Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar eventos..."
                value={searchDraft}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitSearch(); }}
                className="pl-10 pr-10 w-full sm:w-64"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-9 w-9"
                onClick={commitSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Region Select */}
            <Select value={selectedCity} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-[180px]">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                {regionesOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === "todas" ? "Todas las regiones" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fecha">Fecha</SelectItem>
                <SelectItem value="precio-asc">Precio: Menor</SelectItem>
                <SelectItem value="precio-desc">Precio: Mayor</SelectItem>
                <SelectItem value="popularidad">Popularidad</SelectItem>
                <SelectItem value="disponibilidad">Disponibilidad</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros avanzados</SheetTitle>
                  <SheetDescription>
                    Refina tu busqueda con filtros especificos
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Price Range */}
                  <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Rango de precio</span>
                      </div>
                      {isPriceOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Label className="text-muted-foreground">Min:</Label>
                          <span className="font-medium">
                            {formatPrice(priceRange[0])}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-muted-foreground">Max:</Label>
                          <span className="font-medium">
                            {formatPrice(priceRange[1])}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Gratis", range: [0, 0] },
                          { label: "Hasta $500", range: [0, 500] },
                          { label: "$500 - $1,000", range: [500, 1000] },
                          { label: "$1,000 - $2,500", range: [1000, 2500] },
                          { label: "Mas de $2,500", range: [2500, 5000] },
                        ].map((option) => (
                          <Badge
                            key={option.label}
                            variant={
                              priceRange[0] === option.range[0] &&
                              priceRange[1] === option.range[1]
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() =>
                              setPriceRange(option.range as [number, number])
                            }
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Location */}
                  <Collapsible
                    open={isLocationOpen}
                    onOpenChange={setIsLocationOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Ubicacion</span>
                      </div>
                      {isLocationOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Región
                        </Label>
                        <Select
                          value={selectedCity}
                          onValueChange={handleRegionChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar región" />
                          </SelectTrigger>
                          <SelectContent>
                            {regionesOptions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region === "todas" ? "Todas las regiones" : region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Comuna
                        </Label>
                        <Select
                          value={selectedComuna}
                          onValueChange={setSelectedComuna}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar comuna" />
                          </SelectTrigger>
                          <SelectContent>
                            {comunasOptions.map((comuna) => (
                              <SelectItem key={comuna} value={comuna}>
                                {comuna === "todas" ? "Todas las comunas" : comuna}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Date */}
                  <Collapsible open={isDateOpen} onOpenChange={setIsDateOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Fecha</span>
                      </div>
                      {isDateOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        {fechaOpciones.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={option.value}
                              checked={selectedFecha === option.value}
                              onCheckedChange={() =>
                                setSelectedFecha(option.value)
                              }
                            />
                            <Label
                              htmlFor={option.value}
                              className="text-sm cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Category */}
                  <div className="space-y-3">
                    <Label className="font-medium">Categoria</Label>
                    <div className="flex flex-wrap gap-2">
                      {categorias.map((cat) => (
                        <Badge
                          key={cat}
                          variant={
                            selectedCategory === cat.toLowerCase()
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSelectedCategory(cat.toLowerCase())}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                  <Button className="flex-1" onClick={() => setIsFiltersOpen(false)}>
                    Aplicar filtros
                    {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Filtros activos:
            </span>
            {selectedCategory !== "todos" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory("todos")}
                />
              </Badge>
            )}
            {selectedCity !== "todas" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCity}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRegionChange("todas")}
                />
              </Badge>
            )}
            {selectedComuna !== "todas" && (
              <Badge variant="secondary" className="gap-1">
                {selectedComuna}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedComuna("todas")}
                />
              </Badge>
            )}
            {selectedFecha !== "todas" && (
              <Badge variant="secondary" className="gap-1">
                {fechaOpciones.find((f) => f.value === selectedFecha)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedFecha("todas")}
                />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
              <Badge variant="secondary" className="gap-1">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriceRange([0, 5000])}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <Badge
              key={cat}
              variant={
                selectedCategory === cat.toLowerCase() ? "default" : "outline"
              }
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCategory(cat.toLowerCase())}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
