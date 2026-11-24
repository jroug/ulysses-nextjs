# Ulysses Next.js homepage

A small Next.js App Router frontend matching `../html/index.html`. The homepage `/` and About page `/about-us/` are implemented. Runtime dependencies are Next.js, React and React DOM; TypeScript and Node/React type definitions are development dependencies; styling reuses the HTML homepage CSS and local Lato fonts.

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
CMS_DATA_URL=https://headless.ulyssessailing.gr/wp-content/data/
FRONTEND_BASE_URL=https://www.ulyssessailing.gr
```

For Vercel, use `nextjs` as the project root and import `.env` into the project's Environment Variables for the intended environments before deploying. `.env` and `.env.local` are ignored by Git; `.env.example` documents the same non-secret settings. No `NEXT_PUBLIC_` variables are required.

The frontend fetches `CMS_DATA_URL/pages.json` (with a single slash) and the homepage JSON referenced by that manifest over HTTPS. Requests are server-side and use `cache: 'no-store'`; WordPress saving/exporting updates the next frontend request without a Vercel rebuild. Missing/invalid exports cause a clear server error rather than silently serving stale local content. Media URLs use `CMS_BASE_URL`. Links to pages not yet built use normal production routes on `FRONTEND_BASE_URL`, not `.html` filenames.

The live `https://headless.ulyssessailing.gr/wp-content/data/pages.json` endpoint returned HTTP 404 during verification. Upload/generate the CMS JSON exports and ensure the manifest and its referenced files are publicly accessible before expecting the deployed homepage to load.

`.env.local` uses only local HTTP URLs: `CMS_DATA_URL=http://localhost/GitHub/ulysses/headless-cms/wp-content/data/`, `CMS_BASE_URL=http://localhost/GitHub/ulysses/headless-cms`, `HTML_BASE_URL=http://localhost/GitHub/ulysses/html` and `FRONTEND_BASE_URL=http://localhost:3000`. Both local and production environments fetch JSON over HTTP(S); no filesystem data directory is used. Restart Next.js after changing environment variables. Import only `.env` into Vercel, not `.env.local`.

## Content

`lib/cms.ts` fetches `pages.json`, locates its homepage entry and loads that page's JSON. It does not hardcode page ID 8. The homepage is server-rendered on every request, so refreshing after a WordPress export uses the latest data without rebuilding Next.js.

The slider title/subtitle/images, intro, boat rows, contact section, reviews/widget area and eSIM section use the exported ACF fields. Logos, copyright and social links use Ulysses Options. Metadata uses the exported AIOSEO SEO/Facebook/Twitter values, including the configured frontend canonical URL. CMS rich HTML is rendered as trusted administrator-authored content; do not give untrusted users permission to insert arbitrary HTML/scripts into those CMS fields.

The two currently empty boat image fields (X46 and JPK 48 FC) use gray placeholders. Selecting images in the CMS automatically replaces those fallbacks. The award badge, decorative background, fonts and favicon reuse local HTML assets. The CMS widget field is currently empty, so no hardcoded guest reviews are shown. Supplied CMS spelling and text are preserved.

Header navigation comes from `navigation.json`, exported from the WordPress menu assigned to Main Navigation. Labels, order, custom links, targets and dropdown hierarchy are CMS-controlled. Internal links under the CMS base URL become frontend-relative routes; external links retain their destinations. No hardcoded menu or boat-derived submenu is used. Boat buttons still preserve their CMS `button_link` unchanged. The eSIM QR reference uses the bundled WebP instead of the obsolete HTML image path.

## Files

- `app/(site)/page.tsx`: homepage and metadata.
- `app/layout.tsx` / `app/globals.css`: document and reference styling.
- `lib/cms.ts`: JSON loading, media and legacy-link helpers.
- `components/Slideshow.tsx`: play/pause, delayed slide loading and reduced-motion support.
- `components/Navigation.tsx`: mobile menu and yacht dropdown.
- `public/assets/`: reference images, background and fonts.

