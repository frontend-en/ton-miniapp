import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { createTonAppKit } from './ton';
import { getTelegramUserLabel, initTelegramWebApp } from './tg';

function guessManifestUrl() {
  return `${window.location.origin}/tonconnect-manifest.json`;
}

function shortenAddress(addr: string) {
  if (!addr) return '';
  if (addr.length <= 18) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-8)}`;
}

type StatusKind = 'idle' | 'working' | 'ok' | 'error';

function statusKindFromText(text: string): StatusKind {
  const t = (text || '').toLowerCase();
  if (!t || t === 'idle') return 'idle';
  if (t.includes('failed') || t.includes('error') || t.includes('denied') || t.includes('forbidden')) return 'error';
  if (t.includes('connected')) return 'ok';
  return 'working';
}

export default function App() {
  const [tgUser] = useState(() => getTelegramUserLabel());
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('idle');

  useEffect(() => {
    initTelegramWebApp();
  }, []);

  const manifestUrl = useMemo(() => guessManifestUrl(), []);
  const appKit = useMemo(() => createTonAppKit(manifestUrl), [manifestUrl]);

  const kind = statusKindFromText(status);

  const connect = async () => {
    setStatus('opening wallet…');
    try {
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
    } catch (e: unknown) {
      const err = e as { message?: string };
      setStatus(`connect failed: ${err?.message || String(e)}`);
    }
  };

  const disconnect = async () => {
    setStatus('disconnecting…');
    try {
      // @ts-expect-error (alpha API)
      await appKit.disconnect?.();
      setAddress('');
      setStatus('disconnected');
    } catch (e: unknown) {
      const err = e as { message?: string };
      setStatus(`disconnect failed: ${err?.message || String(e)}`);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setStatus('address copied');
      window.setTimeout(() => setStatus('connected'), 1000);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setStatus(`copy failed: ${err?.message || String(e)}`);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div className="brand">
            <div className="brandMark" aria-hidden />
            <div>
              <h1 className="hTitle">TON Mini App</h1>
              <p className="hSub">Testnet • Connect wallet and show address</p>
            </div>
          </div>
          <div className="badge">Built with AppKit (alpha)</div>
        </header>

        <div className="grid">
          <section className="card">
            <div className="cardInner">
              <h2 className="cardTitle">Wallet</h2>
              <p className="cardText">Connect a TON wallet inside Telegram. We’ll display your address here.</p>

              <div className="kv">
                <div className="kvRow">
                  <div className="k">Telegram</div>
                  <div className="v">{tgUser || '—'}</div>
                </div>

                <div className="kvRow">
                  <div className="k">Manifest</div>
                  <div className="v mono">{manifestUrl}</div>
                </div>
              </div>

              <div className="actions">
                <button className="btn btnPrimary" onClick={connect}>
                  Connect wallet
                </button>
                <button className="btn btnDanger" onClick={disconnect} disabled={!address}>
                  Disconnect
                </button>
              </div>

              <div className="toast">
                <span className="pill">
                  <span
                    className={[
                      'dot',
                      kind === 'ok' ? 'dotOk' : '',
                      kind === 'working' ? 'dotWarn' : '',
                      kind === 'error' ? 'dotErr' : '',
                    ].join(' ')}
                  />
                  <span>{status}</span>
                </span>
              </div>

              <p className="footer">
                Tip: open this app from Telegram to test the real WebApp context.
              </p>
            </div>
          </section>

          <aside className="smallCard">
            <div className="smallCardInner">
              <h2 className="cardTitle">Address</h2>
              <p className="cardText">Your wallet address will appear after connection.</p>

              <div style={{ marginTop: 12 }}>
                <div className="copyRow">
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>
                    {address ? shortenAddress(address) : '—'}
                  </div>
                  <button className="btn copyBtn" onClick={copyAddress} disabled={!address}>
                    Copy
                  </button>
                </div>

                {address ? (
                  <div className="mono" style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>
                    {address}
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
