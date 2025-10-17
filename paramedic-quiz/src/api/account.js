import { http } from './http'

export function updateProfileName(name) {
  return http.patch('/user', { name }).then(r => r.data) // { message, user }
}
