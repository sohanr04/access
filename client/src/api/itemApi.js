import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

const itemApi = {
  getAll: async () => (await api.get('/items')).data,
  getById: async (id) => (await api.get(`/items/${id}`)).data,
  create: async (data) => (await api.post('/items', data)).data,
  update: async (id, data) => (await api.put(`/items/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/items/${id}`)).data,
};

export default itemApi;
