import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useFavourites } from '../context/FavouritesContext'
import { API, coverUrl } from '../books'

function getDescription(description) {
  if (!description) return 'No description available.'
  // sometimes it's a plain string, sometimes { type, value }
  return typeof description === 'string' ? description : description.value
}

function BookPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, retry } = useFetch(`${API}/works/${id}.json`)

  // second request for the author's name, only once we know the author key
  const authorKey = data?.authors?.[0]?.author?.key
  const { data: author, loading: authorLoading } = useFetch(authorKey ? `${API}${authorKey}.json` : null)

  const { favourites, add, remove } = useFavourites()
  const isFavourite = favourites.some((b) => b.id === id)

  if (loading) return <p className="message">Loading book…</p>

  if (error) {
    return (
      <div className="message">
        <p>{error === 'Not found' ? "We couldn't find that book." : `Couldn't load this book. ${error}`}</p>
        {error !== 'Not found' && (
          <button type="button" className="retry-btn" onClick={retry}>
            Try again
          </button>
        )}
        <p>
          <Link to="/">Back to search</Link>
        </p>
      </div>
    )
  }

  if (!data) return null

  // some old ids just point to a newer one
  if (data.type?.key === '/type/redirect' && data.location) {
    return <Navigate to={`/books/${data.location.replace('/works/', '')}`} replace />
  }

  const coverId = data.covers?.find((c) => c > 0) ?? null
  const cover = coverUrl(coverId, 'L')
  const year = data.first_publish_date?.match(/\d{4}/)?.[0] ?? null
  // skip machine tags like "nyt:mass-market-monthly=2021-11-07"
  const subjects = data.subjects?.filter((s) => !s.includes(':')).slice(0, 12) ?? []

  function goBack() {
    // if the page was opened straight from a link there's no history to go back to
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  function toggleFavourite() {
    if (isFavourite) {
      remove(id)
    } else {
      add({ id, title: data.title, author: author?.name ?? 'Unknown author', year: year ? Number(year) : null, coverId })
    }
  }

  return (
    <article className="book-page">
      <button type="button" className="back-link" onClick={goBack}>
        ← Back
      </button>

      <div className="book-layout">
        {cover ? <img className="big-cover" src={cover} alt={`Cover of ${data.title}`} /> : <div className="big-cover no-cover">{data.title}</div>}

        <div>
          <h1>{data.title}</h1>
          <p className="author">{author?.name ?? ' '}</p>
          {year && <p className="year">First published {year}</p>}

          {/* wait for the author's name so the saved favourite isn't "Unknown author" */}
          <button
            type="button"
            className={isFavourite ? 'fav-btn saved' : 'fav-btn'}
            onClick={toggleFavourite}
            disabled={authorLoading && !isFavourite}
          >
            {isFavourite ? '♥ Saved to favourites' : '♡ Save to favourites'}
          </button>

          <h2>About this book</h2>
          <p className="description">{getDescription(data.description)}</p>

          {subjects.length > 0 && (
            <>
              <h2>Subjects</h2>
              <ul className="subjects">
                {subjects.map((subject) => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default BookPage
