// Paste the real review link copied from the Google Business Profile here.
// Empty or invalid links keep the entire invitation hidden. No Google script is loaded.
export const reviews = {
  googleReviewUrl: '',
};

export function googleReviewHref(value = reviews.googleReviewUrl): string | null {
  try {
    const url = new URL(value.trim());
    const allowedHosts = ['g.page', 'maps.app.goo.gl', 'search.google.com', 'google.com', 'www.google.com', 'maps.google.com'];
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)) return null;
    if (url.pathname === '/' && !url.search) return null;
    return url.href;
  } catch {
    return null;
  }
}
