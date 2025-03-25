"use client";

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Winner } from '@/utils/supabase';

interface BubbleProps {
  winner: Winner;
  maxScore: number;
}

export default function Bubble({ winner, maxScore }: BubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
  
  // Define header height to avoid
  const headerHeight = 100;
  
  // Calculate bubble size based on score (min 50px, max based on score ratio)
  // Making bubbles 50% bigger
  const minSize = 75; // 50 * 1.5
  const maxSize = 225; // 150 * 1.5
  const sizeRatio = maxScore > 0 ? winner.score / maxScore : 0.5;
  const size = Math.max(minSize, sizeRatio * maxSize);
  
  // Define bubble color - pick a random color from the list
  const colors = [
    "#d3626b", 
    "#eb6775", 
    "#d59d65", 
    "#b7c560", 
    "#63c858", 
    "#4fcaa0", 
    "#6bafd7", 
    "#9a94e5", 
    "#b7b1eb"
  ];
  
  // Use a deterministic way to pick color based on winner id or name to keep it consistent for the same winner
  const colorIndex = winner.id % colors.length;
  const bubbleColor = colors[colorIndex];

  // Initialize a random position when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && bubbleRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      setPosition({
        x: Math.random() * (windowWidth - size),
        y: Math.random() * (windowHeight - size - headerHeight) + headerHeight, // Start below header
      });
    }
  }, [size]);

  // Animate the bubble movement
  useEffect(() => {
    let frameId: number;
    
    const animateFrame = () => {
      setPosition(prev => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        
        // Bounce off edges
        if (newX <= 0 || newX >= windowWidth - size) {
          newVelX = -velocity.x;
        }
        
        // Bounce off top (header) and bottom
        if (newY <= headerHeight || newY >= windowHeight - size) {
          newVelY = -velocity.y;
        }
        
        // Update velocity if changed
        if (newVelX !== velocity.x || newVelY !== velocity.y) {
          setVelocity({ x: newVelX, y: newVelY });
        }
        
        return {
          x: Math.max(0, Math.min(windowWidth - size, newX)),
          y: Math.max(headerHeight, Math.min(windowHeight - size, newY)) // Ensure bubble stays below header
        };
      });
      
      frameId = requestAnimationFrame(animateFrame);
    };
    
    frameId = requestAnimationFrame(animateFrame);
    
    return () => cancelAnimationFrame(frameId);
  }, [velocity, size]);
  
  const bubbleStyle: CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: bubbleColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FBE4D6', // Light text color for all bubbles
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'background-color 0.5s ease',
    zIndex: 10,
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: `${Math.max(14, size * 0.2)}px`,
    textAlign: 'center',
    padding: '10px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <div ref={bubbleRef} style={bubbleStyle}>
      <div>
        {winner.name}
        <div style={{ fontSize: '80%', marginTop: '5px' }}>
          {winner.score}
        </div>
      </div>
    </div>
  );
} 