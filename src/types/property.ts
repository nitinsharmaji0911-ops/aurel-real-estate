export type TowerId = 'tower-a' | 'tower-b' | 'tower-c';

export type ApartmentStatus = 'available' | 'reserved' | 'sold';

export type ApartmentType = '1 BHK' | '2 BHK' | '3 BHK' | 'Penthouse Suite';

export type ViewingMode = 'overview' | 'tower' | 'floor' | 'apartment' | 'floorplan' | 'gallery';

export interface RoomDetail {
  name: string;
  dimensions: string; // e.g., "18'0\" x 14'6\""
  areaSqFt: number;
}

export interface FloorPlanData {
  svgId: string;
  totalArea: number;
  rooms: RoomDetail[];
  highlights: string[];
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Living Room' | 'Master Bedroom' | 'Balcony & View' | 'Kitchen & Dining' | 'Bathroom';
  description: string;
  accentColor: string;
}

export interface Apartment {
  id: string; // e.g. "A-1801"
  unitNumber: string; // "1801"
  towerId: TowerId;
  floorNumber: number;
  type: ApartmentType;
  carpetAreaSqFt: number;
  superBuiltUpSqFt: number;
  indicativePrice: string; // e.g. "$1,850,000"
  status: ApartmentStatus;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  facing: string; // e.g. "Panoramic Waterfront & Sunset"
  floorPlan: FloorPlanData;
  gallery: GalleryImage[];
  specs: {
    flooring: string;
    ceilingHeight: string;
    airConditioning: string;
    homeAutomation: string;
    glazing: string;
  };
}

export interface Tower {
  id: TowerId;
  name: string;
  shortName: string;
  code: string;
  tagline: string;
  description: string;
  floorsCount: number;
  totalResidences: number;
  heightMeters: number;
  position: [number, number, number];
  rotationY: number;
  scale: [number, number, number];
  floorsRange: [number, number]; // [minFloor, maxFloor], e.g. [1, 24]
  unitsPerFloor: number;
  architecturalStyle: string;
  completionDate: string;
}

export interface DevelopmentOverview {
  name: string;
  subTitle: string;
  location: string;
  totalAcreage: string;
  openSpacePercentage: string;
  architect: string;
  landscapeDesigner: string;
  towersCount: number;
  totalResidences: number;
  highlights: string[];
}
