'use client';

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Tower, TowerId, Apartment } from '@/types/property';
import { getApartmentsForFloor } from '@/data/apartments';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';

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

// Lightweight 3D Interactive Apartment Unit Marker
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
      {/* Outer Floating Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.07, 8, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : hovered ? '#dfc285' : '#c5a059'}
          emissive={isSelected ? '#c5a059' : '#000000'}
          emissiveIntensity={isSelected ? 0.9 : 0}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Central Status Sphere */}
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

  // Floor dimensions based on tower personality
  const { width, depth, styleColor } = useMemo(() => {
    switch (tower.id) {
      case 'tower-a':
        return { width: 14.0, depth: 10.8, styleColor: '#c5a059' };
      case 'tower-b':
        return { width: 15.6, depth: 11.6, styleColor: '#b08968' };
      case 'tower-c':
        return { width: 12.4, depth: 9.4, styleColor: '#9e7d3b' };
      default:
        return { width: 13.5, depth: 10.5, styleColor: '#c5a059' };
    }
  }, [tower.id]);

  // Generate apartments for selected floor
  const currentFloorApartments = useMemo(() => {
    if (!isSelectedTower || selectedFloorNumber === null) return [];
    return getApartmentsForFloor(tower.id, selectedFloorNumber);
  }, [isSelectedTower, selectedFloorNumber, tower.id]);

  // Tower Click handler
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
      {/* 1. TRIPLE-HEIGHT TRAVERTINE GRAND LOBBY & PODIUM BASE */}
      <group position={[0, lobbyHeight / 2, 0]}>
        {/* Lobby Solid Core */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width + 3.6, lobbyHeight, depth + 3.6]} />
          <meshStandardMaterial
            color={isSelectedTower ? '#2a2b34' : '#1e1f26'}
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* Double-Height Glass Curtain Wall */}
        <mesh position={[0, 0, (depth + 3.6) / 2 + 0.05]}>
          <planeGeometry args={[width + 2.8, lobbyHeight - 0.6]} />
          <meshStandardMaterial
            color="#1c2d3d"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Grand Overhanging Bronze Port-Cochère Canopy */}
        <mesh position={[0, 0.5, (depth + 3.6) / 2 + 2.2]} castShadow>
          <boxGeometry args={[width * 0.75, 0.25, 3.8]} />
          <meshStandardMaterial color="#8c6e32" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Fluted Travertine Entry Columns */}
        {[-width / 2 - 0.4, width / 2 + 0.4].map((colX, idx) => (
          <mesh key={idx} position={[colX, 0, (depth + 3.6) / 2 + 1.8]}>
            <cylinderGeometry args={[0.35, 0.35, lobbyHeight, 12]} />
            <meshStandardMaterial color="#b39968" roughness={0.3} metalness={0.6} />
          </mesh>
        ))}

        {/* Surrounding Lobby Reflecting Water Moat */}
        <mesh position={[0, -lobbyHeight / 2 + 0.12, (depth + 3.6) / 2 + 2.2]}>
          <boxGeometry args={[width + 4.2, 0.2, 3.2]} />
          <meshStandardMaterial
            color="#0b2233"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>

      {/* 2. FLOORS STACK (Optimized Standard Materials for 60 FPS) */}
      {Array.from({ length: tower.floorsCount }).map((_, idx) => {
        const floorNumber = idx + 1;
        const floorY = lobbyHeight + idx * floorHeight + floorHeight / 2;
        const isFloorSelected = isSelectedTower && selectedFloorNumber === floorNumber;
        const isFloorHovered = isSelectedTower && hoveredFloor === floorNumber;

        const isPenthouseFloor = floorNumber >= tower.floorsCount - 1;
        const scaleMod = isPenthouseFloor ? 0.94 : 1.0;
        const curWidth = width * scaleMod;
        const curDepth = depth * scaleMod;

        const isUnitLit = (floorNumber * 7 + (idx % 3)) % 5 !== 0;

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
            {/* Floor Slab with Chamfered Bronze Nose Edge */}
            <mesh position={[0, -floorHeight / 2 + 0.14, 0]}>
              <boxGeometry args={[curWidth + 0.6, 0.28, curDepth + 0.6]} />
              <meshStandardMaterial
                color={
                  isFloorSelected
                    ? '#d4af37'
                    : isFloorHovered
                    ? '#c5a059'
                    : isSelectedTower
                    ? '#2d2e38'
                    : '#202128'
                }
                roughness={isFloorSelected ? 0.2 : 0.4}
                metalness={isFloorSelected ? 0.85 : 0.6}
                emissive={isFloorSelected ? '#c5a059' : isFloorHovered ? '#6e5628' : '#000000'}
                emissiveIntensity={isFloorSelected ? 0.8 : isFloorHovered ? 0.35 : 0}
              />
            </mesh>

            {/* Architectural Glass Curtain Wall (Fast Specular Standard Material) */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[curWidth, floorHeight - 0.28, curDepth]} />
              <meshStandardMaterial
                color={
                  isFloorSelected
                    ? '#f0d9a6'
                    : isFloorHovered
                    ? '#223445'
                    : isSelectedTower
                    ? '#16232f'
                    : '#111a22'
                }
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.88}
                emissive={
                  isFloorSelected
                    ? '#dfc285'
                    : isUnitLit
                    ? '#ffd48f'
                    : '#080d14'
                }
                emissiveIntensity={
                  isFloorSelected
                    ? 0.75
                    : isUnitLit
                    ? 0.35 * atmosphere.windowLightIntensity
                    : 0.05
                }
              />
            </mesh>

            {/* Front Balcony Base */}
            <mesh position={[0, -0.25, curDepth / 2 + 0.45]}>
              <boxGeometry args={[curWidth * 0.78, 0.85, 0.9]} />
              <meshStandardMaterial
                color={isFloorSelected ? '#dfc285' : '#25262e'}
                roughness={0.35}
                metalness={0.65}
              />
            </mesh>
            {/* Front Balcony Glass Balustrade */}
            <mesh position={[0, 0.4, curDepth / 2 + 0.88]}>
              <boxGeometry args={[curWidth * 0.77, 0.52, 0.05]} />
              <meshStandardMaterial
                color="#648cae"
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.55}
              />
            </mesh>

            {/* Architectural Vertical Bronze Fins */}
            {[-curWidth / 2 + 0.4, curWidth / 2 - 0.4].map((mX, mIdx) => (
              <mesh key={mIdx} position={[mX, 0, curDepth / 2 + 0.06]}>
                <boxGeometry args={[0.16, floorHeight - 0.12, 0.2]} />
                <meshStandardMaterial color={styleColor} roughness={0.25} metalness={0.85} />
              </mesh>
            ))}

            {/* ONLY ONE POINT LIGHT AT THE CURRENTLY SELECTED FLOOR */}
            {isFloorSelected && (
              <pointLight
                position={[0, 0, 0]}
                color="#ffd899"
                intensity={2.8}
                distance={18}
                decay={1.8}
              />
            )}
          </group>
        );
      })}

      {/* 3. ROOFTOP CROWN & PENTHOUSE */}
      <group position={[0, lobbyHeight + tower.floorsCount * floorHeight + 2.0, 0]}>
        {/* Tiered Architectural Core */}
        <mesh castShadow>
          <boxGeometry args={[width * 0.85, 3.8, depth * 0.85]} />
          <meshStandardMaterial color="#1e1f26" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Double-Height Sky Lounge Glazing */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[width * 0.88, 2.6, depth * 0.88]} />
          <meshStandardMaterial
            color="#293b4c"
            roughness={0.1}
            metalness={0.8}
            emissive="#ffd48a"
            emissiveIntensity={0.6 * atmosphere.windowLightIntensity}
          />
        </mesh>

        {/* Crown Architectural Bronze Lattice Trellis */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[width * 0.92, 0.5, depth * 0.92]} />
          <meshStandardMaterial
            color="#c5a059"
            emissive="#c5a059"
            emissiveIntensity={isSelectedTower ? 1.0 : 0.4}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Tower A Rooftop Cantilevered Sky Pool */}
        {tower.id === 'tower-a' && (
          <group position={[0, 1.0, depth * 0.45 + 1.1]}>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[width * 0.45, 0.35, 2.4]} />
              <meshStandardMaterial color="#22242c" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[width * 0.4, 0.12, 2.1]} />
              <meshStandardMaterial
                color="#00e5ff"
                emissive="#00b4d8"
                emissiveIntensity={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        )}

        {/* Signature Architectural Spire on Tower A */}
        {tower.id === 'tower-a' && (
          <group position={[0, 3.6, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.6, 4.2, 12]} />
              <meshStandardMaterial color="#dfc285" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshBasicMaterial color="#ff2222" />
            </mesh>
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
