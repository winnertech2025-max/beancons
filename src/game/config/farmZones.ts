export type FarmZone = { animalId: string; label: string; x: number; y: number; number: number; unlocked: boolean }
export const farmZones: FarmZone[] = [
  { animalId: 'cat', label: 'Trang trại Mèo', x: .21, y: .31, number: 1, unlocked: true },
  { animalId: 'dog', label: 'Trang trại Chó', x: .40, y: .49, number: 2, unlocked: true },
  { animalId: 'cow', label: 'Trang trại Bò', x: .72, y: .34, number: 3, unlocked: true },
  { animalId: 'pig', label: 'Trang trại Lợn', x: .26, y: .70, number: 4, unlocked: true },
  { animalId: 'duck', label: 'Trang trại Vịt', x: .72, y: .70, number: 5, unlocked: true },
]
