import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Database, Server, ShieldCheck, Award } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import ScrollingMarquee from '../components/ui/ScrollingMarquee';
import { achievements, getAchievementsByCategory } from '../data/achievementsData';
import { getRecentPosts } from '../utils/blogUtils';
import { Post } from '../types/blog';

const AboutPage: React.FC = () => {
  // Get achievements by category
  const certifications = getAchievementsByCategory('certification');
  const badges = getAchievementsByCategory('badge');
  const stats = getAchievementsByCategory('stat');
  
  // State for recent blog posts
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch recent blog posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getRecentPosts(2); // Get 2 most recent posts
        setRecentPosts(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent posts:', err);
        setError('Failed to load recent blog posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentPosts();
  }, []);

  return (
    <>
      <SEO 
        title="About" 
        description="Learn more about my background, technical skills, and approach to software engineering."
        canonical="/about"
      />
      
      <PageHeader 
        title="About Me" 
      />
      
      <section className="py-12">
        <div className="container-custom">
          <div className="two-columns">
            <div className="two-columns-main">
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Who I Am</h2>
                  <div className="prose prose-invert text-lg">
                    <p>
                      First of all, thank you for taking the time to visit my website. I'm glad you're here.
                      My name is Kshitij - known online as pir4cy. I'm a tech enthusiast specializing in cybersecurity.  
                    </p>
                    <p>
                     I spend most of my time digging into offensive security, writing code, and exploring how systems behave 
                     when pushed to their limits. I've got a background in computer science, but most of what I've learned has 
                     come from CTFs, side projects, and just being relentlessly curious.
                    </p>
                    <p>
                     I like figuring out how things work and how to make them work better (or fail in interesting ways). 
                     Whether it's building tools, chasing bugs, or automating something annoying, I'm always hacking on something.
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">What This Website Is About</h2>
                  <div className="prose prose-invert text-lg">
                    <p>
                      I created this website as a place to share my thoughts, experiences, and learnings along my journey in cybersecurity and tech.
                    </p>
                    <p>
                      I like to tinker with technology and build things. Whether it's some automation to make my life easier or trying out a new tool that helps me in my workflows,
                      I will share my experience with you. 
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">HR Speak</h2>
                  <div className="space-y-8">
                    {certifications.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-primary-500" />
                          Certifications
                        </h3>
                        <ScrollingMarquee 
                          items={certifications} 
                          speed="medium" 
                          direction="left" 
                        />
                      </div>
                    )}
                    
                    {badges.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-primary-500" />
                          Badges
                        </h3>
                        <ScrollingMarquee 
                          items={badges} 
                          speed="medium" 
                          direction="right" 
                        />
                      </div>
                    )}
                    
                    {stats.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-primary-500" />
                          Stats
                        </h3>
                        <ScrollingMarquee 
                          items={stats} 
                          speed="slow" 
                          direction="left" 
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-sm text-dark-400 mt-8"
                >
                  <p>
                    A resume and related links can be provided upon request, please visit{' '}
                    <Link to="/contact" className="text-primary-500 hover:text-primary-400">
                      the contact page
                    </Link>
                    .
                  </p>
                </motion.div>
              </div>
            </div>
            
            <div className="two-columns-sidebar">
              <div className="sticky top-24 space-y-8">
                <motion.div 
                  className="brutalist-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Let's Connect</h3>
                  <p className="text-dark-300 mb-6">
                    Interested in working together or just want to chat about technology?
                  </p>
                  <Link to="/contact" className="btn-primary w-full">
                    Get in Touch
                  </Link>
                </motion.div>
                
                <motion.div 
                  className="brutalist-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Recent Blog Posts</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-dark-700 rounded w-3/4"></div>
                        <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                        <div className="h-6 bg-dark-700 rounded w-3/4"></div>
                        <div className="h-4 bg-dark-700 rounded w-1/4"></div>
                      </div>
                    ) : error ? (
                      <p className="text-dark-400">Failed to load recent posts</p>
                    ) : recentPosts.length > 0 ? (
                      <>
                        {recentPosts.map((post) => (
                          <Link 
                            key={post.slug}
                            to={`/blog/${post.slug}`} 
                            className="block group"
                          >
                            <h4 className="text-white group-hover:text-primary-500 font-medium transition-colors">
                              {post.frontmatter.title}
                            </h4>
                            <p className="text-sm text-dark-400">
                              {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </Link>
                        ))}
                        <Link 
                          to="/blog"
                          className="text-primary-500 hover:text-primary-400 inline-flex items-center gap-1 mt-2 text-sm"
                        >
                          View all posts
                        </Link>
                      </>
                    ) : (
                      <p className="text-dark-400">No blog posts found</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;