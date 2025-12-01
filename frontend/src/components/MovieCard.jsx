import React from 'react'
import PropTypes from 'prop-types'

export default function MovieCard({ movie }) {
    const [editing, setEditing] = React.useState(false)
    const [title, setTitle] = React.useState(movie.title)
    const [description, setDescription] = React.useState(movie.description)

    return (
        <article className="movie-card">
            {editing ? (
                <div>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input value={description} onChange={(e) => setDescription(e.target.value)} />
                    <div style={{ marginTop: 8 }}>
                        <button onClick={async () => {
                            try {
                                await movie.__onUpdate(movie.id, { title, description })
                                setEditing(false)
                            } catch (_) {}
                        }}>Save</button>
                        <button onClick={() => { setEditing(false); setTitle(movie.title); setDescription(movie.description) }} style={{ marginLeft: 8 }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <h3>{movie.title}</h3>
                    {movie.description && <p>{movie.description}</p>}
                    {movie.genre && <p><strong>Genre:</strong> {movie.genre}</p>}
                    <div style={{ marginTop: 8 }}>
                        <button onClick={() => setEditing(true)}>Edit</button>
                        <button onClick={() => movie.__onDelete(movie.id)} style={{ marginLeft: 8 }}>Delete</button>
                    </div>
                </>
            )}
        </article>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        genre: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
}
