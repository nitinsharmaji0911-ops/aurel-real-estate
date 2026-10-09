import { Apartment, TowerId } from '@/types/property';

// Template for 1 BHK Suite
const create1BHK = (
  towerId: TowerId,
  floor: number,
  unitNum: string,
  price: string,
  status: 'available' | 'reserved' | 'sold',
  facing: string
): Apartment => ({
  id: `${towerId === 'tower-a' ? 'A' : towerId === 'tower-b' ? 'B' : 'C'}-${floor}${unitNum}`,
  unitNumber: `${floor}${unitNum}`,
  towerId,
  floorNumber: floor,
  type: '1 BHK',
  carpetAreaSqFt: 685,
  superBuiltUpSqFt: 890,
  indicativePrice: price,
  status,
  bedrooms: 1,
  bathrooms: 1,
  balconies: 1,
  facing,
  floorPlan: {
    svgId: '1bhk-luxury',
    totalArea: 685,
    rooms: [
      { name: 'Living & Dining Hall', dimensions: '19\'6" x 12\'0"', areaSqFt: 234 },
      { name: 'Master Bedroom Suite', dimensions: '14\'0" x 12\'4"', areaSqFt: 172 },
      { name: 'Gourmet Kitchenette', dimensions: '9\'8" x 8\'6"', areaSqFt: 82 },
      { name: 'En-suite Luxury Bath', dimensions: '8\'6" x 6\'0"', areaSqFt: 51 },
      { name: 'Sunset Sunken Deck', dimensions: '12\'0" x 5\'6"', areaSqFt: 66 },
      { name: 'Entry Vestibule', dimensions: '6\'6" x 5\'0"', areaSqFt: 32 },
    ],
    highlights: [
      'Acoustic double-glazed floor-to-ceiling curtain wall',
      'Italian Calacatta marble flooring throughout living areas',
      'Custom Poliform millwork and walk-in wardrobe',
      'Miele integrated smart appliances & wine cooler',
    ],
  },
  gallery: [
    {
      id: 'living',
      title: 'Sun-Drenched Living Salon',
      category: 'Living Room',
      description: 'Expansive 10-foot ceilings with bespoke bronze-framed glass walls framing unobstructed views.',
      accentColor: '#c5a059',
    },
    {
      id: 'master',
      title: 'Master Bedroom Retreat',
      category: 'Master Bedroom',
      description: 'Acoustically isolated sanctuary with herringbone European oak floors and motorized shear shades.',
      accentColor: '#8c6e32',
    },
    {
      id: 'balcony',
      title: 'Private Sunset Lanai',
      category: 'Balcony & View',
      description: 'Cantilevered glass-railing terrace overlooking the private marina and bay horizon.',
      accentColor: '#4f772d',
    },
    {
      id: 'kitchen',
      title: 'Minimalist Chef Kitchen',
      category: 'Kitchen & Dining',
      description: 'Honed Statuario quartzite countertops, Dornbracht brushed brass tapware, and concealed refrigeration.',
      accentColor: '#90a955',
    },
  ],
  specs: {
    flooring: 'Imported Large-format Calacatta Gold Marble / Smoked European Oak',
    ceilingHeight: '3.2 meters (10.5 ft) finished clear ceiling',
    airConditioning: 'Daikin VRV Silent Multi-zone concealed climate control',
    homeAutomation: 'Lutron Homeworks lighting, motorized shading & climate integration',
    glazing: 'Triple-pane low-E acoustic insulated architectural glass',
  },
});

