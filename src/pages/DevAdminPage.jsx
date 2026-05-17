import { useState, useEffect, useCallback, useMemo } from 'react'
import { AlertCircle, Shield, Key, Lock, LogIn, LogOut, RefreshCw, CheckCircle2, XCircle, Terminal, Gift, Newspaper, Info, AlertTriangle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import { getCsrfToken } from '../auth/apiAuthClient.js'
import { updateCodeAdmin, updateNewsAdmin } from '../repositories/api/adminApiRepository.js'
import { getCodes, getNews } from '../repositories/unified/contentRepository.js'
import { getApiConfig } from '../api/apiConfig.js'

const REQUIRED_PERMISSIONS = {
  code: 'codes/write',
  news: 'news/write',
}

const QA_PHASE_LABELS = {
  idle: 'idle',
  updating: 'updating',
  verifying: 'verifying',
  restoring: 'restoring',
  success: 'success/restored',
  failed: 'failed',
}

function safeSummary(value, maxLength = 96) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return 'Empty'
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
}

function safeErrorMessage(error) {
  const statusCode = error?.statusCode
  const status = error?.status
  if (statusCode === 401 || status === 'unauthorized') return 'Authentication required. Refresh /api/me or log in again.'
  if (statusCode === 403 || status === 'forbidden' || status === 'csrf_error') return 'Forbidden. Check CSRF readiness and required permissions.'
  if (statusCode === 501 || status === 'not_implemented') return 'Admin writes are disabled or unavailable in this runtime.'
  if (status === 'validation_error') return error.message || 'Validation failed for this update.'
  return error?.message || 'Request failed.'
}

function statusTone(ok) {
  return ok ? 'text-emerald-500' : 'text-[#6b7280]'
}

function ChecklistRow({ label, ok, value, detail }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/[0.03] pb-3 last:border-0 last:pb-0">
      <div>
        <span className="text-sm text-[#6b7280]">{label}</span>
        {detail ? <p className="mt-1 text-[11px] leading-5 text-[#9ca3af]">{detail}</p> : null}
      </div>
      <span className={`flex shrink-0 items-center gap-1.5 text-right text-xs font-bold ${statusTone(ok)}`}>
        {ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {value || (ok ? 'YES' : 'NO')}
      </span>
    </div>
  )
}

function TagList({ items, empty = 'None' }) {
  if (!items?.length) return <span className="text-xs italic text-[#6b7280]">{empty}</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(item => (
        <span key={item} className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600">
          {item}
        </span>
      ))}
    </div>
  )
}

function qaDisabledReason({ csrfReady, authenticated, hasPermission, hasItems, running }) {
  if (running) return 'QA is already running'
  if (!csrfReady) return 'missing CSRF'
  if (!authenticated) return 'not authenticated'
  if (!hasPermission) return 'missing permission'
  if (!hasItems) return 'no API items loaded'
  return null
}

