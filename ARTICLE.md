# I Tested Every User Flow on My Web App with AI — Here's What I Found

*How I built a 22-test regression suite using plain English instead of CSS selectors — and what broke.*

---

## The Problem with Testing My Own App

I built a full-stack portfolio website with an integrated CMS admin panel at [protik.eu.org](https://protik.eu.org). Like most indie developers, I skipped writing end-to-end tests. Why? Because Playwright tests are painful to write and even more painful to maintain:

```typescript
// Traditional Playwright — brittle, selector-dependent
await page.locator('[data-testid="email-input"]').fill('test@example.com');
await page.locator('[data-testid="password-input"]').fill('password');
await page.locator('[data-testid="submit-button"]').click();
await expect(page.locator('.error-message')).toBeVisible();
```

Every time I changed a CSS class, renamed a component, or restructured my form, the tests broke. I'd spend more time fixing tests than building features.

Then I found **Passmark** — an open-source AI testing library that lets you write tests in plain English. No selectors. No page objects. Just describe what to test.

---

## What is Passmark?

[Passmark](https://passmark.dev) is built by the team behind [Bug0](https://bug0.com) and [Hashnode](https://hashnode.com). The idea is simple:

1. **Describe** your test steps in plain English
2. **AI executes** them via Playwright on the first run
3. **Actions are cached** to Redis for subsequent runs at native Playwright speed
4. **Auto-heals** when UI changes break a cached step

Here's what a test looks like:

```typescript
import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("Failed login shows error", async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: "Wrong credentials login attempt",
    steps: [
      { description: "Navigate to https://protik.eu.org/auth" },
      { description: "Dismiss any cookie consent banner if visible" },
      { description: 'Type "me@protik.eu.org" into the email input field' },
      { description: 'Type "wrongpassword123" into the password input field' },
      { description: "Click the Sign In button" },
    ],
    assertions: [
      { assertion: "The page displays an error message indicating login failure or invalid credentials — the user stays on the auth page" },
    ],
    test,
    expect,
  });
});
```

That's it. No `data-testid`, no `waitForSelector`, no hardcoded CSS selectors. Just English.

---

## Building the Test Suite

I entered the [Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things) with one goal: test every user-facing flow on my portfolio + CMS app. Here's what I built.

### Setup — 5 Minutes Flat

```bash
npm init playwright@latest breaking-apps-hackathon
cd breaking-apps-hackathon
npm install passmark dotenv
```

Created a `.env` file with the free OpenRouter API key from the hackathon:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

Configured Passmark in `playwright.config.ts`:

```typescript
import { configure } from "passmark";

dotenv.config({ path: path.resolve(__dirname, ".env") });

configure({
  ai: {
    gateway: "openrouter",  // Routes AI calls through OpenRouter
  },
});
```

Done. No separate Anthropic or Google API keys needed.

### What I Tested — 22 Tests Across 3 Categories

#### 🔐 Auth & Navigation (12 tests)

This is the heart of the suite. My app has an admin login portal at `/auth` that gates a CMS dashboard. I tested every way a login can fail — and succeed:

| Test | What it checks |
|------|----------------|
| Homepage loads and displays portfolio content | Basic page rendering |
| Navigation menu links work | SPA routing |
| Auth portal displays login form | Form element visibility |
| Failed login — invalid email format | Input validation |
| Failed login — wrong credentials | Auth error handling |
| Failed login — empty fields | Required field validation |
| Failed login — email but empty password | Partial validation |
| Auth portal UI elements and branding | Labels, placeholders, headings |
| Nonexistent route (404) handling | Fallback routing |
| Cookie consent banner dismissal | Consent UX |
| Dashboard blocks unauthenticated access | Auth gating |
| Back to home link from auth page | Navigation flow |

The key insight? **Assertion quality matters.** Compare these two assertions:

```typescript
// ❌ Weak — could pass even if the page is broken
{ assertion: "An error appears" }

// ✅ Strong — specific, multi-layered, falsifiable
{ assertion: "The page displays an error message indicating login failure or invalid credentials — the user stays on the auth page" }
```

Passmark uses **consensus assertions** — evaluated by multiple AI models independently. A third model breaks ties. So your assertions need to be precise enough that independent models agree on the result.

#### ♿ Accessibility (5 tests)

Traditional Playwright tests rarely check accessibility. With Passmark, it's just as easy as testing anything else:

```typescript
await runSteps({
  page,
  userFlow: "Auth form accessibility — input labels",
  steps: [
    { description: "Navigate to https://protik.eu.org/auth" },
    { description: "Dismiss any cookie consent or notification banner if visible" },
  ],
  assertions: [
    { assertion: "The email input has an associated label, aria-label, or placeholder text that identifies it as an email field" },
    { assertion: "The password input has an associated label, aria-label, or placeholder text that identifies it as a password field" },
  ],
  test,
  expect,
});
```

I tested:

- Form inputs have accessible labels or placeholders
- Page has correct `lang` attribute for screen readers
- Login button has descriptive accessible text
- Auth page text has sufficient color contrast
- Auth form has visible focus indicators for keyboard navigation

**What I found:** My auth form had proper `placeholder` attributes but was missing explicit `<label>` elements. The AI caught this because it checked for *both* labels and placeholders — a human tester might have assumed placeholders were "good enough."

#### ⚡ Performance & Rendering (5 tests)

- Homepage loads without significant delay
- Auth page loads and form is interactive
- No broken images on homepage
- Navigation between pages is smooth
- Mobile viewport rendering

**What I found:** The image test caught a lazy-loaded image that showed a blank space before scrolling into view. Not a bug per se, but something I wouldn't have noticed without an AI agent scrolling through the entire page.

---

## What Surprised Me

### 1. The AI Reads the DOM — Not Just Screenshots

When Passmark executes a step, it takes an **accessibility snapshot** of the page — the same tree that screen readers use. This means it understands semantic structure, not just visual layout. When I asked it to verify that inputs have labels, it checked for `<label>` elements, `aria-label` attributes, AND placeholder text — all three.

### 2. First Run is Slow, But That's the Point

The first run of each test takes 30-60 seconds per step because the AI is navigating the page, taking snapshots, and caching actions. But subsequent runs replay cached Playwright actions at native speed. The trade-off: invest time on the first run, get instant tests forever.

### 3. Auto-Healing is Real (When Redis is Configured)

I didn't have Redis configured during my initial runs (hence the warning in the logs). But the docs say that when a cached step fails because the UI changed, Passmark re-engages AI to discover the new element and updates the cache. No manual test maintenance.

### 4. Specificity in Assertions Pays Off

Vague assertions like "an error is shown" sometimes pass when they shouldn't — the AI might interpret a console error or a minor UI change as "an error." But specific assertions like "the page displays an error message about invalid credentials AND the user stays on the auth page" give the AI clear criteria to evaluate. The multi-model consensus system makes this even more reliable.

### 5. OpenRouter Makes It Zero-Friction

The hackathon provides free OpenRouter API credits. OpenRouter acts as a gateway — you don't need separate Anthropic, Google, or OpenAI API keys. One key, all models. This lowered the barrier to entry significantly.

---

## What Didn't Work

### API Rate Limits on Long Test Suites

Running all 22 tests sequentially takes a while because each step requires an API call on the first run. I hit rate limits when running too many tests too quickly. The solution: run with `--workers 1` and set generous timeouts (90-120 seconds per test).

### Step Caching Requires Redis

Without a Redis instance, every test run hits the AI API. This is fine for development but gets expensive for CI. I used a free [Upstash Redis](https://upstash.com) instance to enable caching — it's mentioned in the `.env.example` but I haven't configured it yet in my CI pipeline.

### Not a Replacement for Unit Tests

Passmark is great for end-to-end regression testing, but it won't replace your unit tests. It tests *user flows*, not individual functions. Use it alongside your existing test pyramid, not as a replacement.

---

## The Full Setup

**Repo:** [github.com/MNDL-27/breaking-apps-hackathon](https://github.com/MNDL-27/breaking-apps-hackathon)

```
breaking-apps-hackathon/
├── .env.example                    # Template for API keys
├── .github/workflows/playwright.yml
├── .gitignore
├── README.md
├── package.json
├── playwright.config.ts            # Passmark + OpenRouter config
└── tests/
    ├── dockerdash.spec.ts          # 12 auth & navigation tests
    ├── accessibility.spec.ts       # 5 accessibility tests
    └── performance.spec.ts         # 5 performance & rendering tests
```

To run it yourself:

```bash
git clone https://github.com/MNDL-27/breaking-apps-hackathon.git
cd breaking-apps-hackathon
npm install
npx playwright install --with-deps

# Add your OpenRouter API key
echo "OPENROUTER_API_KEY=sk-or-v1-..." > .env

# Run the tests
npx playwright test --project chromium

# View the report
npx playwright show-report
```

---

## Lessons Learned

1. **Plain English tests are more maintainable** — When my UI changes, I update the English description, not a selector chain
2. **AI assertions catch subtle issues** — Missing `<label>` elements, poor contrast, focus indicators — things traditional e2e tests never check
3. **Assertion quality is the differentiator** — Specific, multi-layered assertions produce reliable results; vague ones produce flaky ones
4. **Redis caching is essential for CI** — Without it, every run is a first run
5. **Start with critical flows** — Auth, navigation, and form validation first; accessibility and performance next

---

## Try It Yourself

If you're building web apps and not testing them, Passmark removes the biggest excuse: "writing tests takes too long." With plain English test steps, you can cover your critical user flows in an afternoon.

- ⭐ Star and fork: [github.com/bug0inc/passmark](https://github.com/bug0inc/passmark)
- 📖 Docs: [passmark.dev](https://passmark.dev)
- 🏆 Join the hackathon: [hashnode.com/hackathons/breaking-things](https://hashnode.com/hackathons/breaking-things)

---

*This project was built for the Breaking Apps Hackathon by Bug0 and Hashnode. #BreakingAppsHackathon*

*If you found this useful, follow me on [GitHub](https://github.com/MNDL-27) and check out my portfolio at [protik.eu.org](https://protik.eu.org).*
