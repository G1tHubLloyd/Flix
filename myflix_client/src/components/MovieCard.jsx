import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function MovieCard({ movie, selectedUser, onAddFavorite, onDelete, onUpdate }) {
    const [status, setStatus] = useState(null)
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState(movie.Title || movie.title || '')
    const [description, setDescription] = useState(movie.Description || movie.description || '')
    const [imagePath, setImagePath] = useState(movie.ImagePath || movie.imagePath || '')

    async function handleAddFavorite() {
        if (!selectedUser) {
            setStatus('Select a user first')
            return
        }
        setStatus('adding')
        const resp = await onAddFavorite(selectedUser._id, movie._id || movie.id)
        if (resp && resp.success) setStatus('added')
        else setStatus(resp.error || 'error')
    }

    async function handleSaveEdit() {
        if (!onUpdate) return
        setStatus('saving')
        try {
            // send lowercase keys to match frontend normalization
            const payload = { title, description, imagePath }
            await onUpdate(movie._id || movie.id, payload)
            setStatus('saved')
            setEditing(false)
        } catch (err) {
            setStatus(err.message || 'error')
        }
    }

    return (
        <div className="movie-card">
            {movie.ImagePath && (
                <img src={movie.ImagePath} alt={movie.Title} />
            )}
            {!editing ? (
                <>
                    <h2>{movie.Title || movie.title}</h2>
                    <p>{movie.Description || movie.description}</p>
                </>
            ) : (
                <div>
                    <input value={title} onChange={e => setTitle(e.target.value)} />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                    <input value={imagePath} onChange={e => setImagePath(e.target.value)} placeholder="ImagePath (URL)" />
                </div>
            )}
            <div style={{ marginTop: 8 }}>
                <button onClick={handleAddFavorite}>Add to Favorites</button>
                <button onClick={() => setEditing(e => !e)} style={{ marginLeft: 8 }}>{editing ? 'Cancel' : 'Edit'}</button>
                {editing && (
                    <button onClick={handleSaveEdit} style={{ marginLeft: 8 }}>Save</button>
                )}
                <button
                    style={{ marginLeft: 8 }}
                    onClick={async () => {
                        if (!onDelete) return
                        if (!window.confirm('Delete this movie?')) return
                        await onDelete(movie._id || movie.id)
                    }}
                >
                    Delete
                </button>
                {status && <span style={{ marginLeft: 8 }}>{status}</span>}
            </div>
        </div>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.string,
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string,
    }).isRequired,
    selectedUser: PropTypes.object,
    onAddFavorite: PropTypes.func,
    onDelete: PropTypes.func,
}

