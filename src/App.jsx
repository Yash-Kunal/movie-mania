import './css/App.css'
import Home from "./pages/Home"
import Favourites from './pages/Favourites'
import { Route , Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import { MovieProvider } from './contexts/MovieContext'
import MovieDetail from './pages/MovieDetail'
function App() {

  return (
    <MovieProvider>
    <NavBar></NavBar>
    <main className='main-content'>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/favourites" element={<Favourites/>}></Route>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>

    </main>
    </MovieProvider>
  )
}

export default App
