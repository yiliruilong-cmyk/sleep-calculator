# Sleep Calculator

Sleep Calculator is an English sleep planning website centered on a simple calculator and a personalized wind-down routine.

## MVP Positioning

The first version focuses on one clear search intent:

> Find the best bedtime or wake-up time based on sleep cycles and a simple nightly routine.

The product should not act as a medical diagnosis tool. It provides general planning guidance only.

## Core Features

- Sleep Calculator
- Bedtime Calculator
- Wake-up Time Calculator
- Sleep Cycle Options
- Personalized Wind-down Routine
- Sleep Habit Score
- 7-Day Better Sleep Plan
- Google Sign-In
- Sleep education and FAQ content

## Primary SEO Keyword

`Sleep Calculator`

## Supporting Keywords

- Bedtime Calculator
- Sleep Cycle Calculator
- Wake Up Time Calculator
- What Time Should I Go To Bed
- How to Get Better Sleep
- What Causes Lack of Sleep

## Current Status

Initial product planning repository.

See [docs/mvp-requirements.md](docs/mvp-requirements.md) for the detailed MVP requirements.

## Cloudflare Pages Deployment

This project is configured as a static Next.js export for Cloudflare Pages.

Build command:

```bash
npm run build
```

Build output directory:

```text
out
```

GitHub Actions deployment requires these repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Cloudflare Pages project name:

```text
sleep-calculator
```

## Google Sign-In

The site uses Google Identity Services on the client side. Create an OAuth 2.0
Client ID in Google Cloud Console, then set this environment variable in
Cloudflare Pages:

```text
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Authorized JavaScript origins should include:

```text
https://sleepcalculator.life
https://www.sleepcalculator.life
https://sleep-calculator-7lj.pages.dev
```

This MVP stores the signed-in user's basic profile in browser local storage. Add
server-side token verification before using Google Sign-In for paid access or
private user data.

## PayPal Sandbox Checkout

PayPal checkout uses Cloudflare Pages Functions so the client secret stays on
the server side. Configure these Cloudflare Pages environment variables:

```text
PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-paypal-sandbox-client-secret
PAYPAL_ENVIRONMENT=sandbox
```

Runtime API routes:

```text
/api/paypal/config
/api/paypal/create-order
/api/paypal/capture-order
```

The MVP records a successful one-time payment as a 30-day browser-local access
marker. Before using this for production access, store entitlements in a
server-side database and bind them to the signed-in Google account.
