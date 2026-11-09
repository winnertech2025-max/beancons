import { animals, type Animal } from './animals'

export const QUESTION_TYPES = ['LISTEN_AND_CHOOSE', 'IMAGE_AND_CHOOSE', 'WHO_AM_I', 'COMPLETE_WORD', 'VIETNAMESE_TO_ENGLISH', 'ANIMAL_SOUND'] as const
export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const
export type QuestionType = typeof QUESTION_TYPES[number]
export type Difficulty = typeof DIFFICULTIES[number]
export type AssetStatus = 'available' | 'missing'
export type Question = {
  id: string; type: QuestionType; category: string; difficulty: Difficulty
  targetWord: string; meaningVi: string; promptEn: string; promptVi: string; audioText: string
  correctAnswer: string; options: string[]; explanationVi: string; assetKey: string; assetStatus: AssetStatus; enabled: boolean
}

const optionIds = animals.map((animal) => animal.id)
const byId = Object.fromEntries(animals.map((animal) => [animal.id, animal])) as Record<string, Animal>
type Row = [QuestionType, Difficulty, string, string, string, string]

function buildAnimalQuestions(animalId: string, rows: Row[]): Question[] {
  const animal = byId[animalId]
  return rows.map(([type, difficulty, promptEn, promptVi, audioText, explanationVi], index) => ({
    id: `${animalId}_${String(index + 1).padStart(3, '0')}`,
    type, category: 'FARM_ANIMALS', difficulty, targetWord: animal.english.toLowerCase(), meaningVi: animal.vietnamese,
    promptEn, promptVi, audioText, correctAnswer: animalId, options: optionIds, explanationVi,
    assetKey: animalId, assetStatus: 'available', enabled: true,
  }))
}

/**
 * Core pack: 50 authored questions, five distinct learning prompts for each type
 * per animal. Future packs may reference a missing asset, but remain disabled
 * until the real image/audio is added to the asset manifest.
 */
