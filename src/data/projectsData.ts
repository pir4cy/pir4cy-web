import { Project } from '../types/project';

// GitHub API endpoint for user repositories
const GITHUB_API_URL = 'https://api.github.com/users/pir4cy/repos';

interface RepoSort {
  field: 'stars' | 'updated' | 'created';
  order: 'asc' | 'desc';
}

const defaultSort: RepoSort = {
  field: 'stars',
  order: 'desc'
};

// Function to fetch repositories from GitHub
async function fetchGitHubRepos(sort: RepoSort = defaultSort): Promise<Project[]> {
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repositories');
    }
    
    const repos = await response.json();
    
    // Filter to only show starred repositories
    const starredRepos = repos.filter((repo: any) => repo.stargazers_count > 0);

    // Sort repositories
    const sortedRepos = starredRepos.sort((a: any, b: any) => {
      const multiplier = sort.order === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'stars':
          return (a.stargazers_count - b.stargazers_count) * multiplier;
        case 'updated':
          return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * multiplier;
        case 'created':
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * multiplier;
        default:
          return 0;
      }
    });

    // Transform to Project type
    return sortedRepos.map((repo: any) => ({
      id: repo.id.toString(),
      title: repo.name,
      description: repo.description || 'No description available',
      tags: [...(repo.topics || []), repo.language].filter(Boolean),
      githubUrl: repo.html_url,
      demoUrl: repo.homepage,
      featured: true,
      date: repo.updated_at
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

// Export a function to get projects
export async function getProjects(sort: RepoSort = defaultSort): Promise<Project[]> {
  const projects = await fetchGitHubRepos(sort);
  return projects;
}

// For backward compatibility
export const projects: Project[] = [];