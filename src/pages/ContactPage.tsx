import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, X, Linkedin, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';

const THANK_YOU_TIMEOUT = 5000;

const ContactPage: React.FC = () => {
  const [showThankYou, setShowThankYou] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Show thank you modal on form submit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowThankYou(true);
    // Start redirect timer
    timeoutRef.current = setTimeout(() => {
      navigate('/');
    }, THANK_YOU_TIMEOUT);
    // Actually submit the form to Netlify
    e.currentTarget.submit();
  };

  // Cancel redirect if user interacts
  const handleUserAction = (path: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowThankYou(false);
    navigate(path);
  };

  // If user closes modal, cancel redirect
  const handleCloseModal = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowThankYou(false);
  };

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
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="brutalist-box"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Mail className="h-6 w-6 text-primary-500" />
                      <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                    </div>

                    <form
                      name="contact"
                      method="POST"
                      data-netlify="true"
                      data-netlify-honeypot="bot-field"
                      className="space-y-6"
                      onSubmit={handleFormSubmit}
                    >
                      <input type="hidden" name="form-name" value="contact" />
                      <p className="hidden">
                        <label>
                          Don't fill this out if you're human: <input name="bot-field" />
                        </label>
                      </p>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full px-4 py-2 bg-dark-800 border-2 border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full px-4 py-2 bg-dark-800 border-2 border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-dark-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          className="w-full px-4 py-2 bg-dark-800 border-2 border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="What's this about?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-dark-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          className="w-full px-4 py-2 bg-dark-800 border-2 border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                          placeholder="Your message..."
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div />
                        <button
                          type="submit"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <Send className="h-5 w-5" />
                          Send Message
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
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
                          href="mailto:pir4cy@duck.com"
                          className="text-dark-300 hover:text-white transition-colors"
                        >
                          pir4cy@duck.com
                        </a>
                      </div>
                    </div>
                    
                  
                  </div>
                </div>
                
                <div className="brutalist-box">
                  <h3 className="text-xl font-bold text-white mb-6">Connect</h3>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://github.com/pir4cy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5 text-primary-500" />
                      <span>GitHub</span>
                    </a>
                    
                    <a 
                      href="https://x.com/kt_pir4cy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5 text-primary-500" />
                      <span>Twitter (X) ¬_¬</span>
                    </a>
                    
                    <a 
                      href="https://linkedin.com/in/pir4cy" 
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
      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-4 border-primary-600"
          >
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <h2 className="text-2xl font-bold text-white mb-2">Thank you for reaching out!</h2>
            <p className="text-dark-200 mb-6">Your message has been sent. I'll get back to you as soon as possible.</p>
            <div className="flex flex-col gap-3 mb-4">
              <button
                className="btn-primary w-full"
                onClick={() => handleUserAction('/blog')}
              >
                Go to Blog
              </button>
              <button
                className="btn-secondary w-full"
                onClick={() => handleUserAction('/')}
              >
                Go to Homepage
              </button>
              <button
                className="btn-accent w-full"
                onClick={() => handleUserAction('/projects')}
              >
                View Projects
              </button>
            </div>
            <button
              className="text-dark-400 hover:text-white text-xs mt-2"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <p className="text-xs text-dark-500 mt-4">You will be redirected to the homepage in 5 seconds if no action is taken.</p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ContactPage;