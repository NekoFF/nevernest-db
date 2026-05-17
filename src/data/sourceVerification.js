export const sourceVerificationFields = {
  sourceStatus: 'needs_verification',
  sourceUrl: null,
  sourceNote: '',
  evidenceType: null,
  verifiedAt: null,
  verifiedBy: null,
}

export const sourceEvidenceTypes = [
  'official_site',
  'official_social',
  'in_game_screenshot',
  'wiki_reference',
  'community_spreadsheet',
  'manual_entry',
  'unknown',
]

export const sourceStatusValues = [
  'verified',
  'needs_verification',
  'estimated',
  'placeholder',
  'mock',
  'unknown',
]
