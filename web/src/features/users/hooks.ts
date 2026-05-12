import { useQuery } from '@tanstack/react-query';
import { usersService } from './services';

export const useTeachers = () => {
    return useQuery({
        queryKey: ['users', 'teachers'],
        queryFn: usersService.getTeachers
    });
};
