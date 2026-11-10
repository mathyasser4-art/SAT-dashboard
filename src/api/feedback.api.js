import { API_BASE } from '../config/api.config';
// Feedback about the website: quotes to approve for the homepage's Wall of Love, and suggestions
const URL = `${API_BASE}/feedback/admin`

const request = async (method, url, body) => {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || !data || data.message !== 'success') {
        throw new Error((data && data.message) || `Request failed (${response.status})`)
    }
    return data
}

export const getFeedback = (view) => request('GET', `${URL}?view=${encodeURIComponent(view)}`)
export const moderateFeedback = (id, changes) => request('PUT', `${URL}/${id}`, changes)
export const setSuggestion = (id, changes) => request('PUT', `${URL}/${id}/suggestion`, changes)
export const deleteFeedback = (id) => request('DELETE', `${URL}/${id}`)
export const getWall = () => request('GET', `${API_BASE}/feedback/public`)
