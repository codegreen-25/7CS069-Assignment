import { http } from './http'

export async function getCaseStudies() {
  return (await http.get('/case-studies')).data
}

export async function getQuiz(quizId) {
  return (await http.get(`/quizzes/${quizId}`)).data
}

export async function getQuestionByIndex(quizId, index, attemptId) {
  return (await http.get(`/quizzes/${quizId}/question`, { params: { index, attemptId } })).data
}
