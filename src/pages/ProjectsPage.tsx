import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PageHeader from '../components/ui/PageHeader';
import ProjectCard from '../components/projects/ProjectCard';
import { getProjects } from '../data/projectsData';
import { Project } from '../types/project';

const ProjectsPage: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => {
        tagsSet.add(tag);
      });
    });
    return Array.from(tagsSet).sort();
  }, [projects]);
  
  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) return projects;
    
    return projects.filter(project => 
      selectedTags.some(tag => project.tags.includes(tag))
    );
  }, [projects, selectedTags]);
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  return (
    <>
      <SEO 
        title="Projects" 
        description="A showcase of my engineering work, personal projects, and open-source contributions."
        canonical="/projects"
      />
      
      <PageHeader 
        title="Projects" 
        description="A showcase of my engineering work, personal projects, and open-source contributions."
      />
      
      <section className="py-12">
        <div className="container-custom">
          {/* Filter by tags */}
          <div className="mb-10">
            <h3 className="text-white font-medium mb-3">Filter by technology:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-dark-300 mt-4">Loading projects...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Projects grid */}
          {!isLoading && !error && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
          )}
          
          {/* Empty state */}
          {!isLoading && !error && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-dark-400 mb-6">
                No projects match the selected filters.
              </p>
              <button
                onClick={() => setSelectedTags([])}
                className="btn-secondary"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;