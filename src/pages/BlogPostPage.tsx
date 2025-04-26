import { useState, useEffect } from 'react';
import type { JSX } from 'react';
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
import type { Components } from 'react-markdown';

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

// Simple image component that handles local paths
const Image = ({ src, alt, className }: ImageProps): JSX.Element | null => {
  if (!src) return null;

  console.log('Original image src:', src);

  // If it's already an absolute URL, use it as is
  if (src.startsWith('http')) {
    console.log('Using absolute URL:', src);
    return <img src={src} alt={alt} className={className} />;
  }

  // If it's already in the correct format (/images/...), use it as is
  if (src.startsWith('/images/')) {
    console.log('Using direct images path:', src);
    return <img src={src} alt={alt} className={className} />;
  }

  // For legacy paths, convert boxImages/MachineName/image.png to /images/htb/machines/MachineName/image.png
  const imagePath = src.startsWith('boxImages/') 
    ? `/images/htb/machines/${src.replace('boxImages/', '')}`
    : `/images/${src}`;
  
  console.log('Converted image path:', imagePath);
  return <img src={imagePath} alt={alt} className={className} />;
};

const BlogPostPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
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
  
  const formattedDate = post?.frontmatter.date 
    ? new Date(post.frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  
  const components: Components = {
    code({ node, inline, className, children, ...props }: { 
      node?: any;
      inline?: boolean;
      className?: string;
      children: React.ReactNode;
      [key: string]: any;
    }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
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
    img: Image
  };
  
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
                  components={components}
                  className="prose prose-invert prose-lg max-w-none prose-pre:p-0"
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;