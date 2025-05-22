import * as React from 'react';
import type { ReactElement, ComponentProps } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SEO from '../components/SEO';
import { getPostBySlug } from '../utils/blogUtils';
import { Post } from '../types/blog';
import Giscus from '@giscus/react';

type ImageProps = ComponentProps<'img'>;

// Simple image component that handles local paths
const Image = ({ src, alt, className, ...props }: ImageProps): ReactElement | null => {
  if (!src) return null;

  let imagePath = src;

  // Handle absolute URLs
  if (src.startsWith('http')) {
    imagePath = src;
  }
  // Handle local images
  else if (src.startsWith('/images/')) {
    imagePath = src;
  }
  // Handle relative paths (for HTB writeup images)
  else {
    imagePath = `/images/${src}`;
  }

  return (
    <img
      src={imagePath}
      alt={alt || ''}
      className={className}
      {...props}
    />
  );
};

const BlogPostPage = (): ReactElement => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<Post | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) {
          throw new Error('No slug provided');
        }
        const fetchedPost = await getPostBySlug(slug);
        if (!fetchedPost) {
          throw new Error('Post not found');
        }
        setPost(fetchedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Umami custom event tracking for blog post views
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).umami && slug) {
      (window as any).umami.track('blog_view', { post: slug });
    }
  }, [slug]);
  
  const formattedDate = post?.frontmatter.date 
    ? new Date(post.frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  
  // Handle 404
  if (!isLoading && error) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-dark-300 mb-8">
          The blog post you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" className="btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {post && (
        <SEO 
          title={post.frontmatter.title} 
          description={post.frontmatter.excerpt}
          canonical={`/blog/${post.slug}`}
        />
      )}
      
      <article className="py-12">
        <div className="container-custom">
          {/* Back button */}
          <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </button>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-dark-300 mt-4">Loading blog post...</p>
            </div>
          )}
          
          {/* Post content */}
          {post && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Post header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {post.frontmatter.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-dark-300 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{post.frontmatter.readingTime} min read</span>
                  </div>
                  
                  {post.frontmatter.author && (
                    <div className="flex items-center gap-1.5">
                      <span>By {post.frontmatter.author}</span>
                    </div>
                  )}
                </div>
                
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs font-medium bg-dark-700 text-dark-300 px-2.5 py-0.5 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>
              
              {/* Post content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    code({inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
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
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-6">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-6">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="my-2">{children}</li>;
                    },
                    blockquote({ children }) {
                      return <blockquote className="border-l-4 border-primary-500 pl-4 italic my-4">{children}</blockquote>;
                    },
                    img: Image
                  }}
                >
                  {post.content}
                </ReactMarkdown>

                {/* Comments section */}
                <div className="mt-16 pt-8 border-t border-dark-700">
                  <h2 className="text-2xl font-bold text-white mb-8">Comments</h2>
                  <Giscus 
                    id="comments"
                    repo="pir4cy/pir4cy-web"
                    repoId="R_kgDOOgMyiQ"
                    category="General"
                    categoryId="DIC_kwDOOgMyic4Cp2iG"
                    mapping="pathname"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="bottom"
                    theme="dark"
                    lang="en"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;