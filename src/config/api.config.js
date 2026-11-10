// The backend this dashboard talks to.
// REACT_APP_API_URL unset (mrshahin.com's dashboard): calls go to /api, which vercel.json forwards to
// sat-backend-production, and the report calls go straight to sat-backend-production, as before.
// REACT_APP_API_URL set (e.g. SATAREA's dashboard): every call goes straight to that backend.
const API_URL = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');

export const API_BASE = API_URL || '/api';
export const DIRECT_API_BASE = API_URL || 'https://sat-backend-production.up.railway.app';
