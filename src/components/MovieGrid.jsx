import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MovieGrid = ({ movies, fetchMoreMovies }) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const lastMovieRef = (node) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsFetching(true);
        fetchMoreMovies().finally(() => setIsFetching(false));
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {movies.map((movie, index) => {
        const isLastMovie = index === movies.length - 1;
        return (
          <motion.div
            key={movie.id}
            ref={isLastMovie ? lastMovieRef : null}
            className="movie-card bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-2">
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-600">Rating: {movie.rating}</p>
              <p className="text-sm text-gray-600">Genre: {movie.genre}</p>
              <p className="text-sm text-gray-600">Year: {movie.releaseYear}</p>
            </div>
          </motion.div>
        );
      })}
      {isFetching && <p className="col-span-full text-center">Loading more movies...</p>}
    </div>
  );
};

export default MovieGrid;