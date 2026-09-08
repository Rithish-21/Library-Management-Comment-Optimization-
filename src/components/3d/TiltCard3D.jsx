import React, { useRef, useState } from 'react';
export const TiltCard3D = ({ children, className = '', maxTilt = 15, glareColor = 'rgba(99, 102, 241, 0.18)', onClick, }) => {
    const cardRef = useRef(null);
    const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    const [glarePosition, setGlarePosition] = useState({
        x: 50,
        y: 50,
        opacity: 0,
    });
    const handleMouseMove = (e) => {
        if (!cardRef.current)
            return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;
        setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
        setGlarePosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 1,
        });
    };
    const handleMouseLeave = () => {
        setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    };
    return (<div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick} style={{
            transform: transformStyle,
            transition: 'transform 0.15s ease-out',
            transformStyle: 'preserve-3d',
        }} className={`relative overflow-hidden transition-shadow duration-300 will-change-transform ${className} ${onClick ? 'cursor-pointer' : ''}`}>
      {/* Specular glare overlay */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-30" style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor}, transparent 60%)`,
            opacity: glarePosition.opacity,
        }}/>
      {/* Children content (supports translateZ popout) */}
      <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>);
};
