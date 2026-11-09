import { DIFFICULTIES, QUESTION_TYPES, type Question } from '../../data/questionBank'

export type QuestionBankIssue = { questionId: string; message: string }
export type RoundQuestion = Question & { shuffledOptions: string[] }
export const ROUND_SIZES = [5, 10, 15, 20] as const
export type RoundSize = typeof ROUND_SIZES[number]

const shuffled = <T,>(items: readonly T[]) => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

export function validateQuestionBank(questions: readonly Question[], assetKeys: readonly string[]): QuestionBankIssue[] {
  const issues: QuestionBankIssue[] = []; const ids = new Set<string>()
  for (const question of questions) {
    const report = (message: string) => issues.push({ questionId: question.id || '(missing id)', message })
    if (!question.id) report('Missing ID'); else if (ids.has(question.id)) report('Duplicate ID'); else ids.add(question.id)
    if (!QUESTION_TYPES.includes(question.type)) report(`Unsupported type: ${question.type}`)
    if (!DIFFICULTIES.includes(question.difficulty)) report(`Invalid difficulty: ${question.difficulty}`)
    if (!question.targetWord || !question.promptEn.trim() || !question.promptVi.trim()) report('Empty required question text')
    if (!question.correctAnswer) report('Missing correct answer')
    if (question.options.length < 2) report('Missing options')
    if (new Set(question.options).size !== question.options.length) report('Duplicate options')
    if (!question.options.includes(question.correctAnswer)) report('Correct answer is not in options')
    if (!assetKeys.includes(question.assetKey)) report(`Invalid asset key: ${question.assetKey}`)
    if (question.assetStatus === 'available' && !question.enabled) report('Available asset question should be enabled or documented as intentionally disabled')
  }
  return issues
}

export function selectRound(questions: readonly Question[], size: RoundSize = 5): RoundQuestion[] {
  if (!ROUND_SIZES.includes(size)) throw new Error(`Unsupported round size: ${size}`)
  const playable = questions.filter((question) => question.enabled && question.assetStatus === 'available' && question.options.length >= 2 && question.options.includes(question.correctAnswer))
  if (playable.length < size) throw new Error(`Need ${size} playable questions, only ${playable.length} are available`)
  return shuffled(playable).slice(0, size).map((question) => ({ ...question, shuffledOptions: shuffled(question.options) }))
}

export type RoundScore = { firstAttemptCorrect: number; correctAnswers: number; incorrectAttempts: number; totalAttempts: number; completionPercentage: number; elapsedMs: number }
export function createRoundScore(): RoundScore { return { firstAttemptCorrect: 0, correctAnswers: 0, incorrectAttempts: 0, totalAttempts: 0, completionPercentage: 0, elapsedMs: 0 } }
export function scoreAnswer(score: RoundScore, isCorrect: boolean, isFirstAttempt: boolean, completedQuestions: number, totalQuestions: number): RoundScore {
  const next = { ...score, totalAttempts: score.totalAttempts + 1 }
  if (isCorrect) { next.correctAnswers++; if (isFirstAttempt) next.firstAttemptCorrect++ } else next.incorrectAttempts++
  next.completionPercentage = Math.round((completedQuestions / totalQuestions) * 100)
  return next
}
