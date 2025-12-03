import type { MovieSummary } from '@/features/movies/types'

const DB_NAME = 'FimoFavorites'
const DB_VERSION = 1
const STORE_NAME = 'favorites'

let db: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (db) {
    return db
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: 'imdbID',
        })
        objectStore.createIndex('title', 'Title', { unique: false })
      }
    }
  })
}

export async function addFavorite(movie: MovieSummary): Promise<void> {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(movie)
    request.onsuccess = () => {
      resolve()
    }
    request.onerror = () => {
      const updateRequest = store.put(movie)
      updateRequest.onsuccess = () => resolve()
      updateRequest.onerror = () => reject(new Error('Failed to add favorite'))
    }
  })
}

export async function removeFavorite(imdbID: string): Promise<void> {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(imdbID)
    request.onsuccess = () => {
      resolve()
    }
    request.onerror = () => {
      reject(new Error('Failed to remove favorite'))
    }
  })
}

export async function getFavorite(imdbID: string): Promise<MovieSummary | null> {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(imdbID)
    request.onsuccess = () => {
      resolve(request.result || null)
    }
    request.onerror = () => {
      reject(new Error('Failed to get favorite'))
    }
  })
}

export async function getAllFavorites(): Promise<MovieSummary[]> {
  const database = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      resolve(request.result || [])
    }
    request.onerror = () => {
      reject(new Error('Failed to get all favorites'))
    }
  })
}

export async function isFavorite(imdbID: string): Promise<boolean> {
  const favorite = await getFavorite(imdbID)
  return favorite !== null
}

