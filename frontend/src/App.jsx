import React, { useEffect, useState } from 'react'
import MoviesList from './components/MoviesList'
import UsersList from './components/UsersList'
import api from './api/api'

export default function App() {
    const [movies, setMovies] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [view, setView] = useState('movies') // 'movies' or 'users'

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

    // CRUD helpers for movies
    async function addMovie(payload) {
        try {
            const res = await api.post('/movies', payload)
            setMovies((m) => [res.data, ...m])
            return res.data
        } catch (err) {
            setError(err.message || 'Failed to add movie')
            throw err
        }
    }

    async function updateMovie(id, payload) {
        try {
            const res = await api.put(`/movies/${id}`, payload)
            setMovies((list) => list.map((it) => (it.id === id ? res.data : it)))
            return res.data
        } catch (err) {
            setError(err.message || 'Failed to update movie')
            throw err
        }
    }

    async function deleteMovie(id) {
        try {
            await api.delete(`/movies/${id}`)
            setMovies((list) => list.filter((it) => it.id !== id))
        } catch (err) {
            setError(err.message || 'Failed to delete movie')
            throw err
        }
    }

    return (
        <div className="app-container">
            <header>
                <h1>myFlix</h1>
            </header>
            <main>
                <div style={{ marginBottom: 12 }}>
                    <button onClick={() => setView('movies')} disabled={view === 'movies'}>Movies</button>
                    <button onClick={() => setView('users')} disabled={view === 'users'} style={{ marginLeft: 8 }}>Users</button>
                </div>

                {view === 'movies' && (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <AddMovieForm onAdd={addMovie} />
                        </div>
                        {loading && <p>Loading movies...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {!loading && !error && (
                            <MoviesList movies={movies} onUpdate={updateMovie} onDelete={deleteMovie} />
                        )}
                    </>
                )}

                {view === 'users' && (
                    <UsersSection setUsers={setUsers} users={users} />
                )}
            </main>
        </div>
    )
}

function UsersSection({ setUsers, users }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        // fetch users when the UsersSection mounts
        let mounted = true
        async function fetchUsers() {
            try {
                setLoading(true)
                const res = await api.get('/users')
                if (mounted) setUsers(res.data)
            } catch (err) {
                setError(err.message || 'Failed to fetch users')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
        return () => { mounted = false }
    }, [setUsers])

    return (
        <div>
            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && <UsersList users={users} />}
        </div>
    )
}
