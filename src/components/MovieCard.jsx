import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const {
    isFavourite,
    addtoFavourites,
    removeFromFavourites,
  } = useMovieContext();

  const favourite = isFavourite(movie.id);

  function onFavouriteClick(e) {
    e.preventDefault(); // Prevents navigation when clicking heart
    if (favourite) {
      removeFromFavourites(movie.id);
    } else {
      addtoFavourites(movie);
    }
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-overlay">
            <button
              className={`favorite-btn ${favourite ? "active" : ""}`}
              onClick={onFavouriteClick}
            >
              {favourite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split("-")[0]}</p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
