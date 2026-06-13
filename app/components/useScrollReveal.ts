"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal, .reveal-right");

    // Step 1: Mark elements as ready for animation
    // This ensures content is visible by default (no .reveal-ready = full opacity)
    // and only hides them once JS is confirmed running
    elements.forEach((el) => el.classList.add("reveal-ready"));

    // Step 2: Use IntersectionObserver to reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Step 3: Immediately reveal elements already in viewport
    requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 60) {
          el.classList.add("active");
          observer.unobserve(el);
        }
      });
    });

    return () => observer.disconnect();
  }, []);
}
