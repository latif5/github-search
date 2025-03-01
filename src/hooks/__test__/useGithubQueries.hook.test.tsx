/** @jsx React.createElement */
import { getUserRepositories, searchUsers } from '@/services/githubService.service';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchUsers, useUserRepositories } from '../useGithubQueries.hook';

jest.mock('@/services/githubService.service');
const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>;
const mockedGetUserRepositories = getUserRepositories as jest.MockedFunction<typeof getUserRepositories>;

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGithubQueries', () => {
  it('should fetch users successfully', async () => {
    mockedSearchUsers.mockResolvedValue([{ 
      login: 'testUser', 
      id: 123,
      avatar_url: '',
      html_url: ''
    }]);
    
    const { result } = renderHook(() => useSearchUsers('test'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ 
      login: 'testUser', 
      id: 123,
      avatar_url: '',
      html_url: ''
    }]);
  });

  it('should fetch repositories successfully', async () => {
    mockedGetUserRepositories.mockResolvedValue([{ 
      name: 'repo1', 
      id: 456,
      description: null,
      html_url: '',
      stargazers_count: 0,
      forks_count: 0,
      language: null,
      updated_at: ''
    }]);
    
    const { result } = renderHook(() => useUserRepositories('testUser'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ 
      name: 'repo1', 
      id: 456,
      description: null,
      html_url: '',
      stargazers_count: 0,
      forks_count: 0,
      language: null,
      updated_at: ''
    }]);
  });
});