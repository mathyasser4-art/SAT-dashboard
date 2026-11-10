import { API_BASE } from '../config/api.config';
// Payment requests: screenshots of InstaPay / Vodafone Cash transfers to approve or reject.
// Approving activates the user's account until their plan ends (backend: src/services/payments.js)
const URL = `${API_BASE}/payment/admin`

// Sends the admin's login token when there is one (approving activates paid accounts). A token
// that has expired is retried without it, the way the dashboard's other pages call the backend.
const request = async (method, url, body) => {
    const token = localStorage.getItem('O_authDB') || ''
    const send = (withToken) => fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(withToken ? { authrization: `pracYas09${token}` } : {}) },
        body: body ? JSON.stringify(body) : undefined,
    })
    let response = await send(!!token)
    if (token && [401, 403, 404].includes(response.status)) response = await send(false)
    const data = await response.json().catch(() => null)
    if (!response.ok || !data || data.message !== 'success') {
        throw new Error((data && data.message) || `Request failed (${response.status})`)
    }
    return data
}

export const getPendingCount = () => request('GET', `${URL}/count`).then(d => d.pending || 0)
export const getPayments = (status) => request('GET', `${URL}?status=${encodeURIComponent(status)}`)
export const approvePayment = (id, note) => request('PUT', `${URL}/${id}`, { action: 'approve', note })
export const rejectPayment = (id, note) => request('PUT', `${URL}/${id}`, { action: 'reject', note })

// Partners' discount codes (backend: src/services/discountCodes.js): each advertising partner gets
// a code and a link; the report shows the students and payments each code brought
const CODES = `${URL}/codes`
export const getCodes = () => request('GET', CODES)
export const createCode = (fields) => request('POST', CODES, fields)
export const updateCode = (id, fields) => request('PUT', `${CODES}/${id}`, fields)
export const deleteCode = (id) => request('DELETE', `${CODES}/${id}`)
