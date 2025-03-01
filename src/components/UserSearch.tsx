import React, { useState, useEffect } from 'react';
import { GitHubUser } from '../types';
import { useSearchUsers } from '../hooks/useGithubQueries';

interface UserSearchProps {
  onUsersFound: (users: GitHubUser[]) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUsersFound }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Use React Query for searching users
  const { data: users, isLoading, error } = useSearchUsers(debouncedQuery);
  
  // Update parent component when users change
  useEffect(() => {
    if (users) {
      onUsersFound(users);
    }
  }, [users, onUsersFound]);
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search GitHub users..."
          className="w-full p-2 border border-gray-300 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {isLoading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">Error: {(error as Error).message}</p>}
      {!isLoading && query.trim().length > 0 && query.trim().length < 3 && (
        <p className="text-gray-500">Type at least 3 characters to search</p>
      )}
    </div>
  );
};

export default UserSearch;