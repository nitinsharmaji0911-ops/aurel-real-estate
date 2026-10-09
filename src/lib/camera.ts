import * as THREE from 'three';
import { TowerId } from '@/types/property';
import { TOWERS } from '@/data/development';

export interface CameraViewConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const OVERVIEW_CAMERA: CameraViewConfig = {
  position: [38, 34, 52],
  target: [2, 12, -4],
  fov: 42,
};

export const TOWER_CAMERAS: Record<TowerId, CameraViewConfig> = {
  'tower-a': {
    position: [-34, 38, 22],
    target: [-16, 28, -6],
    fov: 40,
  },
  'tower-b': {
    position: [20, 38, 16],
    target: [6, 25, -18],
    fov: 40,
  },
  'tower-c': {
    position: [36, 28, 30],
    target: [20, 18, 8],
    fov: 40,
  },
};

export function getFloorCameraView(towerId: TowerId, floorNumber: number): CameraViewConfig {
  const tower = TOWERS.find((t) => t.id === towerId) || TOWERS[0];
  const floorHeightRatio = floorNumber / tower.floorsCount;
  const targetY = 3.5 + floorHeightRatio * (tower.heightMeters * 0.45);

  const [tx, , tz] = tower.position;

  // Offset camera close to the specific floor level with a luxury architectural perspective
  let offsetX = 18;
  let offsetZ = 22;
  let offsetY = 7;

  if (towerId === 'tower-a') {
    offsetX = -16;
    offsetZ = 20;
    offsetY = 6;
  } else if (towerId === 'tower-b') {
    offsetX = 16;
    offsetZ = 22;
    offsetY = 6;
  } else {
    offsetX = 16;
    offsetZ = 16;
    offsetY = 5;
  }

  return {
    position: [tx + offsetX, targetY + offsetY, tz + offsetZ],
    target: [tx, targetY, tz],
    fov: 38,
  };
}

export function getApartmentCameraView(
  towerId: TowerId,
  floorNumber: number,
  apartmentIndex: number,
  totalUnitsOnFloor: number
): CameraViewConfig {
  const tower = TOWERS.find((t) => t.id === towerId) || TOWERS[0];
  const floorHeightRatio = floorNumber / tower.floorsCount;
  const targetY = 3.5 + floorHeightRatio * (tower.heightMeters * 0.45);
  const [tx, , tz] = tower.position;

  // Determine angle around tower based on unit index
  const angle = (apartmentIndex / totalUnitsOnFloor) * Math.PI * 2 + 0.3;
  const radius = 18;
  const camX = tx + Math.cos(angle) * radius;
  const camZ = tz + Math.sin(angle) * radius;

  return {
    position: [camX, targetY + 3.5, camZ],
    target: [tx, targetY, tz],
    fov: 34,
  };
}
