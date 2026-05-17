export const anonymousAuthState = {
  authenticated: false,
  user: null,
  roles: [],
  permissions: [],
  session: {
    authenticated: false,
    expiresAt: null,
    issuedAt: null,
    provider: null,
  },
}

export function normalizeAuthState(value) {
  if (!value || typeof value !== 'object') return anonymousAuthState
  return {
    authenticated: Boolean(value.authenticated),
    user: value.user || null,
    roles: Array.isArray(value.roles) ? value.roles : [],
    permissions: Array.isArray(value.permissions) ? value.permissions : [],
    session: value.session && typeof value.session === 'object'
      ? { ...anonymousAuthState.session, ...value.session }
      : anonymousAuthState.session,
  }
}
