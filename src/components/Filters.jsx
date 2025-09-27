import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../css/Filters.css';

const Filters = ({ onFilterChange, genres = [] }) => {
  // Filters no longer contain a search input — Home handles search UI
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState([2000, 2025]);
  const [rating, setRating] = useState([0, 10]);

  // Debounce updates so rapid slider moves don't flood parent
  const timeoutRef = useRef();
  const didMount = useRef(false);
  const payload = useMemo(() => ({ genre, releaseYear, rating }), [genre, releaseYear, rating]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onFilterChange(payload);
    }, 200);
    return () => clearTimeout(timeoutRef.current);
  }, [payload, onFilterChange]);

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filter-group">
          <label className="filter-label">Genre</label>
          <select
            className="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.length > 0
              ? genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))
              : (
                <>
                  <option value="28">Action</option>
                  <option value="35">Comedy</option>
                  <option value="18">Drama</option>
                  <option value="27">Horror</option>
                </>
              )}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            Release Year
            <span className="filter-value">{releaseYear[0]} - {releaseYear[1]}</span>
          </label>
          <div className="range-slider">
            <input
              className="slider"
              type="range"
              min="1900"
              max="2025"
              value={releaseYear[0]}
              onChange={(e) => setReleaseYear([Math.min(parseInt(e.target.value), releaseYear[1]), releaseYear[1]])}
            />
            <input
              className="slider"
              type="range"
              min="1900"
              max="2025"
              value={releaseYear[1]}
              onChange={(e) => setReleaseYear([releaseYear[0], Math.max(parseInt(e.target.value), releaseYear[0])])}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            Rating
            <span className="filter-value">{rating[0]} - {rating[1]}</span>
          </label>
          <div className="range-slider">
            <input
              className="slider"
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rating[0]}
              onChange={(e) => setRating([Math.min(parseFloat(e.target.value), rating[1]), rating[1]])}
            />
            <input
              className="slider"
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rating[1]}
              onChange={(e) => setRating([rating[0], Math.max(parseFloat(e.target.value), rating[0])])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;