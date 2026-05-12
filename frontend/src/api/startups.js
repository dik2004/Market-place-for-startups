import api from './axios'

export const getStartups   = (params) => api.get('/startups', { params })
export const getStartup    = (id)     => api.get(`/startups/${id}`)
export const createStartup = (data)   => api.post('/startups', data)
export const updateStartup = (id, d)  => api.put(`/startups/${id}`, d)
export const deleteStartup = (id)     => api.delete(`/startups/${id}`)
export const myStartups    = ()       => api.get('/my-startups')