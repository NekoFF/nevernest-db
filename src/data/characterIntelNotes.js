export const characterIntelNotes = {
  lacrimosa: {
    characterSlug: 'lacrimosa',
    sourceStatus: 'needs_verification',
    confidence: 'low',
    lastReviewed: '2026-05-19',
    label: 'Source-pending intel',
    summary: 'Local corpus notes suggest a Chaos damage profile built around Nightmare pressure and stance-style attacks. These notes need manual source review.',
    sections: [
      {
        id: 'combat-notes',
        title: 'Combat Notes',
        items: [
          {
            text: 'Appears to switch between Frying Pan and Red Jelly attack styles, with both styles contributing Chaos damage.',
            sourceStatus: 'needs_verification',
            confidence: 'low',
          },
          {
            text: 'Nightmare appears to be a recurring damage setup in the extracted skill text, but exact values and triggers still need source review.',
            sourceStatus: 'needs_verification',
            confidence: 'low',
          },
        ],
      },
      {
        id: 'skill-notes',
        title: 'Skill Notes',
        items: [
          {
            text: 'Extracted notes mention a Morning Tomato skill and a Devlish Gift redirect-style skill interaction.',
            sourceStatus: 'needs_verification',
            confidence: 'low',
          },
          {
            text: 'The ultimate is described as an area Chaos damage sequence tied to Working Day Judgement.',
            sourceStatus: 'needs_verification',
            confidence: 'low',
          },
        ],
      },
      {
        id: 'rotation-notes',
        title: 'Rotation Notes',
        items: [
          {
            text: 'One candidate line suggests comboing into a fifth hit after casting, but timing and exact conditions are not verified.',
            sourceStatus: 'needs_verification',
            confidence: 'low',
          },
        ],
      },
    ],
    warnings: [
      'Corpus text for Lacrimosa contains OCR/scrape artifacts and mixed guide references.',
      'No extracted values are applied to Build Planner calculations.',
    ],
  },
}

const PROTECTED_INTEL_KEYS = new Set(['id', 'slug', 'name', 'rarity', 'rank', 'element', 'arcType', 'weapon', 'weaponType', 'roles', 'avatar', 'portrait'])

export function getCharacterIntelNotes(characterSlug) {
  return characterIntelNotes[characterSlug] || null
}

export function characterIntelSearchText(characterSlug) {
  const intel = getCharacterIntelNotes(characterSlug)
  if (!intel) return ''
  return [
    intel.label,
    intel.summary,
    intel.sourceStatus,
    intel.confidence,
    (intel.sections || []).map((section) => [
      section.title,
      (section.items || []).map((item) => item.text),
    ]),
    intel.warnings,
  ].flat(Infinity).filter(Boolean).join(' ')
}

export function validateCharacterIntelNotes(notes = characterIntelNotes, canonicalSlugs = []) {
  const canonical = new Set(canonicalSlugs)
  const problems = []

  for (const [slug, entry] of Object.entries(notes)) {
    if (canonical.size && !canonical.has(slug)) problems.push(`${slug}: not an existing canonical character slug`)
    if (entry.sourceStatus === 'verified') problems.push(`${slug}: top-level sourceStatus must not be verified`)
    if (slug === 'nanally') problems.push('nanally: reference-quality character should remain compare-only in pilot data')

    for (const key of Object.keys(entry)) {
      if (PROTECTED_INTEL_KEYS.has(key)) problems.push(`${slug}: protected canonical field "${key}" is not allowed in intel notes`)
    }

    for (const section of entry.sections || []) {
      for (const item of section.items || []) {
        if (item.sourceStatus === 'verified') problems.push(`${slug}/${section.id}: item sourceStatus must not be verified`)
        for (const key of Object.keys(item)) {
          if (PROTECTED_INTEL_KEYS.has(key)) problems.push(`${slug}/${section.id}: protected canonical field "${key}" is not allowed in intel item`)
        }
      }
    }
  }

  return problems
}
