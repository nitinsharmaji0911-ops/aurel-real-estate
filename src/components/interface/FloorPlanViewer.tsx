'use client';

import React, { useState, useRef } from 'react';
import { Apartment } from '@/types/property';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Maximize2,
  Download,
  Check,
  Layers,
} from 'lucide-react';

interface FloorPlanViewerProps {
  apartment: Apartment;
  onClose: () => void;
}

export function FloorPlanViewer({ apartment, onClose }: FloorPlanViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.8));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Render SVG based on apartment type
  const renderArchitecturalSvg = () => {
    const is1BHK = apartment.type === '1 BHK';
    const is2BHK = apartment.type === '2 BHK';
    const is3BHK = apartment.type === '3 BHK' || apartment.type === 'Penthouse Suite';

    if (is1BHK) {
      return (
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-h-[560px] drop-shadow-2xl select-none"
        >
          <defs>
            <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#c5a059" strokeWidth="0.8" opacity="0.15" />
            </pattern>
            <pattern id="tiles" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />
            </pattern>
          </defs>

          {/* Exterior Boundary Slabs */}
          <rect x="80" y="80" width="640" height="440" rx="8" fill="#14151b" stroke="#333742" strokeWidth="4" />

          {/* ROOM 1: Living & Dining Hall */}
          <g
            onMouseEnter={() => setHoveredRoom('Living & Dining Hall')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer transition-opacity"
          >
            <rect
              x="100"
              y="100"
              width="360"
              height="260"
              fill={hoveredRoom === 'Living & Dining Hall' ? '#1f2530' : '#181a22'}
              stroke="#495062"
              strokeWidth="2"
            />
            {/* Living Furniture Hints */}
            <rect x="130" y="140" width="160" height="50" rx="6" fill="#252834" stroke="#c5a059" strokeWidth="0.8" />
            <rect x="160" y="210" width="100" height="40" rx="4" fill="#20222c" stroke="#555d72" strokeWidth="0.8" />
            {/* Room Tag */}
            <text x="280" y="290" textAnchor="middle" fill="#f5f2eb" fontSize="15" fontWeight="600" fontFamily="serif">
              LIVING & DINING SALON
            </text>
            <text x="280" y="312" textAnchor="middle" fill="#c5a059" fontSize="12" fontFamily="monospace">
              19&apos;6&quot; × 12&apos;0&quot; • 234 SQ.FT.
            </text>
          </g>

          {/* ROOM 2: Master Bedroom Suite */}
          <g
            onMouseEnter={() => setHoveredRoom('Master Bedroom Suite')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer transition-opacity"
          >
            <rect
              x="460"
              y="100"
              width="240"
              height="260"
              fill={hoveredRoom === 'Master Bedroom Suite' ? '#22232d' : '#191b24'}
              stroke="#495062"
              strokeWidth="2"
            />
            {/* King Bed with nightstands */}
            <rect x="520" y="120" width="120" height="130" rx="8" fill="#2b2834" stroke="#c5a059" strokeWidth="0.8" />
            <rect x="485" y="130" width="25" height="25" rx="3" fill="#22232c" stroke="#4a5062" strokeWidth="0.5" />
            <rect x="650" y="130" width="25" height="25" rx="3" fill="#22232c" stroke="#4a5062" strokeWidth="0.5" />
            {/* Wardrobe */}
            <rect x="475" y="315" width="210" height="30" fill="url(#hatch)" stroke="#495062" strokeWidth="1" />
            {/* Room Tag */}
            <text x="580" y="280" textAnchor="middle" fill="#f5f2eb" fontSize="14" fontWeight="600" fontFamily="serif">
              MASTER BEDROOM
            </text>
            <text x="580" y="300" textAnchor="middle" fill="#c5a059" fontSize="11" fontFamily="monospace">
              14&apos;0&quot; × 12&apos;4&quot; • 172 SQ.FT.
            </text>
          </g>

          {/* ROOM 3: Gourmet Kitchenette */}
          <g
            onMouseEnter={() => setHoveredRoom('Gourmet Kitchenette')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="100"
              y="360"
              width="180"
              height="140"
              fill={hoveredRoom === 'Gourmet Kitchenette' ? '#21242e' : '#181a23'}
              stroke="#495062"
              strokeWidth="2"
            />
            <rect x="100" y="360" width="180" height="140" fill="url(#tiles)" />
            {/* Kitchen counter */}
            <path d="M 110 370 L 260 370 L 260 410 L 150 410 L 150 480 L 110 480 Z" fill="#272a36" stroke="#c5a059" strokeWidth="0.8" />
            <text x="190" y="445" textAnchor="middle" fill="#f5f2eb" fontSize="13" fontWeight="600" fontFamily="serif">
              KITCHEN
            </text>
            <text x="190" y="465" textAnchor="middle" fill="#c5a059" fontSize="10" fontFamily="monospace">
              9&apos;8&quot; × 8&apos;6&quot; • 82 SQ.FT.
            </text>
          </g>

          {/* ROOM 4: En-suite Luxury Bath */}
          <g
            onMouseEnter={() => setHoveredRoom('En-suite Luxury Bath')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="460"
              y="360"
              width="130"
              height="140"
              fill={hoveredRoom === 'En-suite Luxury Bath' ? '#21262d' : '#171922'}
              stroke="#495062"
              strokeWidth="2"
            />
            <rect x="460" y="360" width="130" height="140" fill="url(#tiles)" />
            {/* Vanity & Shower */}
            <rect x="475" y="375" width="45" height="30" rx="3" fill="#292d3b" stroke="#c5a059" strokeWidth="0.8" />
            <rect x="535" y="435" width="45" height="50" rx="4" fill="#202b36" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="525" y="425" textAnchor="middle" fill="#f5f2eb" fontSize="12" fontWeight="600" fontFamily="serif">
              BATH
            </text>
            <text x="525" y="445" textAnchor="middle" fill="#c5a059" fontSize="9" fontFamily="monospace">
              51 SQ.FT.
            </text>
          </g>

          {/* ROOM 5: Sunset Sunken Deck / Balcony */}
          <g
            onMouseEnter={() => setHoveredRoom('Sunset Sunken Deck')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="280"
              y="360"
              width="180"
              height="140"
              fill={hoveredRoom === 'Sunset Sunken Deck' ? '#1c2822' : '#141e19'}
              stroke="#388e3c"
              strokeWidth="2"
            />
            {/* Teak Deck Lines */}
            <line x1="290" y1="390" x2="450" y2="390" stroke="#388e3c" strokeWidth="0.6" strokeDasharray="4 4" />
            <line x1="290" y1="420" x2="450" y2="420" stroke="#388e3c" strokeWidth="0.6" strokeDasharray="4 4" />
            <line x1="290" y1="450" x2="450" y2="450" stroke="#388e3c" strokeWidth="0.6" strokeDasharray="4 4" />
            <text x="370" y="425" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="600" fontFamily="serif">
              SUNSET BALCONY
            </text>
            <text x="370" y="445" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontFamily="monospace">
              12&apos;0&quot; × 5&apos;6&quot; • 66 SQ.FT.
            </text>
          </g>

          {/* Door swings (Architectural Arcs) */}
          <path d="M 460 200 A 40 40 0 0 1 500 240" fill="none" stroke="#c5a059" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="460" y1="200" x2="460" y2="240" stroke="#f5f2eb" strokeWidth="2" />

          {/* Main Entrance Marker */}
          <g transform="translate(100, 310)">
            <polygon points="-12,0 0,-12 0,12" fill="#c5a059" />
            <text x="-48" y="4" fill="#c5a059" fontSize="10" fontWeight="bold" fontFamily="monospace">
              ENTRY
            </text>
          </g>

          {/* Architectural Dimensions Ticks */}
          <g stroke="#ffffff" strokeWidth="0.8" opacity="0.3">
            <line x1="80" y1="60" x2="720" y2="60" />
            <line x1="80" y1="55" x2="80" y2="65" />
            <line x1="720" y1="55" x2="720" y2="65" />
            <text x="400" y="52" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" stroke="none">
              TOTAL LENGTH: 48&apos; 0&quot;
            </text>
          </g>
        </svg>
      );
    }

    if (is2BHK) {
      return (
        <svg
          viewBox="0 0 880 620"
          className="w-full h-full max-h-[560px] drop-shadow-2xl select-none"
        >
          <defs>
            <pattern id="hatch2" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#c5a059" strokeWidth="0.8" opacity="0.15" />
            </pattern>
            <pattern id="tiles2" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />
            </pattern>
          </defs>

          {/* Boundary */}
          <rect x="60" y="60" width="760" height="500" rx="8" fill="#14151b" stroke="#333742" strokeWidth="4" />

          {/* ROOM: Grand Living & Dining */}
          <g
            onMouseEnter={() => setHoveredRoom('Grand Living & Dining Room')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="80"
              y="80"
              width="430"
              height="280"
              fill={hoveredRoom === 'Grand Living & Dining Room' ? '#1f2530' : '#181a23'}
              stroke="#495062"
              strokeWidth="2"
            />
            {/* L-shaped sectional sofa */}
            <path d="M 120 120 L 260 120 L 260 160 L 160 160 L 160 240 L 120 240 Z" fill="#252834" stroke="#c5a059" strokeWidth="0.8" />
            {/* Dining Table with 6 Chairs */}
            <rect x="340" y="160" width="110" height="70" rx="4" fill="#222530" stroke="#c5a059" strokeWidth="0.8" />
            <text x="290" y="310" textAnchor="middle" fill="#f5f2eb" fontSize="15" fontWeight="600" fontFamily="serif">
              GRAND LIVING & DINING ROOM
            </text>
            <text x="290" y="332" textAnchor="middle" fill="#c5a059" fontSize="12" fontFamily="monospace">
              24&apos;4&quot; × 14&apos;8&quot; • 357 SQ.FT.
            </text>
          </g>

          {/* ROOM: Master Bedroom Suite */}
          <g
            onMouseEnter={() => setHoveredRoom('Master Bedroom Suite')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="510"
              y="80"
              width="290"
              height="260"
              fill={hoveredRoom === 'Master Bedroom Suite' ? '#22232e' : '#191b25'}
              stroke="#495062"
              strokeWidth="2"
            />
            {/* King Bed */}
            <rect x="590" y="105" width="130" height="140" rx="8" fill="#2b2834" stroke="#c5a059" strokeWidth="0.8" />
            <text x="655" y="280" textAnchor="middle" fill="#f5f2eb" fontSize="14" fontWeight="600" fontFamily="serif">
              MASTER BEDROOM SUITE
            </text>
            <text x="655" y="302" textAnchor="middle" fill="#c5a059" fontSize="11" fontFamily="monospace">
              16&apos;8&quot; × 13&apos;6&quot; • 225 SQ.FT.
            </text>
          </g>

          {/* ROOM: Junior Suite / Guest Bedroom */}
          <g
            onMouseEnter={() => setHoveredRoom('Junior Suite / Guest Bedroom')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="510"
              y="340"
              width="290"
              height="200"
              fill={hoveredRoom === 'Junior Suite / Guest Bedroom' ? '#21232c' : '#181a24'}
              stroke="#495062"
              strokeWidth="2"
            />
            {/* Queen Bed */}
            <rect x="595" y="380" width="120" height="120" rx="6" fill="#2a2733" stroke="#c5a059" strokeWidth="0.8" />
            <text x="655" y="515" textAnchor="middle" fill="#f5f2eb" fontSize="13" fontWeight="600" fontFamily="serif">
              JUNIOR BEDROOM SUITE
            </text>
          </g>

          {/* ROOM: Chef's Island Kitchen */}
          <g
            onMouseEnter={() => setHoveredRoom("Chef's Island Kitchen")}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="80"
              y="360"
              width="230"
              height="180"
              fill={hoveredRoom === "Chef's Island Kitchen" ? '#222630' : '#171a23'}
              stroke="#495062"
              strokeWidth="2"
            />
            <rect x="80" y="360" width="230" height="180" fill="url(#tiles2)" />
            {/* Kitchen Island */}
            <rect x="140" y="420" width="110" height="50" rx="4" fill="#292d3b" stroke="#c5a059" strokeWidth="0.8" />
            <text x="195" y="495" textAnchor="middle" fill="#f5f2eb" fontSize="13" fontWeight="600" fontFamily="serif">
              CHEF&apos;S ISLAND KITCHEN
            </text>
          </g>

          {/* ROOM: Main Waterfront Terrace */}
          <g
            onMouseEnter={() => setHoveredRoom('Main Waterfront Terrace')}
            onMouseLeave={() => setHoveredRoom(null)}
            className="cursor-pointer"
          >
            <rect
              x="310"
              y="360"
              width="200"
              height="180"
              fill={hoveredRoom === 'Main Waterfront Terrace' ? '#1c2822' : '#141e19'}
              stroke="#388e3c"
              strokeWidth="2"
            />
            <text x="410" y="445" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="600" fontFamily="serif">
              WATERFRONT TERRACE
            </text>
            <text x="410" y="468" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="monospace">
              18&apos;0&quot; × 6&apos;8&quot; • 120 SQ.FT.
            </text>
          </g>
        </svg>
      );
    }

    // Default: 3 BHK Presidential Residence
    return (
      <svg
        viewBox="0 0 960 660"
        className="w-full h-full max-h-[560px] drop-shadow-2xl select-none"
      >
        <defs>
          <pattern id="hatch3" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#c5a059" strokeWidth="0.8" opacity="0.18" />
          </pattern>
        </defs>

        <rect x="50" y="50" width="860" height="560" rx="10" fill="#14151b" stroke="#333742" strokeWidth="4" />

        {/* Palatial Reception */}
        <g
          onMouseEnter={() => setHoveredRoom('Palatial Reception & Salon')}
          onMouseLeave={() => setHoveredRoom(null)}
          className="cursor-pointer"
        >
          <rect
            x="70"
            y="70"
            width="490"
            height="320"
            fill={hoveredRoom === 'Palatial Reception & Salon' ? '#202632' : '#181a23'}
            stroke="#495062"
            strokeWidth="2"
          />
          {/* Dual Seating Lounges */}
          <rect x="130" y="110" width="180" height="90" rx="6" fill="#262935" stroke="#c5a059" strokeWidth="0.8" />
          <circle cx="440" cy="180" r="45" fill="#242732" stroke="#c5a059" strokeWidth="0.8" />
          <text x="315" y="340" textAnchor="middle" fill="#f5f2eb" fontSize="16" fontWeight="600" fontFamily="serif">
            PALATIAL RECEPTION & SALON
          </text>
          <text x="315" y="364" textAnchor="middle" fill="#c5a059" fontSize="12" fontFamily="monospace">
            32&apos;6&quot; × 18&apos;2&quot; • 590 SQ.FT.
          </text>
        </g>

        {/* Presidential Suite */}
        <g
          onMouseEnter={() => setHoveredRoom("Owner's Presidential Suite")}
          onMouseLeave={() => setHoveredRoom(null)}
          className="cursor-pointer"
        >
          <rect
            x="560"
            y="70"
            width="330"
            height="320"
            fill={hoveredRoom === "Owner's Presidential Suite" ? '#232530' : '#191b26'}
            stroke="#495062"
            strokeWidth="2"
          />
          <rect x="660" y="100" width="150" height="150" rx="8" fill="#2d2938" stroke="#c5a059" strokeWidth="0.8" />
          <text x="725" y="325" textAnchor="middle" fill="#f5f2eb" fontSize="14" fontWeight="600" fontFamily="serif">
            PRESIDENTIAL SUITE
          </text>
          <text x="725" y="347" textAnchor="middle" fill="#c5a059" fontSize="11" fontFamily="monospace">
            21&apos;0&quot; × 16&apos;0&quot; • 336 SQ.FT.
          </text>
        </g>

        {/* Wraparound Sky Lanai */}
        <g
          onMouseEnter={() => setHoveredRoom('Wraparound Sky Lanai')}
          onMouseLeave={() => setHoveredRoom(null)}
          className="cursor-pointer"
        >
          <rect
            x="70"
            y="390"
            width="490"
            height="200"
            fill={hoveredRoom === 'Wraparound Sky Lanai' ? '#1c2822' : '#141e19'}
            stroke="#388e3c"
            strokeWidth="2"
          />
          <text x="315" y="485" textAnchor="middle" fill="#6ee7b7" fontSize="14" fontWeight="600" fontFamily="serif">
            WRAPAROUND SKY LANAI
          </text>
          <text x="315" y="508" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="monospace">
            38&apos;0&quot; × 8&apos;0&quot; • 304 SQ.FT.
          </text>
        </g>

        {/* Bedroom Suites II & III */}
        <g
          onMouseEnter={() => setHoveredRoom('Bedroom Suite II')}
          onMouseLeave={() => setHoveredRoom(null)}
          className="cursor-pointer"
        >
          <rect
            x="560"
            y="390"
            width="330"
            height="200"
            fill={hoveredRoom === 'Bedroom Suite II' ? '#21242e' : '#181a24'}
            stroke="#495062"
            strokeWidth="2"
          />
          <text x="725" y="485" textAnchor="middle" fill="#f5f2eb" fontSize="14" fontWeight="600" fontFamily="serif">
            GUEST WING SUITES II & III
          </text>
          <text x="725" y="508" textAnchor="middle" fill="#c5a059" fontSize="11" fontFamily="monospace">
            432 SQ.FT. COMBINED
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fadeIn p-4 md:p-8 select-none">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0c0d12] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-aurel-gold/15 border border-aurel-gold/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-aurel-gold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-base font-semibold text-white tracking-wide">
                  Architectural Floor Plan — Unit {apartment.unitNumber}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-aurel-gold/30 text-aurel-gold bg-aurel-gold/10">
                  {apartment.type}
                </span>
              </div>
              <p className="text-xs text-white/50">
                Scale 1:50 Architectural Master Blueprint • {apartment.carpetAreaSqFt} SQ.FT. Net Usable
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* North Compass Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-aurel-ivory/70">
              <Compass className="w-3.5 h-3.5 text-aurel-gold animate-spin-slow" />
              <span className="font-mono text-[11px]">N 14° E</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close floor plan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN VIEWER WORKSPACE */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* INTERACTIVE CAD CANVAS */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`flex-1 relative overflow-hidden bg-[#0a0a0d] flex items-center justify-center p-6 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Transform Container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-full h-full flex items-center justify-center pointer-events-auto"
            >
              {renderArchitecturalSvg()}
            </div>

            {/* FLOATING ZOOM / PAN CONTROLS */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center space-x-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset zoom & pan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="px-2 text-[11px] font-mono text-white/50 border-l border-white/10">
                {Math.round(zoom * 100)}%
              </div>
            </div>
          </div>

          {/* ROOM DIMENSIONS & AREA BREAKDOWN PANEL */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-5 bg-[#0e0f14] flex flex-col justify-between overflow-y-auto no-scrollbar">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-aurel-gold font-semibold mb-3">
                Room Dimensions & Schedule
              </h3>

              <div className="space-y-2">
                {apartment.floorPlan.rooms.map((room, idx) => {
                  const isHovered = hoveredRoom === room.name;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredRoom(room.name)}
                      onMouseLeave={() => setHoveredRoom(null)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-aurel-gold/10 border-aurel-gold/60 text-white'
                          : 'bg-white/[0.02] border-white/5 text-white/80 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span>{room.name}</span>
                        <span className="font-mono text-aurel-gold">{room.areaSqFt} sq.ft.</span>
                      </div>
                      <div className="text-[11px] text-white/40 font-mono mt-0.5">
                        {room.dimensions}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Area Summary */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Carpet Usable Area:</span>
                <span className="font-mono font-semibold text-white">
                  {apartment.carpetAreaSqFt} sq.ft.
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Super Built-up Area:</span>
                <span className="font-mono font-semibold text-white/70">
                  {apartment.superBuiltUpSqFt} sq.ft.
                </span>
              </div>
              <p className="text-[10px] text-white/40 pt-1 leading-relaxed">
                *Dimensions are measured from internal face of finished walls according to RERA standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
