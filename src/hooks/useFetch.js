import { useEffect, useState } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setData(null) // don't keep showing the last search's results
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error('Not found')
        if (!res.ok) throw new Error(`Something went wrong (${res.status})`)
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        // aborted on purpose because the url changed, so ignore it
        if (err.name === 'AbortError') return
        setError(err.message === 'Failed to fetch' ? 'Network error. Check your connection.' : err.message)
        setLoading(false)
      })

    // When the url changes (or the component unmounts) the old request is
    // cancelled, so a slow old search can never overwrite newer results.
    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}
