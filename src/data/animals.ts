export type Animal = { id: string; english: string; vietnamese: string; phonetic: string; color: number; face: string }
export const animals: Animal[] = [
  { id: 'cat', english: 'CAT', vietnamese: 'Con mèo', phonetic: '/kæt/', color: 0xF6A95F, face: '◕ᴥ◕' }, { id: 'dog', english: 'DOG', vietnamese: 'Con chó', phonetic: '/dɔːɡ/', color: 0xB98252, face: '◕ᴥ◕' }, { id: 'cow', english: 'COW', vietnamese: 'Con bò', phonetic: '/kaʊ/', color: 0xF8F4E9, face: '◕ᴥ◕' }, { id: 'pig', english: 'PIG', vietnamese: 'Con lợn', phonetic: '/pɪɡ/', color: 0xF59AB0, face: '◕ᴥ◕' }, { id: 'duck', english: 'DUCK', vietnamese: 'Con vịt', phonetic: '/dʌk/', color: 0xFFE17A, face: '◕ᴥ◕' },
]
export const getAnimal = (id: string) => animals.find((animal) => animal.id === id) ?? animals[0]
