import { Post, Frontmatter } from '../types/blog';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally
(globalThis as any).Buffer = Buffer;

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
    console.log(`Processing post: ${path}`);
    const { data, content: markdownContent } = matter(content);
    
    // Create the slug from the filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    // Ensure all required fields are present
    const frontmatter: Frontmatter = {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || 'No excerpt available',
      readingTime: data.readingTime || 1,
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)] : ['Untagged'],
      author: data.author || 'Unknown',
      coverImage: data.coverImage || '/images/default-cover.jpg'
    };

    console.log(`Successfully parsed post: ${frontmatter.title}`);
    return {
      slug,
      frontmatter,
      content: markdownContent.trim()
    };
  } catch (error) {
    console.error(`Error processing post ${path}:`, error);
    return null;
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    console.log('Starting to fetch posts...');
    const posts: Post[] = [];
    
    // Process blog posts
    console.log('Processing blog posts...');
    for (const [path, content] of Object.entries(blogPosts)) {
      const post = parsePost(path, content);
      if (post) {
        console.log(`Added blog post: ${post.frontmatter.title}`);
        posts.push(post);
      }
    }
    
    // Process HTB writeups
    console.log('Processing HTB writeups...');
    for (const [path, content] of Object.entries(htbPosts)) {
      const post = parsePost(path, content);
      if (post) {
        console.log(`Added HTB writeup: ${post.frontmatter.title}`);
        posts.push(post);
      }
    }
    
    // Sort posts by date
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
    
    console.log(`Total posts processed: ${sortedPosts.length}`);
    return sortedPosts;
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

// For backward compatibility
export const posts = Object.entries(blogPosts)
  .map(([path, content]) => parsePost(path, content))
  .filter((post): post is Post => post !== null)
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());