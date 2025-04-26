import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BlogSection = () => {
  const { theme } = useTheme();
  
  const blogs = [
    {
      image: theme === 'light'
        ? "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'Cybersecurity',
      title: '5 Essential Cybersecurity Measures Every Small Business Should Implement',
      date: 'May 15, 2025',
      readTime: '5 min read'
    },
    {
      image: theme === 'light'
        ? "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'Cloud Computing',
      title: 'The Small Business Guide to Cloud Migration: Benefits and Best Practices',
      date: 'April 22, 2025',
      readTime: '7 min read'
    },
    {
      image: theme === 'light'
        ? "https://images.pexels.com/photos/3862634/pexels-photo-3862634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : "https://images.pexels.com/photos/3862634/pexels-photo-3862634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: 'IT Planning',
      title: 'How to Develop an IT Roadmap That Aligns with Your Business Goals',
      date: 'April 8, 2025',
      readTime: '6 min read'
    }
  ];

  return (
    <section id="resources" className="section bg-white dark:bg-gray-900">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            title="Latest Insights"
            subtitle="Stay updated with our latest articles, resources, and IT insights for small businesses."
          />
          
          <a 
            href="#blog" 
            className="flex items-center text-accent font-medium hover:underline mt-4 md:mt-0"
          >
            View all articles
            <ArrowRight size={18} className="ml-1" />
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <a 
              key={index} 
              href={`#blog-${index}`}
              className="card overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-accent/90 text-white text-xs font-medium py-1 px-2 rounded">
                  {blog.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-neutral-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    {blog.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {blog.readTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-text dark:text-white mb-3">
                  {blog.title}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center font-medium text-accent">
                  Read article
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BlogSection;