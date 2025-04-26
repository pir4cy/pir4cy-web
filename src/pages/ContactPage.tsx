import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import ContactForm from '../components/ui/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Contact" 
        description="Get in touch for project inquiries, collaborations, or just to say hello."
        canonical="/contact"
      />
      
      <PageHeader 
        title="Contact" 
        description="Get in touch for project inquiries, collaborations, or just to say hello."
      />
      
      <section className="py-12">
        <div className="container-custom">
          <div className="two-columns">
            <div className="two-columns-main">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ContactForm />
              </motion.div>
            </div>
            
            <div className="two-columns-sidebar">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="brutalist-box">
                  <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary-500 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">Email</h4>
                        <a 
                          href="mailto:contact@example.com"
                          className="text-dark-300 hover:text-white transition-colors"
                        >
                          contact@example.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium">Location</h4>
                        <p className="text-dark-300">
                          San Francisco, CA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="brutalist-box">
                  <h3 className="text-xl font-bold text-white mb-6">Connect</h3>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5 text-primary-500" />
                      <span>GitHub</span>
                    </a>
                    
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                    >
                      <Twitter className="h-5 w-5 text-primary-500" />
                      <span>Twitter</span>
                    </a>
                    
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-primary-500" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
                
                <div className="brutalist-box">
                  <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
                  <p className="text-dark-300">
                    I typically respond to inquiries within 24-48 hours. For urgent matters, please indicate in the subject line.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;