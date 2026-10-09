'use client';

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Tower, TowerId, Apartment } from '@/types/property';
import { getApartmentsForFloor } from '@/data/apartments';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';
import { JapaneseBuilding } from './architectural/JapaneseBuilding';

interface BuildingTowerProps {
  tower: Tower;
  isSelectedTower: boolean;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  timeOfDay?: TimeOfDay;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
}

// Lightweight 3D Interactive Apartment Unit Marker on Selected Floor
function Unit3DMarker({
  apartment,
  position,
  isSelected,
  onSelect,
}: {
  apartment: Apartment;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const statusColor = useMemo(() => {
    if (apartment.status === 'available') return '#34d399';
    if (apartment.status === 'reserved') return '#fbbf24';
    return '#94a3b8';
  }, [apartment.status]);

  return (
    <group
      position={position}
      scale={hovered || isSelected ? [1.3, 1.3, 1.3] : [1, 1, 1]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* Outer Floating Halo Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.07, 8, 20]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : hovered ? '#dfc285' : '#c5a059'}
          emissive={isSelected ? '#c5a059' : '#000000'}
          emissiveIntensity={isSelected ? 0.9 : 0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Central Status Indicator Jewel */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.28, 14, 14]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={hovered || isSelected ? 1.6 : 0.85}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

/**
 * BuildingTower — Renders the Real Architectural 3D Model (japanese_building__cc0)
 * with interactive tower selection, vertical floor level highlighting, and 3D residence markers.
 */
export function BuildingTower({
  tower,
  isSelectedTower,
  selectedFloorNumber,
  selectedApartmentId,
  timeOfDay = 'golden',
  onSelectTower,
  onSelectFloor,
  onSelectApartment,
}: BuildingTowerProps) {
  const [hovered, setHovered] = useState(false);

  // Proportions and scale for each signature tower
  const scale = useMemo<[number, number, number]>(() => {
    switch (tower.id) {
      case 'tower-a':
        // Flagship landmark skyscraper: 24 storeys
        return [1.12, 1.72, 1.12];
      case 'tower-b':
        // Middle contemporary tower: 18 storeys
        return [1.02, 1.34, 1.02];
      case 'tower-c':
        // The Solstice luxury residential tower: exact 14-storey proportions
        return [0.88, 1.0, 0.88];
      default:
        return [1.0, 1.0, 1.0];
    }
  }, [tower.id]);

  // Model physical dimensions at base scale: width 16.85m, height 34.78m, depth 16.5m
  const modelWidth = 16.85 * scale[0];
  const modelHeight = 34.78 * scale[1];
  const modelDepth = 16.5 * scale[2];

  // Generate apartments for selected floor
  const currentFloorApartments = useMemo(() => {
    if (!isSelectedTower || selectedFloorNumber === null) return [];
    return getApartmentsForFloor(tower.id, selectedFloorNumber);
  }, [isSelectedTower, selectedFloorNumber, tower.id]);

  const handleTowerClick = (e: any) => {
    e.stopPropagation();
    if (!isSelectedTower) {
      onSelectTower(tower.id);
    }
  };

  // Calculate vertical height of selected floor
  const selectedFloorY = useMemo(() => {
    if (selectedFloorNumber === null) return null;
    const startY = 2.6 * scale[1];
    const usableHeight = modelHeight - 5.4 * scale[1];
    const floorFraction = (selectedFloorNumber - 1) / Math.max(1, tower.floorsCount - 1);
    return startY + floorFraction * usableHeight;
  }, [selectedFloorNumber, scale, modelHeight, tower.floorsCount]);

  return (
    <group
      position={tower.position}
      rotation={[0, tower.rotationY, 0]}
      onClick={handleTowerClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* 1. REAL ARCHITECTURAL 3D BUILDING MODEL (japanese_building__cc0) */}
      <JapaneseBuilding
        position={[0, 0, 0]}
        scale={scale}
        isHovered={hovered && !isSelectedTower}
        isSelected={isSelectedTower}
      />

      {/* 2. INTERACTIVE SELECTED FLOOR HIGHLIGHT BAND */}
      {isSelectedTower && selectedFloorY !== null && (
        <group position={[0, selectedFloorY, 0]}>
          {/* Luminous Warm Amber Floor Highlight Slice */}
          <mesh>
            <boxGeometry args={[modelWidth + 0.35, 1.8 * scale[1], modelDepth + 0.35]} />
            <meshStandardMaterial
              color="#dfc285"
              emissive="#c5a059"
              emissiveIntensity={0.85}
              transparent
              opacity={0.34}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>

          {/* Upper & Lower Crisp Accent Lines */}
          <mesh position={[0, (0.9 * scale[1]), 0]}>
            <boxGeometry args={[modelWidth + 0.42, 0.06, modelDepth + 0.42]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, (-0.9 * scale[1]), 0]}>
            <boxGeometry args={[modelWidth + 0.42, 0.06, modelDepth + 0.42]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* 3. INTERACTIVE 3D APARTMENT RESIDENCE MARKERS ON SELECTED FLOOR */}
      {isSelectedTower && selectedFloorY !== null && currentFloorApartments.length > 0 && (
        <group position={[0, selectedFloorY, 0]}>
          {currentFloorApartments.map((apt, aptIdx) => {
            const total = currentFloorApartments.length;
            const angle = (aptIdx / total) * Math.PI * 2;
            const markerRadius = Math.max(modelWidth, modelDepth) * 0.58 + 2.0;
            const mX = Math.cos(angle) * markerRadius;
            const mZ = Math.sin(angle) * markerRadius;
            const isSelected = selectedApartmentId === apt.id;

            return (
              <Unit3DMarker
                key={apt.id}
                apartment={apt}
                position={[mX, 0, mZ]}
                isSelected={isSelected}
                onSelect={() => onSelectApartment(apt)}
              />
            );
          })}
        </group>
      )}

      {/* 4. INVISIBLE RAYCAST HIT VOLUMES FOR FLOOR SELECTION ON MODEL */}
      {isSelectedTower &&
        Array.from({ length: tower.floorsCount }).map((_, idx) => {
          const floorNum = idx + 1;
          const startY = 2.6 * scale[1];
          const usableHeight = modelHeight - 5.4 * scale[1];
          const floorY = startY + ((floorNum - 1) / Math.max(1, tower.floorsCount - 1)) * usableHeight;
          const bandHeight = usableHeight / tower.floorsCount;

          return (
            <mesh
              key={`hit-floor-${floorNum}`}
              position={[0, floorY, 0]}
              visible={false}
              onClick={(e) => {
                e.stopPropagation();
                onSelectFloor(tower.id, floorNum);
              }}
            >
              <boxGeometry args={[modelWidth + 1.0, bandHeight, modelDepth + 1.0]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          );
        })}
    </group>
  );
}
