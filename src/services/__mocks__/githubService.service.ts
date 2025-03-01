import { GitHubRepository, GitHubUser } from "../../types/index.type";

export const searchUsers = jest.fn().mockImplementation(async (_query: string): Promise<GitHubUser[]> => {
  return [{ 
    login: 'testUser', 
    id: 123,
    avatar_url: '',
    html_url: ''
  }];
});

export const getUserRepositories = jest.fn().mockImplementation(async (_username: string): Promise<GitHubRepository[]> => {
  return [{ 
    name: 'repo1', 
    id: 456,
    description: null,
    html_url: '',
    stargazers_count: 0,
    forks_count: 0,
    language: null,
    updated_at: ''
  }];
});

export const setupInterceptors = jest.fn().mockImplementation(() => {
});
