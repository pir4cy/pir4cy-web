import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import GradientIcon from '../common/GradientIcon';
import { Shield, Cog, FileCheck, Cpu, HelpCircle, Bot, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const ServicesSection = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  
  const services = [
    {
      icon: HelpCircle,
      title: 'Core MSP Plan',
      shortDesc: 'Comprehensive IT management and support for your business.',
      features: [
        '24/7 Helpdesk Support',
        'Automated Patch Management',
        'Proactive System Monitoring',
        'DNS Filtering & Security',
        'Multi-Factor Authentication',
        'Asset Management',
        'Network Management'
      ]
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      shortDesc: 'Advanced protection against modern digital threats.',
      features: [
        'Next-gen Endpoint Protection',
        'Security Awareness Training',
        'Phishing Simulations',
        'Regular Security Audits',
        'Vulnerability Assessments',
        'Incident Response Planning',
        'Security Policy Development'
      ]
    },
    {
      icon: FileCheck,
      title: 'Compliance & Insurance',
      shortDesc: 'Meet security standards and reduce insurance premiums.',
      features: [
        'Compliance Gap Analysis',
        'Security Controls Implementation',
        'Insurance Requirement Support',
        'Documentation & Reporting',
        'Regular Compliance Audits',
        'Risk Assessment',
        'Policy Development'
      ]
    },
    {
      icon: Bot,
      title: 'Automation as a Service',
      shortDesc: 'Custom automation solutions to streamline operations.',
      features: [
        'Workflow Automation',
        'AI Integration Services',
        'Process Optimization',
        'Custom Tool Development',
        'Integration Management',
        'ROI Tracking',
        'Automation Training'
      ]
    }
  ];

  return (
    <section id="services" className="section bg-white dark:bg-gray-900">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive IT solutions designed to help your business thrive in the digital age."
          centered
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative h-[400px] perspective-1000"
              onMouseEnter={() => setFlippedCard(index)}
              onMouseLeave={() => setFlippedCard(null)}
              onClick={() => setFlippedCard(flippedCard === index ? null : index)}
            >
              <div 
                className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                  flippedCard === index ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="card p-6 h-full flex flex-col items-center text-center">
                    <div className="mb-6">
                      <GradientIcon icon={service.icon} size={32} />
                    </div>
                    
                    <h3 className="text-xl font-medium text-text dark:text-white mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-neutral-600 dark:text-gray-300 mb-6">
                      {service.shortDesc}
                    </p>
                    
                    <div className="mt-auto flex items-center text-accent font-medium">
                      View Details
                      <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 rotate-y-180 backface-hidden">
                  <div className="card p-6 h-full flex flex-col bg-accent text-white">
                    <h3 className="text-xl font-medium mb-4">{service.title}</h3>
                    
                    <ul className="space-y-3 mb-6 flex-grow">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <a 
                      href="#contact" 
                      className="mt-auto text-center py-2 px-4 bg-white text-accent rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;