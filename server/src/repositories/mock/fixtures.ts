import type {
  ApartmentItemSummary,
  CartridgeSetSummary,
  CharacterSummary,
  CodeSummary,
  CommunityLinkSummary,
  GuideDetail,
  ModulePieceSummary,
  ModuleShapeSummary,
  NewsPostDetail,
  TierListDetail,
  VehicleSummary,
  WeaponSummary,
} from '../../contracts/index.js'

export const mockCharacters: CharacterSummary[] = [
  {
    id: 'char-1',
    externalId: 'nanally',
    slug: 'nanally',
    name: 'Nanally',
    rarityId: 'S',
    elementId: 'anima',
    arcTypeId: 'plasma',
    faction: 'Elbon Antique Shop',
    roles: ['damage'],
    tags: ['main-dps'],
    sourceStatus: 'needs_verification',
    publicationStatus: 'draft',
  },
  {
    id: 'char-2',
    externalId: 'baicang',
    slug: 'baicang',
    name: 'Baicang',
    rarityId: 'S',
    elementId: 'cosmos',
    arcTypeId: 'solid',
    roles: ['support'],
    tags: ['buff'],
    sourceStatus: 'unknown',
    publicationStatus: 'draft',
  },
]

export const mockWeapons: WeaponSummary[] = [
  { id: 'weapon-1', externalId: 'ready-ready', slug: 'ready-ready', name: 'Ready-Ready', rarityId: 'S', arcTypeId: 'plasma', sourceStatus: 'unknown', publicationStatus: 'draft' },
  { id: 'weapon-2', externalId: 'oraora', slug: 'oraora', name: 'Oraora!', rarityId: 'A', arcTypeId: 'solid', sourceStatus: 'unknown', publicationStatus: 'draft' },
]

export const mockCartridges: CartridgeSetSummary[] = [
  { id: 'cart-1', externalId: 'fireflies-and-the-forest', slug: 'fireflies-and-the-forest', name: 'Fireflies and the Forest', elementId: 'anima', sourceStatus: 'needs_verification', publicationStatus: 'draft' },
  { id: 'cart-2', externalId: 'lost-radiance', slug: 'lost-radiance', name: 'Lost Radiance', elementId: 'cosmos', sourceStatus: 'needs_verification', publicationStatus: 'draft' },
]

export const mockVehicles: VehicleSummary[] = [
  { id: 'vehicle-1', externalId: 'rover-a1', slug: 'rover-a1', name: 'A1', vehicleType: 'car', sourceStatus: 'unknown', publicationStatus: 'draft' },
  { id: 'vehicle-2', externalId: 'future-surge', slug: 'future-surge', name: 'Rivok', vehicleType: 'car', sourceStatus: 'unknown', publicationStatus: 'draft' },
]

export const mockTierLists: TierListDetail[] = [
  {
    id: 'tier-1',
    externalId: 'official-character-tier-list',
    slug: 'official-character-tier-list',
    name: 'Official Character Tier List',
    title: 'Official Character Tier List',
    listType: 'official',
    sourceStatus: 'unknown',
    publicationStatus: 'draft',
    rows: [
      {
        label: 'S',
        sortOrder: 0,
        entries: [{ characterId: 'char-1', position: 0, sourceStatus: 'unknown' }],
      },
    ],
  },
]

export const mockCodes: CodeSummary[] = [
  { id: 'code-1', externalId: 'welcome-code', code: 'WELCOME', rewardSummary: 'Draft reward', status: 'unknown', sourceStatus: 'needs_verification' },
]

export const mockModuleShapes: ModuleShapeSummary[] = [
  { id: 'shape-1', externalId: 'type-ii-vertical', slug: 'type-ii-vertical', name: 'Type II Vertical', moduleType: 'II', width: 1, height: 2, cellCount: 2, sourceStatus: 'unknown', publicationStatus: 'draft' },
  { id: 'shape-2', externalId: 'type-iii-line-vertical', slug: 'type-iii-line-vertical', name: 'Type III Line Vertical', moduleType: 'III', width: 1, height: 3, cellCount: 3, sourceStatus: 'unknown', publicationStatus: 'draft' },
]

export const mockModulePieces: ModulePieceSummary[] = [
  { id: 'piece-1', externalId: 'type-ii-vertical-s', slug: 'type-ii-vertical-s', name: 'Type II Vertical S', moduleShapeId: 'shape-1', rarityId: 'S', moduleType: 'II', sourceStatus: 'unknown', publicationStatus: 'draft' },
  { id: 'piece-2', externalId: 'type-iii-line-vertical-a', slug: 'type-iii-line-vertical-a', name: 'Type III Line Vertical A', moduleShapeId: 'shape-2', rarityId: 'A', moduleType: 'III', sourceStatus: 'unknown', publicationStatus: 'draft' },
]

export const mockNews: NewsPostDetail[] = [
  {
    id: 'news-1',
    externalId: 'phase-note',
    slug: 'phase-note',
    name: 'Phase Note',
    title: 'Phase Note',
    description: 'A mock backend contract news item.',
    body: 'This mock news body exists only for backend API contract tests.',
    featured: false,
    pinned: false,
    sourceStatus: 'placeholder',
    publicationStatus: 'draft',
  },
]

export const mockGuides: GuideDetail[] = [
  {
    id: 'guide-1',
    externalId: 'starter-guide',
    slug: 'starter-guide',
    name: 'Starter Guide',
    title: 'Starter Guide',
    category: 'basics',
    description: 'Mock guide detail for API contract tests.',
    sourceStatus: 'placeholder',
    publicationStatus: 'draft',
    sections: [{ heading: 'Overview', body: 'Mock guide section.', sortOrder: 0 }],
  },
]

export const mockCommunityLinks: CommunityLinkSummary[] = [
  { externalId: 'official-site', label: 'Official Site', url: 'https://example.invalid/nte', category: 'official', sourceStatus: 'placeholder' },
]

export const mockApartmentItems: ApartmentItemSummary[] = [
  { id: 'apartment-1', externalId: 'cozy-chair', slug: 'cozy-chair', name: 'Cozy Chair', category: 'furniture', price: 100, currency: 'Fons', sourceStatus: 'placeholder', publicationStatus: 'draft' },
]
