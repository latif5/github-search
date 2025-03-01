import React from 'react';
import { GitHubUser } from '../types/index.type';
import { Accordion, Accordions } from './ui/accordion';
import RepositoryList from './RepositoryList';

interface UserListProps {
  users: GitHubUser[];
  onUserSelect: (username: string) => void;
  selectedUser: string | null;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect, selectedUser }) => {
  if (!users || users.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Users Found</h2>
      <div className="grid-cols-1 gap-2 hidden">
        {users.map(user => (
          <div 
            key={user.id}
            className={`p-3 border rounded cursor-pointer flex items-center
              ${selectedUser === user.login ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => onUserSelect(user.login)}
          >
            <img 
              src={user.avatar_url} 
              alt={`${user.login}'s avatar`} 
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <h3 className="font-medium">{user.login}</h3>
              <a 
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>

      <Accordions 
        type="single"
        collapsible
        className="w-full"
      >
        {users.map(user => (
          <Accordion id={user.login} title={user.login} href={`${user.html_url}`} avatar_url={user.avatar_url} onClick={() => onUserSelect(user.login)}>
            {selectedUser && <RepositoryList 
              username={selectedUser}
            />
            }
          </Accordion>
        ))}
      </Accordions>
    </div>
  );
};

export default UserList;