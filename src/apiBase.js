// Which backend this dashboard talks to.
//
// The API files call '/api/...', which vercel.json forwards to the backend written there
// (mrshahin.com's server). A Vercel project for another site's dashboard sets
// REACT_APP_API_URL to that site's backend (e.g. SATAREA's own Railway server); every
// '/api/...' request is then sent straight to it instead. Nothing changes when it is not set.
const API_URL = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '')

// '/api/report/all' → 'https://<backend>/report/all' when REACT_APP_API_URL is set
export const toBackend = (url) => {
    if (!API_URL || typeof url !== 'string') return url
    if (url === '/api' || url.startsWith('/api/') || url.startsWith('/api?')) return API_URL + url.slice('/api'.length)
    return url
}

if (API_URL && typeof window !== 'undefined' && typeof window.fetch === 'function') {
    const fetchFromBrowser = window.fetch.bind(window)
    window.fetch = (input, init) => fetchFromBrowser(toBackend(input), init)
}
