'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TOWERS } from '@/data/development';
import { TowerId, Apartment } from '@/types/property';
import { BuildingTower } from './BuildingTower';
import { getProceduralWaterNormalTexture } from '@/lib/water-texture';
import { TimeOfDay, ATMOSPHERES } from '@/lib/scene-config';
import { ARCH_MATERIALS } from '@/lib/materials';
import { JapaneseBuilding } from './architectural/JapaneseBuilding';

interface ProceduralDevelopmentProps {
  selectedTowerId: TowerId | null;
  selectedFloorNumber: number | null;
  selectedApartmentId: string | null;
  timeOfDay: TimeOfDay;
  onSelectTower: (towerId: TowerId) => void;
  onSelectFloor: (towerId: TowerId, floorNumber: number) => void;
  onSelectApartment: (apartment: Apartment) => void;
}

// 1. DYNAMIC OCEAN WATER WITH SPECULAR REFLECTION
function DynamicWater({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const normalMap = useMemo(() => getProceduralWaterNormalTexture(), []);
  const atmosphere = ATMOSPHERES[timeOfDay];

  useFrame((_, delta) => {
    if (normalMap) {
      normalMap.offset.x += delta * 0.015;
      normalMap.offset.y += delta * 0.01;
    }
  });

  return (
    <mesh receiveShadow position={[-46, -0.05, 0]}>
      <boxGeometry args={[36, 0.2, 140]} />
      <meshStandardMaterial
        color={atmosphere.waterColor}
        normalMap={normalMap || undefined}
        normalScale={new THREE.Vector2(0.65, 0.65)}
        roughness={0.1}
        metalness={0.88}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// 2. LUXURY SUPERYACHT (Streamlined Marine Craft)
function LuxuryYacht({
  position,
  rotationY = 0,
  scale = 1,
  bobOffset = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  bobOffset?: number;
}) {
  const yachtRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (yachtRef.current) {
      const t = clock.getElapsedTime() * 1.2 + bobOffset;
      yachtRef.current.position.y = position[1] + Math.sin(t) * 0.05;
      yachtRef.current.rotation.z = Math.sin(t * 0.8) * 0.012;
    }
  });

  return (
    <group ref={yachtRef} position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* Sleek Hull in Marine Gelcoat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.2, 0.8, 11]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Aerodynamic Bow */}
      <mesh position={[0, 0.45, 6]}>
        <coneGeometry args={[1.6, 2.2, 4]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.2} metalness={0.25} />
      </mesh>
      {/* Teak Swim Platform */}
      <mesh position={[0, 0.25, -5.6]}>
        <boxGeometry args={[2.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#6b4c2e" roughness={0.7} />
      </mesh>
      {/* Main Deck Cabin */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[2.5, 0.75, 6.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Panoramic Glazing */}
      <mesh position={[0, 1.15, 0.5]}>
        <boxGeometry args={[2.55, 0.35, 6.4]} />
        <meshStandardMaterial
          color="#162635"
          emissive="#ffd79e"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Flybridge Deck */}
      <mesh position={[0, 1.75, -0.4]}>
        <boxGeometry args={[2.1, 0.55, 4.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
    </group>
  );
}

// 3. ARCHITECTURAL STREETLUMINAIRE
function ArchitecturalStreetlamp({
  position,
  intensity = 1.0,
}: {
  position: [number, number, number];
  intensity?: number;
}) {
  return (
    <group position={position}>
      {/* Slender Graphite Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 6]} />
        <meshStandardMaterial color="#22252c" roughness={0.45} metalness={0.7} />
      </mesh>
      {/* Cantilevered Bronze Arm */}
      <mesh position={[0.4, 4.3, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.08]} />
        <meshStandardMaterial color="#9e845a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Luminaire Head */}
      <mesh position={[0.8, 4.25, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.18]} />
        <meshBasicMaterial color="#fff2d1" />
      </mesh>
    </group>
  );
}

// 4. HIGH-DETAIL ARCHITECTURAL TREES
function ArchitecturalTree({
  position,
  type = 'cypress',
  scale = 1,
}: {
  position: [number, number, number];
  type?: 'cypress' | 'pine' | 'canopy';
  scale?: number;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Granite Planter Curb */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.3, 0.2, 14]} />
        <meshStandardMaterial color={ARCH_MATERIALS.graniteCurb.color} roughness={0.65} />
      </mesh>
      {/* Mulch Soil */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 14]} />
        <meshStandardMaterial color="#2b2118" roughness={0.9} />
      </mesh>

      {/* Textured Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 2.8, 8]} />
        <meshStandardMaterial color="#3a2e22" roughness={0.85} />
      </mesh>

      {/* Layered Foliage Canopies */}
      {type === 'cypress' && (
        <group position={[0, 2.2, 0]}>
          <mesh castShadow position={[0, 1.0, 0]}>
            <coneGeometry args={[1.2, 2.5, 9]} />
            <meshStandardMaterial color="#213a27" roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, 2.1, 0]}>
            <coneGeometry args={[0.95, 2.1, 9]} />
            <meshStandardMaterial color="#28442e" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 3.1, 0]}>
            <coneGeometry args={[0.62, 1.7, 8]} />
            <meshStandardMaterial color="#325239" roughness={0.65} />
          </mesh>
        </group>
      )}

      {type === 'pine' && (
        <group position={[0, 2.6, 0]}>
          <mesh castShadow position={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[1.5, 1.7, 0.55, 8]} />
            <meshStandardMaterial color="#26422d" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[-0.2, 0.8, -0.1]}>
            <cylinderGeometry args={[1.2, 1.4, 0.5, 8]} />
            <meshStandardMaterial color="#2f4e36" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0.1, 1.6, 0]}>
            <cylinderGeometry args={[0.85, 1.05, 0.45, 8]} />
            <meshStandardMaterial color="#38593f" roughness={0.65} />
          </mesh>
        </group>
      )}

      {type === 'canopy' && (
        <mesh castShadow position={[0, 3.3, 0]}>
          <dodecahedronGeometry args={[1.75, 1]} />
          <meshStandardMaterial color="#26402b" roughness={0.75} />
        </mesh>
      )}
    </group>
  );
}

