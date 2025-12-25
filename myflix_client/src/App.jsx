import React, { useState, useEffect } from 'react'
import MoviesList from './components/MoviesList'
import AddUserForm from './components/AddUserForm'
import AddMovieForm from './components/AddMovieForm'
import UsersList from './components/UsersList'
import { API_BASE } from './config'
import axios from 'axios'

export default function App() {
    const [movies, setMovies] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        async function loadData() {
            try {
                setLoading(true)
                const [moviesRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE}/movies`, { signal: controller.signal }),
                    axios.get(`${API_BASE}/users`, { signal: controller.signal }),
                ])
                setMovies(moviesRes.data)
                setUsers(usersRes.data)
            } catch (err) {
                if (axios.isCancel?.(err)) { /* cancelled */ }
                else setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadData()
        return () => controller.abort()
    }, [])

    async function handleUserAdded(newUser) {
        // refresh users list
        try {
            const res = await axios.get(`${API_BASE}/users`)
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleMovieAdded(newMovie) {
        // called with the created movie from the AddMovieForm
        if (!newMovie) return
        // prepend to local state for immediate UI update
        setMovies(prev => [newMovie, ...prev])
    }

    async function handleMovieUpdated(movieId, data) {
        try {
            // send lowercase or capitalized fields are both accepted by backend
            await axios.put(`${API_BASE}/movies/${movieId}`, data)
            const res = await axios.get(`${API_BASE}/movies`)
            setMovies(res.data)
        } catch (err) {
            console.error('Failed to update movie', err)
        }
    }

    async function handleAddFavorite(userId, movieId) {
        try {
            const res = await axios.post(`${API_BASE}/users/${userId}/movies/${movieId}`)
            const updated = res.data
            // update users state with updated user
            setUsers((prev) => prev.map(u => (u._id === updated._id ? updated : u)))
            return { success: true, user: updated }
        } catch (err) {
            console.error(err)
            return { success: false, error: err.message }
        }
    }

    async function handleDeleteMovie(movieId) {
        try {
            await axios.delete(`${API_BASE}/movies/${movieId}`)
            // refresh movies and users so UI reflects deleted movie and favorites
            const [moviesRes, usersRes] = await Promise.all([
                axios.get(`${API_BASE}/movies`),
                axios.get(`${API_BASE}/users`),
            ])
            setMovies(moviesRes.data)
            setUsers(usersRes.data)
            // if selected user had that movie, ensure selection updates
            if (selectedUser) {
                const updated = usersRes.data.find(u => u._id === selectedUser._id)
                setSelectedUser(updated || null)
            }
        } catch (err) {
            console.error('Failed to delete movie', err)
        }
    }

    async function handleDeleteUser(userId) {
        try {
            await axios.delete(`${API_BASE}/users/${userId}`)
            const res = await axios.get(`${API_BASE}/users`)
            setUsers(res.data)
            if (selectedUser && selectedUser._id === userId) setSelectedUser(null)
        } catch (err) {
            console.error('Failed to delete user', err)
        }
    }

    async function handleUpdateUser(userId, data) {
        try {
            const res = await axios.put(`${API_BASE}/users/${userId}`, data)
            const updated = res.data
            setUsers((prev) => prev.map(u => (u._id === updated._id ? updated : u)))
            if (selectedUser && selectedUser._id === updated._id) setSelectedUser(updated)
        } catch (err) {
            console.error('Failed to update user', err)
            throw err
        }
    }

    return (
        <div className="app">
            <header>
                <h1>myFlix</h1>
            </header>

            <section style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h2>Movies</h2>
                    {loading && <div>Loading movies…</div>}
                    {error && <div className="error">Error: {error}</div>}
                    {!loading && !error && (
                        <MoviesList movies={movies} selectedUser={selectedUser} onAddFavorite={handleAddFavorite} onDelete={handleDeleteMovie} onUpdate={handleMovieUpdated} />
                    )}
                </div>

                <aside style={{ width: 360 }}>
                    <h2>Users</h2>
                    <UsersList users={users} selectedUser={selectedUser} onSelect={setSelectedUser} onDeleteUser={handleDeleteUser} onUpdateUser={handleUpdateUser} />
                    <AddUserForm onUserAdded={handleUserAdded} />
                    <hr />
                    <h3>Add Movie</h3>
                    <AddMovieForm onMovieAdded={handleMovieAdded} />
                </aside>
            </section>
        </div>
    )
}
