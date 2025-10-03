import { http } from './http'

export async function listFlags() {
  return (await http.get('/flags')).data
}

export async function flagQuestion(questionId) {
  return (await http.post('/flags', { question_id: questionId })).data
}

export async function unflagQuestion(questionId) {
  return (await http.delete(`/flags/${questionId}`)).data
}
