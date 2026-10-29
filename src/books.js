export const API = 'https://openlibrary.org'

export function coverUrl(coverId, size = 'M') {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null
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