// 5. ARTICULATED CONTEMPORARY LOW-RISE PODIUM BUILDING (No Featureless Blocks!)
function ArchitecturalSiteBuilding({
  position,
  args,
  rotationY = 0,
  windowIntensity = 1,
}: {
  position: [number, number, number];
  args: [number, number, number];
  rotationY?: number;
  windowIntensity?: number;
}) {
  const [bWidth, bHeight, bDepth] = args;
  const floorHeight = 3.4;
  const floorCount = Math.max(2, Math.floor(bHeight / floorHeight));
  const baySpacing = 3.6;
  const numBaysX = Math.max(2, Math.floor((bWidth - 1.2) / baySpacing));
  const numBaysZ = Math.max(2, Math.floor((bDepth - 1.2) / baySpacing));

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* A. GROUND FLOOR DOUBLE-HEIGHT LOBBY / RETAIL VOLUME */}
      <group position={[0, 1.7, 0]}>
        {/* Recessed Ground Glazing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[bWidth - 0.4, 3.2, bDepth - 0.4]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.curtainGlass.color}
            roughness={0.1}
            metalness={0.85}
            transparent
            opacity={0.85}
            emissive="#ffe4b5"
            emissiveIntensity={0.28 * windowIntensity}
          />
        </mesh>
        {/* Exterior Limestone Colonnade */}
        {[-bWidth / 2 + 0.3, bWidth / 2 - 0.3].map((cx, idx) => (
          <mesh key={`col-g-${idx}`} position={[cx, 0, bDepth / 2 - 0.2]} castShadow>
            <cylinderGeometry args={[0.26, 0.3, 3.4, 10]} />
            <meshStandardMaterial
              color={ARCH_MATERIALS.limestone.color}
              roughness={ARCH_MATERIALS.limestone.roughness}
            />
          </mesh>
        ))}
        {/* Entrance Portal Canopy in Champagne Bronze */}
        <mesh position={[0, 1.6, bDepth / 2 + 0.6]} castShadow>
          <boxGeometry args={[bWidth * 0.45, 0.18, 1.4]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      </group>

      {/* B. MID-RISE RESIDENTIAL / COMMERCIAL LEVELS */}
      {Array.from({ length: floorCount - 1 }).map((_, fIdx) => {
        const fY = 3.4 + fIdx * floorHeight + floorHeight / 2;
        return (
          <group key={`floor-${fIdx}`} position={[0, fY, 0]}>
            {/* Floor Slab / Spandrel Ribbon in Warm French Limestone */}
            <mesh position={[0, -floorHeight / 2 + 0.2, 0]}>
              <boxGeometry args={[bWidth, 0.4, bDepth]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.limestone.color}
                roughness={ARCH_MATERIALS.limestone.roughness}
                metalness={ARCH_MATERIALS.limestone.metalness}
              />
            </mesh>

            {/* Recessed Vision Glass Core */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[bWidth - 0.3, floorHeight - 0.45, bDepth - 0.3]} />
              <meshStandardMaterial
                color={ARCH_MATERIALS.curtainGlass.color}
                roughness={0.12}
                metalness={0.8}
                transparent
                opacity={0.85}
                emissive="#ffdca3"
                emissiveIntensity={0.18 * windowIntensity}
              />
            </mesh>

            {/* Vertical Graphite Mullions across Front & Rear Facades */}
            {Array.from({ length: numBaysX }).map((_, bIdx) => {
              const bayX = -bWidth / 2 + 1.2 + bIdx * baySpacing;
              return (
                <group key={`mull-b-${bIdx}`}>
                  <mesh position={[bayX, 0.2, bDepth / 2 - 0.1]}>
                    <boxGeometry args={[0.08, floorHeight - 0.45, 0.12]} />
                    <meshStandardMaterial
                      color={ARCH_MATERIALS.graphiteFrame.color}
                      roughness={ARCH_MATERIALS.graphiteFrame.roughness}
                      metalness={ARCH_MATERIALS.graphiteFrame.metalness}
                    />
                  </mesh>
                  <mesh position={[bayX, 0.2, -bDepth / 2 + 0.1]}>
                    <boxGeometry args={[0.08, floorHeight - 0.45, 0.12]} />
                    <meshStandardMaterial
                      color={ARCH_MATERIALS.graphiteFrame.color}
                      roughness={ARCH_MATERIALS.graphiteFrame.roughness}
                      metalness={ARCH_MATERIALS.graphiteFrame.metalness}
                    />
                  </mesh>
                </group>
              );
            })}

            {/* Solid Structural Corner Piers */}
            {[
              [-bWidth / 2 + 0.2, bDepth / 2 - 0.2],
              [bWidth / 2 - 0.2, bDepth / 2 - 0.2],
              [-bWidth / 2 + 0.2, -bDepth / 2 + 0.2],
              [bWidth / 2 - 0.2, -bDepth / 2 + 0.2],
            ].map(([cx, cz], idx) => (
              <mesh key={`col-corner-${idx}`} position={[cx, 0.2, cz]} castShadow>
                <boxGeometry args={[0.42, floorHeight - 0.45, 0.42]} />
                <meshStandardMaterial
                  color={ARCH_MATERIALS.limestone.color}
                  roughness={ARCH_MATERIALS.limestone.roughness}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* C. ARTICULATED ROOF TERRACE & MECHANICAL PENTHOUSE (NO BLANK BLACK SLABS!) */}
      <group position={[0, bHeight, 0]}>
        {/* Light Stone Roof Paving Deck */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[bWidth - 0.2, 0.16, bDepth - 0.2]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.roofPaverLight.color}
            roughness={ARCH_MATERIALS.roofPaverLight.roughness}
          />
        </mesh>

        {/* Green Roof Sedum Planter Section */}
        <mesh position={[bWidth * 0.12, 0.18, 0]}>
          <boxGeometry args={[bWidth * 0.45, 0.08, bDepth * 0.55]} />
          <meshStandardMaterial color={ARCH_MATERIALS.greenRoof.color} roughness={0.85} />
        </mesh>

        {/* Recessed Mechanical Penthouse with Louver Cladding */}
        <mesh position={[-bWidth * 0.18, 0.9, 0]} castShadow>
          <boxGeometry args={[bWidth * 0.38, 1.6, bDepth * 0.48]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.mechanicalLouver.color}
            roughness={ARCH_MATERIALS.mechanicalLouver.roughness}
            metalness={ARCH_MATERIALS.mechanicalLouver.metalness}
          />
        </mesh>

        {/* Layered Parapet Coping with Champagne Bronze Trim */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[bWidth + 0.15, 0.35, bDepth + 0.15]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
      </group>
    </group>
  );
}

export function ProceduralDevelopment({
  selectedTowerId,
  selectedFloorNumber,
  selectedApartmentId,
  timeOfDay,
  onSelectTower,
  onSelectFloor,
  onSelectApartment,
}: ProceduralDevelopmentProps) {
  const atmosphere = ATMOSPHERES[timeOfDay];

  // Refined tree distribution
  const trees = useMemo<
    Array<{ pos: [number, number, number]; type: 'cypress' | 'pine' | 'canopy'; s: number }>
  >(() => {
    return [
      { pos: [-8, 0, 8], type: 'cypress', s: 1.1 },
      { pos: [-12, 0, 14], type: 'pine', s: 1.05 },
      { pos: [-4, 0, 16], type: 'cypress', s: 1.2 },
      { pos: [0, 0, 8], type: 'canopy', s: 1.0 },
      { pos: [6, 0, 14], type: 'cypress', s: 0.95 },
      { pos: [12, 0, 6], type: 'pine', s: 1.15 },
      { pos: [14, 0, 18], type: 'canopy', s: 1.0 },
      { pos: [26, 0, -4], type: 'cypress', s: 1.2 },
      { pos: [18, 0, -8], type: 'pine', s: 1.05 },
      { pos: [-6, 0, -14], type: 'cypress', s: 1.1 },
      { pos: [-18, 0, -22], type: 'pine', s: 1.25 },
      { pos: [-24, 0, -10], type: 'cypress', s: 1.0 },
      { pos: [-28, 0, 6], type: 'canopy', s: 1.1 },
      { pos: [28, 0, 22], type: 'cypress', s: 1.1 },
      { pos: [10, 0, 26], type: 'pine', s: 1.2 },
      { pos: [-2, 0, 24], type: 'cypress', s: 0.95 },
      { pos: [-16, 0, 22], type: 'canopy', s: 1.0 },
      { pos: [32, 0, -8], type: 'pine', s: 1.1 },
      { pos: [2, 0, -28], type: 'cypress', s: 1.2 },
    ];
  }, []);

  const streetlamps: Array<[number, number, number]> = [
    [-28, 0, 34],
    [-14, 0, 34],
    [0, 0, 34],
    [14, 0, 34],
    [28, 0, 34],
    [-27, 0, 10],
    [-27, 0, -10],
    [-27, 0, -26],
  ];

  return (
    <group>
      {/* 1. MASTER GROUND SITE WITH LIGHT WARM GRANITE & TRAVERTINE PLAZA (NO BLACK SLAB!) */}
      {/* Primary Light Granite Base */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[145, 0.4, 145]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.granitePaving.color}
          roughness={ARCH_MATERIALS.granitePaving.roughness}
        />
      </mesh>

      {/* Decorative French Limestone Plaza Banding */}
      <mesh receiveShadow position={[2, 0.01, 4]}>
        <boxGeometry args={[56, 0.04, 48]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.plazaTravertine.color}
          roughness={ARCH_MATERIALS.plazaTravertine.roughness}
        />
      </mesh>

      {/* 2. DYNAMIC OCEAN WATER */}
      <DynamicWater timeOfDay={timeOfDay} />

      {/* 3. MARINA WATERFRONT PROMENADE & YACHTS */}
      <group position={[-46, 0, 0]}>
        {/* Light Grey Granite Seawall */}
        <mesh receiveShadow position={[17.5, 0.25, 0]}>
          <boxGeometry args={[3.2, 0.6, 138]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.graniteCurb.color}
            roughness={0.65}
          />
        </mesh>
        {/* Teak Boardwalk Promenade */}
        <mesh receiveShadow position={[15.6, 0.35, 0]}>
          <boxGeometry args={[1.4, 0.15, 138]} />
          <meshStandardMaterial color="#543c27" roughness={0.7} />
        </mesh>
        {/* Champagne Bronze Safety Handrail */}
        <mesh position={[14.8, 0.75, 0]}>
          <boxGeometry args={[0.06, 0.65, 138]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Piers & Moored Luxury Yachts */}
        {[
          { z: -38, yRot: 0.05, scale: 1.05 },
          { z: -14, yRot: -0.08, scale: 1.15 },
          { z: 14, yRot: 0.06, scale: 0.95 },
          { z: 38, yRot: -0.04, scale: 1.1 },
        ].map((pier, idx) => (
          <group key={idx} position={[5.5, 0.15, pier.z]}>
            <mesh receiveShadow>
              <boxGeometry args={[17, 0.3, 2.4]} />
              <meshStandardMaterial color="#3b2b1e" roughness={0.75} />
            </mesh>
            <mesh position={[-7.8, 0.4, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.5, 6]} />
              <meshBasicMaterial color="#dfc285" />
            </mesh>
            <LuxuryYacht
              position={[-1.2, 0.05, 3.8]}
              rotationY={pier.yRot}
              scale={pier.scale}
              bobOffset={idx * 1.5}
            />
          </group>
        ))}
      </group>

      {/* 4. CENTRAL PODIUM PARK, WATER MIRROR & SUNKEN LAWN */}
      {/* Landscaped Turf Mound */}
      <mesh receiveShadow position={[2, 0.02, 2]}>
        <cylinderGeometry args={[23, 24, 0.16, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.lawnGrass.color}
          roughness={ARCH_MATERIALS.lawnGrass.roughness}
        />
      </mesh>

      {/* Travertine Retaining Curb Border around Lawn */}
      <mesh position={[2, 0.12, 2]}>
        <torusGeometry args={[23.2, 0.28, 8, 36]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.plazaTravertine.color}
          roughness={0.65}
        />
      </mesh>

      {/* Central Water Mirror Pool with Stepped Limestone Rim */}
      <mesh receiveShadow position={[2, 0.14, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 0.16, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.waterPool.color}
          roughness={ARCH_MATERIALS.waterPool.roughness}
          metalness={ARCH_MATERIALS.waterPool.metalness}
        />
      </mesh>
      <mesh position={[2, 0.24, 0]}>
        <torusGeometry args={[8.5, 0.35, 8, 28]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.limestone.color}
          roughness={ARCH_MATERIALS.limestone.roughness}
        />
      </mesh>

      {/* 5. WELLNESS CLUBHOUSE PAVILION (Contemporary Glass & Bronze Architecture) */}
      <group position={[18, 0, -2]}>
        {/* Limestone Solid Wing */}
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <boxGeometry args={[13, 3.2, 8.5]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.limestone.color}
            roughness={ARCH_MATERIALS.limestone.roughness}
          />
        </mesh>
        {/* Floor-to-Ceiling Glass Facade */}
        <mesh position={[0, 1.6, 4.3]}>
          <planeGeometry args={[12, 2.8]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.curtainGlass.color}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Cantilevered Overhanging Bronze Roof */}
        <mesh position={[0, 3.3, 0]}>
          <boxGeometry args={[14.6, 0.28, 10.2]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.champagneBronze.color}
            roughness={ARCH_MATERIALS.champagneBronze.roughness}
            metalness={ARCH_MATERIALS.champagneBronze.metalness}
          />
        </mesh>
        {/* Outdoor Lap Pool with Turquoise Glow */}
        <mesh position={[0, 0.3, 7.5]}>
          <boxGeometry args={[9.8, 0.1, 3.2]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#0096c7"
            emissiveIntensity={0.85}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 6. ROADWAYS, LIGHT GREY GRANITE CURBS & CROSSWALKS */}
      {/* Asphalt Driveway */}
      <mesh receiveShadow position={[0, 0.02, 34]}>
        <boxGeometry args={[95, 0.08, 7.0]} />
        <meshStandardMaterial
          color={ARCH_MATERIALS.asphaltRoad.color}
          roughness={ARCH_MATERIALS.asphaltRoad.roughness}
        />
      </mesh>
      {/* Light Grey Granite Road Curbs on North & South edges of road */}
      <mesh receiveShadow position={[0, 0.08, 30.4]}>
        <boxGeometry args={[95, 0.14, 0.25]} />
        <meshStandardMaterial color={ARCH_MATERIALS.graniteCurb.color} roughness={0.65} />
      </mesh>
      <mesh receiveShadow position={[0, 0.08, 37.6]}>
        <boxGeometry args={[95, 0.14, 0.25]} />
        <meshStandardMaterial color={ARCH_MATERIALS.graniteCurb.color} roughness={0.65} />
      </mesh>

      {/* Center Dashed Road Markings */}
      {[-30, -15, 0, 15, 30].map((rx, idx) => (
        <mesh key={`dash-${idx}`} position={[rx, 0.07, 34]}>
          <planeGeometry args={[4.0, 0.28]} />
          <meshStandardMaterial
            color={ARCH_MATERIALS.roadMarking.color}
            roughness={ARCH_MATERIALS.roadMarking.roughness}
          />
        </mesh>
      ))}

      {/* Pedestrian Crosswalks */}
      {[-2, -1, 0, 1, 2].map((zi, idx) => (
        <mesh key={`cross-${idx}`} position={[-16, 0.07, 32.2 + zi * 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 2.6]} />
          <meshStandardMaterial color={ARCH_MATERIALS.roadMarking.color} roughness={0.6} />
        </mesh>
      ))}

      {/* 7. ARCHITECTURAL STREETLAMPS */}
      {streetlamps.map((pos, idx) => (
        <ArchitecturalStreetlamp
          key={idx}
          position={pos}
          intensity={atmosphere.streetLightIntensity}
        />
      ))}

      {/* 8. ARCHITECTURAL TREES */}
      {trees.map((t, idx) => (
        <ArchitecturalTree key={idx} position={t.pos} type={t.type} scale={t.s} />
      ))}

      {/* 9. REAL ARCHITECTURAL 3D MODELS (japanese_building__cc0) & CONTEMPORARY SITE BUILDINGS */}
      {/* Prominent Foreground Real Japanese Architectural Models */}
      <JapaneseBuilding
        position={[14, 0, 50]}
        rotationY={-0.12}
        scale={0.92}
      />
      <JapaneseBuilding
        position={[-22, 0, 48]}
        rotationY={0.08}
        scale={0.88}
      />
      <JapaneseBuilding
        position={[46, 0, 36]}
        rotationY={0.2}
        scale={0.82}
      />

      {/* Surrounding Context Buildings */}
      <ArchitecturalSiteBuilding
        position={[50, 0, -18]}
        args={[24, 24, 18]}
        rotationY={-0.15}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ArchitecturalSiteBuilding
        position={[38, 0, -44]}
        args={[30, 18, 16]}
        rotationY={0.1}
        windowIntensity={atmosphere.windowLightIntensity}
      />
      <ArchitecturalSiteBuilding
        position={[-18, 0, -50]}
        args={[34, 22, 18]}
        rotationY={-0.08}
        windowIntensity={atmosphere.windowLightIntensity}
      />

      {/* 10. RESIDENTIAL TOWERS */}
      {TOWERS.map((tower) => (
        <BuildingTower
          key={tower.id}
          tower={tower}
          isSelectedTower={selectedTowerId === tower.id}
          selectedFloorNumber={selectedTowerId === tower.id ? selectedFloorNumber : null}
          selectedApartmentId={selectedTowerId === tower.id ? selectedApartmentId : null}
          timeOfDay={timeOfDay}
          onSelectTower={onSelectTower}
          onSelectFloor={onSelectFloor}
          onSelectApartment={onSelectApartment}
        />
      ))}
    </group>
  );
}
