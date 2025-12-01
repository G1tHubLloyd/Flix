import React from 'react'
import PropTypes from 'prop-types'

export default function MovieCard({ movie }) {
    return (
        <article className="movie-card">
            <h3>{movie.Title || movie.title}</h3>
            {(movie.Description || movie.description) && (
                <p>{movie.Description || movie.description}</p>
            )}
            {movie.Genre && <p><strong>Genre:</strong> {movie.Genre}</p>}
        </article>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string,
        title: PropTypes.string,
        Description: PropTypes.string,
        description: PropTypes.string,
        Genre: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }).isRequired,
}