// Template for 2 BHK Residence
const create2BHK = (
  towerId: TowerId,
  floor: number,
  unitNum: string,
  price: string,
  status: 'available' | 'reserved' | 'sold',
  facing: string
): Apartment => ({
  id: `${towerId === 'tower-a' ? 'A' : towerId === 'tower-b' ? 'B' : 'C'}-${floor}${unitNum}`,
  unitNumber: `${floor}${unitNum}`,
  towerId,
  floorNumber: floor,
  type: '2 BHK',
  carpetAreaSqFt: 1240,
  superBuiltUpSqFt: 1580,
  indicativePrice: price,
  status,
  bedrooms: 2,
  bathrooms: 2,
  balconies: 2,
  facing,
  floorPlan: {
    svgId: '2bhk-executive',
    totalArea: 1240,
    rooms: [
      { name: 'Grand Living & Dining Room', dimensions: '24\'4" x 14\'8"', areaSqFt: 357 },
      { name: 'Master Bedroom Suite', dimensions: '16\'8" x 13\'6"', areaSqFt: 225 },
      { name: 'Junior Suite / Guest Bedroom', dimensions: '14\'2" x 12\'0"', areaSqFt: 170 },
      { name: 'Chef\'s Island Kitchen', dimensions: '12\'6" x 9\'6"', areaSqFt: 118 },
      { name: 'Master Bath & Spa Tub', dimensions: '11\'0" x 8\'4"', areaSqFt: 91 },
      { name: 'Guest Bath', dimensions: '8\'4" x 6\'2"', areaSqFt: 51 },
      { name: 'Main Waterfront Terrace', dimensions: '18\'0" x 6\'8"', areaSqFt: 120 },
      { name: 'Service & Utility Vestibule', dimensions: '8\'0" x 5\'4"', areaSqFt: 42 },
    ],
    highlights: [
      'Dual-aspect corner layout capturing both morning sun and ocean sunset',
      'Private elevator vestibule with biometric recognition',
      'Primary bathroom featuring freestanding soaking tub with panoramic skyline view',
      'Integrated Sub-Zero refrigeration and Gaggenau induction cooktop',
    ],
  },
  gallery: [
    {
      id: 'living',
      title: 'Corner View Great Room',
      category: 'Living Room',
      description: 'Soaring 3.4m clear volume framed by seamless structural glass corners overlooking Emerald Bay.',
      accentColor: '#c5a059',
    },
    {
      id: 'master',
      title: 'Primary Sanctuary',
      category: 'Master Bedroom',
      description: 'Lined with custom tactile acoustic fabric wall panels, bronze sconces, and generous walk-through dressing room.',
      accentColor: '#b08968',
    },
    {
      id: 'bathroom',
      title: 'Honed Marble Spa Bath',
      category: 'Bathroom',
      description: 'Monolithic fluted travertine double vanities with Fantini rainfall shower and view-facing soaking tub.',
      accentColor: '#7f5539',
    },
    {
      id: 'kitchen',
      title: 'Culinary Island & Dining',
      category: 'Kitchen & Dining',
      description: 'Waterfall island in brushed Fior di Bosco marble with custom matte charcoal lacquer cabinetry.',
      accentColor: '#6c584c',
    },
  ],
  specs: {
    flooring: 'Hand-selected French White Oak herringbone & Fior di Bosco stone slabs',
    ceilingHeight: '3.4 meters (11.1 ft) finished clear ceiling',
    airConditioning: 'Concealed high-efficiency VRF system with HEPA 13 medical filtration',
    homeAutomation: 'Crestron Home integrated touchpads with personalized lifestyle scenes',
    glazing: 'Curvilinear structural acoustic glazing with motorized solar tracking louver blinds',
  },
});

