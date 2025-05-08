import * as React from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { Post } from '../../types/blog';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

type ExtendedFrontmatter = Post['frontmatter'] & {
  os?: string;
  logos?: {
    os?: string;
  };
};

type ExtendedPost = {
  slug: string;
  frontmatter: ExtendedFrontmatter;
};

const BlogCard: FC<BlogCardProps> = ({ post, featured = false, showExcerpt = true }) => {
  const { slug, frontmatter } = post;
  const { title, date, excerpt, readingTime, tags, coverImage } = frontmatter;
  const os = (frontmatter as ExtendedFrontmatter).os;
  const logos = (frontmatter as ExtendedFrontmatter).logos;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      className={`card group hover:border-primary-700 ${
        featured 
          ? 'brutalist-box mb-8' 
          : 'p-6 h-full transition-transform hover:-translate-y-1'
      }`}
    >
      <Link to={`/blog/${slug}`} className="block h-full">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-lg">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            {/* OS Logo */}
            {logos?.os && (
              <div className="absolute top-2 right-2 bg-dark-900/80 p-2 rounded-lg">
                <img 
                  src={logos.os} 
                  alt={os} 
                  className="w-6 h-6"
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, featured ? 3 : 2).map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs font-medium bg-dark-700 text-dark-300 px-2.5 py-0.5 rounded-lg"
                >
                  {tag}
                </span>
              ))}
              {tags.length > (featured ? 3 : 2) && (
                <span className="text-xs font-medium bg-dark-700 text-dark-300 px-2.5 py-0.5 rounded-lg">
                  +{tags.length - (featured ? 3 : 2)}
                </span>
              )}
            </div>
          )}
          
          <h3 className={`${featured ? 'text-2xl md:text-3xl' : 'text-xl'} text-white font-bold transition-colors duration-200 group-hover:text-primary-500`}>
            {title}
          </h3>
          
          <p className="text-dark-300 line-clamp-2">
            {showExcerpt ? excerpt : ''}
          </p>
          
          <div className="flex items-center gap-1 text-dark-400 text-sm pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;