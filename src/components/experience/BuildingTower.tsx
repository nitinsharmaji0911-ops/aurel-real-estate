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

  // Tower Dimensions
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
      {/* 1. ARTICULATED LUXURY GRAND ARRIVAL PODIUM & LOBBY */}
      <group position={[0, lobbyHeight / 2, 0]}>
        {/* Podium Base Volume in Honed Travertine with crisp reveals */}
        <mesh castShadow receiveShadow position={[0, 0, -0.4]}>
          <boxGeometry args={[width + 1.4, lobbyHeight, depth + 0.6]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.podiumStone.color}
            roughness={ARCH_MATERIALS.podiumStone.roughness}
            metalness={ARCH_MATERIALS.podiumStone.metalness}
          />
        </mesh>

        {/* Double-Height Glass Curtain Wall Grand Lobby Facade */}
        <mesh position={[0, 0, (depth + 0.6) / 2 - 0.35]}>
          <boxGeometry args={[width * 0.82, lobbyHeight - 0.4, 0.1]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.curtainGlass.color}
            roughness={0.06}
            metalness={0.85}
            transparent
            opacity={0.86}
            emissive="#ffdca3"
            emissiveIntensity={0.25 * atmosphere.windowLightIntensity}
          />
        </mesh>

        {/* Interior Lobby Illuminated Travertine Feature Wall */}
        <mesh position={[0, 0, (depth + 0.6) / 2 - 1.8]}>
          <boxGeometry args={[width * 0.5, lobbyHeight - 0.8, 0.15]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestoneLight.color}
            emissive="#ffedd5"
            emissiveIntensity={0.3 * atmosphere.windowLightIntensity}
            roughness={0.5}
          />
        </mesh>

        {/* Monumental Colonnade Columns framing Lobby Entry */}
        {[-width * 0.38, -width * 0.15, width * 0.15, width * 0.38].map((cx, idx) => (
          <mesh key={`lobby-col-${idx}`} position={[cx, 0, (depth + 0.6) / 2 + 0.05]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, lobbyHeight, 12]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.limestone.color}
              roughness={ARCH_MATERIALS.limestone.roughness}
            />
          </mesh>
        ))}

        {/* Sculptural Cantilevered Port-Cochère Canopy in Champagne Bronze */}
        <group position={[0, 0.5, (depth + 0.6) / 2 + 1.8]}>
          <mesh castShadow>
            <boxGeometry args={[width * 0.68, 0.22, 3.4]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.champagneBronze.color}
              roughness={ARCH_MATERIALS.champagneBronze.roughness}
              metalness={ARCH_MATERIALS.champagneBronze.metalness}
            />
          </mesh>
          {/* Canopy Underside Timber Soffit with Warm Downlight Glow */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[width * 0.64, 0.02, 3.1]} />
            <meshStandardMaterial
              color="#ffe4b5"
              emissive="#ffd699"
              emissiveIntensity={0.55 * atmosphere.windowLightIntensity}
              roughness={0.4}
            />
          </mesh>
        </group>

        {/* Reflecting Pool Moat around Arrival Entry */}
        <group position={[0, -lobbyHeight / 2 + 0.12, (depth + 0.6) / 2 + 1.8]}>
          {/* Pool Water */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width + 2.4, 0.16, 2.6]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.waterPool.color}
              roughness={ARCH_MATERIALS.waterPool.roughness}
              metalness={ARCH_MATERIALS.waterPool.metalness}
            />
          </mesh>
          {/* Granite Stepping Entrance Bridge */}
          <mesh position={[0, 0.12, 0]} receiveShadow>
            <boxGeometry args={[width * 0.32, 0.1, 2.8]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.plazaTravertine.color}
              roughness={0.6}
            />
          </mesh>
        </group>

        {/* Stepped Podium Greenery Planters */}
        <group position={[-width / 2 - 0.4, -lobbyHeight / 2 + 0.4, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.8, depth * 0.7]} />
            <meshStandardMaterial color={ARCH_MATERIALS.limestoneLight.color} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.6, 0.2, depth * 0.66]} />
            <meshStandardMaterial color={ARCH_MATERIALS.boxwoodHedge.color} roughness={0.8} />
          </mesh>
        </group>
        <group position={[width / 2 + 0.4, -lobbyHeight / 2 + 0.4, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.8, depth * 0.7]} />
            <meshStandardMaterial color={ARCH_MATERIALS.limestoneLight.color} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.6, 0.2, depth * 0.66]} />
            <meshStandardMaterial color={ARCH_MATERIALS.boxwoodHedge.color} roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* 2. REFINED ARCHITECTURAL RESIDENTIAL FLOORS STACK */}
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

      {/* 3. DETAILED ARCHITECTURAL ROOFTOPS (Light Pavers & Louvers, NO Dark Slabs) */}
      <group position={[0, lobbyHeight + tower.floorsCount * floorHeight, 0]}>
        {/* Tower A Crown: Layered Architectural Penthouse, Glass Pool, Spire & Louvers */}
        {tower.id === 'tower-a' && (
          <group>
            {/* Light Travertine Roof Deck Pavers (No black surface!) */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[width * 0.88, 0.1, depth * 0.88]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.roofPaverLight.color}
                roughness={ARCH_MATERIALS.roofPaverLight.roughness}
              />
            </mesh>

            {/* Perimeter Sedum Green Roof Trays */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[width * 0.86, 0.06, depth * 0.86]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.greenRoof.color}
                roughness={0.8}
              />
            </mesh>

            {/* Mechanical Louver Screen in Satin Bronze & Graphite */}
            <mesh position={[0, 1.1, -0.4]} castShadow>
              <boxGeometry args={[width * 0.62, 2.0, depth * 0.58]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.mechanicalLouver.color}
                roughness={ARCH_MATERIALS.mechanicalLouver.roughness}
                metalness={ARCH_MATERIALS.mechanicalLouver.metalness}
              />
            </mesh>

            {/* Bronze Cornice Cap above Louver Screen */}
            <mesh position={[0, 2.15, -0.4]}>
              <boxGeometry args={[width * 0.66, 0.16, depth * 0.62]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.champagneBronze.color}
                roughness={ARCH_MATERIALS.champagneBronze.roughness}
                metalness={ARCH_MATERIALS.champagneBronze.metalness}
              />
            </mesh>

            {/* Glazed Penthouse Sky Observatory */}
            <mesh position={[0, 0.9, depth * 0.18]}>
              <boxGeometry args={[width * 0.52, 1.6, depth * 0.32]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.curtainGlass.color}
                emissive="#ffdca3"
                emissiveIntensity={0.45 * atmosphere.windowLightIntensity}
                roughness={0.1}
                metalness={0.85}
              />
            </mesh>

            {/* Cantilevered Glass Dipping Pool */}
            <group position={[0, 0.45, depth * 0.44 + 0.8]}>
              <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[width * 0.44, 0.3, 1.8]} />
                <meshStandardMaterial color={ARCH_MATERIALS.slabEdge.color} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[width * 0.40, 0.12, 1.6]} />
                <meshStandardMaterial
                  color="#00e5ff"
                  emissive="#00b4d8"
                  emissiveIntensity={0.85}
                  roughness={0.1}
                />
              </mesh>
            </group>

            {/* Sculptural Architectural Spire with Aviation Beacon */}
            <group position={[0, 2.25, -0.4]}>
              <mesh castShadow position={[0, 1.6, 0]}>
                <cylinderGeometry args={[0.06, 0.38, 3.2, 12]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.champagneBronze.color}
                  roughness={0.2}
                  metalness={0.85}
                />
              </mesh>
              <mesh position={[0, 3.2, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#ff3333" />
              </mesh>
            </group>
          </group>
        )}

        {/* Tower B Crown: Terraced Aerofoil Canopy & Sky Garden */}
        {tower.id === 'tower-b' && (
          <group>
            {/* Light Stone Roof Surface */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[width * 0.86, 0.1, depth * 0.86]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.roofPaverLight.color}
                roughness={ARCH_MATERIALS.roofPaverLight.roughness}
              />
            </mesh>

            {/* Mechanical Louver Enclosure */}
            <mesh position={[0, 0.9, -0.3]} castShadow>
              <boxGeometry args={[width * 0.65, 1.7, depth * 0.6]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.mechanicalLouver.color}
                roughness={ARCH_MATERIALS.mechanicalLouver.roughness}
                metalness={ARCH_MATERIALS.mechanicalLouver.metalness}
              />
            </mesh>

            {/* Sweeping Aerodynamic Champagne Bronze Canopy */}
            <mesh position={[0.3, 1.95, -0.1]} castShadow>
              <boxGeometry args={[width * 0.88, 0.18, depth * 0.88]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.champagneBronze.color}
                roughness={ARCH_MATERIALS.champagneBronze.roughness}
                metalness={ARCH_MATERIALS.champagneBronze.metalness}
              />
            </mesh>

            {/* Rooftop Sky Garden Lounge */}
            <mesh position={[0, 0.2, depth * 0.28]}>
              <boxGeometry args={[width * 0.55, 0.2, 1.4]} />
              <meshStandardMaterial color={ARCH_MATERIALS.greenRoof.color} roughness={0.85} />
            </mesh>
          </group>
        )}

        {/* Tower C Crown: Open Bronze Pergola & Sunset Terrace */}
        {tower.id === 'tower-c' && (
          <group>
            {/* Light Travertine Terrace Floor */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[width * 0.9, 0.1, depth * 0.9]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.plazaTravertine.color}
                roughness={ARCH_MATERIALS.plazaTravertine.roughness}
              />
            </mesh>

            {/* Elevator & Stair Core in Honed French Limestone */}
            <mesh position={[-curWidthDepthOffset(width), 0.75, -curWidthDepthOffset(depth)]} castShadow>
              <boxGeometry args={[width * 0.42, 1.4, depth * 0.42]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.limestone.color}
                roughness={ARCH_MATERIALS.limestone.roughness}
              />
            </mesh>

            {/* Open Bronze Pergola Trellis */}
            {[-2.2, -1.1, 0, 1.1, 2.2].map((px, idx) => (
              <mesh key={`c-beam-${idx}`} position={[px, 1.4, 0.2]}>
                <boxGeometry args={[0.08, 0.16, depth * 0.68]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.champagneBronze.color}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            ))}

            {/* Glass Windbreak Balustrade around Roof Terrace */}
            <mesh position={[0, 0.45, depth * 0.44]}>
              <boxGeometry args={[width * 0.86, 0.8, 0.03]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.balconyGlass.color}
                transparent
                opacity={ARCH_MATERIALS.balconyGlass.opacity}
              />
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

function curWidthDepthOffset(dim: number): number {
  return dim * 0.18;
}
