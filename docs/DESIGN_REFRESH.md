# Website refresh

The patient website and `/solutions/dental` sales page now use a bright white, teal, and mint design with bold Inter typography and locally stored African-focused imagery. Shared headers, service pages, team profiles, and booking entry points follow the same visual style. Existing clinic configuration and booking/chat APIs remain in use.

The homepage has a new photo-led hero, a quick treatment selector that carries the choice into booking, accessible treatment tabs, a family-care photo section, team cards, an interactive assistant preview, and clearer calls to action. The booking page uses a focused two-column layout on desktop and brings the form forward on mobile. The mobile drawer is wider, and the floating chat launcher is more compact on small screens.

Custom clinic brand colors remain supported. The legacy default is refreshed to the new teal on the public website. Keyboard focus, reduced-motion support, and mobile layouts are retained.

## Sales inquiries

The sales page now explains the product benefits, shows illustrative workflow previews, links to the working demo and dashboard, and presents the existing Starter and Professional packages.

The inquiry form uses the existing lead endpoint, marks its service as `AI receptionist — business inquiry`, and stores the practice, package interest, and message in lead notes. Find these in **Dashboard → Leads**. The form saves a request; it does not send email or reserve a meeting. It provides validation, loading, success, and retry states.

Set `NEXT_PUBLIC_AGENCY_EMAIL` to show the business email. Set `NEXT_PUBLIC_AGENCY_CALENDAR_URL` to connect sales buttons to a real calendar. Without a calendar, the buttons lead to the inquiry form. There is no placeholder email destination.

## Imagery

Seven images were created with built-in ImageGen and converted to WebP without changing their composition. The local assets total approximately 706 KB. Prompts and filenames are documented in [IMAGE_ASSETS.md](IMAGE_ASSETS.md). Demo portraits remain clearly identified as fictional and AI-generated. Unused original stock assets are preserved.

## Validation

- Production build passed, including TypeScript and route generation.
- ESLint passed with no errors or warnings. Three existing JSX escaping errors and two unused bindings were also corrected.
- HTTP checks passed for 16 public routes, including all five treatment pages.
- Business inquiry creation and invalid-email rejection passed through the frontend API proxy.
- AI chat answered a practice question; appointment availability returned slots.
- All seven WebP assets and the responsive Next.js image optimizer returned successfully.
- Rendered-page checks confirmed African image references and removal of the placeholder sales email.
- API checks used an isolated demo database with simulated messaging and the scheduler disabled.
- Reviewed the production build in headless Chrome on desktop and mobile, including the homepage, sales page, booking page, treatment section, family-care section, final CTA, and mobile navigation.
- Checked five public pages at widths of 360, 390, 768, 1024, and 1440 pixels; none had horizontal overflow.
- Verified treatment tabs with pointer and keyboard input, booking service preselection and available times, mobile menu navigation and dismissal, and business inquiry submission and confirmation.
- Repeated rapid browser test runs reached the existing clinic API rate limit; functional checks passed. Production review showed no React hydration errors (an earlier development screenshot warning was caused by the test runner hiding input carets before hydration).
- A final production smoke check passed with no browser console or runtime errors and confirmed the mobile drawer's intended width and dismissal.

Preview captures are in [screenshots/refresh-desktop.png](screenshots/refresh-desktop.png), [screenshots/refresh-mobile.png](screenshots/refresh-mobile.png), and [screenshots/refresh-sales.png](screenshots/refresh-sales.png).

The website remains a fictional practice demo. Replace demo practice information and configure the real sales destination before a public business launch.
