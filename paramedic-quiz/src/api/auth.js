// src/api/auth.js
import axios from 'axios'
import { API_BASE, http, setAuthToken } from './http'

// Token endpoints live at /api/auth/*
export async function register(name, email, password) {
  const { data } = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password }, { headers: { Accept: 'application/json' } })
  localStorage.setItem('token', data.token)
  setAuthToken(data.token)
  return data.user
}

export async function login(email, password) {
  const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, { headers: { Accept: 'application/json' } })
  localStorage.setItem('token', data.token)
  setAuthToken(data.token)
  return data.user
}

export async function logout() {
  try { await http.post('/auth/logout') } catch {}
  localStorage.removeItem('token')
  setAuthToken(null)
}

export async function me() {
  const { data } = await http.get('/user')
  return data
}
