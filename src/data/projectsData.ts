import { Project } from '../types/project';

// GitHub API endpoint for user repositories
const GITHUB_API_URL = 'https://api.github.com/users/pir4cy/repos';

// Function to fetch repositories from GitHub
async function fetchGitHubRepos(): Promise<Project[]> {
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repositories');
    }
    
    const repos = await response.json();
    
    // Transform GitHub repos into Project format
    return repos.map((repo: any) => ({
      id: repo.name,
      title: repo.name.split('-').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: repo.description || 'No description available',
      tags: [
        repo.language || 'Unknown',
        ...(repo.topics || [])
      ],
      githubUrl: repo.html_url,
      demoUrl: repo.homepage || undefined,
      featured: repo.stargazers_count > 0,
      date: repo.created_at.split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

// Export a function to get projects
export async function getProjects(): Promise<Project[]> {
  const githubProjects = await fetchGitHubRepos();
  
  // Sort projects by date (newest first)
  return githubProjects.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// For backward compatibility, export an empty array as default
export const projects: Project[] = [];