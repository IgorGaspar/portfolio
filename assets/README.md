# assets

Build-time inputs that must not be served from `public/`.

- `og-neural.jpg`: 1200×630 crop of `public/media/neural-dark.avif`, used by
  `app/[locale]/opengraph-image.tsx` (Satori cannot decode AVIF). Regenerate it when the
  fallback changes:

  ```
  node -e "require('sharp')('public/media/neural-dark.avif').resize(1200,630,{fit:'cover'}).jpeg({quality:80}).toFile('assets/og-neural.jpg')"
  ```
