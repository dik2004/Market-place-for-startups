import api from './axios'

export const sendEOI      = (data)         => api.post('/eois', data)
export const myEOIs       = ()             => api.get('/my-eois')
export const startupEOIs  = (id)           => api.get(`/startups/${id}/eois`)
export const updateStatus = (id, status)   => api.patch(`/eois/${id}/status`, { status })
export const aiMatch      = (data)         => api.post('/ai-match', data)