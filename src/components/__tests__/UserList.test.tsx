import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../UserList';
import { GitHubUser } from '../../types/index.type';

jest.mock('../RepositoryList', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ username }) => {
      return <div data-testid="repository-list">Repositories for {username}</div>;
    })
  };
});

describe('UserList Component', () => {
  const mockUsers: GitHubUser[] = [
    {
      login: 'testuser1',
      id: 1,
      avatar_url: 'https://example.com/avatar1.jpg',
      html_url: 'https://github.com/testuser1'
    },
    {
      login: 'testuser2',
      id: 2,
      avatar_url: 'https://example.com/avatar2.jpg',
      html_url: 'https://github.com/testuser2'
    }
  ];

  const mockOnUserSelect = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders users when provided', () => {
    render(
      <UserList 
        users={mockUsers} 
        onUserSelect={mockOnUserSelect} 
        selectedUser={null} 
      />
    );

    expect(screen.getByText('testuser1')).toBeInTheDocument();
    expect(screen.getByText('testuser2')).toBeInTheDocument();
    expect(screen.getByText('Users Found')).toBeInTheDocument();
  });

  test('shows "No users found" when users array is empty', () => {
    render(
      <UserList 
        users={[]} 
        onUserSelect={mockOnUserSelect} 
        selectedUser={null} 
      />
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  test('calls onUserSelect when a user is clicked', () => {
    render(
      <UserList 
        users={mockUsers} 
        onUserSelect={mockOnUserSelect} 
        selectedUser={null} 
      />
    );

    fireEvent.click(screen.getByText('testuser1'));
    expect(mockOnUserSelect).toHaveBeenCalledWith('testuser1');
  });

  test.skip('renders repository list when a user is selected', () => {
    render(
      <UserList 
        users={mockUsers} 
        onUserSelect={mockOnUserSelect} 
        selectedUser="testuser1" 
      />
    );
  });
});
