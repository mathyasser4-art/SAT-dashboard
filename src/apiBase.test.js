const load = (apiUrl) => {
    jest.resetModules()
    if (apiUrl === undefined) delete process.env.REACT_APP_API_URL
    else process.env.REACT_APP_API_URL = apiUrl
    return require('./apiBase').toBackend
}

afterEach(() => { delete process.env.REACT_APP_API_URL })

test('without REACT_APP_API_URL, /api paths are left for the vercel.json rewrite', () => {
    const toBackend = load(undefined)
    expect(toBackend('/api/report/all')).toBe('/api/report/all')
})

test('with REACT_APP_API_URL, /api paths go straight to that backend', () => {
    const toBackend = load('https://satarea-backend.up.railway.app/')
    expect(toBackend('/api/report/all')).toBe('https://satarea-backend.up.railway.app/report/all')
    expect(toBackend('/api/feedback/admin?view=new')).toBe('https://satarea-backend.up.railway.app/feedback/admin?view=new')
    expect(toBackend('/apiary')).toBe('/apiary')
    expect(toBackend('https://res.cloudinary.com/x.png')).toBe('https://res.cloudinary.com/x.png')
})
