import matter from 'gray-matter';
import { Post } from '../types/blog';
import { getPosts } from '../data/blogData';

// Function to get all blog posts
export const getAllPosts = async (): Promise<Post[]> => {
  // In a real application, you would fetch all .md files from a directory
  // or from an API endpoint, then parse them
  return getPosts();
};

// Function to get a post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const posts = await getPosts();
    return posts.find(p => p.slug === slug) || null;
  } catch (err) {
    return null;
  }
};

// Function to get the most recent posts
export const getRecentPosts = async (count: number = 5): Promise<Post[]> => {
  const posts = await getPosts();
  return [...posts]
    .sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
    .slice(0, count);
};

// Function to calculate reading time (would normally be done at build time)
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/g).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Parse markdown frontmatter
export const parseFrontmatter = (markdownContent: string) => {
  return matter(markdownContent);
};

// Function to get posts filtered by tag
export const getPostsByTag = async (tag: string): Promise<Post[]> => {
  const posts = await getPosts();
  return posts.filter(post => 
    post.frontmatter.tags?.includes(tag)
  );
};

// Function to search posts
export const searchPosts = async (query: string): Promise<Post[]> => {
  const posts = await getPosts();
  const lowerQuery = query.toLowerCase();
  
  return posts.filter(post => 
    post.frontmatter.title.toLowerCase().includes(lowerQuery) ||
    post.frontmatter.excerpt.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.frontmatter.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Function to get related posts
export const getRelatedPosts = async (currentSlug: string, limit: number = 3): Promise<Post[]> => {
  try {
    const posts = await getPosts();
    
    const currentPost = posts.find(p => p.slug === currentSlug);
    if (!currentPost) {
      return [];
    }
    
    const relatedPosts = posts
      .filter(p => p.slug !== currentSlug)
      .sort((a, b) => {
        // Sort by number of matching tags
        const aTags = new Set(a.frontmatter.tags || []);
        const bTags = new Set(b.frontmatter.tags || []);
        const currentTags = new Set(currentPost.frontmatter.tags || []);
        
        const aMatches = [...aTags].filter(tag => currentTags.has(tag)).length;
        const bMatches = [...bTags].filter(tag => currentTags.has(tag)).length;
        
        if (aMatches !== bMatches) {
          return bMatches - aMatches;
        }
        
        // If same number of matching tags, sort by date
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
      })
      .slice(0, limit);
    
    return relatedPosts;
  } catch (err) {
    return [];
  }
};