export default function DevAdminPage() {
  const { authState, getMe, localLogin, logout } = useAuth()
  const apiConfig = getApiConfig()

  const [csrfToken, setCsrfToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ loading: false, error: null, message: null })
  const [codes, setCodes] = useState([])
  const [news, setNews] = useState([])
  const [selectedCodeId, setSelectedCodeId] = useState('')
  const [selectedNewsSlug, setSelectedNewsSlug] = useState('')
  const [qaStatus, setQaStatus] = useState({
    code: { phase: 'idle', message: '', warning: '', original: '', temporary: '' },
    news: { phase: 'idle', message: '', warning: '', original: '', temporary: '' },
  })

  const isEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_ADMIN_PANEL === '1'
  const isApiMode = apiConfig.dataSource === 'api'
  const devAdminFlag = import.meta.env.VITE_ENABLE_DEV_ADMIN_PANEL === '1'
  const csrfReady = Boolean(csrfToken)
  const authenticated = Boolean(authState.authenticated)
  const permissions = authState.permissions || []
  const canWriteCodes = permissions.includes(REQUIRED_PERMISSIONS.code)
  const canWriteNews = permissions.includes(REQUIRED_PERMISSIONS.news)

  const selectedCode = useMemo(
    () => codes.find(code => code.externalId === selectedCodeId) || codes[0] || null,
    [codes, selectedCodeId],
  )
  const selectedNews = useMemo(
    () => news.find(item => item.slug === selectedNewsSlug) || news[0] || null,
    [news, selectedNewsSlug],
  )

  const codeDisabledReason = qaDisabledReason({
    csrfReady,
    authenticated,
    hasPermission: canWriteCodes,
    hasItems: Boolean(selectedCode),
    running: ['updating', 'verifying', 'restoring'].includes(qaStatus.code.phase),
  })
  const newsDisabledReason = qaDisabledReason({
    csrfReady,
    authenticated,
    hasPermission: canWriteNews,
    hasItems: Boolean(selectedNews),
    running: ['updating', 'verifying', 'restoring'].includes(qaStatus.news.phase),
  })

  const refreshMe = useCallback(async () => {
    setStatus(s => ({ ...s, loading: true, error: null, message: null }))
    try {
      await getMe()
      setStatus(s => ({ ...s, loading: false, message: 'Auth state refreshed' }))
    } catch (err) {
      setStatus(s => ({ ...s, loading: false, error: safeErrorMessage(err) }))
    }
  }, [getMe])

  const fetchCsrf = useCallback(async () => {
    setStatus(s => ({ ...s, loading: true, error: null, message: null }))
    try {
      const token = await getCsrfToken()
      setCsrfToken(token)
      setStatus(s => ({ ...s, loading: false, message: 'CSRF ready' }))
      return token
    } catch (err) {
      setStatus(s => ({ ...s, loading: false, error: safeErrorMessage(err) }))
      return null
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus(s => ({ ...s, loading: true, error: null, message: null }))
    try {
      const result = await localLogin(email, password)
      if (!result.authenticated) throw new Error('Authentication failed')
      setPassword('')
      await refreshMe()
      setStatus(s => ({ ...s, loading: false, message: 'Login successful; /api/me refreshed' }))
    } catch (err) {
      setStatus(s => ({ ...s, loading: false, error: safeErrorMessage(err) }))
    }
  }

  const handleLogout = async () => {
    setStatus(s => ({ ...s, loading: true, error: null, message: null }))
    try {
      const token = csrfToken || await fetchCsrf()
      if (!token) throw new Error('Fetch CSRF before logout')
      await logout(token)
      setCsrfToken(null)
      setQaStatus({
        code: { phase: 'idle', message: '', warning: '', original: '', temporary: '' },
        news: { phase: 'idle', message: '', warning: '', original: '', temporary: '' },
      })
      await refreshMe()
      setStatus(s => ({ ...s, loading: false, message: 'Logged out; /api/me refreshed' }))
    } catch (err) {
      setStatus(s => ({ ...s, loading: false, error: safeErrorMessage(err) }))
    }
  }

  const loadData = useCallback(async () => {
    try {
      const [codesRes, newsRes] = await Promise.all([getCodes(), getNews()])
      setCodes(codesRes || [])
      setNews(newsRes || [])
      setSelectedCodeId(current => current || codesRes?.[0]?.externalId || '')
      setSelectedNewsSlug(current => current || newsRes?.[0]?.slug || '')
    } catch (err) {
      setStatus(s => ({ ...s, error: safeErrorMessage(err) }))
    }
  }, [])

  useEffect(() => {
    if (isEnabled) loadData()
  }, [isEnabled, loadData])

  const runCodeQa = async () => {
    if (!selectedCode || !csrfToken || codeDisabledReason) return
    const originalValue = selectedCode.rewardSummary
    const testValue = `QA Test Update ${new Date().toISOString()}`
    const entityId = selectedCode.externalId

    setQaStatus(s => ({
      ...s,
      code: { phase: 'updating', message: `Updating ${entityId}`, warning: '', original: safeSummary(originalValue), temporary: safeSummary(testValue) },
    }))

    let updated = false
    try {
      await updateCodeAdmin(entityId, { rewardSummary: testValue }, csrfToken)
      updated = true
      setQaStatus(s => ({ ...s, code: { ...s.code, phase: 'verifying', message: `Verifying ${entityId} through public API` } }))

      const freshCodes = await getCodes()
      const verified = freshCodes.find(code => code.externalId === entityId)
      if (!verified || verified.rewardSummary !== testValue) throw new Error('Verification failed: value mismatch')

      setQaStatus(s => ({ ...s, code: { ...s.code, phase: 'restoring', message: `Restoring ${entityId}` } }))
      await updateCodeAdmin(entityId, { rewardSummary: originalValue }, csrfToken)
      setQaStatus(s => ({ ...s, code: { ...s.code, phase: 'success', message: `Code ${entityId} updated, verified, and restored`, warning: '' } }))
      await loadData()
    } catch (err) {
      setQaStatus(s => ({
        ...s,
        code: {
          ...s.code,
          phase: 'failed',
          message: `Code QA failed: ${safeErrorMessage(err)}`,
          warning: updated ? `Restore may be needed for code ${entityId}. Original reward summary: ${safeSummary(originalValue)}` : '',
        },
      }))
    }
  }

  const runNewsQa = async () => {
    if (!selectedNews || !csrfToken || newsDisabledReason) return
    const originalValue = selectedNews.title
    const testValue = `QA Test Update ${new Date().toISOString()}`
    const entityId = selectedNews.slug

    setQaStatus(s => ({
      ...s,
      news: { phase: 'updating', message: `Updating ${entityId}`, warning: '', original: safeSummary(originalValue), temporary: safeSummary(testValue) },
    }))

    let updated = false
    try {
      await updateNewsAdmin(entityId, { title: testValue }, csrfToken)
      updated = true
      setQaStatus(s => ({ ...s, news: { ...s.news, phase: 'verifying', message: `Verifying ${entityId} through public API` } }))

      const freshNews = await getNews()
      const verified = freshNews.find(item => item.slug === entityId)
      if (!verified || verified.title !== testValue) throw new Error('Verification failed: value mismatch')

      setQaStatus(s => ({ ...s, news: { ...s.news, phase: 'restoring', message: `Restoring ${entityId}` } }))
      await updateNewsAdmin(entityId, { title: originalValue }, csrfToken)
      setQaStatus(s => ({ ...s, news: { ...s.news, phase: 'success', message: `News ${entityId} updated, verified, and restored`, warning: '' } }))
      await loadData()
    } catch (err) {
      setQaStatus(s => ({
        ...s,
        news: {
          ...s.news,
          phase: 'failed',
          message: `News QA failed: ${safeErrorMessage(err)}`,
          warning: updated ? `Restore may be needed for news ${entityId}. Original title: ${safeSummary(originalValue)}` : '',
        },
      }))
    }
  }

  if (!isEnabled) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-black/[0.06] bg-white p-12 text-center shadow-sm">
        <div className="max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Dev Admin Panel Disabled</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#6b7280]">
            This panel is only available in development mode with <code className="rounded bg-black/[0.05] px-1 py-0.5 font-mono text-[11px]">VITE_ENABLE_DEV_ADMIN_PANEL=1</code>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#111111]">Dev Admin Panel</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Runtime QA and local authentication verification</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">Local Only</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">Not for Production</span>
        </div>
      </header>

      {status.error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
          <XCircle className="h-5 w-5 shrink-0" />
          <p>{status.error}</p>
        </div>
      ) : null}

      {status.message ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>{status.message}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Terminal className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">Runtime Checklist</h2>
          </div>

          <div className="space-y-4">
            <ChecklistRow label="API mode" ok={isApiMode} value={apiConfig.dataSource} />
            <ChecklistRow label="API base URL" ok={Boolean(apiConfig.baseUrl)} value={apiConfig.baseUrl} detail="Use the same hostname in frontend and backend CORS for cookie auth." />
            <ChecklistRow label="Dev Admin flag" ok={devAdminFlag} value={devAdminFlag ? 'enabled' : 'disabled'} />
            <ChecklistRow label="CSRF ready" ok={csrfReady} value={csrfReady ? 'Ready' : 'Missing'} />
            <ChecklistRow label="Authenticated" ok={authenticated} value={authenticated ? 'YES' : 'NO'} />
            <ChecklistRow label="Codes permission" ok={canWriteCodes} value={REQUIRED_PERMISSIONS.code} />
            <ChecklistRow label="News permission" ok={canWriteNews} value={REQUIRED_PERMISSIONS.news} />
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[#111111]">Safe Auth State</h2>
            </div>
            <button onClick={refreshMe} className="rounded-xl border border-black/[0.06] p-2 transition hover:bg-black/[0.03]" title="Refresh /api/me">
              <RefreshCw className={`h-4 w-4 text-[#6b7280] ${status.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            <ChecklistRow label="Authenticated" ok={authenticated} value={authenticated ? 'YES' : 'NO'} />
            <div className="flex items-center justify-between border-b border-black/[0.03] pb-3">
              <span className="text-sm text-[#6b7280]">User</span>
              <span className="text-sm font-bold text-[#111111]">{authenticated ? authState.user?.displayName || 'Unknown user' : 'None'}</span>
            </div>
            <div className="space-y-2 border-b border-black/[0.03] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Roles</span>
              <TagList items={authState.roles} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Permissions</span>
              <TagList items={permissions} />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff2f6d]/5 text-[#ff2f6d]">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">Local Login</h2>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-black/[0.04] bg-[#fafafa] p-4">
            <span className="text-sm text-[#6b7280]">CSRF readiness</span>
            {csrfReady ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500"><CheckCircle2 className="h-4 w-4" /> Ready</span>
            ) : (
              <button onClick={fetchCsrf} className="flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-xs font-bold text-white transition hover:bg-black">
                <Key className="h-3.5 w-3.5" /> Fetch CSRF
              </button>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.test" className="mt-1.5 w-full rounded-xl border border-black/[0.06] bg-[#fafafa] px-4 py-2.5 text-sm outline-none transition focus:border-[#ff2f6d] focus:ring-2 focus:ring-[#ff2f6d]/10" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mt-1.5 w-full rounded-xl border border-black/[0.06] bg-[#fafafa] px-4 py-2.5 text-sm outline-none transition focus:border-[#ff2f6d] focus:ring-2 focus:ring-[#ff2f6d]/10" required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={status.loading || authenticated} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50">
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button type="button" onClick={handleLogout} disabled={status.loading || !authenticated} title={!csrfReady ? 'Fetch CSRF before logout' : 'Logout'} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#fafafa] disabled:opacity-50">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">Mutation QA</h2>
          </div>

          <div className="space-y-6">
            <QaPanel
              icon={<Gift className="h-4 w-4 text-[#6b7280]" />}
              title="Codes QA"
              items={codes}
              selectedValue={selectedCode?.externalId || ''}
              onSelect={setSelectedCodeId}
              getOptionValue={item => item.externalId}
              getOptionLabel={item => `${item.code || item.externalId} - ${safeSummary(item.rewardSummary, 48)}`}
              selectedLabel={selectedCode ? selectedCode.code || selectedCode.externalId : 'None'}
              originalLabel="Original reward"
              originalValue={selectedCode?.rewardSummary}
              status={qaStatus.code}
              disabledReason={codeDisabledReason}
              onRun={runCodeQa}
            />

            <QaPanel
              icon={<Newspaper className="h-4 w-4 text-[#6b7280]" />}
              title="News QA"
              items={news}
              selectedValue={selectedNews?.slug || ''}
              onSelect={setSelectedNewsSlug}
              getOptionValue={item => item.slug}
              getOptionLabel={item => `${item.slug} - ${safeSummary(item.title, 48)}`}
              selectedLabel={selectedNews ? selectedNews.slug : 'None'}
              originalLabel="Original title"
              originalValue={selectedNews?.title}
              status={qaStatus.news}
              disabledReason={newsDisabledReason}
              onRun={runNewsQa}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function QaPanel({ icon, title, items, selectedValue, onSelect, getOptionValue, getOptionLabel, selectedLabel, originalLabel, originalValue, status, disabledReason, onRun }) {
  const running = ['updating', 'verifying', 'restoring'].includes(status.phase)

  return (
    <div className="rounded-2xl border border-black/[0.04] bg-[#fafafa] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate text-sm font-bold text-[#111111]">{title}</span>
        </div>
        <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${status.phase === 'success' ? 'text-emerald-500' : status.phase === 'failed' ? 'text-red-500' : 'text-[#6b7280]'}`}>
          {QA_PHASE_LABELS[status.phase] || status.phase}
        </span>
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Selected item</label>
      <select value={selectedValue} onChange={e => onSelect(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 text-xs font-semibold text-[#111111] outline-none transition focus:border-[#ff2f6d] focus:ring-2 focus:ring-[#ff2f6d]/10">
        {items.length ? items.map(item => (
          <option key={getOptionValue(item)} value={getOptionValue(item)}>{getOptionLabel(item)}</option>
        )) : <option value="">No items loaded</option>}
      </select>

      <div className="mt-4 space-y-2 rounded-xl border border-black/[0.04] bg-white p-3 text-[11px] leading-5 text-[#6b7280]">
        <p><span className="font-bold text-[#111111]">Target:</span> {selectedLabel}</p>
        <p><span className="font-bold text-[#111111]">{originalLabel}:</span> {safeSummary(originalValue)}</p>
        {status.temporary ? <p><span className="font-bold text-[#111111]">Temporary value:</span> {status.temporary}</p> : null}
      </div>

      <button onClick={onRun} disabled={Boolean(disabledReason)} className="mt-4 w-full rounded-xl border border-black/[0.06] bg-white px-4 py-2.5 text-xs font-bold text-[#111111] shadow-sm transition hover:bg-black hover:text-white disabled:opacity-40">
        {running ? 'QA Running' : `Test Update & Restore ${title.replace(' QA', '')}`}
      </button>

      {disabledReason ? (
        <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6b7280]">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>Disabled: {disabledReason}</p>
        </div>
      ) : null}
      {status.message ? (
        <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#6b7280]">
          <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>{status.message}</p>
        </div>
      ) : null}
      {status.warning ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-semibold leading-5 text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>{status.warning}</p>
        </div>
      ) : null}
    </div>
  )
}
