'use client';

import React from 'react';
import {
  RotateCcw,
  Calendar,
  ChevronRight,
  Compass,
  Building2,
  Layers,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { TowerId, ViewingMode, Apartment } from '@/types/property';
import { TOWERS } from '@/data/development';
import { TimeOfDay } from '@/lib/scene-config';

interface ProjectHeaderProps {
  viewingMode: ViewingMode;
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartment: Apartment | null;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  onResetView: () => void;
  onSelectOverview: () => void;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floor: number) => void;
  onOpenEnquiry: () => void;
}

export function ProjectHeader({
  viewingMode,
  selectedTowerId,
  selectedFloorNumber,
  selectedApartment,
  timeOfDay,
  onChangeTimeOfDay,
  onResetView,
  onSelectOverview,
  onSelectTower,
  onSelectFloor,
  onOpenEnquiry,
}: ProjectHeaderProps) {
  const selectedTower = TOWERS.find((t) => t.id === selectedTowerId);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* BRAND & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 pointer-events-auto">
        {/* Brand identity */}
        <div
          onClick={onSelectOverview}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-full border border-aurel-gold/40 bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-aurel-gold">
            <span className="font-serif text-lg tracking-wider text-aurel-gold">A</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-base tracking-[0.25em] text-aurel-ivory font-bold uppercase">
                AUREL
              </h1>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-aurel-gold/30 text-aurel-gold bg-aurel-gold/10">
                Residences
              </span>
            </div>
            <p className="text-[10px] tracking-wider text-aurel-ivory/50">
              Emerald Bay Waterfront Enclave
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Breadcrumbs */}
        <nav
          aria-label="Navigation trail"
          className="hidden sm:flex items-center space-x-2 text-xs bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5"
        >
          <button
            type="button"
            onClick={onSelectOverview}
            className={`transition-colors flex items-center space-x-1 ${
              viewingMode === 'overview'
                ? 'text-aurel-gold font-medium'
                : 'text-aurel-ivory/60 hover:text-aurel-ivory'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Master Plan</span>
          </button>

          {selectedTower && (
            <>
              <ChevronRight className="w-3 h-3 text-white/30" />
              <button
                type="button"
                onClick={() => onSelectTower(selectedTower.id)}
                className={`transition-colors flex items-center space-x-1 ${
                  viewingMode === 'tower'
                    ? 'text-aurel-gold font-medium'
                    : 'text-aurel-ivory/60 hover:text-aurel-ivory'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{selectedTower.name}</span>
              </button>
            </>
          )}

          {selectedFloorNumber !== null && selectedTower && (
            <>
              <ChevronRight className="w-3 h-3 text-white/30" />
              <button
                type="button"
                onClick={() => onSelectFloor(selectedTower.id, selectedFloorNumber)}
                className={`transition-colors flex items-center space-x-1 ${
                  viewingMode === 'floor'
                    ? 'text-aurel-gold font-medium'
                    : 'text-aurel-ivory/60 hover:text-aurel-ivory'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Floor {selectedFloorNumber}</span>
              </button>
            </>
          )}

          {selectedApartment && (
            <>
              <ChevronRight className="w-3 h-3 text-white/30" />
              <span className="text-aurel-gold font-mono font-medium">
                Unit {selectedApartment.unitNumber} ({selectedApartment.type})
              </span>
            </>
          )}
        </nav>
      </div>

      {/* QUICK ACTIONS & ATMOSPHERE TIME SELECTOR */}
      <div className="flex items-center space-x-2 sm:space-x-3 pointer-events-auto self-end md:self-auto">
        {/* TIME OF DAY ATMOSPHERE TOGGLE */}
        <div className="flex items-center p-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-md">
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('golden')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[11px] transition-all ${
              timeOfDay === 'golden'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
            title="Golden Hour (Warm Sunset Light)"
          >
            <Sunset className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Golden Hour</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTimeOfDay('twilight')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[11px] transition-all ${
              timeOfDay === 'twilight'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
            title="Twilight / Blue Hour (Illuminated Architecture)"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Twilight</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTimeOfDay('daylight')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[11px] transition-all ${
              timeOfDay === 'daylight'
                ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
            title="Midday Sun (Bright Architectural Day)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden lg:inline">Daylight</span>
          </button>
        </div>

        {/* Reset Camera View */}
        <button
          type="button"
          onClick={onResetView}
          className="flex items-center space-x-2 px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-aurel-gold/50 text-xs text-aurel-ivory/80 hover:text-aurel-ivory backdrop-blur-md transition-all duration-200 shadow-md"
          title="Reset Camera Framing"
        >
          <RotateCcw className="w-3.5 h-3.5 text-aurel-gold" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        {/* Schedule a Visit Button */}
        <button
          type="button"
          onClick={onOpenEnquiry}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-aurel-gold/20 hover:bg-aurel-gold/30 border border-aurel-gold/60 hover:border-aurel-gold text-xs text-aurel-ivory backdrop-blur-md transition-all duration-300 shadow-lg shadow-aurel-gold/10 group"
        >
          <Calendar className="w-3.5 h-3.5 text-aurel-gold group-hover:scale-110 transition-transform" />
          <span className="font-medium tracking-wide">Schedule Visit</span>
        </button>
      </div>
    </header>
  );
}
