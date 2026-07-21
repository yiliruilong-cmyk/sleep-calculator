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
