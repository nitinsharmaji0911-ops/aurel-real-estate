'use client';

import React from 'react';
import { Apartment, TowerId } from '@/types/property';
import { getApartmentsForFloor } from '@/data/apartments';
import { TOWERS } from '@/data/development';
import { Home, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface ApartmentSelectorProps {
  towerId: TowerId;
  floorNumber: number;
  selectedApartmentId: string | null;
  onSelectApartment: (apartment: Apartment) => void;
}

export function ApartmentSelector({
  towerId,
  floorNumber,
  selectedApartmentId,
  onSelectApartment,
}: ApartmentSelectorProps) {
  const tower = TOWERS.find((t) => t.id === towerId);
  const apartments = getApartmentsForFloor(towerId, floorNumber);

  if (!tower || apartments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 max-w-full">
      {/* Floor Context Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-aurel-ivory/80">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-aurel-gold font-medium">
            {tower.name}
          </span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-white/90">Floor {floorNumber} Residences</span>
        </div>
        <span className="text-[11px] text-white/50">
          {apartments.filter((a) => a.status === 'available').length} of {apartments.length} Available
        </span>
      </div>

      {/* Horizontal Scrollable Units Cards */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar max-w-[85vw] sm:max-w-2xl">
        {apartments.map((apt) => {
          const isSelected = selectedApartmentId === apt.id;
          const isSold = apt.status === 'sold';
          const isReserved = apt.status === 'reserved';

          return (
            <button
              key={apt.id}
              type="button"
              onClick={() => onSelectApartment(apt)}
              className={`group flex-shrink-0 flex flex-col p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 text-left min-w-[160px] sm:min-w-[175px] select-none ${
                isSelected
                  ? 'bg-aurel-card border-aurel-gold ring-1 ring-aurel-gold/60 shadow-xl shadow-aurel-gold/10 -translate-y-0.5'
                  : 'bg-black/75 hover:bg-black/90 border-white/10 hover:border-aurel-gold/40'
              }`}
            >
              {/* Unit Header & Status Badge */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono text-xs font-bold text-aurel-ivory group-hover:text-aurel-gold transition-colors">
                  Unit {apt.unitNumber}
                </span>

                <span
                  className={`flex items-center space-x-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-medium ${
                    apt.status === 'available'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : isReserved
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-stone-500/15 text-stone-400 border border-stone-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      apt.status === 'available'
                        ? 'bg-emerald-400'
                        : isReserved
                        ? 'bg-amber-400'
                        : 'bg-stone-400'
                    }`}
                  />
                  <span>{apt.status}</span>
                </span>
              </div>

              {/* Configuration & Area */}
              <div className="text-xs text-white/90 font-medium mb-1">
                {apt.type}
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                <span>{apt.carpetAreaSqFt} sq.ft. carpet</span>
                <span>{apt.bedrooms} Bed • {apt.bathrooms} Bath</span>
              </div>

              {/* Indicative Price */}
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-aurel-gold">
                  {apt.indicativePrice}
                </span>
                <span className="text-[9px] text-white/40 group-hover:text-aurel-gold transition-colors">
                  View →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
