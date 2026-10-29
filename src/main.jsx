import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavouritesProvider } from './context/FavouritesContext'
import App from './App'
import './index.css'

// No <StrictMode> here on purpose: in dev it renders every component twice,
// which would double the numbers on the render counters.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FavouritesProvider>
      <App />
    </FavouritesProvider>
  </BrowserRouter>,
)
