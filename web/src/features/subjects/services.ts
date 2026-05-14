const API_URL = 'http://localhost:3000/api/v1/subjects';

export const subjectsService = {
  async getAll(page = 1, limit = 10) {
    const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  async getOne(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch subject');
    return res.json();
  },

  async create(data: any) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to create subject');
    }
    return res.json();
  },

  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to update subject');
    }
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to delete subject');
  }
};
