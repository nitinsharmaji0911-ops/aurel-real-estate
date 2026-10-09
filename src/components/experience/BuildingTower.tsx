'use client';

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Tower, TowerId, Apartment } from '@/types/property';
import { getApartmentsForFloor } from '@/data/apartments';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';
import { ARCH_MATERIALS } from '@/lib/materials';
import { TowerAFloor } from './architectural/TowerAFacade';
import { TowerBFloor } from './architectural/TowerBFacade';
import { TowerCFloor } from './architectural/TowerCFacade';

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
      scale={hovered || isSelected ? [1.25, 1.25, 1.25] : [1, 1, 1]}
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
        <torusGeometry args={[0.55, 0.06, 8, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : hovered ? '#dfc285' : '#c5a059'}
          emissive={isSelected ? '#c5a059' : '#000000'}
          emissiveIntensity={isSelected ? 0.9 : 0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Central Status Jewel Indicator */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

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
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  const atmosphere = ATMOSPHERES[timeOfDay];
  const floorHeight = 1.85;
  const lobbyHeight = 3.6;

  // Dimensions
  const { width, depth } = useMemo(() => {
    switch (tower.id) {
      case 'tower-a':
        return { width: 14.0, depth: 10.8 };
      case 'tower-b':
        return { width: 15.6, depth: 11.6 };
      case 'tower-c':
        return { width: 12.4, depth: 9.4 };
      default:
        return { width: 13.5, depth: 10.5 };
    }
  }, [tower.id]);

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

  return (
    <group
      position={tower.position}
      rotation={[0, tower.rotationY, 0]}
      onClick={handleTowerClick}
    >
      {/* 1. ARCHITECTURAL GRAND ENTRANCE LOBBY & PODIUM */}
      <group position={[0, lobbyHeight / 2, 0]}>
        {/* Solid Core Structure in Warm Limestone */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width + 1.8, lobbyHeight, depth + 1.8]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.podiumStone.color}
            roughness={ARCH_MATERIALS.podiumStone.roughness}
            metalness={ARCH_MATERIALS.podiumStone.metalness}
          />
        </mesh>

        {/* Double-Height Glass Curtain Wall Facade */}
        <mesh position={[0, 0, (depth + 1.8) / 2 + 0.05]}>
          <planeGeometry args={[width + 1.2, lobbyHeight - 0.6]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.curtainGlass.color}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Structural Limestone Columns inside/outside lobby */}
        {[-width / 2, width / 2].map((colX, idx) => (
          <mesh key={`lobby-col-${idx}`} position={[colX, 0, (depth + 1.8) / 2 + 0.6]}>
            <cylinderGeometry args={[0.32, 0.32, lobbyHeight, 12]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.limestone.color}
              roughness={ARCH_MATERIALS.limestone.roughness}
            />
          </mesh>
        ))}

        {/* Grand Cantilevered Port-Cochère Canopy */}
        <mesh position={[0, 0.6, (depth + 1.8) / 2 + 2.2]} castShadow>
          <boxGeometry args={[width * 0.72, 0.22, 3.8]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>

        {/* Canopy Underside Soffit with Warm Downlight Accent */}
        <mesh position={[0, 0.48, (depth + 1.8) / 2 + 2.2]}>
          <boxGeometry args={[width * 0.68, 0.04, 3.4]} />
          <meshStandardMaterial
            color="#ffe9b8"
            emissive="#ffdca3"
            emissiveIntensity={0.6 * atmosphere.windowLightIntensity}
            roughness={0.3}
          />
        </mesh>

        {/* Reflecting Pool Moat around Entrance */}
        <mesh position={[0, -lobbyHeight / 2 + 0.1, (depth + 1.8) / 2 + 2.0]}>
          <boxGeometry args={[width + 3.2, 0.16, 2.8]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.waterPool.color}
            roughness={ARCH_MATERIALS.waterPool.roughness}
            metalness={ARCH_MATERIALS.waterPool.metalness}
          />
        </mesh>
      </group>

      {/* 2. REFINED ARCHITECTURAL FLOORS STACK */}
      {Array.from({ length: tower.floorsCount }).map((_, idx) => {
        const floorNumber = idx + 1;
        const floorY = lobbyHeight + idx * floorHeight;
        const isFloorSelected = isSelectedTower && selectedFloorNumber === floorNumber;
        const isFloorHovered = isSelectedTower && hoveredFloor === floorNumber;
        const isPenthouse = floorNumber >= tower.floorsCount - 2;

        return (
          <group
            key={floorNumber}
            position={[0, floorY, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (isSelectedTower) setHoveredFloor(floorNumber);
            }}
            onPointerOut={() => {
              if (isSelectedTower) setHoveredFloor(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelectedTower) {
                onSelectTower(tower.id);
              } else {
                onSelectFloor(tower.id, floorNumber);
              }
            }}
          >
            {/* Render distinct architectural facade per tower personality */}
            {tower.id === 'tower-a' && (
              <TowerAFloor
                floorNumber={floorNumber}
                width={width}
                depth={depth}
                floorHeight={floorHeight}
                isFloorSelected={isFloorSelected}
                isFloorHovered={isFloorHovered}
                isPenthouse={isPenthouse}
                windowLitIntensity={atmosphere.windowLightIntensity}
              />
            )}

            {tower.id === 'tower-b' && (
              <TowerBFloor
                floorNumber={floorNumber}
                width={width}
                depth={depth}
                floorHeight={floorHeight}
                isFloorSelected={isFloorSelected}
                isFloorHovered={isFloorHovered}
                isPenthouse={isPenthouse}
                windowLitIntensity={atmosphere.windowLightIntensity}
              />
            )}

            {tower.id === 'tower-c' && (
              <TowerCFloor
                floorNumber={floorNumber}
                width={width}
                depth={depth}
                floorHeight={floorHeight}
                isFloorSelected={isFloorSelected}
                isFloorHovered={isFloorHovered}
                isPenthouse={isPenthouse}
                windowLitIntensity={atmosphere.windowLightIntensity}
              />
            )}
          </group>
        );
      })}

      {/* 3. DISTINCT ARCHITECTURAL ROOFTOPS & PARAPETS */}
      <group position={[0, lobbyHeight + tower.floorsCount * floorHeight, 0]}>
        {/* Tower A Crown: Tiered Mechanical Screen & Spire */}
        {tower.id === 'tower-a' && (
          <group>
            {/* Penthouse Parapet Screen */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[width * 0.82, 2.4, depth * 0.82]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.limestone.color}
                roughness={ARCH_MATERIALS.limestone.roughness}
              />
            </mesh>
            {/* Bronze Cornice Cap */}
            <mesh position={[0, 2.45, 0]}>
              <boxGeometry args={[width * 0.86, 0.25, depth * 0.86]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.champagneBronze.color}
                roughness={ARCH_MATERIALS.champagneBronze.roughness}
                metalness={ARCH_MATERIALS.champagneBronze.metalness}
              />
            </mesh>
            {/* Cantilevered Glass Dipping Pool on 24th floor */}
            <group position={[0, 0.6, depth * 0.42 + 0.9]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[width * 0.42, 0.3, 2.0]} />
                <meshStandardMaterial color={ARCH_MATERIALS.slabEdge.color} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[width * 0.38, 0.12, 1.8]} />
                <meshStandardMaterial
                  color="#00e5ff"
                  emissive="#00b4d8"
                  emissiveIntensity={0.8}
                  roughness={0.1}
                />
              </mesh>
            </group>
            {/* Elegant Architectural Spire & Aviation Beacon */}
            <group position={[0, 2.6, 0]}>
              <mesh castShadow position={[0, 1.6, 0]}>
                <cylinderGeometry args={[0.06, 0.45, 3.2, 12]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.champagneBronze.color}
                  roughness={0.2}
                  metalness={0.85}
                />
              </mesh>
              <mesh position={[0, 3.2, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#ff2222" />
              </mesh>
            </group>
          </group>
        )}

        {/* Tower B Crown: Sculptural Terraced Folded Roofline */}
        {tower.id === 'tower-b' && (
          <group>
            <mesh position={[0, 1.0, 0]} castShadow>
              <boxGeometry args={[width * 0.82, 2.0, depth * 0.82]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.limestone.color}
                roughness={ARCH_MATERIALS.limestone.roughness}
              />
            </mesh>
            {/* Cantilevered Bronze Canopy Overhang */}
            <mesh position={[0.4, 2.1, 0]}>
              <boxGeometry args={[width * 0.94, 0.22, depth * 0.94]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.champagneBronze.color}
                roughness={ARCH_MATERIALS.champagneBronze.roughness}
                metalness={ARCH_MATERIALS.champagneBronze.metalness}
              />
            </mesh>
          </group>
        )}

        {/* Tower C Crown: Open Bronze Pergola Trellis */}
        {tower.id === 'tower-c' && (
          <group>
            {/* Parapet Base */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[width * 0.86, 1.2, depth * 0.86]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.limestone.color}
                roughness={ARCH_MATERIALS.limestone.roughness}
              />
            </mesh>
            {/* Open Pergola Beams */}
            {[-2.5, -1.2, 0, 1.2, 2.5].map((px, idx) => (
              <mesh key={`beam-${idx}`} position={[px, 1.5, 0]}>
                <boxGeometry args={[0.12, 0.2, depth * 0.9]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.champagneBronze.color}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* 4. 3D APARTMENT UNIT SELECTOR MARKERS */}
      {isSelectedTower && selectedFloorNumber !== null && currentFloorApartments.length > 0 && (
        <group
          position={[
            0,
            lobbyHeight + (selectedFloorNumber - 1) * floorHeight + floorHeight / 2,
            0,
          ]}
        >
          {currentFloorApartments.map((apt, aptIdx) => {
            const total = currentFloorApartments.length;
            const angle = (aptIdx / total) * Math.PI * 2;
            const markerRadius = Math.max(width, depth) * 0.65 + 1.8;
            const mX = Math.cos(angle) * markerRadius;
            const mZ = Math.sin(angle) * markerRadius;
            const isSelected = selectedApartmentId === apt.id;

            return (
              <Unit3DMarker
                key={apt.id}
                apartment={apt}
                position={[mX, 0.2, mZ]}
                isSelected={isSelected}
                onSelect={() => onSelectApartment(apt)}
              />
            );
          })}
        </group>
      )}
    </group>
  );
}
