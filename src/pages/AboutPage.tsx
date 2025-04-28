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
                      I'm a cybersecurity engineer with a passion for building secure solutions and protecting digital assets. 
                      My journey in technology began with a Bachelor's in Computer Science, which laid the foundation for my 
                      career in cybersecurity.
                    </p>
                    <p>
                      Currently working as a Concierge Security Engineer at Arctic Wolf, I combine my security expertise with 
                      development skills to create robust security solutions. My experience spans from security analysis to 
                      advanced threat detection and incident response.
                    </p>
                    <p>
                      When I'm not defending against cyber threats, you can find me participating in CTF competitions, 
                      contributing to security tools, or exploring new technologies in the cybersecurity space.
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
                      <h3 className="text-xl font-bold text-white mb-3">Programming</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>Python, JavaScript</li>
                        <li>Bash, Shell Scripting</li>
                        <li>Web Development</li>
                        <li>Automation & Tooling</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <Server className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Security Tools</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>MDR Solutions</li>
                        <li>SIEM Platforms</li>
                        <li>Docker, Linux</li>
                        <li>Security Frameworks</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <Database className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Security Operations</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>Incident Response</li>
                        <li>Threat Analysis</li>
                        <li>Malware Analysis</li>
                        <li>Security Monitoring</li>
                      </ul>
                    </div>
                    
                    <div className="brutalist-box bg-dark-800">
                      <ShieldCheck className="h-8 w-8 text-primary-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3">Certifications</h3>
                      <ul className="space-y-2 text-dark-300">
                        <li>PNPT Certified</li>
                        <li>Project Management</li>
                        <li>Computer Application Security</li>
                        <li>CTF Achievements</li>
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
                      I believe in a comprehensive approach to cybersecurity that combines technical expertise with practical solutions. My methodology is centered on:
                    </p>
                    <ul>
                      <li>
                        <strong>Proactive Defense:</strong> Identifying and mitigating security risks before they become incidents.
                      </li>
                      <li>
                        <strong>Automation:</strong> Building efficient tools and scripts to streamline security operations.
                      </li>
                      <li>
                        <strong>Continuous Learning:</strong> Staying current with emerging threats and security technologies.
                      </li>
                      <li>
                        <strong>Collaboration:</strong> Working with teams to implement effective security strategies.
                      </li>
                      <li>
                        <strong>Innovation:</strong> Developing creative solutions to complex security challenges.
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