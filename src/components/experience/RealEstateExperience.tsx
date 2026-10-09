'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { TowerId, ViewingMode, Apartment } from '@/types/property';
import { TOWERS, DEVELOPMENT_INFO } from '@/data/development';
import { getApartmentsForFloor } from '@/data/apartments';
import { ProjectHeader } from '@/components/interface/ProjectHeader';
import { ProjectNavigation } from '@/components/interface/ProjectNavigation';
import { FloorSelector } from '@/components/experience/FloorSelector';
import { ApartmentSelector } from '@/components/experience/ApartmentSelector';
import { ApartmentPanel } from '@/components/interface/ApartmentPanel';
import { FloorPlanViewer } from '@/components/interface/FloorPlanViewer';
import { PropertyGallery } from '@/components/interface/PropertyGallery';
import { EnquiryDialog } from '@/components/interface/EnquiryDialog';
import { LoadingState } from '@/components/interface/LoadingState';
import { TimeOfDay } from '@/lib/scene-config';
import { ArrowRight, Sparkles, Building2, Eye, ShieldCheck } from 'lucide-react';

// Dynamic import for R3F Canvas scene to guarantee SSR safety and clean hydration
const DevelopmentScene = dynamic(
  () => import('./DevelopmentScene').then((mod) => mod.DevelopmentScene),
  {
    ssr: false,
    loading: () => <LoadingState message="Initializing 3D Architectural Scene..." />,
  }
);

