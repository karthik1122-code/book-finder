import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import BookPage from './pages/BookPage'
import FavouritesPage from './pages/FavouritesPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
