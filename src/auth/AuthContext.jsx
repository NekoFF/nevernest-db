import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createAnonymousSession } from './authModel.js'
import { anonymousAuthState } from './authState.js'
import { getCurrentAuthState, localLogin, logout } from './apiAuthClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(anonymousAuthState)

  const getMe = useCallback(async (options = {}) => {
    const nextAuthState = await getCurrentAuthState(options)
    setAuthState(nextAuthState)
    return nextAuthState
  }, [])

  const loginLocal = useCallback(async (email, password, options = {}) => {
    const nextAuthState = await localLogin(email, password, options)
    setAuthState(nextAuthState)
    return nextAuthState
  }, [])

  const logoutLocal = useCallback(async (csrfToken, options = {}) => {
    const result = await logout(csrfToken, options)
    setAuthState(anonymousAuthState)
    return result
  }, [])

  const value = useMemo(() => ({
    authState,
    session: authState.session || createAnonymousSession(),
    user: authState.user,
    isAuthenticated: authState.authenticated,
    roles: authState.roles,
    permissions: authState.permissions,
    getMe,
    localLogin: loginLocal,
    logout: logoutLocal,
  }), [authState, getMe, loginLocal, logoutLocal])

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
