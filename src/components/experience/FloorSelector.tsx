'use client';

import React, { useRef, useEffect } from 'react';
import { TowerId } from '@/types/property';
import { TOWERS } from '@/data/development';
import { Layers, Crown, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface FloorSelectorProps {
  towerId: TowerId;
  selectedFloorNumber: number | null;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
}

export function FloorSelector({
  towerId,
  selectedFloorNumber,
  onSelectFloor,
}: FloorSelectorProps) {
  const tower = TOWERS.find((t) => t.id === towerId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!tower) return null;

  const floors = Array.from({ length: tower.floorsCount }, (_, i) => tower.floorsCount - i);

  // Auto-scroll the active floor into view
  useEffect(() => {
    if (selectedFloorNumber && scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-floor="${selectedFloorNumber}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedFloorNumber]);

  return (
    <aside
      aria-label="Floor selector"
      className="flex flex-col items-center bg-[#0d0e13]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl select-none max-h-[68vh] w-14 sm:w-16"
    >
      {/* Header Label */}
      <div className="flex flex-col items-center py-1.5 border-b border-white/10 w-full mb-1">
        <Layers className="w-3.5 h-3.5 text-aurel-gold mb-0.5" />
        <span className="text-[9px] uppercase tracking-widest text-aurel-ivory/50 font-mono">
          Floor
        </span>
      </div>

      {/* Up Button */}
      <button
        type="button"
        onClick={() => {
          if (selectedFloorNumber && selectedFloorNumber < tower.floorsCount) {
            onSelectFloor(towerId, selectedFloorNumber + 1);
          } else if (!selectedFloorNumber) {
            onSelectFloor(towerId, tower.floorsCount);
          }
        }}
        disabled={selectedFloorNumber === tower.floorsCount}
        className="p-1 text-white/40 hover:text-aurel-gold disabled:opacity-20 transition-colors"
        title="Next floor up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>

      {/* Scrollable Floor List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-1 w-full flex flex-col items-center"
      >
        {floors.map((floorNum) => {
          const isSelected = selectedFloorNumber === floorNum;
          const isPenthouse = floorNum >= tower.floorsCount - 1;

          return (
            <button
              key={floorNum}
              data-floor={floorNum}
              type="button"
              onClick={() => onSelectFloor(towerId, floorNum)}
              className={`group relative w-10 sm:w-12 h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-all duration-200 ${
                isSelected
                  ? 'bg-aurel-gold text-aurel-dark font-bold shadow-lg shadow-aurel-gold/30 scale-105 ring-1 ring-white/60'
                  : isPenthouse
                  ? 'bg-white/5 hover:bg-white/15 text-aurel-gold/90 hover:text-aurel-gold border border-aurel-gold/20'
                  : 'bg-white/[0.03] hover:bg-white/10 text-aurel-ivory/70 hover:text-aurel-ivory'
              }`}
              title={`Floor ${floorNum} ${isPenthouse ? '(Penthouse)' : ''}`}
            >
              <div className="flex items-center space-x-0.5">
                {isPenthouse && !isSelected && (
                  <Crown className="w-2.5 h-2.5 text-aurel-gold/70 absolute -top-1 -right-1" />
                )}
                <span>{floorNum < 10 ? `0${floorNum}` : floorNum}</span>
              </div>

              {/* Active Floor Pointer indicator */}
              {isSelected && (
                <div className="absolute -left-1.5 w-1 h-3 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Down Button */}
      <button
        type="button"
        onClick={() => {
          if (selectedFloorNumber && selectedFloorNumber > 1) {
            onSelectFloor(towerId, selectedFloorNumber - 1);
          } else if (!selectedFloorNumber) {
            onSelectFloor(towerId, 1);
          }
        }}
        disabled={selectedFloorNumber === 1}
        className="p-1 text-white/40 hover:text-aurel-gold disabled:opacity-20 transition-colors"
        title="Next floor down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Footnote */}
      <div className="pt-1.5 border-t border-white/10 w-full text-center">
        <span className="text-[9px] text-white/40 font-mono font-medium">
          {tower.code}01-{tower.code}
          {tower.floorsCount}
        </span>
      </div>
    </aside>
  );
}
