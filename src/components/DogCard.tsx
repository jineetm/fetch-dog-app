import { Dog } from '../types'

interface Props {
  dog: Dog
  isFavorite: boolean
  onFavorite: (id: string) => void
}

const DogCard = ({ dog, isFavorite, onFavorite }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1">{dog.name}</h2>
        <p className="text-sm text-gray-600 mb-1">Breed: <span className="font-medium text-gray-800">{dog.breed}</span></p>
        <p className="text-sm text-gray-600 mb-1">Age: {dog.age}</p>
        <p className="text-sm text-gray-600 mb-4">Zip Code: {dog.zip_code}</p>

        <button
          onClick={() => onFavorite(dog.id)}
          className={`mt-auto px-4 py-2 text-sm font-medium rounded-lg transition ${
            isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {isFavorite ? 'Unfavorite ❤️' : 'Favorite 🤍'}
        </button>
      </div>
    </div>
  )
}

export default DogCard
