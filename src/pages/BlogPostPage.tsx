import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SEO from '../components/SEO';
import { getPostBySlug } from '../utils/blogUtils';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || '');
  
  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-dark-300 mb-8">
          The blog post you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" className="btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }
  
  const { frontmatter, content } = post;
  const { title, date, readingTime, tags, coverImage } = frontmatter;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <SEO 
        title={title}
        description={frontmatter.excerpt}
        canonical={`/blog/${slug}`}
        image={coverImage}
        type="article"
        publishedAt={date}
      />
      
      <article className="py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          {/* Back to blog link */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to all posts</span>
          </Link>
          
          {/* Cover image */}
          {coverImage && (
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-10">
              <motion.img 
                src={coverImage} 
                alt={title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
          
          {/* Title and metadata */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-dark-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              
              {tags && tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/blog?tag=${tag}`} 
                        className="text-xs font-medium bg-dark-800 text-dark-300 hover:bg-dark-700 px-2.5 py-0.5 rounded-lg transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Article content */}
          <div className="prose prose-dark prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;