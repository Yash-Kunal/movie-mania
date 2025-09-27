import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import placeholder from "../assets/details.png";

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
      <motion.div
        className="movie-card"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="movie-poster">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholder}
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
      </motion.div>
    </Link>
  );
}

export default MovieCard;
