import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-800 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-dark-400 text-sm">
              Engineer. Hacker. Builder. Always learning.
            </p>
            <p className="text-dark-500 text-sm mt-2">
              © {currentYear} pir4cy. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/pir4cy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com/kt_pir4cy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/in/pir4cy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:pir4cy@duck.com" 
              className="text-dark-400 hover:text-white transition-colors duration-200"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;