import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Engineer. Hacker. Builder. Always learning. Personal portfolio and blog of pir4cy.',
  canonical = '',
  image = '/social-image.jpg',
  type = 'website',
  publishedAt,
}) => {
  const siteUrl = window.location.origin;
  const fullTitle = title === 'Home' ? 'pir4cy | Engineer. Hacker. Builder.' : `${title} | pir4cy`;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${siteUrl}${canonical}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${siteUrl}${canonical}`} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Helmet>
  );
};

export default SEO;