export type TimeOfDay = 'golden' | 'twilight' | 'daylight';

export interface AtmosphereConfig {
  name: string;
  label: string;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  skyRayleigh: number;
  skyTurbidity: number;
  skyAzimuth: number;
  skyElevation: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  exposure: number;
  windowLightIntensity: number;
  streetLightIntensity: number;
  waterColor: string;
}

export const ATMOSPHERES: Record<TimeOfDay, AtmosphereConfig> = {
  golden: {
    name: 'golden',
    label: 'Golden Hour',
    sunPosition: [42, 16, 32],
    sunColor: '#ffb066',
    sunIntensity: 3.2,
    ambientColor: '#2b3648',
    ambientIntensity: 0.9,
    skyRayleigh: 2.8,
    skyTurbidity: 8.5,
    skyAzimuth: 0.22,
    skyElevation: 8.5,
    fogColor: '#12141c',
    fogNear: 55,
    fogFar: 210,
    exposure: 1.25,
    windowLightIntensity: 1.0,
    streetLightIntensity: 1.4,
    waterColor: '#0a1d2e',
  },
  twilight: {
    name: 'twilight',
    label: 'Blue Hour / Twilight',
    sunPosition: [25, 3, -15],
    sunColor: '#e08342',
    sunIntensity: 0.8,
    ambientColor: '#18243b',
    ambientIntensity: 0.6,
    skyRayleigh: 4.5,
    skyTurbidity: 10,
    skyAzimuth: 0.35,
    skyElevation: 2.0,
    fogColor: '#090c14',
    fogNear: 45,
    fogFar: 180,
    exposure: 1.4,
    windowLightIntensity: 2.2,
    streetLightIntensity: 2.6,
    waterColor: '#071320',
  },
  daylight: {
    name: 'daylight',
    label: 'Midday Sun',
    sunPosition: [35, 65, 28],
    sunColor: '#fff5e8',
    sunIntensity: 2.6,
    ambientColor: '#8ea8c4',
    ambientIntensity: 1.1,
    skyRayleigh: 1.2,
    skyTurbidity: 4.0,
    skyAzimuth: 0.15,
    skyElevation: 58.0,
    fogColor: '#141822',
    fogNear: 65,
    fogFar: 230,
    exposure: 1.1,
    windowLightIntensity: 0.3,
    streetLightIntensity: 0.1,
    waterColor: '#0d283c',
  },
};

export const SCENE_CONFIG = {
  background: '#08090d',
};
