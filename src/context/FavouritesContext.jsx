import { useCallback, useEffect, useMemo, useState } from 'react'
import { FavouritesContext } from './useFavourites'

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem('favourites')) ?? []
  } catch {
    return []
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(loadSaved)

  useEffect(() => {
    try {
      localStorage.setItem('favourites', JSON.stringify(favourites))
    } catch {
      // storage can be blocked (private mode etc.), favourites just won't persist
    }
  }, [favourites])

  // functional updates, so add/remove never change between renders
  const add = useCallback((book) => {
    setFavourites((prev) => (prev.some((b) => b.id === book.id) ? prev : [...prev, book]))
  }, [])

  const remove = useCallback((id) => {
    setFavourites((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const value = useMemo(() => ({ favourites, add, remove }), [favourites, add, remove])

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
}
