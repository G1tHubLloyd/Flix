import axios from 'axios'

const base = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

const api = axios.create({
    baseURL: base,
})

// Normalize backend movie objects to use lowercase keys the frontend expects.
// Maps: _id -> id, Title -> title, Description -> description, Genre -> genre
function normalizeMovie(m) {
    if (!m || typeof m !== 'object') return m
    return {
        id: m._id || m.id,
        title: m.Title || m.title || '',
        description: m.Description || m.description || '',
        genre: m.Genre || m.genre || null,
        // keep original fields available if needed
        ...m,
    }
}

api.interceptors.response.use(
    (response) => {
        const d = response.data
        if (Array.isArray(d)) {
            response.data = d.map(normalizeMovie)
        } else if (d && typeof d === 'object') {
            response.data = normalizeMovie(d)
        }
        return response
    },
    (error) => Promise.reject(error)
)

export default api
