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
  const authData = value.ok === true && value.data && typeof value.data === 'object'
    ? value.data
    : value

  return {
    authenticated: Boolean(authData.authenticated),
    user: authData.user || null,
    roles: Array.isArray(authData.roles) ? authData.roles : [],
    permissions: Array.isArray(authData.permissions) ? authData.permissions : [],
    session: authData.session && typeof authData.session === 'object'
      ? { ...anonymousAuthState.session, ...authData.session }
      : anonymousAuthState.session,
  }
}
