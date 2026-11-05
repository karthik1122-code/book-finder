import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'
import BookList from '../components/BookList'
import { API, toBook } from '../books'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [text, setText] = useState(searchParams.get('q') ?? '')
  const [fromYear, setFromYear] = useState('')
  const [toYear, setToYear] = useState('')
  const [sort, setSort] = useState('relevance')

  const inputRef = useRef(null)
  const query = useDebounce(text.trim(), 500)

  // focus the search box as soon as the page opens
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  // keep the search in the URL so it's still there after visiting a book and coming back
  useEffect(() => {
    if ((searchParams.get('q') ?? '') !== query) {
      setSearchParams(query ? { q: query } : {}, { replace: true })
    }
  }, [query, searchParams, setSearchParams])

  const url = query
    ? `${API}/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i`
    : null
  const { data, loading, error, retry } = useFetch(url)

  // only re-sorts/filters when the results or the filters change,
  // not when something unrelated (like favourites) changes
  const books = useMemo(() => {
    if (!data) return []

    const from = fromYear ? Number(fromYear) : -Infinity
    const to = toYear ? Number(toYear) : Infinity
    const usingRange = fromYear || toYear

    const list = data.docs
      .filter((doc) => {
        if (!usingRange) return true
        const year = doc.first_publish_year
        return year && year >= from && year <= to
      })
      .map(toBook)

    if (sort === 'newest') list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    if (sort === 'oldest') list.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999))
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [data, fromYear, toYear, sort])

  return (
    <div>
      <h1 className="page-title">Find your next book</h1>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by title, author or topic"
          aria-label="Search books"
        />
      </div>

      <div className="filters">
        <label>
          From year
          <input type="number" value={fromYear} onChange={(e) => setFromYear(e.target.value)} placeholder="1900" />
        </label>
        <label>
          To year
          <input type="number" value={toYear} onChange={(e) => setToYear(e.target.value)} placeholder="2026" />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      {!query && <p className="message">Start typing to search millions of books from Open Library.</p>}
      {loading && <p className="message">Searching for “{query}”…</p>}
      {error && (
        <div className="message error">
          <p>Couldn't load results. {error}</p>
          <button type="button" className="retry-btn" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {data && books.length === 0 && (
        <p className="message">
          {data.docs.length === 0 ? `No books found for “${query}”.` : 'No books in that year range. Try widening it.'}
        </p>
      )}

      {books.length > 0 && <BookList books={books} />}
    </div>
  )
}

export default SearchPage
