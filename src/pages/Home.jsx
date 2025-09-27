import { searchMovies, getGenres, safeGetPopular, getDiscoverMovies } from "../services/api";
import { MOCK_GENRES, MOCK_MOVIES } from '../data/mockData';
import MovieCard from "../components/MovieCard";
import { useState, useEffect, useCallback, useRef } from "react";
import "../css/MovieCard.css";
import "../css/Home.css";
import "../index.css";
import Filters from '../components/Filters';

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        genre: '',
        releaseYear: [2000, 2025],
        rating: [0, 10],
    });
    const [genres, setGenres] = useState([]);

    // Remove mock seeding for proper pagination; show empty state instead (we already have a message)

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const list = await getGenres();
                setGenres(list.length ? list : MOCK_GENRES);
            } catch (err) {
                console.warn('Failed to load genres', err);
                setGenres(MOCK_GENRES);
            }
        };
        loadGenres();
    }, []);

    useEffect(() => {
        const loadPopularOrDiscover = async () => {
            try {
                setLoading(true);
                const useDiscover = Boolean(filters.genre || filters.releaseYear || filters.rating);
                const pageData = useDiscover
                    ? await getDiscoverMovies({
                        page,
                        genreId: filters.genre ? parseInt(filters.genre, 10) : undefined,
                        releaseYear: filters.releaseYear,
                        rating: filters.rating,
                    })
                    : await safeGetPopular(page);

                if (pageData && pageData.length > 0) {
                    // append and dedupe by id
                    setMovies((prev) => {
                        const combined = page === 1 ? pageData : [...prev, ...pageData];
                        const map = new Map();
                        combined.forEach((m) => map.set(m.id, m));
                        return Array.from(map.values());
                    });
                    // optimistic: assume there may be another page unless API returns empty next time
                    setHasMore(true);
                } else {
                    if (page === 1) {
                        setMovies(MOCK_MOVIES);
                    }
                    setHasMore(false);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load movies");
                if (page === 1) {
                    setMovies(MOCK_MOVIES);
                }
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        if (!searchQuery) {
            loadPopularOrDiscover();
        }
    }, [page, searchQuery, filters.genre, filters.releaseYear, filters.rating]);

    // Infinite scroll using an IntersectionObserver sentinel (works even when content fits in viewport)
    const sentinelRef = useRef(null);
    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return;
        const obs = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !loading && hasMore && !searchQuery) {
                setPage((prev) => prev + 1);
            }
        }, { rootMargin: '200px' });
        obs.observe(node);
        return () => obs.disconnect();
    }, [loading, hasMore, searchQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery);
            // dedupe and replace movies with search results
            const map = new Map();
            (searchResults || []).forEach(m => map.set(m.id, m));
            setMovies(Array.from(map.values()));
            setError(null);
            setHasMore(false);
        } catch (err) {
            console.error(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = useCallback(async (newFilters) => {
        // Only act if values actually changed
        let changed = false;
        setFilters((prev) => {
            const same = prev.genre === newFilters.genre &&
                        prev.releaseYear[0] === newFilters.releaseYear[0] &&
                        prev.releaseYear[1] === newFilters.releaseYear[1] &&
                        prev.rating[0] === newFilters.rating[0] &&
                        prev.rating[1] === newFilters.rating[1];
            changed = !same;
            return same ? prev : newFilters;
        });
        if (!changed) return;
        setMovies([]);
        setHasMore(true);
        // In search mode, let search own the list
        if (searchQuery) {
            // if searching, let search handler own the list
            setHasMore(false);
        }
        setPage(1);
    }, [searchQuery]);

    // With Discover, movies are already filtered server-side; render as-is
    const renderedMovies = movies;

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
            <Filters onFilterChange={handleFilterChange} genres={genres} />

            {error && <div className="error-message">{error}</div>}

            {renderedMovies.length > 0 && (
                <h2 className="section-title">
                    {searchQuery ? "Top Search Results" : "Trending Movies"}
                </h2>
            )}

            <div className="movies-grid">
                {renderedMovies.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>

            {/* Empty state intentionally removed because we now fallback to mock data when API fails */}

            {loading && <div className="loading">Loading...</div>}
            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
    );
}

export default Home;
