import React, { useState, useMemo, useEffect } from 'react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import BlogCard from '../components/blog/BlogCard';
import { getAllPosts } from '../utils/blogUtils';
import { Post } from '../types/blog';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setError(null);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    try {
      const tagsSet = new Set<string>();
      posts.forEach(post => {
        if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
          post.frontmatter.tags.forEach(tag => {
            tagsSet.add(tag);
          });
        }
      });
      return Array.from(tagsSet).sort();
    } catch (err) {
      console.error('Error extracting tags:', err);
      return [];
    }
  }, [posts]);
  
  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    try {
      return posts.filter(post => {
        const matchesSearch = searchQuery === '' || 
          (post.frontmatter.title && post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.frontmatter.excerpt && post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesTag = selectedTag === null || 
          (post.frontmatter.tags && post.frontmatter.tags.includes(selectedTag));
        
        return matchesSearch && matchesTag;
      });
    } catch (err) {
      console.error('Error filtering posts:', err);
      return [];
    }
  }, [posts, searchQuery, selectedTag]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <>
      <SEO 
        title="Blog" 
        description="Thoughts, tutorials, and insights on software engineering, cybersecurity, and technology. Including HTB writeups."
        canonical="/blog"
      />
      
      <PageHeader 
        title="Blog" 
        description="Thoughts, tutorials, and insights on software, tech and cybersecurity. Feel free to leave a comment!"
      />
      
      <section className="py-12">
        <div className="container-custom">
          {/* Search and Filter */}
          <div className="mb-10 space-y-6">
            <div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">Filter by topic:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === tag 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                
                {(searchQuery || selectedTag) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto" />
              <p className="text-dark-300 mt-4">Loading blog posts...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Results count */}
          {!isLoading && !error && (
            <div className="mb-6">
              <p className="text-dark-400">
                {filteredPosts.length === 0 
                  ? 'No articles found' 
                  : `Showing ${filteredPosts.length} article${filteredPosts.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
          )}
          
          {/* Blog posts grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-dark-400 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;