import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { createTonAppKit } from './ton';
import { getTelegramUserLabel, initTelegramWebApp } from './tg';

function guessManifestUrl() {
  // Vercel/production: use current origin.
  // Local dev: still works, but TON wallets may require HTTPS (manifest must be https for real wallets).
  return `${window.location.origin}/tonconnect-manifest.json`;
}

export default function App() {
  const [tgUser, setTgUser] = useState('');
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    initTelegramWebApp();
    setTgUser(getTelegramUserLabel());
  }, []);

  const manifestUrl = useMemo(() => guessManifestUrl(), []);
  const appKit = useMemo(() => createTonAppKit(manifestUrl), [manifestUrl]);

  const connect = async () => {
    setStatus('opening wallet…');
    try {
      // AppKit API is alpha; this is the typical flow: open connect UI and then read account.
      // If this method name changes, we’ll adjust after checking the exact AppKit docs/version.
      // @ts-expect-error (alpha API)
      await appKit.openConnectModal?.();

      // @ts-expect-error (alpha API)
      const acc = await appKit.getAccount?.();
      if (acc?.address) {
        setAddress(acc.address);
        setStatus('connected');
      } else {
        setStatus('connected (no address returned yet)');
      }
    } catch (e: any) {
      setStatus(`connect failed: ${e?.message || String(e)}`);
    }
  };

  const disconnect = async () => {
    setStatus('disconnecting…');
    try {
      // @ts-expect-error (alpha API)
      await appKit.disconnect?.();
      setAddress('');
      setStatus('disconnected');
    } catch (e: any) {
      setStatus(`disconnect failed: ${e?.message || String(e)}`);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 20 }}>
      <h2>TON Mini App (testnet)</h2>

      <p style={{ opacity: 0.8 }}>
        Telegram user: <b>{tgUser || '—'}</b>
      </p>

      <p style={{ opacity: 0.8, wordBreak: 'break-all' }}>
        Manifest URL: <code>{manifestUrl}</code>
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <button onClick={connect}>Connect wallet</button>
        <button onClick={disconnect} disabled={!address}>
          Disconnect
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Status</div>
        <div style={{ wordBreak: 'break-word' }}>{status || 'idle'}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Address</div>
        <div style={{ wordBreak: 'break-all' }}>{address || '—'}</div>
      </div>

      <hr style={{ margin: '24px 0', opacity: 0.2 }} />
      <p style={{ fontSize: 13, opacity: 0.75 }}>
        Note: TON AppKit is alpha; if the connect method names differ in your version, tell me what error you see and I’ll
        patch the integration.
      </p>
    </div>
  );
}
