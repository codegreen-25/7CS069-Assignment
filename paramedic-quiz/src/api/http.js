// src/api/http.js
import axios from 'axios'

// Your Laravel API origin (no proxy needed)
export const API_BASE = 'http://localhost:8030'

// Single axios instance for ALL API routes under /api/*
export const http = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { Accept: 'application/json' }
})

// Attach/remove Authorization header globally
export function setAuthToken(token) {
  if (token) {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log('[auth] token set')
  } else {
    delete http.defaults.headers.common['Authorization']
    console.log('[auth] token cleared')
  }
}
