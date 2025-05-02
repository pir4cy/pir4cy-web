import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Github, X, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await fetch('/', {
      method: 'POST',
      body: new URLSearchParams(data as any).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
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
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
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
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="text-green-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">Thank you for reaching out!</h2>
                    <p className="text-dark-200 mb-2 text-center">Your message has been sent. I'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    className="space-y-6"
                    onSubmit={handleSubmit}
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
                        value={form.name}
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
                        value={form.email}
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
                        value={form.subject}
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
                        value={form.message}
                        onChange={handleChange}
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
                )}
              </motion.div>
            </div>
            {/* Contact Info & Socials */}
            <div className="w-full lg:w-1/3">
              <motion.div
                className="brutalist-box pt-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
                <div className="space-y-4">
                  <a 
                    href="mailto:pir4cy@duck.com"
                    className="flex items-center gap-3 text-dark-300 hover:text-white transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary-500" />
                    <span>pir4cy@duck.com</span>
                  </a>
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
                    <span>Twitter</span>
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;