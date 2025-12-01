import React from 'react'
import PropTypes from 'prop-types'

export default function MovieCard({ movie }) {
    return (
        <article className="movie-card">
            <h3>{movie.title}</h3>
            {movie.description && <p>{movie.description}</p>}
            {movie.genre && <p><strong>Genre:</strong> {movie.genre}</p>}
        </article>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        genre: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
}
