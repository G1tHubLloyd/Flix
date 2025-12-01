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
                        {loading && <p>Loading movies...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {!loading && !error && <MoviesList movies={movies} />}
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
