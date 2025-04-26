import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CaseStudiesSection = () => {
  const { theme } = useTheme();
  
  const caseStudies = [
    {
      image: theme === 'light' 
        ? "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'Cybersecurity',
      title: 'Dental Practice Security Overhaul',
      description: 'How we helped a growing dental practice protect patient data and comply with regulations.',
      results: ['60% reduction in security incidents', '100% HIPAA compliance', 'Staff security awareness improved by 85%']
    },
    {
      image: theme === 'light'
        ? "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'Cloud Migration',
      title: 'Law Firm\'s Transition to Cloud',
      description: 'Modernizing a traditional law firm\'s infrastructure with secure, accessible cloud solutions.',
      results: ['Annual IT costs reduced by 35%', 'Remote work capability established for 100% of staff', '99.9% uptime achieved']
    },
    {
      image: theme === 'light'
        ? "https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'Business Continuity',
      title: 'Manufacturing Disaster Recovery',
      description: 'Implementing a comprehensive business continuity plan for a local manufacturer.',
      results: ['Recovery time reduced from days to hours', 'Zero data loss during actual power outage', 'Production continuity maintained']
    }
  ];

  return (
    <section id="case-studies" className="section bg-white dark:bg-gray-900">
      <Container>
        <SectionHeading
          title="Case Studies"
          subtitle="Real-world examples of how we've helped businesses overcome their technology challenges and achieve measurable results."
          centered
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="card overflow-hidden h-full flex flex-col">
              <div className="relative overflow-hidden h-48">
                <img
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-medium py-1 px-2 rounded">
                  {caseStudy.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-medium text-text dark:text-white mb-3">
                  {caseStudy.title}
                </h3>
                
                <p className="text-neutral-600 dark:text-gray-300 mb-4">
                  {caseStudy.description}
                </p>
                
                <div className="mt-auto">
                  <h4 className="font-medium text-text dark:text-white mb-2">Results:</h4>
                  <ul className="space-y-1 mb-4">
                    {caseStudy.results.map((result, rIndex) => (
                      <li key={rIndex} className="text-sm text-neutral-600 dark:text-gray-300 flex items-start">
                        <span className="text-accent mr-2">•</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={`#case-study-${index}`}
                    className="text-accent font-medium flex items-center hover:underline"
                  >
                    Read full case study
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CaseStudiesSection;