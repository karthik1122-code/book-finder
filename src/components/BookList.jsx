import { useCallback, useMemo, useRef } from 'react'
import BookCard from './BookCard'
import { useFavourites } from '../context/FavouritesContext'

function BookList({ books, label = 'Results list' }) {
  const { favourites, add, remove } = useFavourites()

  // debug render counter (reading a ref during render is fine for this,
  // just don't use refs for anything that should update the UI)
  const renders = useRef(0)
  renders.current += 1

  // a Set makes the "is this saved?" check quick for every card
  const savedIds = useMemo(() => new Set(favourites.map((b) => b.id)), [favourites])

  // same function every render, so it doesn't break React.memo on the cards
  const handleToggle = useCallback(
    (book, isFavourite) => {
      if (isFavourite) remove(book.id)
      else add(book)
    },
    [add, remove],
  )

  return (
    <section>
      <p className="debug">
        {label} renders: {renders.current}
      </p>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} isFavourite={savedIds.has(book.id)} onToggle={handleToggle} />
        ))}
      </div>
    </section>
  )
}

export default BookList
