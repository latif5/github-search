import { useQuery } from '@tanstack/react-query';
import { GitHubUser, GitHubRepository } from '../types';
import { getUserRepositories, searchUsers } from '../services/githubService';

export const useSearchUsers = (query: string) => {
  return useQuery<GitHubUser[], Error>({
    queryKey: ['searchUsers', query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 3, // Only run query if at least 3 characters
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
};

export const useUserRepositories = (username: string | null) => {
  return useQuery<GitHubRepository[], Error>({
    queryKey: ['userRepositories', username],
    queryFn: () => getUserRepositories(username || ''),
    enabled: !!username, // Only run query if username is provided
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
};