// Template for 3 BHK Grand Residence
const create3BHK = (
  towerId: TowerId,
  floor: number,
  unitNum: string,
  price: string,
  status: 'available' | 'reserved' | 'sold',
  facing: string
): Apartment => ({
  id: `${towerId === 'tower-a' ? 'A' : towerId === 'tower-b' ? 'B' : 'C'}-${floor}${unitNum}`,
  unitNumber: `${floor}${unitNum}`,
  towerId,
  floorNumber: floor,
  type: '3 BHK',
  carpetAreaSqFt: 2180,
  superBuiltUpSqFt: 2750,
  indicativePrice: price,
  status,
  bedrooms: 3,
  bathrooms: 3.5,
  balconies: 3,
  facing,
  floorPlan: {
    svgId: '3bhk-presidential',
    totalArea: 2180,
    rooms: [
      { name: 'Palatial Reception & Salon', dimensions: '32\'6" x 18\'2"', areaSqFt: 590 },
      { name: 'Formal Dining Gallery', dimensions: '18\'4" x 14\'0"', areaSqFt: 256 },
      { name: 'Owner\'s Presidential Suite', dimensions: '21\'0" x 16\'0"', areaSqFt: 336 },
      { name: 'Bedroom Suite II', dimensions: '16\'0" x 14\'6"', areaSqFt: 232 },
      { name: 'Bedroom Suite III / Library', dimensions: '15\'0" x 13\'4"', areaSqFt: 200 },
      { name: 'Show Kitchen & Breakfast Island', dimensions: '16\'8" x 12\'0"', areaSqFt: 200 },
      { name: 'Wet Prep Kitchen & Scullery', dimensions: '10\'0" x 8\'0"', areaSqFt: 80 },
      { name: 'Presidential Spa Bath', dimensions: '14\'6" x 11\'0"', areaSqFt: 159 },
      { name: 'Wraparound Sky Lanai', dimensions: '38\'0" x 8\'0"', areaSqFt: 304 },
      { name: 'Staff Quarters with Bath', dimensions: '10\'0" x 7\'6"', areaSqFt: 75 },
    ],
    highlights: [
      'Entire semi-floor residence with direct private elevator entry vestibule',
      'Unbroken 270-degree panoramic ocean, city skyline, and park views',
      'Dual-kitchen design (Sculptural Show Island + Heavy Scullery Prep Kitchen)',
      'Wraparound cantilevered terrace with integrated architectural planters and outdoor kitchen prep',
    ],
  },
  gallery: [
    {
      id: 'living',
      title: 'Palatial Double-Exposure Salon',
      category: 'Living Room',
      description: 'Framed by continuous floor-to-ceiling glass wrapping around the building’s curved perimeter.',
      accentColor: '#c5a059',
    },
    {
      id: 'master',
      title: 'Presidential Wing & Lounge',
      category: 'Master Bedroom',
      description: 'Private wing with custom upholstered headboard wall, morning beverage bar, and dual dressing suites.',
      accentColor: '#a68a56',
    },
    {
      id: 'balcony',
      title: 'Sky Lanai with Sunset Ocean Vista',
      category: 'Balcony & View',
      description: 'Sheltered outdoor room paved in teak decking and bush-hammered limestone with concealed heaters.',
      accentColor: '#3a5a40',
    },
    {
      id: 'bathroom',
      title: 'Bookmatched Arabescato Spa',
      category: 'Bathroom',
      description: 'Floor-to-ceiling bookmatched Italian marble with freestanding stone bathtub carved from single monolith.',
      accentColor: '#588157',
    },
  ],
  specs: {
    flooring: 'Hand-selected Extra-White Statuario Bookmatched Marble / Smoked Belgian Oak Plank',
    ceilingHeight: '3.6 meters (11.8 ft) finished clear ceiling with recessed architectural cove lighting',
    airConditioning: 'Silent hospital-grade magnetic bearing chiller system with UV purification & humidity balancing',
    homeAutomation: 'Full Savant Smart Home ecosystem with invisible stealth acoustic wall speakers',
    glazing: 'Extra-clear low-iron laminated acoustic facade with UV reflection coating',
  },
});

