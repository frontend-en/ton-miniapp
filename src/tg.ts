import WebApp from '@twa-dev/sdk';

export function initTelegramWebApp() {
  try {
    // Expands the webview and marks the app as ready.
    WebApp.ready();
    WebApp.expand();

    // Optional: match Telegram theme colors
    document.documentElement.style.background = WebApp.themeParams.bg_color || '#0b0b0b';
  } catch {
    // Not inside Telegram (e.g. local dev in browser)
  }
}

export function getTelegramUserLabel(): string {
  try {
    const u = WebApp.initDataUnsafe?.user;
    if (!u) return 'not in Telegram';
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
    const handle = u.username ? `@${u.username}` : '';
    return [name, handle].filter(Boolean).join(' ');
  } catch {
    return 'not in Telegram';
  }
}
