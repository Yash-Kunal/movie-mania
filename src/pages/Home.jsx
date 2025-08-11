import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import "../css/MovieCard.css";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";
import "../index.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                setLoading(true);
                const popularMovies = await getPopularMovies(page);
                if (popularMovies.length > 0) {
                    setMovies((prev) => [...prev, ...popularMovies]);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load movies");
            } finally {
                setLoading(false);
            }
        };

        if (!searchQuery) {
            loadPopularMovies();
        }
    }, [page, searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                if (!loading && hasMore && !searchQuery) {
                    setPage((prevPage) => prevPage + 1);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, searchQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
            setHasMore(false);
        } catch (err) {
            console.error(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === "") {
                            setMovies([]);
                            setPage(1);
                            setHasMore(true);
                        }
                    }}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>

            {loading && <div className="loading">Loading...</div>}
        </div>
    );
}

export default Home;
