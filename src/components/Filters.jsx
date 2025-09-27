import React, { useState, useEffect, useRef, useMemo } from 'react';

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
    <div className="filters" style={{ maxWidth: 800, margin: '0 auto 1.5rem', padding: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: '#1c1c1c', color: '#fff', border: '1px solid rgba(255,255,255,0.06)'}}
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

        <div style={{ minWidth: 240 }}>
          <label style={{ display: 'block', color: '#ddd', fontSize: 13 }}>Release Year: {releaseYear[0]} - {releaseYear[1]}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="range"
              min="1900"
              max="2025"
              value={releaseYear[0]}
              onChange={(e) => setReleaseYear([Math.min(parseInt(e.target.value), releaseYear[1]), releaseYear[1]])}
              style={{ flex: 1 }}
            />
            <input
              type="range"
              min="1900"
              max="2025"
              value={releaseYear[1]}
              onChange={(e) => setReleaseYear([releaseYear[0], Math.max(parseInt(e.target.value), releaseYear[0])])}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ minWidth: 200 }}>
          <label style={{ display: 'block', color: '#ddd', fontSize: 13 }}>Rating: {rating[0]} - {rating[1]}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="range"
              min="0"
              max="10"
              value={rating[0]}
              onChange={(e) => setRating([Math.min(parseInt(e.target.value), rating[1]), rating[1]])}
              style={{ flex: 1 }}
            />
            <input
              type="range"
              min="0"
              max="10"
              value={rating[1]}
              onChange={(e) => setRating([rating[0], Math.max(parseInt(e.target.value), rating[0])])}
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;