const API_URL = 'http://localhost:3000/api/v1';

export const usersService = {
    getTeachers: async () => {
        const res = await fetch(`${API_URL}/users/teachers`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch teachers');
        return res.json();
    }
};
