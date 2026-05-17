import { useCallback, useEffect, useState } from 'react'

export function useAsyncData(load, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))

  const reload = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return initialData
    }

    setLoading(true)
    setError(null)
    try {
      const next = await load()
      setData(next)
      return next
    } catch (nextError) {
      setError(nextError)
      return null
    } finally {
      setLoading(false)
    }
  }, [enabled, load, initialData])

  useEffect(() => {
    let alive = true
    if (!enabled) {
      setData(initialData)
      setError(null)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(null)
    load()
      .then((next) => {
        if (alive) setData(next)
      })
      .catch((nextError) => {
        if (alive) setError(nextError)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, deps)

  return { data, error, loading, reload }
}
