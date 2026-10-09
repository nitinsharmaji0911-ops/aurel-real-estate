'use client';

import React, { useState, useEffect } from 'react';
import { Apartment, GalleryImage } from '@/types/property';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Compass,
  Image as ImageIcon,
} from 'lucide-react';

interface PropertyGalleryProps {
  apartment: Apartment;
  onClose: () => void;
}

// Architectural Vector Renderings for the Gallery Spaces
function ArchitecturalRenderView({
  image,
  apartment,
}: {
  image: GalleryImage;
  apartment: Apartment;
}) {
  const isLiving = image.category === 'Living Room';
  const isMaster = image.category === 'Master Bedroom';
  const isBalcony = image.category === 'Balcony & View';
  const isKitchen = image.category === 'Kitchen & Dining';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#11131a] to-[#0b0c10] select-none">
      {/* Cinematic Architectural SVG Scene */}
      <svg
        viewBox="0 0 1200 750"
        className="w-full h-full object-cover max-h-[720px] drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0c1726" />
            <stop offset="45%" stopColor="#2c3e55" />
            <stop offset="75%" stopColor="#a77044" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1c24" />
            <stop offset="50%" stopColor="#262936" />
            <stop offset="100%" stopColor="#181920" />
          </linearGradient>
        </defs>

        {/* 1. PANORAMIC WINDOW VISTA (Background Sky & Emerald Bay Horizon) */}
        <rect x="120" y="60" width="960" height="480" fill="url(#skyGrad)" rx="6" />

        {/* Ocean Horizon Water */}
        <rect x="120" y="380" width="960" height="160" fill="#0d2438" opacity="0.9" />
        <line x1="120" y1="380" x2="1080" y2="380" stroke="#ffd899" strokeWidth="1.5" opacity="0.7" />

        {/* Distant coastline silhouettes */}
        <polygon points="120,380 280,350 420,380" fill="#091522" opacity="0.85" />
        <polygon points="780,380 940,360 1080,380" fill="#091522" opacity="0.85" />

        {/* Architectural Window Mullions / Bronze Framing */}
        <g stroke="#9e7e44" strokeWidth="4">
          <line x1="120" y1="60" x2="1080" y2="60" />
          <line x1="120" y1="540" x2="1080" y2="540" />
          <line x1="360" y1="60" x2="360" y2="540" />
          <line x1="600" y1="60" x2="600" y2="540" />
          <line x1="840" y1="60" x2="840" y2="540" />
        </g>

        {/* 2. INTERIOR ARCHITECTURE & FURNITURE ACCORDING TO ROOM */}
        {isLiving && (
          <g>
            {/* Hardwood / Marble Floor Reflection */}
            <rect x="0" y="520" width="1200" height="230" fill="url(#marbleGrad)" />
            {/* Low-profile Italian Sectional Sofa */}
            <path
              d="M 280 480 L 820 480 Q 840 480 840 505 L 840 590 L 260 590 L 260 505 Q 260 480 280 480 Z"
              fill="#2b2d3b"
              stroke="#c5a059"
              strokeWidth="1"
            />
            {/* Sofa Cushions */}
            <rect x="290" y="500" width="160" height="70" rx="8" fill="#353849" />
            <rect x="470" y="500" width="160" height="70" rx="8" fill="#353849" />
            <rect x="650" y="500" width="160" height="70" rx="8" fill="#353849" />
            {/* Bronze Minimalist Coffee Table */}
            <ellipse cx="550" cy="625" rx="140" ry="25" fill="#1b1c23" stroke="#dfc285" strokeWidth="2" />
            {/* Floor Lamp (Arch Bronze Lamp) */}
            <path d="M 200 680 Q 200 240 380 220" fill="none" stroke="#dfc285" strokeWidth="3" />
            <circle cx="380" cy="225" r="18" fill="#ffe099" opacity="0.8" />
          </g>
        )}

        {isMaster && (
          <g>
            {/* Herringbone floor */}
            <rect x="0" y="500" width="1200" height="250" fill="#181920" />
            {/* King Platform Bed */}
            <rect x="360" y="440" width="480" height="180" rx="12" fill="#262330" stroke="#c5a059" strokeWidth="1.2" />
            {/* Upholstered Fluted Headboard */}
            <rect x="340" y="320" width="520" height="130" rx="6" fill="#363242" stroke="#544e66" strokeWidth="1" />
            {/* Crisp Bedding with Silk Throw */}
            <rect x="380" y="460" width="440" height="140" rx="8" fill="#edeae1" opacity="0.9" />
            <rect x="380" y="520" width="440" height="80" rx="4" fill="#a68a56" opacity="0.85" />
            {/* Bedside Bronze Pedestals & Lighting */}
            <rect x="260" y="460" width="70" height="80" rx="4" fill="#1f1e26" stroke="#c5a059" strokeWidth="0.8" />
            <rect x="870" y="460" width="70" height="80" rx="4" fill="#1f1e26" stroke="#c5a059" strokeWidth="0.8" />
            <circle cx="295" cy="430" r="12" fill="#ffdd99" opacity="0.9" />
            <circle cx="905" cy="430" r="12" fill="#ffdd99" opacity="0.9" />
          </g>
        )}

        {isBalcony && (
          <g>
            {/* Teak Decking */}
            <rect x="0" y="480" width="1200" height="270" fill="#281e15" />
            {/* Structural Frameless Glass Railing */}
            <rect x="60" y="420" width="1080" height="110" fill="url(#glassGrad)" stroke="#68a0cf" strokeWidth="1.5" />
            <line x1="60" y1="420" x2="1140" y2="420" stroke="#c5a059" strokeWidth="3" />
            {/* Outdoor Lounge Chaise & Cocktail Table */}
            <path d="M 320 460 L 620 460 L 590 540 L 290 540 Z" fill="#3b332b" stroke="#8c6e32" strokeWidth="1" />
            <circle cx="720" cy="520" r="40" fill="#1e1712" stroke="#c5a059" strokeWidth="1.5" />
          </g>
        )}

        {isKitchen && (
          <g>
            {/* Statuario Marble Floor */}
            <rect x="0" y="480" width="1200" height="270" fill="#1d2028" />
            {/* Monolithic Waterfall Island */}
            <polygon points="380,420 820,420 780,620 340,620" fill="#2e3342" stroke="#c5a059" strokeWidth="1.5" />
            <polygon points="380,420 820,420 840,400 400,400" fill="#3c4357" />
            {/* Pendant Glow Bars */}
            <line x1="500" y1="120" x2="500" y2="280" stroke="#c5a059" strokeWidth="2" />
            <line x1="700" y1="120" x2="700" y2="280" stroke="#c5a059" strokeWidth="2" />
            <rect x="470" y="280" width="60" height="12" rx="4" fill="#ffe299" />
            <rect x="670" y="280" width="60" height="12" rx="4" fill="#ffe299" />
          </g>
        )}

        {/* Ambient Architectural Vignette Overlay */}
        <rect x="0" y="0" width="1200" height="750" fill="none" stroke="#0c0d12" strokeWidth="16" />
      </svg>

      {/* Floating Space Title Badge */}
      <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-aurel-gold" />
        <span className="font-serif text-xs uppercase tracking-widest text-white font-medium">
          {image.title}
        </span>
      </div>
    </div>
  );
}