// Template for Sky Penthouse (Top Floors)
const createPenthouse = (
  towerId: TowerId,
  floor: number,
  unitNum: string,
  price: string,
  status: 'available' | 'reserved' | 'sold',
  facing: string
): Apartment => ({
  id: `${towerId === 'tower-a' ? 'A' : towerId === 'tower-b' ? 'B' : 'C'}-${floor}${unitNum}`,
  unitNumber: `${floor}${unitNum}`,
  towerId,
  floorNumber: floor,
  type: 'Penthouse Suite',
  carpetAreaSqFt: 3850,
  superBuiltUpSqFt: 4900,
  indicativePrice: price,
  status,
  bedrooms: 4,
  bathrooms: 5,
  balconies: 4,
  facing,
  floorPlan: {
    svgId: 'penthouse-duplex',
    totalArea: 3850,
    rooms: [
      { name: 'Cathedral Grand Great Room', dimensions: '40\'0" x 22\'0"', areaSqFt: 880 },
      { name: 'Private Sky Pool & Solarium', dimensions: '28\'0" x 14\'0"', areaSqFt: 392 },
      { name: 'Owner\'s Crown Suite & Lounge', dimensions: '26\'0" x 18\'0"', areaSqFt: 468 },
      { name: 'Secondary Master Suite', dimensions: '19\'0" x 15\'0"', areaSqFt: 285 },
      { name: 'Sky Observatory / Wine Salon', dimensions: '18\'0" x 14\'0"', areaSqFt: 252 },
      { name: 'Bulthaup Show Kitchen', dimensions: '20\'0" x 14\'0"', areaSqFt: 280 },
      { name: 'Private Rooftop Garden Terrace', dimensions: '42\'0" x 16\'0"', areaSqFt: 672 },
    ],
    highlights: [
      'Private cantilevered glass-bottom heated dipping pool 80m above sea level',
      'Exclusive high-speed elevator opening directly into residence foyer',
      'Dedicated 500-bottle temperature-regulated sommelier wine vault',
      '360-degree unobstructed horizon capturing ocean, city skyline, and surrounding bay',
    ],
  },
  gallery: [
    {
      id: 'living',
      title: 'Double-Height Sky Sanctuary',
      category: 'Living Room',
      description: 'Monumental 6.8m double-height living room with sculptural floating steel and bronze staircase.',
      accentColor: '#c5a059',
    },
    {
      id: 'balcony',
      title: 'Private Infinity Edge Dipping Pool',
      category: 'Balcony & View',
      description: 'Suspended acrylic glass swimming pool merging visually with the emerald waters below.',
      accentColor: '#1d3557',
    },
    {
      id: 'master',
      title: 'The Sovereign Bedroom Suite',
      category: 'Master Bedroom',
      description: 'Framed on three sides by continuous curved structural glazing with sunrise and sunset views.',
      accentColor: '#8d99ae',
    },
  ],
  specs: {
    flooring: 'Custom-quarried Calacatta Viola & Quarter-sawn smoked European walnut',
    ceilingHeight: '6.8 meters (22.3 ft) double-height cathedral ceiling in primary salon',
    airConditioning: 'Dedicated independent medical-grade HVAC with ionization & aroma distribution',
    homeAutomation: 'Enterprise-grade Crestron / Basalte tactile switches with motorized curtain tracking',
    glazing: 'Hurricane-rated acoustic laminated glass with dynamic photovoltaic electrochromic tinting',
  },
});

