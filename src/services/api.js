import { MOCK_GENRES, MOCK_MOVIES } from '../data/mockData';

// Use environment variable if available, otherwise fallback to the provided OMDb key.
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "b5b0b8ca";
const BASE_URL = "https://www.omdbapi.com/";

// Debug environment variables in the API service
console.log('API Service Initialization:');
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_OMDB_API_KEY available:', !!import.meta.env.VITE_OMDB_API_KEY);
console.log('Using fallback key:', !import.meta.env.VITE_OMDB_API_KEY);

// Session-specific offline mode (no longer persists across sessions or devices)
let OFFLINE_MODE = false;
let failureCount = 0;
const MAX_FAILURES_BEFORE_OFFLINE = 3;
const FAILURE_RESET_INTERVAL = 60000; // 1 minute

// Reset failure count periodically to allow retrying real API
setInterval(() => {
  if (failureCount > 0) {
    console.log("Resetting API failure count to allow retrying");
    failureCount = 0;
    OFFLINE_MODE = false;
  }
}, FAILURE_RESET_INTERVAL);

// Mark as offline temporarily after multiple failures
function trackFailure() {
  failureCount++;
  console.log(`API failure ${failureCount}/${MAX_FAILURES_BEFORE_OFFLINE}`);
  if (failureCount >= MAX_FAILURES_BEFORE_OFFLINE) {
    console.log("Too many API failures, switching to offline mode temporarily");
    OFFLINE_MODE = true;
  }
}

// Fetch with timeout helper
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (res.ok) {
      // Reset failure count on success
      failureCount = 0;
      OFFLINE_MODE = false;
    }
    return res;
  } finally {
    clearTimeout(id);
  }
}

export const getPopularMovies = async (page = 1) => {
    if (OFFLINE_MODE) return makeMockPage(MOCK_MOVIES, page);
    try {
        const response = await fetchWithTimeout(buildOmdbUrl({ s: "movie", type: "movie", page }));
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return (data.Search || []).map(normalizeSearchMovie);
    } catch (err) {
        console.warn("Popular movies fetch failed, using mock data:", err.message);
        trackFailure();
        return makeMockPage(MOCK_MOVIES, page);
    }
};

export const searchMovies = async(query) => {
    if (OFFLINE_MODE) {
        const q = (query || '').toLowerCase();
        const filtered = MOCK_MOVIES.filter(m => (m.title || '').toLowerCase().includes(q));
        return makeMockPage(filtered.length ? filtered : MOCK_MOVIES, 1);
    }
    try {
        const response = await fetchWithTimeout(buildOmdbUrl({ s: query, type: "movie", page: 1 }));
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return (data.Search || []).map(normalizeSearchMovie);
    } catch (err) {
        console.warn("Search movies fetch failed, using mock data:", err.message);
        trackFailure();
        const q = (query || '').toLowerCase();
        const filtered = MOCK_MOVIES.filter(m => (m.title || '').toLowerCase().includes(q));
        return makeMockPage(filtered.length ? filtered : MOCK_MOVIES, 1);
    }
};

export const getMovieDetails = async (id) => {
    if (OFFLINE_MODE) return { 
        id, 
        title: "Mock Movie Details", 
        overview: "This is a mock movie since the API is currently offline.", 
        release_date: "2023-01-01",
        poster_path: "/mock_poster.jpg",
        vote_average: 7.5,
        genres: [{ id: 28, name: "Action" }],
        runtime: 120
    };
    try {
        const response = await fetchWithTimeout(buildOmdbUrl({ i: id, plot: "full" }));
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return normalizeDetailedMovie(data);
    } catch (err) {
        console.warn("Movie details fetch failed, using mock data:", err.message);
        trackFailure();
        return { 
            id, 
            title: "Mock Movie Details", 
            overview: "This is a mock movie since the API is currently offline.", 
            release_date: "2023-01-01",
            poster_path: "/mock_poster.jpg",
            vote_average: 7.5,
            genres: [{ id: 28, name: "Action" }],
            runtime: 120
        };
    }
};

export const getMovieCredits = async (movieId) => {
    if (OFFLINE_MODE) return { 
        cast: [
            { id: 101, name: "Mock Actor 1", character: "Character 1" },
            { id: 102, name: "Mock Actor 2", character: "Character 2" }
        ], 
        crew: [
            { id: 201, name: "Mock Director", job: "Director" },
            { id: 202, name: "Mock Writer", job: "Writer" }
        ] 
    };
    try {
        const response = await fetchWithTimeout(buildOmdbUrl({ i: movieId, plot: "short" }));
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return normalizeCredits(data);
    } catch (err) {
        console.warn("Movie credits fetch failed, using mock data:", err.message);
        trackFailure();
        return { 
            cast: [
                { id: 101, name: "Mock Actor 1", character: "Character 1" },
                { id: 102, name: "Mock Actor 2", character: "Character 2" }
            ], 
            crew: [
                { id: 201, name: "Mock Director", job: "Director" },
                { id: 202, name: "Mock Writer", job: "Writer" }
            ] 
        };
    }
};

export const getMovieVideos = async () => {
    return { results: [] };
};

