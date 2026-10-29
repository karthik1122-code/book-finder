import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    // every keystroke clears the previous timer, so this only fires
    // once the user has stopped typing for `delay` ms
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
