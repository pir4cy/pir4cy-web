import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="container-custom py-12 md:py-20">
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{title}</h1>
        {description && (
          <p className="text-xl text-dark-300 md:text-2xl leading-relaxed">{description}</p>
        )}
      </motion.div>
    </div>
  );
};

export default PageHeader;