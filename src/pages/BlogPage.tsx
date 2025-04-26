import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import BlogCard from '../components/blog/BlogCard';
import { getAllPosts } from '../utils/blogUtils';

const BlogPage: React.FC = () => {
  const allPosts = getAllPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allPosts.forEach(post => {
      post.frontmatter.tags?.forEach(tag => {
        tagsSet.add(tag);
      });
    });
    return Array.from(tagsSet).sort();
  }, [allPosts]);
  
  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === null || 
        post.frontmatter.tags?.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [allPosts, searchQuery, selectedTag]);
  
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
        description="Thoughts, tutorials, and insights on software engineering, cybersecurity, and technology."
        canonical="/blog"
      />
      
      <PageHeader 
        title="Blog" 
        description="Thoughts, tutorials, and insights on software engineering, cybersecurity, and technology."
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
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-dark-400">
              {filteredPosts.length === 0 
                ? 'No articles found' 
                : `Showing ${filteredPosts.length} article${filteredPosts.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          
          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          
          {/* Empty state */}
          {filteredPosts.length === 0 && (
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