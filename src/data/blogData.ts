import { Post, Frontmatter } from '../types/blog';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Import all markdown files from both blog and htb directories
const blogPosts = import.meta.glob('../content/blog/*.md', { 
  eager: true,
  as: 'raw',
}) as Record<string, string>;

const htbPosts = import.meta.glob('../content/htb/*.md', {
  eager: true,
  as: 'raw',
}) as Record<string, string>;

function parsePost(path: string, content: string): Post | null {
  try {
    console.log(`Processing post: ${path}`);
    console.log(`Content length: ${content.length}`);
    console.log(`Content preview: ${content.slice(0, 100)}`);
    
    // Convert string to Buffer for gray-matter
    const buffer = Buffer.from(content);
    const { data, content: markdownContent } = matter(buffer);
    
    // Skip draft posts
    if (data.draft === true) {
      console.log(`Skipping draft post: ${path}`);
      return null;
    }
    
    // Create the slug from the filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    // Log for debugging in production
    console.log(`Processing ${path}:`, {
      contentLength: content.length,
      hasData: !!data,
      dataKeys: Object.keys(data),
      markdownLength: markdownContent.length,
      frontmatter: data
    });
    
    // Ensure all required fields are present
    const frontmatter: Frontmatter = {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || 'No excerpt available',
      readingTime: data.readingTime || 1,
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)] : ['Untagged'],
      author: data.author || 'Unknown',
      coverImage: data.coverImage || '/images/default-cover.jpg',
      draft: data.draft || false
    };

    console.log(`Successfully parsed post: ${frontmatter.title}`);
    return {
      slug,
      frontmatter,
      content: markdownContent.trim()
    };
  } catch (error) {
    console.error(`Error processing post ${path}:`, error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Content preview:', content ? content.slice(0, 100) : 'No content');
    return null;
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    console.log('Starting to fetch posts...');
    console.log('Available blog posts:', Object.keys(blogPosts));
    console.log('Available HTB posts:', Object.keys(htbPosts));
    
    const posts: Post[] = [];
    
    // Process blog posts
    console.log('Processing blog posts...');
    for (const [path, content] of Object.entries(blogPosts)) {
      console.log(`Processing blog post at path: ${path}`);
      const post = parsePost(path, content);
      if (post) {
        console.log(`Added blog post: ${post.frontmatter.title}`);
        posts.push(post);
      }
    }
    
    // Process HTB writeups
    console.log('Processing HTB writeups...');
    for (const [path, content] of Object.entries(htbPosts)) {
      console.log(`Processing HTB writeup at path: ${path}`);
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
    if (sortedPosts.length === 0) {
      console.warn('No posts were processed. This might indicate an issue with loading markdown files.');
    }
    return sortedPosts;
  } catch (error) {
    console.error('Error getting posts:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return [];
  }
};

// For backward compatibility
export const posts = Object.entries(blogPosts)
  .map(([path, content]) => parsePost(path, content))
  .filter((post): post is Post => post !== null && !post.frontmatter.draft)
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());