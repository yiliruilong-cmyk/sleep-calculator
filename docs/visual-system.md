# Sleep Calculator Visual System

## Brand Position

Sleep Calculator is a practical sleep planning tool, not a wellness magazine or a medical product. The interface should feel calm, precise, and easy to act on.

Design keywords:

- Calm but not sleepy
- Data-backed but not clinical
- Friendly but not cute
- Useful before bedtime on mobile
- Trustworthy enough for payment and account flows

## Visual Direction

Use a quiet interface with clear calculator surfaces, strong time results, and restrained accent color. The product should look like a habit tool people can return to, not a one-off landing page.

Avoid:

- Heavy purple gradients
- Beige-only wellness palettes
- Large decorative blobs or ornamental backgrounds
- Oversized marketing sections on tool pages
- Nested cards inside cards

## Color System

Primary colors:

- Ink: main text and high-contrast action surfaces
- Slate: secondary text and borders
- Mist: quiet tool background
- Mint: sleep-positive action and progress
- Coral: plan, urgency, and conversion highlights
- Dusk: selected states and links
- Pollen: gentle warning or education highlights

Usage:

- Use Ink for primary buttons and result panels.
- Use Mint for positive action, score rings, and progress signals.
- Use Coral sparingly for paid plan prompts and urgency.
- Use Dusk for selected states and links, not as the dominant brand color.
- Use Pollen only for supporting notes, never as the main page background.

## Typography

Use a system sans-serif stack for speed and global language rendering.

Type roles:

- Page H1: 48-72px on desktop, 36-44px on mobile.
- Section H2: 24-32px.
- Card title: 18-22px.
- Body copy: 15-18px, relaxed line-height.
- UI labels: 13-15px, bold when actionable.
- Eyebrow text: uppercase only for English marketing labels; avoid forcing uppercase for CJK pages.

Rules:

- No negative letter spacing.
- Do not scale type with viewport width.
- Keep compact UI text smaller than hero text.

## Layout

Pages should feel like tools first:

- Navigation stays predictable and compact.
- The calculator should remain above the fold when possible.
- Result panels should be visually stronger than explanatory content.
- Long educational content belongs below the calculator or on separate pages.

Container:

- Max width: 1280px.
- Page padding: 16px mobile, 24px tablet, 32px desktop.
- Cards: 8px radius.
- Tool panels: 8px radius, visible border, subtle shadow.

## Components

Buttons:

- Primary: Ink background, white text.
- Positive CTA: Mint background, Ink text.
- Secondary: white or transparent background with Ink border.
- Paid CTA: Coral background only when conversion is the main action.

Cards:

- Use cards for repeated items, result panels, and framed tools.
- Do not put cards inside other decorative cards.
- Use Mist backgrounds for low-priority inner rows.

Forms:

- Inputs use white backgrounds, clear borders, and Dusk focus state.
- Time inputs should look as important as the calculator output.
- Native selects are fine for MVP speed.

Navigation:

- Brand on the left.
- Core product links centered on desktop.
- Account, language, and menu controls on the right.
- Do not use the nav as a marketing banner.

## Conversion Areas

Free pages should make the paid path visible but not noisy.

Primary paid entry:

- 7-day plan from calculator result

Secondary paid entries:

- Personalized routine PDF
- Sleep habit score worksheet
- Paid planner
- Notion tracker

Pricing should feel like a continuation of the tool result, not a separate sales page.

## Accessibility

- Keep text contrast high.
- Visible focus rings for keyboard users.
- Do not rely on color alone for selected states.
- Keep tap targets at least 40px tall.
- Avoid text over low-contrast backgrounds.

## Future UI Priorities

1. Convert repeated Tailwind patterns into small component classes.
2. Give the calculator a denser professional tool layout.
3. Create a stronger paid product page layout with side-by-side product previews.
4. Localize typography rules for CJK and Japanese pages.
5. Add product screenshots or generated assets once paid content is more mature.
