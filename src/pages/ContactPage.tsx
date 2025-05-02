import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, X, Linkedin, Send } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Netlify will automatically handle the form submission
      // The form data will be sent to the URL specified in the form's action attribute
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...formData
        }).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
                      onSubmit={handleSubmit}
                      className="space-y-6"
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
                          value={formData.name}
                          onChange={handleChange}
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
                          value={formData.email}
                          onChange={handleChange}
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
                          value={formData.subject}
                          onChange={handleChange}
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
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-2 bg-dark-800 border-2 border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                          placeholder="Your message..."
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-dark-400">
                          {submitStatus === 'success' && (
                            <span className="text-green-500">Message sent successfully!</span>
                          )}
                          {submitStatus === 'error' && (
                            <span className="text-red-500">Failed to send message. Please try again.</span>
                          )}
                        </p>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Message
                            </>
                          )}
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
    </>
  );
};

export default ContactPage;