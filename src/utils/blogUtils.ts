import matter from 'gray-matter';
import { Post } from '../types/blog';
import { posts } from '../data/blogData';

// Function to get all blog posts
export const getAllPosts = (): Post[] => {
  // In a real application, you would fetch all .md files from a directory
  // or from an API endpoint, then parse them
  return posts;
};

// Function to get a post by slug
export const getPostBySlug = (slug: string): Post | undefined => {
  return posts.find(post => post.slug === slug);
};

// Function to get the most recent posts
export const getRecentPosts = (count: number = 5): Post[] => {
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
export const getPostsByTag = (tag: string): Post[] => {
  return posts.filter(post => 
    post.frontmatter.tags?.includes(tag)
  );
};