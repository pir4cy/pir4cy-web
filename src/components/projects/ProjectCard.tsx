import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, tags, imageUrl, demoUrl, githubUrl } = project;

  return (
    <article className="card overflow-hidden group hover:border-primary-700 transition-transform hover:-translate-y-1">
      <div className="relative overflow-hidden h-48 bg-dark-900">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevents infinite loop
              e.currentTarget.src = `/images/projects/${title}-cover.gif`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-800">
            <span className="text-dark-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        
        <p className="text-dark-300 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="inline-block text-xs font-medium bg-dark-700 text-dark-300 px-2.5 py-0.5 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-4 pt-2">
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-300 hover:text-white transition-colors duration-200 flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>Source</span>
            </a>
          )}
          
          {demoUrl && (
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;