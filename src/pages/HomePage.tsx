import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Server, Terminal, Database } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCard from '../components/blog/BlogCard';
import ProjectCard from '../components/projects/ProjectCard';
import { getRecentPosts } from '../utils/blogUtils';
import { getProjects } from '../data/projectsData';
import { Project } from '../types/project';
import { Post } from '../types/blog';

const HomePage: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recent posts
        const posts = await getRecentPosts(5);
        setRecentPosts(posts);
        
        // Fetch featured projects
        const projects = await getProjects();
        // Get the 3 most recent projects as featured projects
        const featured = projects
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        setFeaturedProjects(featured);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.2 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to my portfolio website. I'm a software engineer passionate about building great products."
        canonical="/"
      />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="container-custom py-16 md:py-24">
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="font-grotesk text-5xl md:text-6xl font-bold text-white mb-6"
              variants={itemVariants}
            >
              Hacker. Builder. 
              <br />
              <span className="text-primary-500">Always curious.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-dark-300 mb-8"
              variants={itemVariants}
            >
              I spend my days digging into offensive security, writing code, and exploring how systems behave 
              when pushed to their limits. Whether it's building tools, chasing bugs, or automating something 
              annoying, I'm always hacking on something.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link to="/projects" className="btn-primary">
                See What I've Built
              </Link>
              <Link to="/blog" className="btn-secondary">
                Read My Blog
              </Link>
              <Link to="/contact" className="btn-secondary">
                Let's Chat
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Skills/Expertise Section */}
      <section className="bg-dark-900 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Technical Expertise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Terminal className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Security Engineering</h3>
              <p className="text-dark-300">
                Expert in incident response, threat analysis, and security operations with proven experience in MDR solutions.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Code className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Development & Automation</h3>
              <p className="text-dark-300">
                Building efficient tools and scripts in Python, JavaScript, and Bash to optimize security workflows.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Database className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Offensive Security</h3>
              <p className="text-dark-300">
                Experienced in Active Directory, Windows, Linux, and Web application security. Learning through experience.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Server className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Security Operations</h3>
              <p className="text-dark-300">
                Proficient in threat intelligence, malware analysis, and security incident management.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Blog Posts */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">Recent Blog Posts</h2>
            <Link to="/blog" className="flex items-center gap-2 text-primary-500 hover:text-primary-400">
              <span>View all posts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
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
          
          {/* Blog posts */}
          {!isLoading && !error && recentPosts.length > 0 && (
            <div className="two-columns">
              <div className="two-columns-main">
                <BlogCard post={recentPosts[0]} featured={true} />
              </div>
              
              <div className="two-columns-sidebar">
                <div className="space-y-6">
                  {recentPosts.slice(1, 3).map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && !error && recentPosts.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {recentPosts.slice(3, 5).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && !error && recentPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No blog posts found</h3>
              <p className="text-dark-400 mb-6">
                Check back soon for new content.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-16 bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Featured Projects
            </h2>

            {/* Loading state */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-dark-300 mt-4">Loading projects...</p>
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

            {/* Projects grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* View all projects button */}
            {!isLoading && !error && (
              <div className="text-center mt-12">
                <Link to="/projects" className="btn-secondary">
                  View All Projects
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20">
        <div className="container-custom">
          <div className="brutalist-box text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to work together?</h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Whether you have a specific project in mind or just want to connect, I'm always open to new opportunities and collaborations.
            </p>
            <Link to="/contact" className="btn-primary text-lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;