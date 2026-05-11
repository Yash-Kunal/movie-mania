import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits, getMovieDetails, getMovieVideos } from "../services/api";
import ErrorBoundary from "../components/ErrorBoundary";
import "../css/MovieDetail.css"; // Make sure this file exists

const MovieDetails = () => {
  const [movie, setMovie] = useState({});
  const [credits, setCredits] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieData = await getMovieDetails(id);
      const creditsData = await getMovieCredits(id);
      const videosData = await getMovieVideos(id);
      
      setMovie(movieData);
      setCredits(creditsData);
      
      // Filter for trailers only from YouTube
      const trailers = videosData.results?.filter(
        video => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
      ) || [];
      
      setVideos(trailers);
      
      // Select the first trailer automatically if available
      if (trailers.length > 0) {
        setSelectedTrailer(trailers[0]);
      }
    };

    fetchMovieData();
  }, [id]);

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const posterUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const director = credits.crew?.find(member => member.job === "Director")?.name || "N/A";
  const writer = credits.crew?.find(member => member.job === "Writer" || member.job === "Screenplay")?.name || "N/A";
  const cast = credits.cast?.slice(0, 5).map(actor => actor.name).join(", ") || "N/A";

  return (
    <div className="movie-details-wrapper">
      {/* Movie details section */}
      <div className="movie-details-container">
        <div className="poster-section">
          {posterUrl && <img src={posterUrl} alt={movie.title} className="movie-poster" />}
        </div>
        <div className="details-section">
          <h2>{movie.title} ({releaseYear})</h2>
          <br /><br /><br />
          <p><u><strong>IMDb Rating :</strong></u> {movie.vote_average || "N/A"}</p>
          <br />
          <p><u><strong>Description :</strong></u> {movie.overview || "No description available."}</p>
          <p><u><strong>Genres :</strong> </u> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><u><strong>Runtime :</strong> </u> {movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
          <p><u><strong>Director :</strong> </u> {director}</p>
          <p><u><strong>Writer :</strong> </u> {writer}</p>
          <p><u><strong>Cast :</strong></u> {cast}</p>
        </div>
      </div>
      
      {/* Trailer section */}
      {videos.length > 0 && (
        <div className="trailer-section">
          <h2>Watch Trailer</h2>
          <div className="trailer-container">
            {selectedTrailer && (
              <div className="trailer-player">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                  title={selectedTrailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          {videos.length > 1 && (
            <div className="trailer-selector">
              <h3>More videos:</h3>
              <div className="trailer-buttons">
                {videos.map(video => (
                  <button 
                    key={video.id || video.key} 
                    className={`trailer-button ${selectedTrailer && selectedTrailer.key === video.key ? 'active' : ''}`}
                    onClick={() => setSelectedTrailer(video)}
                  >
                    {video.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Wrap the MovieDetails component with our error boundary
const MovieDetailsWithErrorBoundary = () => (
  <ErrorBoundary>
    <MovieDetails />
  </ErrorBoundary>
);

export default MovieDetailsWithErrorBoundary;
