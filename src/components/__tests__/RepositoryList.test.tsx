import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepositoryList from '../RepositoryList';
import { useUserRepositories } from '../../hooks/useGithubQueries.hook';
import { GitHubRepository } from '../../types/index.type';

jest.mock('../../hooks/useGithubQueries.hook');

describe('RepositoryList Component', () => {
  const mockRepositories: GitHubRepository[] = [
    {
      id: 1,
      name: 'repo1',
      html_url: 'https://github.com/testuser/repo1',
      description: 'Test repository 1',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'repo2',
      html_url: 'https://github.com/testuser/repo2',
      description: null,
      stargazers_count: 20,
      forks_count: 8,
      language: 'JavaScript',
      updated_at: '2023-02-01T00:00:00Z'
    }
  ];

  const mockHook = (data: GitHubRepository[] | null = null, loading = false, error: Error | null = null) => {
    (useUserRepositories as jest.Mock).mockReturnValue({
      data,
      isLoading: loading,
      error
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    mockHook(null, true, null);
    render(<RepositoryList username="testuser" />);
    
    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    mockHook(null, false, new Error('Failed to fetch'));
    render(<RepositoryList username="testuser" />);
    
    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
  });

  test('renders empty state when no repositories', () => {
    mockHook([], false, null);
    render(<RepositoryList username="testuser" />);
    
    expect(screen.getByText('No repositories found for this user.')).toBeInTheDocument();
  });

  test('renders repositories when data is available', () => {
    mockHook(mockRepositories, false, null);
    render(<RepositoryList username="testuser" />);
    
    expect(screen.getByText('Found 2 repositories.')).toBeInTheDocument();
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
    expect(screen.getByText('Test repository 1')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    
    const dates = screen.getAllByText(/Updated:/);
    expect(dates.length).toBe(2);
  });

  test('returns null when username is null', () => {
    mockHook(mockRepositories, false, null);
    const { container } = render(<RepositoryList username={null} />);
    
    expect(container.firstChild).toBeNull();
  });
});
