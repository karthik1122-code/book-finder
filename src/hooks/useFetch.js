import { useCallback, useEffect, useState } from 'react'

const MAX_RETRIES = 2 // so up to 3 tries in total
const RETRY_DELAY = 1000 // ms, doubles each time

// waits, but stops early (and throws an AbortError) if the request gets cancelled
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

// Open Library sometimes drops requests when it's busy. Those show up as a network error
// (the browser calls it a CORS error because the error page has no CORS header) or a 5xx.
// Those are worth retrying. A 404 or other 4xx isn't, so it fails straight away.
async function fetchWithRetry(url, signal) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal })
      if (res.status === 404) throw Object.assign(new Error('Not found'), { retry: false })
      if (res.status >= 500) throw Object.assign(new Error(`Server error (${res.status})`), { retry: true })
      if (!res.ok) throw Object.assign(new Error(`Something went wrong (${res.status})`), { retry: false })
      return await res.json()
    } catch (err) {
      if (err.name === 'AbortError' || err.retry === false || attempt >= MAX_RETRIES) throw err
      await wait(RETRY_DELAY * 2 ** attempt, signal)
    }
  }
}

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0) // bumped by retry() to run the effect again

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

    fetchWithRetry(url, controller.signal)
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        // aborted on purpose because the url changed, so ignore it
        if (err.name === 'AbortError') return
        setError(
          err.message === 'Failed to fetch' || err.message.startsWith('Server error')
            ? "Open Library isn't responding right now."
            : err.message,
        )
        setLoading(false)
      })

    // When the url changes (or the component unmounts) the old request is
    // cancelled, so a slow old search can never overwrite newer results.
    // This also cancels any retry that's still waiting.
    return () => controller.abort()
  }, [url, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { data, loading, error, retry }
}
