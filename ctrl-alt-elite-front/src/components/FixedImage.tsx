import { useState, useEffect } from "react";

interface FixedImageProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  defaultSrc?: string;
}

// Helper function to fix image URL if needed
const fixImageUrl = (src: string | null | undefined): string | null => {
  if (!src) return null;
  
  // Handle the specific case where we have a data URL prefix followed by a file path
  if (src.startsWith('data:image') && src.includes('/images/')) {
    // Extract the file path and convert it to a proper URL
    const path = src.substring(src.indexOf('/images/'));
    // Return the absolute URL to the backend server
    return `http://localhost:8000${path}`;
  }
  
  // Handle direct image paths
  if (src.startsWith('/images/')) {
    return `http://localhost:8000${src}`;
  }
  
  return src;
};

const FixedImage = ({ 
  src, 
  alt = "Image", 
  className = "", 
  defaultSrc = "/default_profile.png" 
}: FixedImageProps) => {
  // Apply URL fixing on the incoming src
  const fixedSrc = fixImageUrl(src);
  const [imgSrc, setImgSrc] = useState<string>(fixedSrc || defaultSrc);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    // Update image source when prop changes
    if (fixedSrc) {
      setImgSrc(fixedSrc);
      setImgError(false);
    } else {
      setImgSrc(defaultSrc);
    }
  }, [fixedSrc, defaultSrc]);

  const handleError = () => {
    console.error('Image failed to load:', {
      originalSrc: src,
      fixedSrc: fixedSrc
    });
    setImgError(true);
    setImgSrc(defaultSrc);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default FixedImage; 