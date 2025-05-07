import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { Post, Frontmatter } from '../types/blog';
import { calculateReadingTime } from '../utils/blogUtils';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Import all markdown files from both blog and htb directories
const blogPosts = import.meta.glob('../content/blog/*.md', { 
  eager: true,
  query: '?raw', 
  import: 'default'
}) as Record<string, string>;

const htbPosts = import.meta.glob('../content/htb/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

function parsePost(path: string, content: string): Post | null {
  try {
    // Convert string to Buffer for gray-matter
    const buffer = Buffer.from(content);
    const { data, content: markdownContent } = matter(buffer);
    
    // Skip draft posts
    if (data.draft === true) {
      return null;
    }

    // Create the slug from the filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    // Ensure all required fields are present
    const frontmatter: Frontmatter = {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || 'No excerpt available',
      readingTime: calculateReadingTime(markdownContent),
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)] : ['Untagged'],
      author: data.author || 'Unknown',
      coverImage: data.coverImage || '/images/default-cover.jpg',
      draft: data.draft || false
    };

    return {
      slug,
      frontmatter,
      content: markdownContent.trim()
    };
  } catch (error) {
    return null;
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const posts: Post[] = [];

    // Process blog posts
    for (const [path, content] of Object.entries(blogPosts)) {
      const post = parsePost(path, content);
      if (post) {
        posts.push(post);
      }
    }

    // Process HTB writeups
    for (const [path, content] of Object.entries(htbPosts)) {
      const post = parsePost(path, content);
      if (post) {
        posts.push(post);
      }
    }

    // Sort posts by date
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
    
    return sortedPosts;
  } catch (error) {
    return [];
  }
};

// For backward compatibility
export const posts = Object.entries(blogPosts)
  .map(([path, content]) => parsePost(path, content))
  .filter((post): post is Post => post !== null && !post.frontmatter.draft)
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());