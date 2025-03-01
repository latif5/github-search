import React, { useState } from 'react';
import { GitHubUser } from '../types';
import UserSearch from '../components/UserSearch';
import UserList from '../components/UserList';
import RepositoryList from '../components/RepositoryList';

const Index: React.FC = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserSelect = (username: string) => {
    setSelectedUser(username);
  };
  
  const handleUsersFound = (foundUsers: GitHubUser[]) => {
    setUsers(foundUsers);
    if (foundUsers.length === 0) {
      setSelectedUser(null);
    }
  };
  
  return (
    
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">GitHub User & Repository Explorer</h1>
        
        <UserSearch onUsersFound={handleUsersFound} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <UserList 
              users={users}
              onUserSelect={handleUserSelect}
              selectedUser={selectedUser}
            />
          </div>
          
          <div className="md:col-span-2">
            <RepositoryList 
              username={selectedUser}
            />
          </div>
        </div>
      </div>
      
  );
};

export default Index;