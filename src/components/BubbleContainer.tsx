"use client";

import { useEffect, useState } from 'react';
import Bubble from './Bubble';
import { Winner } from '@/utils/supabase';

export default function BubbleContainer() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define header height for later use in bubble positioning
  const headerHeight = 100;

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('/api/winners');
        
        if (!response.ok) {
          throw new Error('Failed to fetch winners');
        }
        
        const data = await response.json();
        setWinners(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching winners:', err);
        setError('Failed to load winners. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchWinners();

    // Set up polling interval
    const intervalId = setInterval(fetchWinners, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Find the maximum score for bubble sizing
  const maxScore = winners.length > 0 
    ? Math.max(...winners.map(winner => winner.score)) 
    : 0;

  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0C0950',
    color: '#FBE4D6'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    fontSize: '24px',
    paddingTop: `${headerHeight}px` // Add padding to avoid header area
  };

  const headerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    padding: '20px',
    textAlign: 'center' as const,
    backgroundColor: '#261FB3',
    zIndex: 20,
    height: `${headerHeight}px`
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Winners</div>
          <div style={{ fontSize: '18px', marginTop: '5px' }}>
            <a 
              href="https://redslug.github.io/tiles/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#FBE4D6', textDecoration: 'underline', cursor: 'pointer' }}
            >
              beat the bot
            </a>
          </div>
        </div>
        <div style={loadingStyle}>Loading winners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Winners</div>
          <div style={{ fontSize: '18px', marginTop: '5px' }}>
            <a 
              href="https://redslug.github.io/tiles/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#FBE4D6', textDecoration: 'underline', cursor: 'pointer' }}
            >
              beat the bot
            </a>
          </div>
        </div>
        <div style={loadingStyle}>{error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Winners</div>
        <div style={{ fontSize: '18px', marginTop: '5px' }}>
          <a 
            href="https://redslug.github.io/tiles/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#FBE4D6', textDecoration: 'underline', cursor: 'pointer' }}
          >
            beat the bot
          </a>
        </div>
      </div>
      
      {winners.length === 0 ? (
        <div style={loadingStyle}>No winners yet!</div>
      ) : (
        winners.map(winner => (
          <Bubble 
            key={winner.id} 
            winner={winner} 
            maxScore={maxScore}
          />
        ))
      )}
    </div>
  );
} 