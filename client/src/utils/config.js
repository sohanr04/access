/**
 * Application configuration
 * 
 * This file contains environment-specific configuration settings.
 * Update the PRODUCTION_URL when deploying to production.
 */

// Base URL for production environment
// Replace this with your actual production domain when deploying
// Priority: 1. Environment variable 2. Hardcoded value
export const PRODUCTION_URL = process.env.NEXT_PUBLIC_PRODUCTION_URL || 'https://yourdomain.com';

// Check if we're in development mode
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost');
};

// Get the base URL based on the environment
export const getBaseUrl = () => {
  if (isDevelopment()) {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  }
  return PRODUCTION_URL;
};

// Generate a full URL for a sample
export const getSampleUrl = (styleId) => {
  return `${getBaseUrl()}/samples/${styleId}`;
}; 