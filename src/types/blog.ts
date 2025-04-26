export interface Frontmatter {
  title: string;
  date: string;
  excerpt: string;
  readingTime: number;
  tags?: string[];
  coverImage?: string;
  author?: string;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}