import { http } from './http'

export async function createAttempt(quizId) {
  return (await http.post('/attempts', { quizId })).data   // { attemptId }
}

export async function saveAnswer(attemptId, questionId, chosenAnswerId) {
  return (await http.patch(`/attempts/${attemptId}/answer`, { questionId, chosenAnswerId })).data
}

export async function submitAttempt(attemptId) {
  return (await http.post(`/attempts/${attemptId}/submit`)).data
}

export async function myAttempts(quizId) {
  return (await http.get('/attempts/mine', { params: { quizId, status: 'completed' } })).data
}