export const getGenres = async () => {
    return MOCK_GENRES;
};

export const safeGetPopular = async (page = 1) => {
    if (OFFLINE_MODE) return makeMockPage(MOCK_MOVIES, page);
    try {
        const res = await fetchWithTimeout(buildOmdbUrl({ s: "movie", type: "movie", page }));
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return (data.Search || []).map(normalizeSearchMovie);
    } catch (err) {
        console.warn("Safe popular movies fetch failed, using mock data:", err.message);
        trackFailure();
        return makeMockPage(MOCK_MOVIES, page);
    }
};

export const getDiscoverMovies = async ({ page = 1, genreId, releaseYear, rating } = {}) => {
    if (OFFLINE_MODE) {
        return mockDiscover({ page, genreId, releaseYear, rating });
    }
    try {
        const genre = MOCK_GENRES.find(g => String(g.id) === String(genreId));
        const searchTerm = genre?.name || "movie";
        const res = await fetchWithTimeout(buildOmdbUrl({ s: searchTerm, type: "movie", page }));
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        if (data.Response === "False") throw new Error(data.Error || 'OMDb request failed');
        return (data.Search || [])
            .map(normalizeSearchMovie)
            .filter(movie => matchesFilters(movie, { releaseYear, rating }));
    } catch (err) {
        console.warn("Discover movies fetch failed, using mock data:", err.message, {
            page, filters: { genreId, releaseYear, rating }
        });
        trackFailure();
        return mockDiscover({ page, genreId, releaseYear, rating });
    }
};

function buildOmdbUrl(params) {
    const searchParams = new URLSearchParams({
        apikey: API_KEY,
        ...Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ),
    });
    return `${BASE_URL}?${searchParams.toString()}`;
}

function normalizeSearchMovie(movie) {
    return {
        id: movie.imdbID,
        imdbID: movie.imdbID,
        title: movie.Title,
        release_date: yearToDate(movie.Year),
        poster_path: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "",
        vote_average: null,
        type: movie.Type,
    };
}

function normalizeDetailedMovie(movie) {
    return {
        ...normalizeSearchMovie(movie),
        overview: movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "",
        genres: splitNames(movie.Genre).map((name, index) => ({ id: index + 1, name })),
        runtime: parseRuntime(movie.Runtime),
        vote_average: movie.imdbRating && movie.imdbRating !== "N/A" ? Number(movie.imdbRating) : null,
        director: movie.Director,
        writer: movie.Writer,
        actors: movie.Actors,
    };
}

function normalizeCredits(movie) {
    return {
        cast: splitNames(movie.Actors).map((name, index) => ({ id: `${movie.imdbID}-cast-${index}`, name })),
        crew: [
            ...splitNames(movie.Director).map((name, index) => ({ id: `${movie.imdbID}-director-${index}`, name, job: "Director" })),
            ...splitNames(movie.Writer).map((name, index) => ({ id: `${movie.imdbID}-writer-${index}`, name, job: "Writer" })),
        ],
    };
}

function splitNames(value) {
    if (!value || value === "N/A") return [];
    return value.split(",").map(item => item.trim()).filter(Boolean);
}

function yearToDate(year) {
    const match = String(year || "").match(/\d{4}/);
    return match ? `${match[0]}-01-01` : "";
}

function parseRuntime(runtime) {
    const minutes = String(runtime || "").match(/\d+/);
    return minutes ? Number(minutes[0]) : null;
}

function matchesFilters(movie, { releaseYear, rating } = {}) {
    const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;
    if (releaseYear && Array.isArray(releaseYear) && year) {
        const [minY, maxY] = releaseYear;
        if (year < (minY || 0) || year > (maxY || 9999)) return false;
    }
    if (rating && Array.isArray(rating) && movie.vote_average != null) {
        const [minR, maxR] = rating;
        if (movie.vote_average < (minR ?? 0) || movie.vote_average > (maxR ?? 10)) return false;
    }
    return true;
}

// helper to create unique ids per page from mock list so React keys remain stable and infinite scroll can append
function makeMockPage(list, page) {
    const offset = (Number(page) || 1) * 10000;
    return (list || []).map((m, idx) => ({
        ...m,
        id: (m.id ?? 1000000) + offset + idx,
    }));
}

function mockDiscover({ page = 1, genreId, releaseYear, rating } = {}) {
    let base = [...MOCK_MOVIES];
    if (genreId) base = base.filter(m => (m.genre_ids || []).includes(Number(genreId)));
    if (releaseYear && Array.isArray(releaseYear)) {
        const [minY, maxY] = releaseYear;
        base = base.filter(m => {
            const y = m.release_date ? parseInt(m.release_date.slice(0,4), 10) : null;
            return y && y >= (minY || 0) && y <= (maxY || 9999);
        });
    }
    if (rating && Array.isArray(rating)) {
        const [minR, maxR] = rating;
        base = base.filter(m => (m.vote_average ?? 0) >= (minR ?? 0) && (m.vote_average ?? 0) <= (maxR ?? 10));
    }
    if (base.length === 0) base = [...MOCK_MOVIES];
    return makeMockPage(base, page);
}
