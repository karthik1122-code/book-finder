// same-origin paths, forwarded to openlibrary.org (see vercel.json / vite.config.js)
export const API = '/ol'

export function coverUrl(coverId, size = 'M') {
  return coverId ? `/covers/b/id/${coverId}-${size}.jpg` : null
}

// search results come back with key: "/works/OL893414W", we only want the id part
export function toBook(doc) {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    author: doc.author_name ? doc.author_name.join(', ') : 'Unknown author',
    year: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }
}
