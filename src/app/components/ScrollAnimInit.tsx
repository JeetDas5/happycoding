'use client';

import { useEffect } from 'react';

export default function ScrollAnimInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const targets = document.querySelectorAll('.animate-on-scroll');
    targets?.forEach((el) => observer?.observe(el));

    return () => observer?.disconnect();
  }, []);

  return null;
}