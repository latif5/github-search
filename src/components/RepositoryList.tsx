import React from 'react';
import { useUserRepositories } from '../hooks/useGithubQueries';

interface RepositoryListProps {
  username: string | null;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ username }) => {
  const { data: repositories, isLoading, error } = useUserRepositories(username);
  
  if (!username) {
    return null;
  }
  
  if (isLoading) {
    return <div className="text-center p-4">Loading repositories...</div>;
  }
  
  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {(error as Error).message}</div>;
  }
  
  if (!repositories || repositories.length === 0) {
    return <div className="text-center p-4">No repositories found for this user.</div>;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Repositories for {username}</h2>
      <div className="grid grid-cols-1 gap-4">
        {repositories.map(repo => (
          <div key={repo.id} className="border rounded p-4 hover:shadow-md">
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.name}
                </a>
              </h3>
              <div className="flex space-x-3 text-sm">
                <span title="Stars" className="flex items-center">
                  ⭐ {repo.stargazers_count}
                </span>
                <span title="Forks" className="flex items-center">
                  🍴 {repo.forks_count}
                </span>
              </div>
            </div>
            
            {repo.description && (
              <p className="text-gray-700 mt-2">{repo.description}</p>
            )}
            
            <div className="mt-4 flex justify-between text-sm">
              {repo.language && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {repo.language}
                </span>
              )}
              <span className="text-gray-500">
                Updated: {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryList;
