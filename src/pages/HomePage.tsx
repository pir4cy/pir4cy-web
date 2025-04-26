import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Server, Terminal, Database } from 'lucide-react';
import SEO from '../components/SEO';
import BlogCard from '../components/blog/BlogCard';
import ProjectCard from '../components/projects/ProjectCard';
import { getRecentPosts } from '../utils/blogUtils';
import { projects } from '../data/projectsData';

const HomePage: React.FC = () => {
  const recentPosts = getRecentPosts(5);
  const featuredProjects = projects.filter(project => project.featured).slice(0, 2);
  
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
              Engineer. Hacker. Builder. 
              <br />
              <span className="text-primary-500">Always learning.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-dark-300 mb-8"
              variants={itemVariants}
            >
              I craft secure, efficient, and elegant solutions to complex technical problems. 
              From low-level systems to cutting-edge web applications.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
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
              <h3 className="text-xl font-bold text-white mb-3">Systems Programming</h3>
              <p className="text-dark-300">
                Building high-performance, low-level software with C, Rust, and Go.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Code className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Web Development</h3>
              <p className="text-dark-300">
                Creating responsive, accessible, and modern web applications.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Database className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Data Engineering</h3>
              <p className="text-dark-300">
                Designing efficient databases and data processing pipelines.
              </p>
            </div>
            
            <div className="brutalist-box hover:border-primary-600 transition-colors duration-300">
              <Server className="h-10 w-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Security Research</h3>
              <p className="text-dark-300">
                Finding and addressing vulnerabilities in complex systems.
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
          
          <div className="two-columns">
            <div className="two-columns-main">
              {recentPosts.length > 0 && (
                <BlogCard post={recentPosts[0]} featured={true} />
              )}
            </div>
            
            <div className="two-columns-sidebar">
              <div className="space-y-6">
                {recentPosts.slice(1, 3).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recentPosts.slice(3, 5).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="bg-dark-900 py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
            <Link to="/projects" className="flex items-center gap-2 text-primary-500 hover:text-primary-400">
              <span>View all projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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