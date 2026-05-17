import { createContext, useCallback, useContext, useMemo } from 'react'
import { createAnonymousSession } from './authModel.js'
import { anonymousAuthState } from './authState.js'
import { getCurrentAuthState, localLogin, logout } from './apiAuthClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const getMe = useCallback((options = {}) => getCurrentAuthState(options), [])
  const loginLocal = useCallback((email, password, options = {}) => localLogin(email, password, options), [])
  const logoutLocal = useCallback((options = {}) => logout(options), [])

  const value = useMemo(() => ({
    authState: anonymousAuthState,
    session: createAnonymousSession(),
    user: null,
    isAuthenticated: false,
    roles: [],
    permissions: [],
    getMe,
    localLogin: loginLocal,
    logout: logoutLocal,
  }), [getMe, loginLocal, logoutLocal])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  return value || {
    authState: anonymousAuthState,
    session: createAnonymousSession(),
    user: null,
    isAuthenticated: false,
    roles: [],
    permissions: [],
    getMe: getCurrentAuthState,
    localLogin,
    logout,
  }
}
