import { createContext, useContext } from 'react'

// kept in its own file so FavouritesContext.jsx only exports a component (keeps fast refresh happy)
export const FavouritesContext = createContext(null)

export function useFavourites() {
  const context = useContext(FavouritesContext)
  if (!context) throw new Error('useFavourites must be used inside FavouritesProvider')
  return context
}
