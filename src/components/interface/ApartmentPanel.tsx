'use client';

import React from 'react';
import { Apartment } from '@/types/property';
import { TOWERS } from '@/data/development';
import {
  X,
  Compass,
  Maximize2,
  Calendar,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Bath,
  Sun,
  Layers,
} from 'lucide-react';

interface ApartmentPanelProps {
  apartment: Apartment | null;
  onClose: () => void;
  onViewFloorPlan: () => void;
  onViewGallery: () => void;
  onRequestVisit: () => void;
}

export function ApartmentPanel({
  apartment,
  onClose,
  onViewFloorPlan,
  onViewGallery,
  onRequestVisit,
}: ApartmentPanelProps) {
  if (!apartment) return null;

  const tower = TOWERS.find((t) => t.id === apartment.towerId);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] md:w-[460px] bg-[#0c0d12]/95 sm:bg-[#0c0d12]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 animate-slideInRight text-aurel-ivory overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-aurel-gold/15 border border-aurel-gold/30 flex items-center justify-center">
            <span className="font-serif text-lg font-bold text-aurel-gold">
              {tower?.code || 'A'}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif text-lg font-semibold text-white tracking-wide">
                Residence {apartment.unitNumber}
              </h2>
              {/* Availability pill */}
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                  apartment.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : apartment.status === 'reserved'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-stone-500/20 text-stone-400 border border-stone-500/40'
                }`}
              >
                {apartment.status}
              </span>
            </div>
            <p className="text-xs text-white/50">
              {tower?.name} • Floor {apartment.floorNumber}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        {/* PRICE & CONFIGURATION HERO */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/50 block">
                Indicative Valuation
              </span>
              <span className="font-mono text-2xl font-bold text-aurel-gold tracking-tight">
                {apartment.indicativePrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-white/50 block">
                Layout
              </span>
              <span className="font-serif text-base text-white font-medium">
                {apartment.type}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>*Illustrative demo pricing for project simulation</span>
            <span>All Taxes Applicable</span>
          </div>
        </div>

        {/* KEY ARCHITECTURAL METRICS */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
            <Maximize2 className="w-4 h-4 text-aurel-gold mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              Carpet Area
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              {apartment.carpetAreaSqFt} sq.ft.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
            <BedDouble className="w-4 h-4 text-aurel-gold mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              Bedrooms
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              {apartment.bedrooms} Suites
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center">
            <Bath className="w-4 h-4 text-aurel-gold mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              Bathrooms
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              {apartment.bathrooms} Baths
            </span>
          </div>
        </div>

        {/* ORIENTATION & VISTAS */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <Sun className="w-5 h-5 text-aurel-gold flex-shrink-0" />
          <div className="text-xs">
            <span className="text-white/40 block text-[10px] uppercase tracking-wider">
              Primary Aspect & Vistas
            </span>
            <span className="text-white/90 font-medium">{apartment.facing}</span>
          </div>
        </div>

        {/* VISUAL TOUR & FLOOR PLAN QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          {/* Floor Plan Button */}
          <button
            type="button"
            onClick={onViewFloorPlan}
            className="group relative flex flex-col items-start p-3.5 rounded-xl border border-white/10 hover:border-aurel-gold/60 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-aurel-gold/15 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4 text-aurel-gold" />
            </div>
            <span className="text-xs font-medium text-white group-hover:text-aurel-gold transition-colors">
              Floor Plan
            </span>
            <span className="text-[10px] text-white/50">2D Architectural CAD</span>
          </button>

          {/* Gallery Button */}
          <button
            type="button"
            onClick={onViewGallery}
            className="group relative flex flex-col items-start p-3.5 rounded-xl border border-white/10 hover:border-aurel-gold/60 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-aurel-gold/15 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4 text-aurel-gold" />
            </div>
            <span className="text-xs font-medium text-white group-hover:text-aurel-gold transition-colors">
              Visual Tour
            </span>
            <span className="text-[10px] text-white/50">4 High-Res Renders</span>
          </button>
        </div>

        {/* ARCHITECTURAL SPECIFICATIONS */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase tracking-widest text-aurel-gold font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Specifications & Finishes</span>
          </h3>

          <div className="space-y-2 text-xs divide-y divide-white/5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <div className="flex justify-between py-1.5">
              <span className="text-white/50">Flooring</span>
              <span className="text-white/90 text-right max-w-[220px]">
                {apartment.specs.flooring}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/50">Ceiling Height</span>
              <span className="text-white/90">{apartment.specs.ceilingHeight}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/50">Climate System</span>
              <span className="text-white/90 text-right max-w-[220px]">
                {apartment.specs.airConditioning}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/50">Home Automation</span>
              <span className="text-white/90 text-right max-w-[220px]">
                {apartment.specs.homeAutomation}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/50">Acoustic Glazing</span>
              <span className="text-white/90 text-right max-w-[220px]">
                {apartment.specs.glazing}
              </span>
            </div>
          </div>
        </div>

        {/* RESIDENCE HIGHLIGHTS */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-widest text-white/60 font-medium">
            Residence Highlights
          </h3>
          <ul className="space-y-1.5 text-xs text-white/70">
            {apartment.floorPlan.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-aurel-gold mt-0.5">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-white/10 bg-[#090a0d] flex items-center space-x-3">
        <button
          type="button"
          onClick={onRequestVisit}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-aurel-gold via-aurel-gold-light to-aurel-gold text-aurel-dark font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:shadow-aurel-gold/25 flex items-center justify-center space-x-2 font-semibold"
        >
          <Calendar className="w-4 h-4" />
          <span>Request Private Visit</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          title="Return to Building"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
