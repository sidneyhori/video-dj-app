'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export default function AudioVisualizer({ isPlaying, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(new Array(32).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentBars = new Array(32).fill(0);

    const animate = () => {
      if (!isPlaying) {
        // Gradually fade out bars when not playing
        currentBars = currentBars.map(bar => Math.max(0, bar - 2));
      } else {
        // Generate random bars that simulate audio frequencies
        currentBars = currentBars.map((_, index) => {
          // Create some pattern based on time for more realistic movement
          const time = Date.now() / 1000;
          const frequency = (index + 1) * 0.5;
          const base = Math.sin(time * frequency) * 30 + 30;
          const random = Math.random() * 20;
          return Math.max(5, base + random);
        });
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bars
      const barWidth = canvas.width / currentBars.length;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ff006e');
      gradient.addColorStop(0.5, '#8338ec');
      gradient.addColorStop(1, '#3a86ff');

      ctx.fillStyle = gradient;

      currentBars.forEach((bar, index) => {
        const barHeight = (bar / 100) * canvas.height;
        const x = index * barWidth;
        const y = canvas.height - barHeight;

        // Add slight spacing between bars
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793l-4.146-3.317a1 1 0 00-.632-.226H2a1 1 0 01-1-1V7.5a1 1 0 011-1h1.605a1 1 0 00.632-.226l4.146-3.317zM14 7a3 3 0 013 3v0a3 3 0 01-3 3" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm">
              Start playing music to see visuals
            </p>
          </div>
        </div>
      )}
    </div>
  );
}