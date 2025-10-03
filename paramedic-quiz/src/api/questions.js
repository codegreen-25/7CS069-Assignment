import { http } from './http'

export async function getQuestion(questionId) {
  const { data } = await http.get(`/questions/${questionId}`)
  return data
}

export async function checkQuestion(questionId, answerId) {
  const { data } = await http.post(`/questions/${questionId}/check`, { answer_id: answerId })
  return data // { correct, correctAnswerId, correctAnswerText, chosenAnswerId, chosenAnswerText, explanation }
}
