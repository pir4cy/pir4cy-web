import React, { useState } from 'react';

interface MarqueeItem {
  id: string;
  name: string;
  imageUrl: string;
  link?: string;
  certificateUrl?: string;
}

interface ScrollingMarqueeProps {
  items: MarqueeItem[];
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

const ScrollingMarquee: React.FC<ScrollingMarqueeProps> = ({
  items,
  speed = 'medium',
  direction = 'left',
  pauseOnHover = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

  // Speed settings in pixels per second
  const speedMap = {
    slow: 20,
    medium: 40,
    fast: 60,
  };

  // Threshold for enabling scrolling
  const SCROLL_THRESHOLD = 4;

  const handleImageClick = (e: React.MouseEvent, item: MarqueeItem) => {
    e.preventDefault();
    // If there's a certificate URL, show that instead of the badge
    const imageUrl = item.certificateUrl || item.imageUrl;
    setSelectedImage({ url: imageUrl, name: item.name });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // If we have fewer items than the threshold, display them in a static grid
  if (items.length < SCROLL_THRESHOLD) {
    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-center">
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block transition-transform hover:scale-110"
                  onClick={(e) => handleImageClick(e, item)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-32 w-auto object-contain cursor-pointer"
                    title={item.name}
                  />
                </a>
              ) : (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-32 w-auto object-contain cursor-pointer"
                  title={item.name}
                  onClick={() => {
                    const imageUrl = item.certificateUrl || item.imageUrl;
                    setSelectedImage({ url: imageUrl, name: item.name });
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Modal for full image view */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl w-full">
              <button 
                className="absolute top-4 right-4 text-white hover:text-primary-500 transition-colors"
                onClick={closeModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <p className="text-white text-center mt-4">{selectedImage.name}</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Create a duplicate of items to ensure continuous scrolling
  const duplicatedItems = [...items, ...items];

  return (
    <>
      <div 
        className="relative overflow-hidden w-full py-4"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div 
          className={`flex whitespace-nowrap ${pauseOnHover ? 'hover:pause' : ''}`}
          style={{
            animation: `scroll-${direction} ${duplicatedItems.length * 2}s linear infinite`,
            animationPlayState: 'running',
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="inline-block mx-4"
            >
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block transition-transform hover:scale-110"
                  onClick={(e) => handleImageClick(e, item)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-32 w-auto object-contain cursor-pointer"
                    title={item.name}
                  />
                </a>
              ) : (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-32 w-auto object-contain cursor-pointer"
                  title={item.name}
                  onClick={() => {
                    const imageUrl = item.certificateUrl || item.imageUrl;
                    setSelectedImage({ url: imageUrl, name: item.name });
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full image view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-4 right-4 text-white hover:text-primary-500 transition-colors"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.name}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <p className="text-white text-center mt-4">{selectedImage.name}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollingMarquee; 