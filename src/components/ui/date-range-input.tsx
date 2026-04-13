"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangeInputProps {
  label?: string;
  fromLabel?: string;
  toLabel?: string;
  fromDate: string;
  toDate: string;
  fromTime?: string;
  toTime?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onFromTimeChange?: (value: string) => void;
  onToTimeChange?: (value: string) => void;
  error?: string;
  showTime?: boolean;
  minDate?: string;
  maxDate?: string;
}

export function DateRangeInput({
  label,
  fromLabel = "Desde",
  toLabel = "Hasta",
  fromDate,
  toDate,
  fromTime,
  toTime,
  fromPlaceholder,
  toPlaceholder,
  onFromDateChange,
  onToDateChange,
  onFromTimeChange,
  onToTimeChange,
  error,
  showTime = false,
  minDate,
  maxDate,
}: DateRangeInputProps) {
  const hasError = fromDate && toDate && fromDate > toDate;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">{fromLabel}</Label>
          <div className="flex gap-1">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              placeholder={fromPlaceholder}
              min={minDate}
              max={maxDate}
              className="flex-1"
            />
            {showTime && fromTime !== undefined && onFromTimeChange && (
              <Input
                type="time"
                value={fromTime}
                onChange={(e) => onFromTimeChange(e.target.value)}
                className="w-20"
              />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{toLabel}</Label>
          <div className="flex gap-1">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              placeholder={toPlaceholder}
              min={fromDate || minDate}
              max={maxDate}
              className="flex-1"
            />
            {showTime && toTime !== undefined && onToTimeChange && (
              <Input
                type="time"
                value={toTime}
                onChange={(e) => onToTimeChange(e.target.value)}
                className="w-20"
              />
            )}
          </div>
        </div>
      </div>
      {(error || hasError) && (
        <p className="text-sm text-red-500">{error || "La fecha de fin debe ser mayor que la de inicio"}</p>
      )}
    </div>
  );
}