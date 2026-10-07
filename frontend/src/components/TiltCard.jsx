import React, { useState, useRef, useEffect } from 'react';

/**
 * TiltCard Component
 * Provides subtle 3D tilt effect on mouse hover.
 * Automatically disables on touch/mobile devices or when prefers-reduced-motion is active.
 */
const TiltCard = ({ children, className = '', maxTilt = 6, scale = 1.015, onClick }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.25s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.25s ease',
  });
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion or if device is mobile/touch
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (mediaQuery.matches || isTouch || window.innerWidth < 768) {
      setIsDisabled(true);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (isDisabled || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out, box-shadow 0.15s ease',
    });
  };

  const handleMouseLeave = () => {
    if (isDisabled) return;
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.3s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={isDisabled ? {} : style}
      className={`transform-gpu ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;
