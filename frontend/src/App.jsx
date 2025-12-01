import React, { useEffect, useState } from 'react'
import MoviesList from './components/MoviesList'
import api from './api/api'

export default function App() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchMovies() {
            try {
                setLoading(true)
                const res = await api.get('/movies')
                setMovies(res.data)
            } catch (err) {
                setError(err.message || 'Failed to fetch movies')
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [])

    return (
        <div className="app-container">
            <header>
                <h1>myFlix</h1>
            </header>
            <main>
                {loading && <p>Loading movies...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && <MoviesList movies={movies} />}
            </main>
        </div>
    )
}
