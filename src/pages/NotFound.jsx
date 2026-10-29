import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="message not-found">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/">Go to search</Link>
    </div>
  )
}

export default NotFound
