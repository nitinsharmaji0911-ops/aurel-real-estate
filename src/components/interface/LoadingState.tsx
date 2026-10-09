'use client';

import React from 'react';

export function LoadingState({ message = 'Loading Architectural Environment...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#08080a] text-aurel-ivory transition-opacity duration-700">
      <div className="relative flex flex-col items-center">
        {/* Animated Architectural Monogram */}
        <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-aurel-gold/20 animate-ping opacity-30" />
          <div className="w-14 h-14 rounded-full border border-aurel-gold/40 flex items-center justify-center shadow-lg shadow-aurel-gold/10">
            <span className="font-serif text-2xl tracking-widest text-aurel-gold">A</span>
          </div>
        </div>

        <h2 className="text-sm font-serif tracking-[0.3em] uppercase text-aurel-gold mb-2">
          AUREL RESIDENCES
        </h2>
        <p className="text-xs tracking-wider text-aurel-ivory/60 font-sans">{message}</p>

        {/* Fine Loading Bar */}
        <div className="w-48 h-[1px] bg-white/10 mt-6 overflow-hidden relative">
          <div className="absolute h-full w-24 bg-gradient-to-r from-transparent via-aurel-gold to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
