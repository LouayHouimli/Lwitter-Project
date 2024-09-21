import React, { useState, useEffect, useRef } from 'react';
import './StaticImage.css';

const StaticImage = ({ src, alt, ...props }) => {
  const [isGif, setIsGif] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsGif(img.src.toLowerCase().endsWith('.gif'));
    };
    img.src = src;
  }, [src]);

  const handleLoad = () => {
    if (isGif && imgRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;
      canvas.getContext('2d').drawImage(imgRef.current, 0, 0);
      imgRef.current.src = canvas.toDataURL('image/png');
    }
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="static-image"
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default StaticImage;