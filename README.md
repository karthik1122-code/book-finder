# Book Finder

Search books from the [Open Library API](https://openlibrary.org/developers/api), open a book's details page and save favourites that show up on every page.

**Live:** https://book-finder-karthik.vercel.app

## Run it locally

```bash
npm install
npm run dev
```

No API key needed.

## What's where

```
src/
├── hooks/
│   ├── useFetch.js          # { data, loading, error } + AbortController cleanup
│   └── useDebounce.js       # waits 500ms after the last keystroke
├── context/
│   └── FavouritesContext.jsx  # provider with add/remove + useFavourites()
├── components/
│   ├── Navbar.jsx           # links + favourites count
│   ├── BookList.jsx         # grid + "Results list renders: N" counter
│   └── BookCard.jsx         # wrapped in React.memo, has its own render counter
├── pages/
│   ├── SearchPage.jsx       # search box, year filter, sort (useMemo)
│   ├── BookPage.jsx         # /books/:id, reads the id with useParams
│   ├── FavouritesPage.jsx   # /favourites
│   └── NotFound.jsx         # anything else
└── books.js                 # API url, cover url, turns a search result into a book object
```

`vercel.json` sends every route to `index.html`, so `/books/OL893414W` works after a refresh too.

## How the search avoids stale results

1. `useDebounce(text, 500)` only updates once you stop typing, so typing "tolkien" sends **one** request, not seven.
2. `useFetch` creates an `AbortController` for every request and aborts it in the effect cleanup. When the search changes, the old request is cancelled before the new one starts, so a slow old response can never overwrite newer results.

I tested this by slowing down the request for "harry" by 3 seconds and then searching "dune" straight away. Only the Dune results ever showed up.

**Network tab:** see `screenshots/network.png`. It shows that typing a full word sends a single `search.json` request.

## Proving the memoisation works

Every card shows `renders: N` and the list shows `Results list renders: N`.

When you save a favourite, the context changes, so `BookList` re-renders (its counter goes up by 1). But:

| | Cards re-rendered after saving 1 favourite |
| --- | --- |
| Without `React.memo` | 20 of 20 |
| With `React.memo` + `useCallback` | **1 of 20** (only the card that was saved) |

This works because each card only gets `book`, `isFavourite` and `onToggle`:
- `book` objects come from a `useMemo`, so they're the same objects until the search or filters change
- `onToggle` is made with `useCallback`, and `add`/`remove` in the context use functional updates so they never change
- only the clicked card's `isFavourite` flips, so only that card re-renders

(StrictMode is turned off in `main.jsx` because in dev it renders everything twice, which would make the counters misleading.)

## Two cases where useMemo would be pointless

1. **Cheap calculations.** Something like `useMemo(() => favourites.length, [favourites])`. Reading `.length` costs nothing, and useMemo itself has a cost (storing the value and comparing deps every render), so it's slower than just writing `favourites.length`.
2. **When the dependencies change every render anyway.** For example, `useMemo(() => filter(books), [books])` where the parent passes a brand new `books` array each time it renders. The deps never match, so it recalculates every time and the memo does nothing.

## When I'd switch from Context to Zustand or Redux

Context is fine here: favourites is one small piece of state that rarely changes.

I'd switch when:
- **Lots of state changes often.** Every component that reads a context re-renders when any part of its value changes. Zustand lets a component subscribe to just the slice it needs (`useStore(s => s.count)`), so the rest don't re-render.
- **There's a lot of shared state with complex update logic.** For example cart + user + filters + server data all affecting each other. Redux Toolkit gives a clear structure (slices, actions, reducers) and great devtools to see what changed and why.
- **I'd start nesting lots of providers.** Five or six providers wrapped around the app is a sign a single store would be simpler.

For a small-to-medium app I'd pick Zustand first because it's tiny and has almost no boilerplate. Redux makes sense for bigger teams and apps where the strict structure pays off.

## Interview answers

See [INTERVIEW.md](INTERVIEW.md).
