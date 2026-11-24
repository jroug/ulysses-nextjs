# Ulysses Next.js homepage

A small Next.js App Router frontend matching `../html/index.html`. Only `/` is implemented. The only dependencies are Next.js, React and React DOM; styling reuses the HTML homepage CSS and local Lato fonts.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm start`.

## Configuration

`.env` and `.env.example` contain production values; `.env.local` overrides them for local development:

```dotenv
CMS_BASE_URL=https://headless.ulyssessailing.gr
CMS_DATA_URL=https://headless.ulyssessailing.gr/data/
FRONTEND_BASE_URL=https://www.ulyssessailing.gr
```

For Vercel, use `nextjs` as the project root and import `.env` into the project's Environment Variables for the intended environments before deploying. `.env` and `.env.local` are ignored by Git; `.env.example` documents the same non-secret settings. No `NEXT_PUBLIC_` variables are required.

The frontend fetches `CMS_DATA_URL/pages.json` (with a single slash) and the homepage JSON referenced by that manifest over HTTPS. Requests are server-side and use `cache: 'no-store'`; WordPress saving/exporting updates the next frontend request without a Vercel rebuild. Missing/invalid exports cause a clear server error rather than silently serving stale local content. Media URLs use `CMS_BASE_URL`. Links to pages not yet built use normal production routes on `FRONTEND_BASE_URL`, not `.html` filenames.

The live `https://headless.ulyssessailing.gr/data/pages.json` endpoint returned HTTP 404 during verification. Upload/generate the CMS JSON exports and ensure the manifest and its referenced files are publicly accessible before expecting the deployed homepage to load.

`.env.local` uses only local HTTP URLs: `CMS_DATA_URL=http://localhost/GitHub/ulysses/headless-cms/data/`, `CMS_BASE_URL=http://localhost/GitHub/ulysses/headless-cms`, `HTML_BASE_URL=http://localhost/GitHub/ulysses/html` and `FRONTEND_BASE_URL=http://localhost:3000`. Both local and production environments fetch JSON over HTTP(S); no filesystem data directory is used. Restart Next.js after changing environment variables. Import only `.env` into Vercel, not `.env.local`.

## Content

`lib/cms.js` fetches `pages.json`, locates its homepage entry and loads that page's JSON. It does not hardcode page ID 8. The homepage is server-rendered on every request, so refreshing after a WordPress export uses the latest data without rebuilding Next.js.

The slider title/subtitle/images, intro, boat rows, contact section, reviews/widget area and eSIM section use the exported ACF fields. Logos, copyright and social links use Ulysses Options. Metadata uses the exported AIOSEO SEO/Facebook/Twitter values, including the configured frontend canonical URL. CMS rich HTML is rendered as trusted administrator-authored content; do not give untrusted users permission to insert arbitrary HTML/scripts into those CMS fields.

The two currently empty boat image fields (X46 and JPK 48 FC) use matching local HTML photos, selected by boat identity rather than row order. Selecting images in the CMS automatically replaces those fallbacks. The award badge, decorative background, fonts and favicon reuse local HTML assets. The CMS widget field is currently empty, so no hardcoded guest reviews are shown. Supplied CMS spelling and text are preserved.

Navigation labels/layout follow the HTML reference; yacht submenu labels and destinations come from the boat rows. Known links to pages not yet implemented use the existing production website (or local HTML site when explicitly configured). The eSIM QR reference uses the bundled WebP instead of the obsolete HTML image path. Remaining rich-text links and images retain their CMS values unless the CMS origin is rebased.

## Files

- `app/page.js`: homepage and metadata.
- `app/layout.js` / `app/globals.css`: document and reference styling.
- `lib/cms.js`: JSON loading, media and legacy-link helpers.
- `components/Slideshow.js`: play/pause, delayed slide loading and reduced-motion support.
- `components/Navigation.js`: mobile menu and yacht dropdown.
- `public/assets/`: reference images, background and fonts.

## Validation

Production build passed. HTTP checks confirmed the homepage renders the CMS heading, all four boats, options copyright and AIOSEO metadata; image alt text and local fallback assets were checked. CMS media and representative local image/font URLs returned HTTP 200. Browser-host access was unavailable, so interactive and visual browser verification could not be completed.

Production configuration verification: Next.js production build passed without needing CMS data at build time. Mocked integration checks verified both remote JSON fetch URLs, no-store behavior, production media/navigation URLs and explicit 404 handling. The live CMS data endpoint is currently unavailable (404), so live content rendering on the production CMS could not be verified.
