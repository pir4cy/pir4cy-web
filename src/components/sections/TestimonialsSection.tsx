import { useState, useEffect } from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Prevolv completely transformed our IT operations. Their proactive approach has prevented countless issues and their team feels like an extension of our own staff.",
      author: "Sarah Johnson",
      position: "Operations Director",
      company: "Eastwood Dental"
    },
    {
      quote: "Moving our systems to the cloud seemed daunting, but Prevolv made it seamless. We've improved collaboration and cut costs significantly.",
      author: "Michael Chen",
      position: "Managing Partner",
      company: "Chen & Associates Law"
    },
    {
      quote: "Their 24/7 monitoring caught a potential ransomware attack before it could do any damage. That alone was worth the investment.",
      author: "Robert Patel",
      position: "CEO",
      company: "Innovate Manufacturing"
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section className="section bg-primary dark:bg-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 transform -translate-x-1/2 translate-y-1/4">
        <div className="w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/2 -translate-y-1/4">
        <div className="w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      
      <Container className="relative z-10">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Don't just take our word for it. Here's what businesses like yours have to say about working with Prevolv."
          centered
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="relative h-80 md:h-64">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === activeIndex 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-24'
                }`}
              >
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg h-full flex flex-col">
                  <Quote className="text-accent/20 mb-4" size={48} />
                  
                  <p className="text-neutral-700 dark:text-gray-100 text-lg italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="mt-auto">
                    <p className="font-medium text-text dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-gray-300">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-accent' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;