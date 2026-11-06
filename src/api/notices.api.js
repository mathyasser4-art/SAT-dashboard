// Notices from the platform to everyone (or only students, teachers, parents or schools).
// They arrive in each person's notification bell on the website.
const URL = '/api/notification/admin/notices'

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

export const getNotices = () => request('GET', URL)
export const sendNotice = (notice) => request('POST', URL, notice)
export const deleteNotice = (batch) => request('DELETE', `${URL}/${batch}`)
