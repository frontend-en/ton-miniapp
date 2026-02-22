import { AppKit, TonConnectConnector } from '@ton/appkit';

/**
 * TON Connect manifest must be accessible via HTTPS.
 * In production on Vercel it will be: https://<your-domain>/tonconnect-manifest.json
 */
export function createTonAppKit(manifestUrl: string) {
  const appKit = new AppKit({
    connectors: [
      new TonConnectConnector({
        tonConnectOptions: {
          manifestUrl,
        },
      }),
    ],
  });

  return appKit;
}
