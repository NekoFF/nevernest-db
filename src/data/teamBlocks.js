function makeId(prefix, index) {
  return `${prefix}-${index + 1}`
}

function normalizeStringList(list) {
  return Array.isArray(list) ? list.map((item) => String(item)) : []
}

export function normalizeTeamMember(member, index) {
  return {
    characterId: String(member?.characterId || ''),
    name: String(member?.name || ''),
    role: String(member?.role || member?.slot || ''),
    note: String(member?.note || ''),
    id: String(member?.id || makeId('member', index)),
  }
}

export function normalizeSynergy(synergy, index) {
  return {
    id: String(synergy?.id || synergy?.characterId || makeId('synergy', index)),
    characterId: String(synergy?.characterId || ''),
    name: String(synergy?.name || ''),
    roleLabel: String(synergy?.roleLabel || synergy?.role || ''),
    notes: normalizeStringList(synergy?.notes),
    enabled: synergy?.enabled !== false,
  }
}

export function normalizeRecommendedTeam(team, index) {
  return {
    id: String(team?.id || makeId('team', index)),
    title: String(team?.title || team?.name || `Team ${index + 1}`),
    badge: String(team?.badge || team?.tag || ''),
    tag: String(team?.tag && team?.badge ? team.tag : team?.type || ''),
    enabled: team?.enabled !== false,
    members: Array.isArray(team?.members) ? team.members.map(normalizeTeamMember) : [],
    description: String(team?.description || ''),
    rotation: normalizeStringList(team?.rotation),
    alternatives: normalizeStringList(team?.alternatives),
  }
}

export function normalizeTeams(characterOrTeams) {
  const teamsSource = characterOrTeams?.teams !== undefined || characterOrTeams?.synergies !== undefined
    ? characterOrTeams
    : { teams: characterOrTeams }

  if (teamsSource?.teams && !Array.isArray(teamsSource.teams) && typeof teamsSource.teams === 'object') {
    return {
      synergies: Array.isArray(teamsSource.teams.synergies) ? teamsSource.teams.synergies.map(normalizeSynergy) : [],
      recommendedTeams: Array.isArray(teamsSource.teams.recommendedTeams) ? teamsSource.teams.recommendedTeams.map(normalizeRecommendedTeam) : [],
    }
  }

  return {
    synergies: Array.isArray(teamsSource?.synergies) ? teamsSource.synergies.map(normalizeSynergy) : [],
    recommendedTeams: Array.isArray(teamsSource?.teams) ? teamsSource.teams.map(normalizeRecommendedTeam) : [],
  }
}

export function hasTeamsData(characterOrTeams) {
  const teams = normalizeTeams(characterOrTeams)
  return teams.synergies.some((item) => item.enabled !== false) || teams.recommendedTeams.some((item) => item.enabled !== false)
}
