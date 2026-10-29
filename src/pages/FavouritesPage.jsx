import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import BookList from '../components/BookList'

function FavouritesPage() {
  const { favourites } = useFavourites()

  return (
    <div>
      <h1 className="page-title">Your favourites</h1>
      {favourites.length === 0 ? (
        <p className="message">
          Nothing saved yet. <Link to="/">Search for a book</Link> and tap Save.
        </p>
      ) : (
        <BookList books={favourites} label="Favourites list" />
      )}
    </div>
  )
}

export default FavouritesPage
