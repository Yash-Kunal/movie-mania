// Use environment variable if available, otherwise fallback to hardcoded key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "227f8ae47b1c1df332b2e8aef9ef158f";
const BASE_URL = "https://api.themoviedb.org/3";
import { MOCK_GENRES, MOCK_MOVIES } from '../data/mockData';

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
        const response = await fetchWithTimeout(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data.results || [];
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
        const response = await fetchWithTimeout(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                query
            )}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data.results || [];
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
        const response = await fetchWithTimeout(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
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
        const response = await fetchWithTimeout(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
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

export const getMovieVideos = async (movieId) => {
    if (OFFLINE_MODE) return { results: [
        { id: "v1", key: 'dQw4w9WgXcQ', name: 'Mock Trailer', site: 'YouTube', type: 'Trailer' },
        { id: "v2", key: 'dQw4w9WgXcQ', name: 'Mock Teaser', site: 'YouTube', type: 'Teaser' }
    ]};
    try {
        const response = await fetchWithTimeout(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
    } catch (err) {
        console.warn("Movie videos fetch failed, using mock data:", err.message);
        trackFailure();
        return { results: [
            { id: "v1", key: 'dQw4w9WgXcQ', name: 'Mock Trailer', site: 'YouTube', type: 'Trailer' },
            { id: "v2", key: 'dQw4w9WgXcQ', name: 'Mock Teaser', site: 'YouTube', type: 'Teaser' }
        ]};
    }
};

export const getGenres = async () => {
    if (OFFLINE_MODE) return MOCK_GENRES;
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data.genres || [];
    } catch (err) {
        console.warn("Genres fetch failed, using mock data:", err.message);
        trackFailure();
        return MOCK_GENRES;
    }
};

export const safeGetPopular = async (page = 1) => {
    if (OFFLINE_MODE) return makeMockPage(MOCK_MOVIES, page);
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        return data.results || [];
    } catch (err) {
        console.warn("Safe popular movies fetch failed, using mock data:", err.message);
        trackFailure();
        return makeMockPage(MOCK_MOVIES, page);
    }
};

export const getDiscoverMovies = async ({ page = 1, genreId, releaseYear, rating } = {}) => {
    const params = new URLSearchParams({
        api_key: API_KEY,
        include_adult: 'false',
        language: 'en-US',
        sort_by: 'popularity.desc',
        page: String(page),
    });
    if (genreId) params.set('with_genres', String(genreId));
    if (releaseYear && Array.isArray(releaseYear)) {
        const [minY, maxY] = releaseYear;
        if (minY) params.set('primary_release_date.gte', `${minY}-01-01`);
        if (maxY) params.set('primary_release_date.lte', `${maxY}-12-31`);
    }
    if (rating && Array.isArray(rating)) {
        const [minR, maxR] = rating;
        if (minR != null) params.set('vote_average.gte', String(minR));
        if (maxR != null) params.set('vote_average.lte', String(maxR));
    }
    if (OFFLINE_MODE) {
        return mockDiscover({ page, genreId, releaseYear, rating });
    }
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/discover/movie?${params.toString()}`);
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        return data.results || [];
    } catch (err) {
        console.warn("Discover movies fetch failed, using mock data:", err.message, {
            page, filters: { genreId, releaseYear, rating }
        });
        trackFailure();
        return mockDiscover({ page, genreId, releaseYear, rating });
    }
};

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