export function RealEstateExperience() {
  // Application State
  const [hasEntered, setHasEntered] = useState(false);
  const [viewingMode, setViewingMode] = useState<ViewingMode>('overview');
  const [selectedTowerId, setSelectedTowerId] = useState<TowerId | null>(null);
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('golden');

  // Modals state
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);

  // Camera reset incrementer
  const [resetTrigger, setResetTrigger] = useState(0);

  // Handlers
  const handleEnterExperience = () => {
    setHasEntered(true);
    setViewingMode('overview');
    setResetTrigger((c) => c + 1);
  };

  const handleSelectOverview = useCallback(() => {
    setViewingMode('overview');
    setSelectedTowerId(null);
    setSelectedFloorNumber(null);
    setSelectedApartment(null);
    setResetTrigger((c) => c + 1);
  }, []);

  const handleSelectTower = useCallback((towerId: TowerId) => {
    setSelectedTowerId(towerId);
    setViewingMode('tower');
    // Default to an attractive mid-high floor when selecting a tower
    const tower = TOWERS.find((t) => t.id === towerId);
    const defaultFloor = tower ? Math.floor(tower.floorsCount * 0.65) : 10;
    setSelectedFloorNumber(defaultFloor);
    setSelectedApartment(null);
  }, []);

  const handleSelectFloor = useCallback((towerId: TowerId, floorNumber: number) => {
    setSelectedTowerId(towerId);
    setSelectedFloorNumber(floorNumber);
    setViewingMode('floor');
    setSelectedApartment(null);
  }, []);

  const handleSelectApartment = useCallback((apartment: Apartment) => {
    setSelectedTowerId(apartment.towerId);
    setSelectedFloorNumber(apartment.floorNumber);
    setSelectedApartment(apartment);
    setViewingMode('apartment');
  }, []);

  const handleResetView = useCallback(() => {
    setResetTrigger((c) => c + 1);
  }, []);

  // Compute selected unit index on floor for camera framing
  const selectedApartmentIndex = React.useMemo(() => {
    if (!selectedTowerId || selectedFloorNumber === null || !selectedApartment) return 0;
    const units = getApartmentsForFloor(selectedTowerId, selectedFloorNumber);
    const idx = units.findIndex((u) => u.id === selectedApartment.id);
    return idx >= 0 ? idx : 0;
  }, [selectedTowerId, selectedFloorNumber, selectedApartment]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#08080a] select-none">
      {/* 1. 3D DEVELOPMENT CANVAS */}
      <div className="absolute inset-0 z-0">
        <DevelopmentScene
          viewingMode={viewingMode}
          selectedTowerId={selectedTowerId}
          selectedFloorNumber={selectedFloorNumber}
          selectedApartmentId={selectedApartment ? selectedApartment.id : null}
          selectedApartmentIndex={selectedApartmentIndex}
          timeOfDay={timeOfDay}
          resetTrigger={resetTrigger}
          onSelectTower={handleSelectTower}
          onSelectFloor={handleSelectFloor}
          onSelectApartment={handleSelectApartment}
        />
      </div>

      {/* 2. OPENING EXPERIENCE OVERLAY */}
      {!hasEntered && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fadeIn">
          <div className="relative max-w-lg w-full p-8 md:p-10 rounded-3xl bg-[#0e0f14]/95 border border-aurel-gold/30 shadow-2xl flex flex-col items-center text-center text-aurel-ivory">
            {/* Monogram */}
            <div className="w-16 h-16 rounded-2xl bg-aurel-gold/15 border border-aurel-gold/40 flex items-center justify-center mb-6 shadow-lg shadow-aurel-gold/15">
              <span className="font-serif text-3xl font-bold text-aurel-gold">A</span>
            </div>

            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-aurel-gold mb-1">
              IMMERSIVE PROPERTY EXPERIENCE
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-white uppercase mb-2">
              AUREL Residences
            </h1>
            <p className="text-xs text-aurel-ivory/60 max-w-sm leading-relaxed mb-6">
              {DEVELOPMENT_INFO.location}
              <br />
              {DEVELOPMENT_INFO.totalAcreage} • 3 Signature Towers
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 w-full mb-8 text-[11px] text-white/70">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-aurel-gold" />
                <span>Private Deep-Water Marina</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center space-x-2">
                <Building2 className="w-3.5 h-3.5 text-aurel-gold" />
                <span>1, 2, 3 BHK & Penthouses</span>
              </div>
            </div>

            {/* Enter Action */}
            <button
              type="button"
              onClick={handleEnterExperience}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-aurel-gold via-aurel-gold-light to-aurel-gold text-aurel-dark font-serif font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-xl hover:shadow-aurel-gold/30 hover:scale-[1.02] flex items-center justify-center space-x-3 group"
            >
              <span>Explore 3D Development</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-[10px] text-white/40 mt-4 font-sans">
              Interactive 3D WebGL Visualization • Rotate, zoom, and explore residences
            </span>
          </div>
        </div>
      )}

      {/* 3. ACTIVE INTERFACE OVERLAYS (When entered) */}
      {hasEntered && (
        <>
          {/* TOP PROJECT HEADER */}
          <ProjectHeader
            viewingMode={viewingMode}
            selectedTowerId={selectedTowerId}
            selectedFloorNumber={selectedFloorNumber}
            selectedApartment={selectedApartment}
            timeOfDay={timeOfDay}
            onChangeTimeOfDay={setTimeOfDay}
            onResetView={handleResetView}
            onSelectOverview={handleSelectOverview}
            onSelectTower={handleSelectTower}
            onSelectFloor={handleSelectFloor}
            onOpenEnquiry={() => setShowEnquiry(true)}
          />

          {/* PROJECT NAVIGATION (Tower Switcher) */}
          <div className="absolute top-20 md:top-24 left-4 md:left-6 z-20 pointer-events-auto">
            <ProjectNavigation
              selectedTowerId={selectedTowerId}
              onSelectTower={handleSelectTower}
              onSelectOverview={handleSelectOverview}
            />
          </div>

          {/* VERTICAL FLOOR SELECTOR (Right side when a tower is selected) */}
          {selectedTowerId && (
            <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto animate-fadeIn">
              <FloorSelector
                towerId={selectedTowerId}
                selectedFloorNumber={selectedFloorNumber}
                onSelectFloor={handleSelectFloor}
              />
            </div>
          )}

          {/* APARTMENT SELECTOR DOCK (Bottom dock when floor is active) */}
          {selectedTowerId && selectedFloorNumber !== null && !selectedApartment && (
            <div className="absolute bottom-6 left-4 sm:left-6 z-20 pointer-events-auto animate-slideInUp max-w-[calc(100vw-32px)]">
              <ApartmentSelector
                towerId={selectedTowerId}
                floorNumber={selectedFloorNumber}
                selectedApartmentId={null}
                onSelectApartment={handleSelectApartment}
              />
            </div>
          )}

          {/* APARTMENT INFORMATION PANEL (Drawer on right when apartment is selected) */}
          {selectedApartment && (
            <ApartmentPanel
              apartment={selectedApartment}
              onClose={() => {
                setSelectedApartment(null);
                setViewingMode('floor');
              }}
              onViewFloorPlan={() => setShowFloorPlan(true)}
              onViewGallery={() => setShowGallery(true)}
              onRequestVisit={() => setShowEnquiry(true)}
            />
          )}

          {/* BOTTOM QUICK CONTROLS HINT */}
          <div className="hidden lg:flex items-center space-x-3 absolute bottom-4 right-6 z-10 text-[11px] text-white/40 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 pointer-events-none">
            <span>Left Click + Drag: Rotate Scene</span>
            <span>•</span>
            <span>Scroll: Zoom In/Out</span>
            <span>•</span>
            <span>Right Click + Drag: Pan</span>
          </div>
        </>
      )}

      {/* 4. MODALS */}
      {/* Floor Plan Viewer */}
      {showFloorPlan && selectedApartment && (
        <FloorPlanViewer
          apartment={selectedApartment}
          onClose={() => setShowFloorPlan(false)}
        />
      )}

      {/* Property Visual Gallery */}
      {showGallery && selectedApartment && (
        <PropertyGallery
          apartment={selectedApartment}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Visit Enquiry Dialog */}
      <EnquiryDialog
        apartment={selectedApartment}
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
      />
    </main>
  );
}
