import { useQuery } from '@tanstack/react-query';
import { GitHubUser, GitHubRepository } from '../types/index.type';
import { getUserRepositories, searchUsers } from '../services/githubService.service';

export const useSearchUsers = (query: string) => {
  return useQuery<GitHubUser[], Error>({
    queryKey: ['searchUsers', query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 3,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserRepositories = (username: string | null) => {
  return useQuery<GitHubRepository[], Error>({
    queryKey: ['userRepositories', username],
    queryFn: () => getUserRepositories(username || ''),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};