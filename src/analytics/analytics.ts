export const MEASUREMENT_ID = 'G-9QF4VMGV2Y';
export const CONSENT_KEY = 'afs.analytics-consent.v1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
type Choice = 'granted' | 'denied';
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    'ga-disable-G-9QF4VMGV2Y'?: boolean;
  }
}
let choice: Choice | null = null;
let initialized = false;
let lastPath = '';

export function readConsent(): Choice | null {
  try {
    const record = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    return record?.version === 1 && ['granted', 'denied'].includes(record.choice)
      && typeof record.at === 'number' && record.at <= Date.now() && Date.now() - record.at < MAX_AGE
      ? record.choice : null;
  } catch { return null; }
}

function clearCookies() {
  const domains = ['', window.location.hostname, `.${window.location.hostname}`, '.annafilippi.studio'];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
    }
  }
}

export function applyConsent(next: Choice | null) {
  choice = next;
  if (next !== 'granted') {
    window['ga-disable-G-9QF4VMGV2Y'] = true;
    clearCookies();
    if (initialized) {
      // A fresh document removes Google's listeners/timers as well as its script.
      // Do not send a denied consent ping in Basic Consent Mode.
      window.dataLayer = [];
      window.gtag = () => undefined;
      document.getElementById('afs-ga4')?.remove();
      window.location.reload();
    }
  }
}

export function saveConsent(next: Choice) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, choice: next, at: Date.now() })); }
  catch { /* Storage unavailable: consent applies only to this document. */ }
  applyConsent(next);
}

export function trackPage(path: string, title: string) {
  if (choice !== 'granted') return;
  const url = window.location.origin + path;
  if (!initialized) {
    initialized = true;
    window['ga-disable-G-9QF4VMGV2Y'] = false;
    window.dataLayer = window.dataLayer || [];
    // Google’s command queue requires Arguments objects, not nested arrays.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer!.push(arguments); };
    const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
    window.gtag('consent', 'default', denied);
    window.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 15552000, cookie_update: false,
      page_location: url, page_referrer: '', page_title: title,
    });
    const script = document.createElement('script');
    script.id = 'afs-ga4';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
  if (lastPath === path) return;
  window.gtag!('set', { page_location: url, page_title: title, page_referrer: lastPath ? window.location.origin + lastPath : '' });
  window.gtag!('event', 'page_view', { send_to: MEASUREMENT_ID, page_location: url, page_title: title });
  lastPath = path;
}
