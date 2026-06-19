/**
 * Responsive design utilities and media query helpers
 */

// Media query breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  // Max width queries for mobile-first
  maxXs: `@media (max-width: 639px)`,
  maxSm: `@media (max-width: 767px)`,
  maxMd: `@media (max-width: 1023px)`,
  maxLg: `@media (max-width: 1279px)`,
};

/**
 * Responsive styles generator
 * Usage: responsive({ mobile: '100%', tablet: '50%', desktop: '33.33%' })
 */
export const responsive = (styles) => {
  let css = '';
  
  if (styles.mobile) css += `${media.maxSm} { ${styles.mobile} }`;
  if (styles.tablet) css += `${media.md} { ${styles.tablet} }`;
  if (styles.desktop) css += `${media.lg} { ${styles.desktop} }`;
  
  return css;
};

/**
 * Container query responsive hook
 */
import { useState, useEffect, useRef } from 'react';

export const useResponsive = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
};

/**
 * Responsive grid styles
 */
export const responsiveGrid = {
  auto: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  twoColumn: {
    mobile: { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' },
    desktop: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  },
  threeColumn: {
    mobile: { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' },
    tablet: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    desktop: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  },
};

/**
 * Touch-friendly button sizes
 */
export const touchFriendly = {
  button: {
    minHeight: '44px', // iOS recommended
    minWidth: '44px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  input: {
    minHeight: '44px',
    padding: '0.75rem',
    fontSize: '16px', // Prevents zoom on iOS
  },
};

export default {
  breakpoints,
  media,
  responsive,
  useResponsive,
  responsiveGrid,
  touchFriendly,
};
