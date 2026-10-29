import { Link, NavLink } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

function Navbar() {
  const { favourites } = useFavourites()

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Book<span>Finder</span>
      </Link>
      <nav>
        <NavLink to="/" end>
          Search
        </NavLink>
        <NavLink to="/favourites">
          Favourites <span className="badge">{favourites.length}</span>
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
