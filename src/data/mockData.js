export const MOCK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
];

export const MOCK_MOVIES = [
  {
    id: 1000001,
    title: 'Mock Action Movie',
    poster_path: '',
    genre_ids: [28],
    release_date: '2021-05-12',
    vote_average: 7.8,
  },
  {
    id: 1000002,
    title: 'Mock Comedy Film',
    poster_path: '',
    genre_ids: [35],
    release_date: '2020-08-20',
    vote_average: 6.9,
  },
  {
    id: 1000003,
    title: 'Mock Drama Feature',
    poster_path: '',
    genre_ids: [18],
    release_date: '2019-11-02',
    vote_average: 8.2,
  },
];

export default { MOCK_GENRES, MOCK_MOVIES };
