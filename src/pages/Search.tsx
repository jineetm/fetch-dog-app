import { useEffect, useState } from 'react'
import fetchClient from '../api/fetchClient'
import DogCard from '../components/DogCard'
import { Dog } from '../types'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'

Modal.setAppElement('#root')

const Search = () => {
  const [breeds, setBreeds] = useState<string[]>([])
  const [selectedBreed, setSelectedBreed] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [dogs, setDogs] = useState<Dog[]>([])
  const [resultIds, setResultIds] = useState<string[]>([])
  const [from, setFrom] = useState<number>(0)
  const [total, setTotal] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null)

  const pageSize = 12
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBreeds = async () => {
      const res = await fetchClient.get('/dogs/breeds')
      setBreeds(res.data)
    }

    fetchBreeds()
  }, [])

  useEffect(() => {
    const fetchDogIds = async () => {
      const queryParams = new URLSearchParams()
      if (selectedBreed) queryParams.append('breeds', selectedBreed)
      queryParams.append('size', pageSize.toString())
      queryParams.append('from', from.toString())
      queryParams.append('sort', `breed:${sortOrder}`)

      const res = await fetchClient.get(`/dogs/search?${queryParams.toString()}`)
      setResultIds(res.data.resultIds)
      setTotal(res.data.total)
    }

    fetchDogIds()
  }, [selectedBreed, sortOrder, from])

  useEffect(() => {
    const fetchDogs = async () => {
      if (resultIds.length === 0) {
        setDogs([])
        return
      }

      const res = await fetchClient.post('/dogs', resultIds)
      setDogs(res.data)
    }

    fetchDogs()
  }, [resultIds])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  const findMatch = async () => {
    if (favorites.length === 0) return

    const matchRes = await fetchClient.post('/dogs/match', favorites)
    const matchId = matchRes.data.match

    const dogRes = await fetchClient.post('/dogs', [matchId])
    setMatchedDog(dogRes.data[0])
    setShowFavorites(false)
  }

  const handleLogout = async () => {
    await fetchClient.post('/auth/logout')
    navigate('/')
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🐕 Browse Dogs</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Filter & Sort Controls */}
<div className="bg-white shadow-sm rounded-lg p-4 flex flex-wrap items-center gap-4">
  {/* Breed Filter */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="breed-select">
      Filter by Breed
    </label>
    <select
      id="breed-select"
      value={selectedBreed}
      onChange={(e) => setSelectedBreed(e.target.value)}
      className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Breeds</option>
      {breeds.map((breed) => (
        <option key={breed} value={breed}>
          {breed}
        </option>
      ))}
    </select>
  </div>

  {/* Sort Button */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Sort by Breed</label>
    <button
      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
    >
      {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
    </button>
  </div>
</div>


      {/* Dog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={favorites.includes(dog.id)}
            onFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Polished Pagination */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
  {/* Prev Button */}
  <button
    disabled={from === 0}
    onClick={() => setFrom(from - pageSize)}
    className={`px-4 py-2 rounded-md font-medium transition ${
      from === 0
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    ◀ Prev
  </button>

  {/* Result Info */}
  <p className="text-sm text-gray-600 text-center">
    Showing <span className="font-semibold">{from + 1}</span>–
    <span className="font-semibold">{Math.min(from + pageSize, total)}</span> of{' '}
    <span className="font-semibold">{total}</span> dogs
  </p>

  {/* Next Button */}
  <button
    disabled={from + pageSize >= total}
    onClick={() => setFrom(from + pageSize)}
    className={`px-4 py-2 rounded-md font-medium transition ${
      from + pageSize >= total
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    Next ▶
  </button>
</div>


      {/* View Favorites Button */}
      <div className="mt-6">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded"
          onClick={() => setShowFavorites(true)}
          disabled={favorites.length === 0}
        >
          View Favorites ({favorites.length})
        </button>
      </div>

      {/* 🐾 Upgraded Favorites Modal */}
      <Modal
        isOpen={showFavorites}
        onRequestClose={() => setShowFavorites(false)}
        contentLabel="Favorite Dogs"
        className="bg-white w-[90%] max-w-3xl mx-auto mt-20 p-6 rounded-xl shadow-2xl relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto"
      >
        {/* Close icon */}
        <button
          onClick={() => setShowFavorites(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
          aria-label="Close favorites modal"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Your Favorite Dogs 🐾</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto px-1">
          {dogs
            .filter((dog) => favorites.includes(dog.id))
            .map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={true}
                onFavorite={toggleFavorite}
              />
            ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-full sm:w-auto"
            onClick={() => setShowFavorites(false)}
          >
            Close
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md w-full sm:w-auto"
            onClick={findMatch}
          >
            Find My Match 💘
          </button>
        </div>
      </Modal>

      {/* Matched Dog Display */}
      {matchedDog && (
  <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-green-100 via-white to-green-50 border-2 border-green-300 shadow-xl animate-fade-in">
    <h2 className="text-3xl font-extrabold text-green-700 text-center mb-4">
      🎉 You’ve Been Matched! 🐶
    </h2>
    <p className="text-center text-gray-600 mb-6">
      Say hello to your perfect companion!
    </p>
    <div className="max-w-md mx-auto">
      <DogCard
        dog={matchedDog}
        isFavorite={true}
        onFavorite={() => {}}
      />
    </div>
  </div>
)}

    </div>
  )
}

export default Search
