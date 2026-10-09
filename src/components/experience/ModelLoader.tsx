'use client';

import React, { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { ProceduralDevelopment } from './ProceduralDevelopment';
import { TowerId, Apartment } from '@/types/property';
import { TimeOfDay } from '@/lib/scene-config';

interface ModelLoaderProps {
  modelUrl?: string | null;
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  timeOfDay?: TimeOfDay;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
}

function ExternalGLTFModel({ url, fallback }: { url: string; fallback: React.ReactNode }) {
  try {
    const gltf = useGLTF(url);
    return <primitive object={gltf.scene} />;
  } catch (err) {
    console.warn(`Failed to load external GLTF at ${url}, using procedural architecture fallback:`, err);
    return <>{fallback}</>;
  }
}

export function ModelLoader({
  modelUrl,
  selectedTowerId,
  selectedFloorNumber,
  selectedApartmentId,
  timeOfDay = 'golden',
  onSelectTower,
  onSelectFloor,
  onSelectApartment,
}: ModelLoaderProps) {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [modelUrl]);

  const proceduralFallback = (
    <ProceduralDevelopment
      selectedTowerId={selectedTowerId}
      selectedFloorNumber={selectedFloorNumber}
      selectedApartmentId={selectedApartmentId}
      timeOfDay={timeOfDay}
      onSelectTower={onSelectTower}
      onSelectFloor={onSelectFloor}
      onSelectApartment={onSelectApartment}
    />
  );

  if (!modelUrl || loadError) {
    return proceduralFallback;
  }

  return <ExternalGLTFModel url={modelUrl} fallback={proceduralFallback} />;
}
