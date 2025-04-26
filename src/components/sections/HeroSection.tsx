import { ArrowRight } from 'lucide-react';
import Container from '../common/Container';
import { useTheme } from '../../context/ThemeContext';

const HeroSection = () => {
  const { theme } = useTheme();
  
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-secondary/20 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <Container className="relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-fadeIn">
            <h1 className="font-inter font-bold text-4xl md:text-5xl lg:text-6xl text-text dark:text-white leading-tight mb-6">
              Proactive IT Solutions for 
              <span className="gradient-text"> Small Businesses</span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-700 dark:text-gray-300 mb-8 max-w-lg">
              We help small businesses stay secure, efficient, and future-ready with managed IT services designed for growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="btn-primary flex items-center justify-center sm:justify-start"
              >
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a 
                href="#services" 
                className="btn-secondary flex items-center justify-center sm:justify-start"
              >
                Explore Services
              </a>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-neutral-500 dark:text-gray-400 mb-4">Trusted by businesses across Ontario</p>
              <div className="flex flex-wrap gap-6 items-center opacity-70">
                {/* Replace with actual client logos, using placeholder text for now */}
                <div className="text-neutral-700 dark:text-gray-300 font-medium text-sm">COMPANY ONE</div>
                <div className="text-neutral-700 dark:text-gray-300 font-medium text-sm">COMPANY TWO</div>
                <div className="text-neutral-700 dark:text-gray-300 font-medium text-sm">COMPANY THREE</div>
                <div className="text-neutral-700 dark:text-gray-300 font-medium text-sm">COMPANY FOUR</div>
              </div>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="flex justify-center md:justify-end animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <img 
              src={theme === 'light' 
                ? "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                : "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              } 
              alt="IT professionals working together" 
              className="rounded-2xl shadow-xl max-w-full w-[90%] md:w-auto max-h-[500px] object-cover animate-float"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;