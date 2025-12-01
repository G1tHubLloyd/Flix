import React from 'react'
import PropTypes from 'prop-types'
import MovieCard from './MovieCard'

export default function MoviesList({ movies }) {
    if (!movies || movies.length === 0) return <p>No movies available.</p>

    return (
        <div className="movies-list">
            {movies.map((m) => (
                <MovieCard key={m._id || m.id || m.Title || m.title} movie={m} />
            ))}
        </div>
    )
}

MoviesList.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
}
