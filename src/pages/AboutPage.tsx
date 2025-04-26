import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Database, Server, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';

const AboutPage: React.FC = () => {
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
                      I'm a software engineer, security researcher, and technology enthusiast with a 
                      passion for building elegant solutions to complex problems. My journey in technology 
                      began at an early age when I disassembled my first computer to understand how it worked.
                    </p>
                    <p>
                      Since then, I've developed expertise across the full technology stack, from low-level 
                      systems programming to modern web development. I'm particularly interested in the 
                      intersection of performance, security, and usability.
                    </p>
                    <p>
                      When I'm not coding, you can find me exploring cybersecurity challenges, contributing 
                      to open-source projects, or researching emerging technologies.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="brutalist-box bg-dark-800">
                      <Code className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Languages</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>Rust, Go, C/C++</li>
                        <li>JavaScript/TypeScript</li>
                        <li>Python, Bash</li>
                        <li>SQL, GraphQL</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <Server className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Technologies</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>Linux, Docker, Kubernetes</li>
                        <li>React, Next.js, Node.js</li>
                        <li>AWS, GCP, Azure</li>
                        <li>CI/CD, Git, GitHub Actions</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <Database className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Data & Infrastructure</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>PostgreSQL, MongoDB, Redis</li>
                        <li>Elasticsearch, Kafka</li>
                        <li>Data modeling & optimization</li>
                        <li>Infrastructure as Code</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <ShieldCheck className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Security</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>Penetration testing</li>
                        <li>Secure coding practices</li>
                        <li>Network security</li>
                        <li>Security auditing</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">My Approach</h2>
                  <div className="prose prose-invert text-lg">
                    <p>
                      I believe in writing clean, maintainable code that solves real problems. My approach is centered on:
                    </p>
                    <ul>
                      <li>
                        <strong>Deep understanding:</strong> Taking the time to fully comprehend a problem before implementing a solution.
                      </li>
                      <li>
                        <strong>Simplicity:</strong> Finding the most elegant solution rather than the most complex.
                      </li>
                      <li>
                        <strong>Performance:</strong> Optimizing for efficiency without sacrificing readability.
                      </li>
                      <li>
                        <strong>Security:</strong> Building with security in mind from the ground up.
                      </li>
                      <li>
                        <strong>Continuous learning:</strong> Staying current with best practices and emerging technologies.
                      </li>
                    </ul>
                  </div>
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
                    <Link 
                      to="/blog/zero-knowledge-proofs-explained" 
                      className="block group"
                    >
                      <h4 className="text-white group-hover:text-primary-500 font-medium transition-colors">
                        Zero Knowledge Proofs Explained Simply
                      </h4>
                      <p className="text-sm text-dark-400">Dec 10, 2023</p>
                    </Link>
                    <Link 
                      to="/blog/quantum-computing-threat" 
                      className="block group"
                    >
                      <h4 className="text-white group-hover:text-primary-500 font-medium transition-colors">
                        The Quantum Computing Threat to Cryptography
                      </h4>
                      <p className="text-sm text-dark-400">Nov 5, 2023</p>
                    </Link>
                    <Link 
                      to="/blog"
                      className="text-primary-500 hover:text-primary-400 inline-flex items-center gap-1 mt-2 text-sm"
                    >
                      View all posts
                    </Link>
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