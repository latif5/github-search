import apiConfig from "../api/apiConfig";
import { GitHubRepository, GitHubUser } from "../types/index.type";

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await apiConfig.get<GitHubSearchResponse>(`/search/users`, {
      params: {
        q: query,
        per_page: 5
      }
    });
    
    return response.data.items;
  } catch (error) {
    console.error('Error searching GitHub users:', error);
    throw error;
  }
};

export const getUserRepositories = async (username: string): Promise<GitHubRepository[]> => {
  if (!username.trim()) return [];
  
  try {
    const response = await apiConfig.get<GitHubRepository[]>(`/users/${username}/repos`, {
      params: {
        sort: 'updated'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching repositories for user ${username}:`, error);
    throw error;
  }
};

export const setupInterceptors = () => {
  apiConfig.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  apiConfig.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response && error.response.status === 403) {
        console.error('GitHub API rate limit exceeded');
      }
      return Promise.reject(error);
    }
  );
};

export default apiConfig;