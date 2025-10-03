// src/api/auth.js
import { http, setAuthToken } from './http'

// Register
export async function register(name, email, password) {
  const { data } = await http.post('/auth/register', {
    name,
    email,
    password
  })
  localStorage.setItem('token', data.token)
  setAuthToken(data.token)
  return data.user
}

// Login
export async function login(email, password) {
  const { data } = await http.post('/auth/login', {
    email,
    password
  })
  localStorage.setItem('token', data.token)
  setAuthToken(data.token)
  return data.user
}

// Logout
export async function logout() {
  try {
    await http.post('/auth/logout')
  } catch (e) {
    console.warn('Logout request failed (already logged out?)')
  }
  localStorage.removeItem('token')
  setAuthToken(null)
}

// Current user
export async function me() {
  const { data } = await http.get('/user')
  return data
}

