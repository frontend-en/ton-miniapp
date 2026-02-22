# TON Telegram Mini App (React + Vite) — Testnet

This is a minimal Telegram Mini App project scaffolded with Vite + React + TypeScript, wired for TON AppKit.

## Local run

```bash
npm install
npm run dev
```

Open http://localhost:5173

> Wallet connection usually requires HTTPS for the TON Connect manifest. Local dev in a normal browser is for UI testing.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel.
3. After deploy, open:

- `https://<your-vercel-domain>/tonconnect-manifest.json`

Update `public/tonconnect-manifest.json` values to match your Vercel domain (url/iconUrl/etc).

## Telegram setup

- Create a bot via @BotFather
- Configure Mini App / Web App URL to your Vercel domain
- Open the Mini App from the bot menu button.

## Notes

- AppKit is alpha; APIs can change. If you see runtime errors around `openConnectModal/getAccount`, share the error and we’ll adapt.