export const questionBank: Question[] = [
  ...buildAnimalQuestions('cat', [
    ['LISTEN_AND_CHOOSE', 'EASY', 'Listen and choose the animal.', 'Nghe và chọn con vật.', 'Cat.', 'Cat nghĩa là con mèo.'],
    ['LISTEN_AND_CHOOSE', 'EASY', 'Which friend says meow?', 'Bạn nào kêu meow?', 'Find the cat.', 'Mèo thường kêu meow.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Tap the little pet you hear.', 'Chạm vào thú cưng bé nghe thấy.', 'The cat is here.', 'Đây là cat, con mèo.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Can you find a cat?', 'Bé có tìm được con mèo không?', 'Where is the cat?', 'Hãy nhớ: cat là con mèo.'],
    ['LISTEN_AND_CHOOSE', 'HARD', 'Listen carefully: choose the animal with whiskers.', 'Nghe kỹ: chọn con vật có râu.', 'Choose the cat.', 'Mèo có râu nhỏ ở hai bên mặt.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'What animal is in the picture?', 'Con vật trong hình là gì?', 'Cat.', 'Hình này là con mèo.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'Look at the orange friend. Choose its English name.', 'Nhìn bạn màu cam. Chọn tên tiếng Anh.', 'Cat.', 'Tên tiếng Anh của con mèo là Cat.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Which word matches this meowing pet?', 'Từ nào chỉ thú cưng kêu meow?', 'Cat.', 'Meow là tiếng kêu quen thuộc của cat.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Point to the word for this whiskered animal.', 'Chọn từ chỉ con vật có râu này.', 'Cat.', 'Cat là con mèo.'],
    ['IMAGE_AND_CHOOSE', 'HARD', 'Choose the English word for the animal that likes to curl up.', 'Chọn từ tiếng Anh cho bạn hay cuộn tròn nghỉ ngơi.', 'Cat.', 'Đáp án là Cat.'],
  ]),
  ...buildAnimalQuestions('dog', [
    ['LISTEN_AND_CHOOSE', 'EASY', 'Listen and choose the animal.', 'Nghe và chọn con vật.', 'Dog.', 'Dog nghĩa là con chó.'],
    ['LISTEN_AND_CHOOSE', 'EASY', 'Which friend says woof?', 'Bạn nào kêu woof?', 'Find the dog.', 'Chó thường kêu woof.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Tap the farm helper you hear.', 'Chạm vào bạn giúp nông trại bé nghe thấy.', 'The dog is here.', 'Đây là dog, con chó.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Can you find a dog?', 'Bé có tìm được con chó không?', 'Where is the dog?', 'Hãy nhớ: dog là con chó.'],
    ['LISTEN_AND_CHOOSE', 'HARD', 'Listen carefully: choose the friend with a wagging tail.', 'Nghe kỹ: chọn bạn hay vẫy đuôi.', 'Choose the dog.', 'Dog là người bạn hay vẫy đuôi.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'What animal is in the picture?', 'Con vật trong hình là gì?', 'Dog.', 'Hình này là con chó.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'Look at the friendly helper. Choose its English name.', 'Nhìn bạn trợ giúp thân thiện. Chọn tên tiếng Anh.', 'Dog.', 'Tên tiếng Anh của con chó là Dog.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Which word matches this woofing friend?', 'Từ nào chỉ bạn kêu woof?', 'Dog.', 'Woof là tiếng kêu của dog.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Point to the word for this tail-wagging animal.', 'Chọn từ chỉ con vật hay vẫy đuôi này.', 'Dog.', 'Dog là con chó.'],
    ['IMAGE_AND_CHOOSE', 'HARD', 'Choose the English word for the animal that can guard a farm.', 'Chọn từ tiếng Anh cho bạn có thể trông nông trại.', 'Dog.', 'Đáp án là Dog.'],
  ]),
  ...buildAnimalQuestions('cow', [
    ['LISTEN_AND_CHOOSE', 'EASY', 'Listen and choose the animal.', 'Nghe và chọn con vật.', 'Cow.', 'Cow nghĩa là con bò.'],
    ['LISTEN_AND_CHOOSE', 'EASY', 'Which farm friend says moo?', 'Bạn nông trại nào kêu moo?', 'Find the cow.', 'Bò thường kêu moo.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Tap the animal you hear on the farm.', 'Chạm vào con vật bé nghe thấy ở nông trại.', 'The cow is here.', 'Đây là cow, con bò.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Can you find the cow?', 'Bé có tìm được con bò không?', 'Where is the cow?', 'Hãy nhớ: cow là con bò.'],
    ['LISTEN_AND_CHOOSE', 'HARD', 'Listen carefully: choose the animal that gives us milk.', 'Nghe kỹ: chọn con vật cho chúng ta sữa.', 'Choose the cow.', 'Cow cho chúng ta milk, sữa.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'What animal is in the picture?', 'Con vật trong hình là gì?', 'Cow.', 'Hình này là con bò.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'Look at the big farm friend. Choose its English name.', 'Nhìn bạn nông trại to lớn. Chọn tên tiếng Anh.', 'Cow.', 'Tên tiếng Anh của con bò là Cow.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Which word matches this mooing animal?', 'Từ nào chỉ con vật kêu moo?', 'Cow.', 'Moo là tiếng kêu của cow.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Point to the word for this milk-giving animal.', 'Chọn từ chỉ con vật cho sữa này.', 'Cow.', 'Cow là con bò.'],
    ['IMAGE_AND_CHOOSE', 'HARD', 'Choose the English word for the animal that eats grass.', 'Chọn từ tiếng Anh cho con vật ăn cỏ.', 'Cow.', 'Đáp án là Cow.'],
  ]),
  ...buildAnimalQuestions('pig', [
    ['LISTEN_AND_CHOOSE', 'EASY', 'Listen and choose the animal.', 'Nghe và chọn con vật.', 'Pig.', 'Pig nghĩa là con lợn.'],
    ['LISTEN_AND_CHOOSE', 'EASY', 'Which friend says oink?', 'Bạn nào kêu oink?', 'Find the pig.', 'Lợn thường kêu oink.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Tap the round farm friend you hear.', 'Chạm vào bạn nông trại tròn trịa bé nghe thấy.', 'The pig is here.', 'Đây là pig, con lợn.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Can you find the pig?', 'Bé có tìm được con lợn không?', 'Where is the pig?', 'Hãy nhớ: pig là con lợn.'],
    ['LISTEN_AND_CHOOSE', 'HARD', 'Listen carefully: choose the animal with a pink snout.', 'Nghe kỹ: chọn con vật có mõm hồng.', 'Choose the pig.', 'Pig có chiếc mõm hồng đáng yêu.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'What animal is in the picture?', 'Con vật trong hình là gì?', 'Pig.', 'Hình này là con lợn.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'Look at the pink farm friend. Choose its English name.', 'Nhìn bạn nông trại màu hồng. Chọn tên tiếng Anh.', 'Pig.', 'Tên tiếng Anh của con lợn là Pig.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Which word matches this oinking animal?', 'Từ nào chỉ con vật kêu oink?', 'Pig.', 'Oink là tiếng kêu của pig.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Point to the word for this animal with a snout.', 'Chọn từ chỉ con vật có mõm này.', 'Pig.', 'Pig là con lợn.'],
    ['IMAGE_AND_CHOOSE', 'HARD', 'Choose the English word for the pink friend on the farm.', 'Chọn từ tiếng Anh cho bạn màu hồng ở nông trại.', 'Pig.', 'Đáp án là Pig.'],
  ]),
  ...buildAnimalQuestions('duck', [
    ['LISTEN_AND_CHOOSE', 'EASY', 'Listen and choose the animal.', 'Nghe và chọn con vật.', 'Duck.', 'Duck nghĩa là con vịt.'],
    ['LISTEN_AND_CHOOSE', 'EASY', 'Which friend says quack?', 'Bạn nào kêu quack?', 'Find the duck.', 'Vịt thường kêu quack.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Tap the pond friend you hear.', 'Chạm vào bạn ở ao bé nghe thấy.', 'The duck is here.', 'Đây là duck, con vịt.'],
    ['LISTEN_AND_CHOOSE', 'MEDIUM', 'Can you find the duck?', 'Bé có tìm được con vịt không?', 'Where is the duck?', 'Hãy nhớ: duck là con vịt.'],
    ['LISTEN_AND_CHOOSE', 'HARD', 'Listen carefully: choose the animal with webbed feet.', 'Nghe kỹ: chọn con vật có chân có màng.', 'Choose the duck.', 'Duck có chân có màng để bơi.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'What animal is in the picture?', 'Con vật trong hình là gì?', 'Duck.', 'Hình này là con vịt.'],
    ['IMAGE_AND_CHOOSE', 'EASY', 'Look at the pond friend. Choose its English name.', 'Nhìn bạn ở ao. Chọn tên tiếng Anh.', 'Duck.', 'Tên tiếng Anh của con vịt là Duck.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Which word matches this quacking animal?', 'Từ nào chỉ con vật kêu quack?', 'Duck.', 'Quack là tiếng kêu của duck.'],
    ['IMAGE_AND_CHOOSE', 'MEDIUM', 'Point to the word for this swimming animal.', 'Chọn từ chỉ con vật biết bơi này.', 'Duck.', 'Duck là con vịt.'],
    ['IMAGE_AND_CHOOSE', 'HARD', 'Choose the English word for the farm friend that likes a pond.', 'Chọn từ tiếng Anh cho bạn nông trại thích ở ao.', 'Duck.', 'Đáp án là Duck.'],
  ]),
]
