'use client';

import { useEffect } from 'react';

export default function SpotlightInit() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.spotlight-card');

    const handleMouseMove = (e: MouseEvent) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}