// Deterministic generator ensuring every tower and floor has valid, believable units
export function getApartmentsForFloor(towerId: TowerId, floorNumber: number): Apartment[] {
  // Tower A has 4 units per floor (24 floors)
  if (towerId === 'tower-a') {
    const isTopFloor = floorNumber >= 22;
    if (isTopFloor) {
      return [
        createPenthouse(
          towerId,
          floorNumber,
          '01',
          `$${(5.2 + floorNumber * 0.15).toFixed(2)}M`,
          floorNumber === 24 ? 'reserved' : 'available',
          '270° Panoramic Ocean & Skyline'
        ),
        createPenthouse(
          towerId,
          floorNumber,
          '02',
          `$${(4.9 + floorNumber * 0.15).toFixed(2)}M`,
          floorNumber === 23 ? 'sold' : 'available',
          'Marina Vista & Sunset Harbor'
        ),
      ];
    }

    const priceBase = 1.95 + floorNumber * 0.055;
    return [
      create3BHK(
        towerId,
        floorNumber,
        '01',
        `$${priceBase.toFixed(2)}M`,
        floorNumber % 3 === 0 ? 'sold' : floorNumber % 2 === 0 ? 'reserved' : 'available',
        'Direct Ocean & Sunset Front'
      ),
      create3BHK(
        towerId,
        floorNumber,
        '02',
        `$${(priceBase - 0.1).toFixed(2)}M`,
        floorNumber % 4 === 0 ? 'reserved' : 'available',
        'Central Marina & Harbor Vista'
      ),
      create2BHK(
        towerId,
        floorNumber,
        '03',
        `$${(priceBase * 0.68).toFixed(2)}M`,
        floorNumber % 5 === 0 ? 'sold' : 'available',
        'Skyline & Landscaped Parkland'
      ),
      create2BHK(
        towerId,
        floorNumber,
        '04',
        `$${(priceBase * 0.65).toFixed(2)}M`,
        floorNumber % 3 === 1 ? 'available' : 'reserved',
        'Sunrise Botanical Garden'
      ),
    ];
  }

  // Tower B has 6 units per floor (18 floors)
  if (towerId === 'tower-b') {
    const priceBase = 1.35 + floorNumber * 0.045;
    return [
      create3BHK(
        towerId,
        floorNumber,
        '01',
        `$${(priceBase * 1.35).toFixed(2)}M`,
        floorNumber % 4 === 1 ? 'available' : 'reserved',
        'Bay Horizon & Promenade'
      ),
      create2BHK(
        towerId,
        floorNumber,
        '02',
        `$${priceBase.toFixed(2)}M`,
        floorNumber % 3 === 0 ? 'available' : floorNumber % 2 === 0 ? 'reserved' : 'sold',
        'Central Marina & Promenade'
      ),
      create2BHK(
        towerId,
        floorNumber,
        '03',
        `$${(priceBase * 0.98).toFixed(2)}M`,
        floorNumber % 5 === 2 ? 'sold' : 'available',
        'Garden Sanctuary & Pool'
      ),
      create1BHK(
        towerId,
        floorNumber,
        '04',
        `$${(priceBase * 0.58).toFixed(2)}M`,
        floorNumber % 2 === 1 ? 'available' : 'reserved',
        'Skyline City Lights'
      ),
      create1BHK(
        towerId,
        floorNumber,
        '05',
        `$${(priceBase * 0.56).toFixed(2)}M`,
        floorNumber % 3 === 2 ? 'sold' : 'available',
        'Courtyard & Waterfall Garden'
      ),
      create2BHK(
        towerId,
        floorNumber,
        '06',
        `$${(priceBase * 0.95).toFixed(2)}M`,
        floorNumber % 4 === 0 ? 'reserved' : 'available',
        'Sunset Coastal Boulevard'
      ),
    ];
  }

  // Tower C has 5 units per floor (14 floors)
  const priceBase = 0.92 + floorNumber * 0.038;
  return [
    create2BHK(
      towerId,
      floorNumber,
      '01',
      `$${(priceBase * 1.38).toFixed(2)}M`,
      floorNumber % 3 === 1 ? 'available' : 'sold',
      'Sunrise Harbor & Yacht Basin'
    ),
    create2BHK(
      towerId,
      floorNumber,
      '02',
      `$${(priceBase * 1.32).toFixed(2)}M`,
      floorNumber % 2 === 0 ? 'available' : 'reserved',
      'Botanical Gardens & Reflecting Pool'
    ),
    create1BHK(
      towerId,
      floorNumber,
      '03',
      `$${priceBase.toFixed(2)}M`,
      floorNumber % 4 === 3 ? 'reserved' : 'available',
      'Promenade & Olive Grove'
    ),
    create1BHK(
      towerId,
      floorNumber,
      '04',
      `$${(priceBase * 0.96).toFixed(2)}M`,
      floorNumber % 2 === 1 ? 'sold' : 'available',
      'Zen Rock Garden'
    ),
    create1BHK(
      towerId,
      floorNumber,
      '05',
      `$${(priceBase * 0.94).toFixed(2)}M`,
      floorNumber % 3 === 0 ? 'available' : 'reserved',
      'East Coast Sunrise Vista'
    ),
  ];
}

// Quick finder for an apartment by its ID
export function findApartmentById(apartmentId: string): Apartment | null {
  const parts = apartmentId.split('-');
  if (parts.length < 2) return null;
  const towerCode = parts[0];
  const unitStr = parts[1];
  
  let towerId: TowerId = 'tower-a';
  if (towerCode === 'B') towerId = 'tower-b';
  if (towerCode === 'C') towerId = 'tower-c';

  // extract floor number (e.g. 1401 -> floor 14, unit 01)
  const floorNum = parseInt(unitStr.slice(0, unitStr.length - 2), 10);
  if (isNaN(floorNum)) return null;

  const floorUnits = getApartmentsForFloor(towerId, floorNum);
  return floorUnits.find((apt) => apt.id === apartmentId) || null;
}
