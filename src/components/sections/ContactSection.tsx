import { useState } from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

const ContactSection = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      // In a real app, this would be an API call
      setFormStatus('success');
      
      // Track form submission in analytics
      trackEvent('Contact', 'Form Submission', 'Contact Form');
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1500);
  };
  
  return (
    <section id="contact" className="section bg-primary dark:bg-gray-800">
      <Container>
        <SectionHeading
          title="Get in Touch"
          subtitle="Have questions or ready to improve your IT infrastructure? Reach out to our team today."
          centered
        />
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden mt-8">
          <div className="grid md:grid-cols-5">
            {/* Contact Information */}
            <div className="md:col-span-2 bg-accent/10 dark:bg-accent/5 p-8 md:p-10">
              <h3 className="text-2xl font-medium text-text dark:text-white mb-6">
                Contact Information
              </h3>
              
              <p className="text-neutral-700 dark:text-gray-300 mb-8">
                Fill out the form or contact us directly using the information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="text-accent mt-1 mr-4" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-gray-400">Email</p>
                    <a href="mailto:contact@prevolv.tech" className="text-text dark:text-white">
                      contact@prevolv.tech
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-accent mt-1 mr-4" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-gray-400">Phone</p>
                    <a href="tel:+1-555-123-4567" className="text-text dark:text-white">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-accent mt-1 mr-4" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-gray-400">Address</p>
                    <p className="text-text dark:text-white">
                      123 Tech Avenue, Toronto<br />
                      ON M5V 2N4, Canada
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <p className="text-sm text-neutral-700 dark:text-gray-300 mb-4">
                  Working Hours
                </p>
                <p className="text-text dark:text-white">
                  Monday to Friday: 8:00 AM - 6:00 PM<br />
                  Weekend: 9:00 AM - 1:00 PM
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-3 p-8 md:p-10">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 mb-6 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                    <CheckCircle className="text-success-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-medium text-text dark:text-white mb-3">
                    Message Received!
                  </h3>
                  <p className="text-neutral-600 dark:text-gray-300 max-w-md">
                    Thanks for reaching out. A member of our team will get back to you within 1 business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2"
                      >
                        Full Name <span className="text-error-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2"
                      >
                        Email Address <span className="text-error-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="phone" 
                        className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-colors"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="company" 
                        className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2"
                      >
                        Company Name
                      </label>
                      <input 
                        type="text" 
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-colors"
                        placeholder="Your Company Ltd."
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-2"
                    >
                      How can we help? <span className="text-error-500">*</span>
                    </label>
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none transition-colors"
                      placeholder="Describe your IT needs or questions..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center justify-center w-full md:w-auto"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;