## Validation

Production build passed. HTTP checks confirmed the homepage renders the CMS heading, all four boats, options copyright and AIOSEO metadata; image alt text and local fallback assets were checked. CMS media and representative local image/font URLs returned HTTP 200. Browser-host access was unavailable, so interactive and visual browser verification could not be completed.

Production configuration verification: Next.js production build passed without needing CMS data at build time. Mocked integration checks verified both remote JSON fetch URLs, no-store behavior, production media/navigation URLs and explicit 404 handling. The live CMS data endpoint is currently unavailable (404), so live content rendering on the production CMS could not be verified.

## Missing CMS images

Images supplied by WordPress render normally, including the slider, logos and rich-text images. Boat rows without a CMS image use a gray placeholder instead of a hardcoded yacht-photo fallback. Selecting an image in WordPress and saving the page replaces the placeholder on the next frontend request. Reference decorations (background, award and favicon) are retained.

## TypeScript

All application and component source uses `.ts` or `.tsx`. `lib/types.ts` defines the WordPress export contracts, media, SEO, homepage fields and component data. Strict checking is enabled with JavaScript excluded; `next-env.d.ts` is generated by Next.js. Run `npm run typecheck` to generate route types and check the project, or `npm run build` to type-check and create the production build. Both checks passed after conversion.

## WordPress navigation

Assign your menu under Appearance → Menus → Main Navigation. Saving the menu creates/updates `wp-content/data/navigation.json`; the header fetches it over HTTP with no-store caching, so no frontend rebuild is needed for subsequent menu edits. Nested dropdowns support desktop hover and keyboard/click toggles, plus mobile expansion. The active link uses the current Next.js pathname. The live CMS must have the updated Ulysses Custom Code plugin and a generated `navigation.json` before this frontend version is deployed.

## Not-found page

`app/not-found.tsx` provides the full-screen ocean 404 with a warning icon and Return to Home link. It includes the shared CMS header, with a local logo fallback if CMS loading fails. The footer and funding banner remain hidden. The root layout supplies the shared background; the `(site)` route-group layout supplies header/footer/navigation for regular pages. Missing URLs return HTTP 404 and noindex. TypeScript, production build and HTTP checks passed, including HTTP 200 for the regular homepage after the layout extraction.

## About page

`app/(site)/[...slug]/page.tsx` follows the HTML About layout and resolves `/about-us/` through the CMS manifest. Its title, hero image/subtext and biography come from `page.title`, `acf.hero_section` and the rendered WordPress editor content. Missing hero images use a gray placeholder. AIOSEO metadata uses the same typed adapter as the homepage (`lib/metadata.ts`). Shared site layout/header/footer/navigation are reused, with no ESPA banner on About. Missing unpublished About pages use the custom 404.

`lib/cms.ts` now exposes `getSiteData()` for shared options/navigation independently of homepage content and `getPageByPath()` for manifest-based page loading. Type checking, production build and HTTP checks passed for the About content, hero, SEO, navigation and shared layout; the homepage also remains HTTP 200.

## Generic CMS page template

`app/(site)/[...slug]/page.tsx` handles every non-homepage URL, including nested paths, by looking up the exact published page path in the CMS manifest. About is now an instance of this template; no About-specific route or page ID remains. The template uses the CMS page title, optional `hero_section`, editor HTML and AIOSEO metadata. Missing hero images use a gray placeholder. Saving/exporting another published CMS page makes its path available without adding a Next.js route or rebuilding. The homepage keeps its dedicated layout and ESPA banner.

`app/(site)/not-found.tsx` supplies the shared-layout 404 content for unknown CMS paths. TypeScript checks and the production build passed; HTTP checks confirmed the About page returns 200 and unknown single/nested paths return 404.

## Media URLs

Images load directly from WordPress uploads. `CMS_BASE_URL` adjusts exported CMS media URLs for local/production environments. There is no `/media/` proxy rewrite.
