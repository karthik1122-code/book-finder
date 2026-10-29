import { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { coverUrl } from '../books'

function BookCard({ book, isFavourite, onToggle }) {
  // debug render counter (reading a ref during render is fine for this,
  // just don't use refs for anything that should update the UI)
  const renders = useRef(0)
  renders.current += 1

  const cover = coverUrl(book.coverId)

  return (
    <article className="book-card">
      <Link to={`/books/${book.id}`} className="cover-link">
        {cover ? (
          <img src={cover} alt={`Cover of ${book.title}`} loading="lazy" />
        ) : (
          <div className="no-cover">{book.title}</div>
        )}
      </Link>
      <div className="book-info">
        <h3>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="author">{book.author}</p>
        <p className="year">{book.year ?? 'Year unknown'}</p>
      </div>
      <div className="card-bottom">
        <button
          type="button"
          className={isFavourite ? 'fav-btn saved' : 'fav-btn'}
          onClick={() => onToggle(book, isFavourite)}
          aria-pressed={isFavourite}
        >
          {isFavourite ? '♥ Saved' : '♡ Save'}
        </button>
        <span className="render-count" title="How many times this card has rendered">
          renders: {renders.current}
        </span>
      </div>
    </article>
  )
}

// memo: the card only re-renders when book, isFavourite or onToggle change
export default memo(BookCard)
