import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits, getMovieDetails } from "../services/api";
import "../css/MovieDetail.css"; // Make sure this file exists

const MovieDetails = () => {
  const [movie, setMovie] = useState({});
  const [credits, setCredits] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieData = await getMovieDetails(id);
      const creditsData = await getMovieCredits(id);
      setMovie(movieData);
      setCredits(creditsData);
    };

    fetchMovieData();
  }, [id]);

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const director = credits.crew?.find(member => member.job === "Director")?.name || "N/A";
  const writer = credits.crew?.find(member => member.job === "Writer" || member.job === "Screenplay")?.name || "N/A";
  const cast = credits.cast?.slice(0, 5).map(actor => actor.name).join(", ") || "N/A";

  return (
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
  );
};

export default MovieDetails;
