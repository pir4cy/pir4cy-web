import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AboutSection = () => {
  const { theme } = useTheme();
  
  const values = [
    {
      title: 'Proactive Approach',
      description: 'We identify and resolve issues before they impact your business.'
    },
    {
      title: 'Client Partnership',
      description: 'We work as an extension of your team, aligned with your goals.'
    },
    {
      title: 'Technology Excellence',
      description: 'We maintain cutting-edge expertise in relevant technologies.'
    },
    {
      title: 'Security-First Mindset',
      description: 'We prioritize protecting your business at every level.'
    }
  ];

  return (
    <section id="about" className="section bg-primary dark:bg-gray-800">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Image */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 transform translate-x-4 translate-y-4 rounded-2xl bg-accent/10 dark:bg-accent/20" />
              <img
                src={theme === 'light' 
                  ? "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  : "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
                alt="Prevolv team meeting"
                className="relative z-10 rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* About Content */}
          <div className="order-1 md:order-2">
            <SectionHeading
              title="About Prevolv"
              subtitle="Leading IT managed services provider for small businesses across Ontario."
            />
            
            <p className="text-neutral-700 dark:text-gray-300 mb-6">
              Founded in 2018, Prevolv emerged from a simple observation: small businesses deserve enterprise-quality IT solutions at affordable prices. Our team of certified specialists combines technical expertise with business acumen to deliver services that truly impact your bottom line.
            </p>
            
            <div className="space-y-4 mb-8">
              {values.map((value, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="text-accent flex-shrink-0 mt-1 mr-3" size={20} />
                  <div>
                    <h4 className="font-medium text-text dark:text-white">{value.title}</h4>
                    <p className="text-neutral-600 dark:text-gray-400">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="#case-studies" className="btn-primary">
              View Our Case Studies
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;