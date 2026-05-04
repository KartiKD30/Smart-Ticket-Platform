/**
 * Centralized navigation and redirect management
 * Prevents multiple concurrent redirects and adds logging/tracing
 */

const TRUSTED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
];

let isRedirecting = false;

/**
 * Validates if a URL is safe to redirect to
 * @param {string} url 
 * @returns {boolean}
 */
export const isSafeUrl = (url) => {
  if (!url) return false;
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  
  try {
    const parsedUrl = new URL(url);
    return TRUSTED_DOMAINS.includes(parsedUrl.hostname);
  } catch (e) {
    return false;
  }
};

/**
 * Handles redirects with guards and logging
 * @param {string} targetUrl 
 * @param {string} reason 
 */
export const safeRedirect = (targetUrl, reason = 'unknown') => {
  if (isRedirecting) {
    console.warn(`[Navigation] Redirect to ${targetUrl} blocked: Another redirect is already in progress.`);
    return;
  }

  if (!isSafeUrl(targetUrl)) {
    // Fallback to safe login if an untrusted redirect is detected
    targetUrl = '/login';
  }

  isRedirecting = true;
  
  // Use window.location for hard redirects (like on 401)
  window.location.href = targetUrl;

  // Reset flag after a timeout in case the page doesn't actually reload
  setTimeout(() => {
    isRedirecting = false;
  }, 3000);
};

export const logNavigation = (path, context = 'default') => {
  // Silent in production
};
