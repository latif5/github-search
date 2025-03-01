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
  
  return (
    <div className="mb-6">
      {users.length > 0 && (
      <>
        <h2 className="text-lg font-semibold mb-2">Users Found</h2>
        <Accordions 
          type="single"
          collapsible
          className="w-full"
        >
          {users.map(user => (
            <Accordion key={user.login} id={user.login} title={user.login} href={`${user.html_url}`} avatar_url={user.avatar_url} onClick={() => onUserSelect(user.login)}>
              {selectedUser && <RepositoryList 
                username={selectedUser}
              />
              }
            </Accordion>
          ))}
        </Accordions>
      </>
      )}
      {users.length === 0 && (
        <div className="text-center p-4 mt-34 sm:mt-48">
          <h2 className="text-lg font-semibold mb-2 text-muted-foreground">No users found</h2>
        </div>
      )}

    </div>
  );
};

export default UserList;