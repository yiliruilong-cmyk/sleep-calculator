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

The client stores the signed-in user's basic profile and credential locally for
MVP convenience. Pages Functions verify the Google credential before reading or
writing paid access.

## PayPal Checkout

PayPal checkout uses Cloudflare Pages Functions so the client secret stays on
the server side. Configure these Cloudflare Pages environment variables:

```text
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=sandbox # use live for production payments
```

Use PayPal sandbox credentials while testing. Before accepting real payments,
replace both PayPal credentials with Live app credentials and set
`PAYPAL_ENVIRONMENT=live` in Cloudflare Pages.

Paid access is stored in Cloudflare KV and bound to the verified Google account.
Create a KV namespace and bind it to Pages Functions:

```text
SLEEP_ACCESS_KV
```

Runtime API routes:

```text
/api/access/me
/api/paypal/config
/api/paypal/create-order
/api/paypal/capture-order
```
