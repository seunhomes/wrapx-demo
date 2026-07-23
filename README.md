# WRAPX — Website Rebuild

Modern, dark, image-forward marketing site for **WRAPX** (professional car wrapping, Etobicoke / GTA).
Static site — plain HTML/CSS/JS, no build step.

- **Live demo:** _(GitHub Pages URL — added after deploy)_
- **Style reference:** sekanskin.com (black + Teko condensed headlines, image-forward)

## Files
- `index.html` — the page + SEO/GEO structured data
- `styles.css` — design system
- `script.js` — nav, reveals, GHL calendar + lead form, Instagram embed
- `images/` — hero + portfolio imagery
- `robots.txt`, `sitemap.xml` — SEO

---

## Connect GoHighLevel (Location ID: `yvbhY9lzSbHoq48QIOi5`)

Open `script.js` and fill the two values at the top:

### 1. Booking calendar
GHL → **Calendars** → open your calendar → **⋯ → Embed code**. Copy the `src` URL
(looks like `https://api.leadconnectorhq.com/widget/booking/XXXXXXXX`) and paste it into
`ghlCalendarUrl`. It renders inside the **Book** section automatically.

### 2. Lead-gen form → GHL
GHL → **Automation → Workflows** → new workflow → **Inbound Webhook** trigger → copy the URL
into `ghlLeadWebhook`. The form posts `name, phone, email, vehicle, service, msg, source,
location_id` into GHL. In the workflow, map those fields to Contact fields + create the contact.
_If left blank, the form falls back to opening the visitor's email app._

---

## Reviews (real Google data)
The **5.0 ★ / 68 reviews** badge is real (from the Google Business Profile) and wired into the
page + `AggregateRating` schema. To show the actual review **text**, drop a free Google-reviews
widget (Trustindex, Elfsight or Behold) embed into `#reviewsWidget` in `index.html` and remove its
`hidden` attribute. _Note: the current site only has review screenshots, so live quotes require the widget._

## Instagram
- The owner's FAQ video (`/p/DTbh-wxDuHg/`) is embedded in the **Wrapping 101** section via
  Instagram's official embed.
- Portfolio tiles currently use studio-style images and link to `@gtawrapx`. To show **real IG
  photos**: either (a) send 6–8 IG post URLs to embed, or (b) add a free feed widget
  (Behold/SnapWidget) into the portfolio grid.

## SEO / GEO built in
- `AutoBodyShop` LocalBusiness schema (NAP, geo, hours, services, area served, rating)
- `FAQPage` schema — helps Google rich results **and** AI answer engines (ChatGPT, Perplexity, AI Overviews)
- Open Graph + Twitter cards, canonical, geo meta, `robots.txt` (AI crawlers allowed), `sitemap.xml`
- Semantic headings, descriptive alt text, lazy-loaded images

### Verify before launch
- [ ] Confirm business **hours** (assumed Mon–Sat 10am–7pm from "Closes 7pm")
- [ ] Swap `canonical`/OG URLs if the live domain differs from `gtawrapx.com`
- [ ] Replace studio placeholder images with real WRAPX build photos
- [ ] Point the Google-reviews CTA at the exact Business Profile URL
