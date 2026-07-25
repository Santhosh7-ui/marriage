# Wedding 3D Gallery

This is a modern, interactive 3D wedding photo gallery built with Next.js, React Three Fiber, and Tailwind CSS. It supports multiple 3D spatial layouts and integrates seamlessly with Cloudflare R2 for asset delivery.

## Core Features & Implementation

### Technology Stack
- **Framework:** Next.js 16 (App Router) & React 19
- **3D Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), and React Three Drei (`@react-three/drei`)
- **Styling:** Tailwind CSS v4 & Vanilla CSS

### 3D Gallery & Navigation Features
- **Dynamic View Modes:** Seamlessly switch between a custom CSS 3D Carousel and a Curved Filmstrip view.
- **Redesigned Navigation Header:**
  - Modern, spacious design with fixed height (`h-24 md:h-28`) and perfect vertical alignment.
  - Active navigation links highlighted with a vibrant **neon gold glow** (`#d4af37` text-shadow).
  - Hovering over nav items triggers the same high-end neon gold glow transition.
  - Interactive white pill action button dynamically changes action based on context (e.g. toggling carousel/curved mode, returning to gallery, or entering).
- **Interactive Multi-Album Support:**
  - Supports separate dynamic albums: **3D Wedding Album** and **3D Reception Album**.
  - Renders dynamically from Cloudflare R2 based on route search parameters.
  - Pages are loaded asynchronously inside React `<Suspense>` boundaries.
  - 3D Carousel cards feature elegant bottom details overlays displaying formatted image titles and subtitle badges, now with enhanced padding and spacing.
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
