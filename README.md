# Breaking Apps Hackathon — Passmark Test Suite

A comprehensive AI-powered regression test suite for [protik.eu.org](https://protik.eu.org), built with [Passmark](https://passmark.dev) for the [Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things).

## What is this?

This project tests every user-facing flow on **protik.eu.org** — a full-stack portfolio website with an integrated CMS admin panel. Instead of writing brittle Playwright selectors, we describe tests in plain English using Passmark, and AI executes them via Playwright.

## Test Coverage

### Auth & Navigation (`tests/dockerdash.spec.ts`) — 12 tests

| # | Test | What it covers |
|---|------|----------------|
| 1 | Homepage loads and displays portfolio content | Page rendering, key elements |
| 2 | Navigation menu links are present and functional | Nav traversal |
| 3 | Auth portal displays login form | Form element visibility |
| 4 | Failed login — invalid email format | Input validation |
| 5 | Failed login — wrong credentials | Auth error handling |
| 6 | Failed login — empty fields | Required field validation |
| 7 | Failed login — email but empty password | Partial field validation |
| 8 | Auth portal UI elements and branding | Labels, placeholders, headings |
| 9 | Nonexistent route handling | 404 / fallback routing |
| 10 | Cookie consent banner dismissal | Consent UX |
| 11 | Dashboard blocks unauthenticated access | Auth gating |
| 12 | Back to home link from auth page | Navigation flow |

### Accessibility (`tests/accessibility.spec.ts`) — 5 tests

| # | Test | What it covers |
|---|------|----------------|
| 1 | Form inputs have accessible labels | Label/placeholder presence |
| 2 | Page has correct lang attribute | Screen reader compatibility |
| 3 | Login button has descriptive accessible text | Button accessibility |
| 4 | Auth page text has sufficient contrast | Readability |
| 5 | Auth form has visible focus indicators | Keyboard accessibility |

### Performance & Rendering (`tests/performance.spec.ts`) — 5 tests

| # | Test | What it covers |
|---|------|----------------|
| 1 | Homepage loads without significant delay | Load performance |
| 2 | Auth page loads and form is interactive | Form readiness |
| 3 | No broken images on homepage | Asset loading |
| 4 | Navigation between pages is smooth | Page transitions |
| 5 | Mobile viewport rendering | Responsive design |

**Total: 22 tests** across 3 spec files

## Setup

### Prerequisites

- Node.js 18+
- An OpenRouter API key (provided free when you register for the hackathon)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/breaking-apps-hackathon.git
cd breaking-apps-hackathon

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Create .env file with your API key
echo "OPENROUTER_API_KEY=sk-or-..." > .env
```

### Running Tests

```bash
# Run all tests
npx playwright test --project chromium

# Run a specific test file
npx playwright test tests/dockerdash.spec.ts --project chromium

# Run a specific test by name
npx playwright test --project chromium --grep "Homepage loads"

# View the HTML report
npx playwright show-report
```

## How Passmark Works

Passmark lets you write tests in plain English instead of dealing with CSS selectors and page objects:

```typescript
import { test, expect } from '@playwright/test';
import { configure, runSteps } from 'passmark';

// Configure Passmark to use OpenRouter as AI gateway
configure({
  ai: {
    gateway: 'openrouter',
  },
});

test.use({ headless: !!process.env.CI });

test('Failed login shows error', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Wrong credentials login attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Type "me@protik.eu.org" into the email input field' },
      { description: 'Type "wrongpassword" into the password input field' },
      { description: 'Click the Sign In button' },
    ],
    assertions: [
      { assertion: 'The page displays an error message indicating login failure' },
    ],
    test,
    expect,
  });
});
```

On the first run, AI agents execute each step via Playwright. Actions are cached to Redis for subsequent runs at native Playwright speed. When UI changes break a cached step, AI auto-heals by re-discovering the correct interaction.

## What I Learned

This test suite revealed several insights about testing web apps with AI:

1. **Plain English tests are more maintainable** — No more updating selectors when the UI changes
2. **AI-powered assertions catch subtle issues** — Like missing aria labels or poor contrast that traditional tests miss
3. **Auto-healing is real** — When a cached step fails, Passmark re-engages AI to find the correct element
4. **Assertion quality matters** — Specific, multi-layered assertions ("user stays on auth page AND error is shown") are more valuable than vague ones ("an error appears")

## Hackathon Details

- **Event**: [Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things)
- **Sponsor**: [Bug0](https://bug0.com)
- **Tool**: [Passmark](https://passmark.dev) — Open-source AI regression testing
- **Article**: [Link to Hashnode article] (coming soon)
- **Tag**: #BreakingAppsHackathon

## License

MIT