export function PropertyGallery({ apartment, onClose }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const images = apartment.gallery;
  const currentImage = images[activeIndex] || images[0];

  const handleNext = () => setActiveIndex((idx) => (idx + 1) % images.length);
  const handlePrev = () => setActiveIndex((idx) => (idx - 1 + images.length) % images.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-fadeIn select-none p-3 md:p-6 text-aurel-ivory">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#090a0e] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-aurel-gold/15 border border-aurel-gold/30 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-aurel-gold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-base font-semibold text-white tracking-wide">
                  Architectural Visual Tour — Residence {apartment.unitNumber}
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-aurel-gold/30 text-aurel-gold bg-aurel-gold/10">
                  {apartment.type}
                </span>
              </div>
              <p className="text-xs text-white/50">
                Studio Aurel CGI Architectural Renders • Perspective {activeIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN VISUAL VIEWER */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <ArchitecturalRenderView image={currentImage} apartment={apartment} />

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white hover:text-aurel-gold transition-all backdrop-blur-md shadow-xl"
            title="Previous perspective"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white hover:text-aurel-gold transition-all backdrop-blur-md shadow-xl"
            title="Next perspective"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Architectural Space Description Overlay Banner */}
          <div className="absolute bottom-4 left-6 right-6 z-20 p-4 rounded-xl bg-black/75 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xl">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-serif text-sm font-semibold text-white tracking-wide">
                  {currentImage.title}
                </span>
                <span className="text-[10px] text-aurel-gold font-mono px-1.5 py-0.5 rounded bg-aurel-gold/10 border border-aurel-gold/25">
                  {currentImage.category}
                </span>
              </div>
              <p className="text-xs text-white/70 max-w-3xl leading-relaxed">
                {currentImage.description}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[11px] font-mono text-white/40 block">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>

        {/* THUMBNAIL STRIP */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => {
            const isSelected = activeIndex === idx;

            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group flex items-center space-x-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-md transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-aurel-gold/20 border-aurel-gold ring-1 ring-aurel-gold/60 text-white scale-105'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: img.accentColor }}
                />
                <div className="text-left">
                  <div className="text-xs font-medium leading-none mb-0.5">{img.title}</div>
                  <div className="text-[10px] text-white/40 font-mono leading-none">
                    {img.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
