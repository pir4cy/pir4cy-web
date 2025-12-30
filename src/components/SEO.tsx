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
  const socialImage = image && image.trim() !== '' ? image : '/social-image.jpg';
  const absoluteImageUrl = socialImage.startsWith('http') ? socialImage : `${siteUrl}${socialImage}`;
  
  // Generate JSON-LD structured data for articles
  const jsonLd = type === 'article' && publishedAt ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": fullTitle,
    "description": description,
    "image": absoluteImageUrl,
    "author": {
      "@type": "Person",
      "name": "pir4cy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "pir4cy",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logos/main-logo.png`
      }
    },
    "datePublished": publishedAt,
    "url": `${siteUrl}${canonical}`
  } : null;
  
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
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`Cover image for ${fullTitle}`} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${siteUrl}${canonical}`} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* LinkedIn specific */}
      <meta property="og:site_name" content="pir4cy" />
      <meta name="author" content="pir4cy" />
      
      {/* Additional meta tags for better crawling */}
      <meta property="og:locale" content="en_US" />
      <meta name="robots" content="index, follow" />
      {type === 'article' && <meta property="article:author" content="pir4cy" />}
      
      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;