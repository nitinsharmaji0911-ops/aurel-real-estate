'use client';

import React from 'react';
import { TowerId } from '@/types/property';
import { TOWERS } from '@/data/development';
import { Building, MapPin, Sparkles } from 'lucide-react';

interface ProjectNavigationProps {
  selectedTowerId: TowerId | null;
  onSelectTower: (towerId: TowerId) => void;
  onSelectOverview: () => void;
}

export function ProjectNavigation({
  selectedTowerId,
  onSelectTower,
  onSelectOverview,
}: ProjectNavigationProps) {
  return (
    <div className="flex flex-col items-start gap-2 select-none">
      <div className="flex items-center space-x-1.5 p-1 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Full Overview / Master Plan Tab */}
        <button
          type="button"
          onClick={onSelectOverview}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 font-medium ${
            selectedTowerId === null
              ? 'bg-aurel-gold text-aurel-dark shadow-md shadow-aurel-gold/30'
              : 'text-aurel-ivory/70 hover:text-aurel-ivory hover:bg-white/5'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>All Towers</span>
        </button>

        {/* Individual Towers Tabs */}
        {TOWERS.map((tower) => {
          const isSelected = selectedTowerId === tower.id;
          return (
            <button
              key={tower.id}
              type="button"
              onClick={() => onSelectTower(tower.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 font-medium relative ${
                isSelected
                  ? 'bg-aurel-gold text-aurel-dark shadow-md shadow-aurel-gold/30'
                  : 'text-aurel-ivory/70 hover:text-aurel-ivory hover:bg-white/5'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{tower.shortName}</span>
              <span
                className={`text-[10px] px-1 rounded ${
                  isSelected ? 'bg-black/20 text-aurel-dark' : 'bg-white/10 text-white/50'
                }`}
              >
                {tower.floorsCount}F
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Tower Quick Meta Capsule */}
      {selectedTowerId && (
        <div className="hidden sm:flex items-center space-x-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/5 text-[11px] text-aurel-ivory/70 animate-fadeIn">
          <Sparkles className="w-3 h-3 text-aurel-gold" />
          <span>
            {TOWERS.find((t) => t.id === selectedTowerId)?.tagline}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-aurel-gold/90 font-mono">
            {TOWERS.find((t) => t.id === selectedTowerId)?.completionDate} Handover
          </span>
        </div>
      )}
    </div>
  );
}
