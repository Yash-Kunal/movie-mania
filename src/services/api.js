const API_KEY = "227f8ae47b1c1df332b2e8aef9ef158f"
const BASE_URL = "https://api.themoviedb.org/3"
import { MOCK_GENRES, MOCK_MOVIES } from '../data/mockData'

// Offline mode: once we detect a fetch failure, avoid hammering the network.
let OFFLINE_MODE = false;
const OFFLINE_KEY = 'mm_offline_mode';
try {
    const stored = typeof window !== 'undefined' && window.localStorage.getItem(OFFLINE_KEY);
    OFFLINE_MODE = stored === '1';
} catch {}

function markOffline() {
    OFFLINE_MODE = true;
    try { window.localStorage.setItem(OFFLINE_KEY, '1'); } catch {}
}

// Fetch with timeout helper
async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
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
        // Mark offline and use mock data silently
        markOffline();
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
        // Mark offline and use mock data silently
        markOffline();
        const q = (query || '').toLowerCase();
        const filtered = MOCK_MOVIES.filter(m => (m.title || '').toLowerCase().includes(q));
        return makeMockPage(filtered.length ? filtered : MOCK_MOVIES, 1);
    }
};

export const getMovieDetails = async (id) => {
    if (OFFLINE_MODE) return { id, title: "Mock Movie", overview: "This is a mock movie since the API is currently offline.", release_date: "2023-01-01" };
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
    } catch (err) {
        markOffline();
        return { id, title: "Mock Movie", overview: "This is a mock movie since the API is currently offline.", release_date: "2023-01-01" };
    }
};

export const getMovieCredits = async (movieId) => {
    if (OFFLINE_MODE) return { cast: [], crew: [] };
    try {
        const response = await fetchWithTimeout(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
    } catch (err) {
        markOffline();
        return { cast: [], crew: [] };
    }
};

export const getMovieVideos = async (movieId) => {
    if (OFFLINE_MODE) return { results: [{ key: 'dQw4w9WgXcQ', name: 'Mock Trailer', site: 'YouTube', type: 'Trailer' }] };
    try {
        const response = await fetchWithTimeout(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
    } catch (err) {
        markOffline();
        return { results: [{ key: 'dQw4w9WgXcQ', name: 'Mock Trailer', site: 'YouTube', type: 'Trailer' }] };
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
        // Mark offline and use mock data silently
        markOffline();
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
        // Mark offline and use mock data silently
        markOffline();
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
        // Mark offline and use mock data silently
        markOffline();
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
