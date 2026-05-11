import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsService } from './services';

export const useSubjects = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['subjects', page, limit],
    queryFn: () => subjectsService.getAll(page, limit)
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => subjectsService.getOne(id),
    enabled: !!id
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => subjectsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects', id] });
    }
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    }
  });
};
