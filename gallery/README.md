# Wedding 3D Gallery

This is a modern, interactive 3D wedding photo gallery built with Next.js, React Three Fiber, and Tailwind CSS. It supports multiple 3D spatial layouts and integrates seamlessly with Cloudflare R2 for asset delivery.

## Core Features & Implementation

### Technology Stack
- **Framework:** Next.js 16 (App Router) & React 19
- **3D Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), and React Three Drei (`@react-three/drei`)
- **Styling:** Tailwind CSS v4

### 3D Gallery Features
- **Dynamic Layout Modes:** The gallery supports 6 distinct 3D spatial layouts for viewing photos:
  - `constellation`
  - `editorial`
  - `filmFlow`
  - `orbit`
  - `tunnel`
  - `stack`
- **Interactive Controls:** Includes a custom `CameraController` for smooth 3D navigation and a `DisplayStyleSelector` to transition seamlessly between layout modes.
- **Intro Animation:** Features a unique `QuillingIntro` sequence before entering the main gallery.
- **Optimized Texture Loading:** Custom texture queuing system to manage concurrent loading and cache memory for high-resolution images.

### Asset Management & CDN Integration (Cloudflare R2)
The project includes a robust asset management system to serve images via a CDN instead of bundling them locally:
- **`r2:upload` (`scripts/upload-to-r2.mjs`):** Uploads local thumbnails and full-resolution WebP images to a Cloudflare R2 (S3-compatible) bucket. It then regenerates `public/photos-normalized.json` to point the app to the CDN URLs.
- **`r2:restore` (`scripts/restore-local-urls.mjs`):** Reverts `photos-normalized.json` to use local `/images/...` paths for local offline development.
- **`r2:dry-run`:** Simulates the upload process to check which files will be synced.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Cloudflare R2 Configuration

To upload your assets to R2, you must set the following environment variables (e.g., in `.env.local` or `.env.r2`):

```bash
export R2_ACCOUNT_ID="your_account_id"
export R2_ACCESS_KEY_ID="your_access_key"
export R2_SECRET_ACCESS_KEY="your_secret_key"
export R2_PUBLIC_URL="https://pub-XXXX.r2.dev"
export R2_BUCKET_NAME="wedding-gallery" # Optional
```

Once configured, run:
```bash
npm run r2:upload
```

## Deployment

This Next.js app can be deployed anywhere that supports Node.js or easily on [Vercel](https://vercel.com/new). Ensure you upload the images to your CDN (R2) before deploying to production to minimize bundle size.
