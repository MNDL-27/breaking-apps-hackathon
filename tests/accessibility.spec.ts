import { test, expect } from '@playwright/test';
import { runSteps } from 'passmark';

// ─── 1. Form inputs have labels ──────────────────────────────────────────────
test('Auth form inputs have accessible labels or placeholders', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Auth form accessibility — input labels',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
    ],
    assertions: [
      { assertion: 'The email input has an associated label, aria-label, or placeholder text that identifies it as an email field' },
      { assertion: 'The password input has an associated label, aria-label, or placeholder text that identifies it as a password field' },
    ],
    test,
    expect,
  });
});

// ─── 2. Page has proper language attribute ────────────────────────────────────
test('Page has correct lang attribute for screen readers', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Language attribute verification',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
    ],
    assertions: [
      { assertion: 'The HTML element has a lang attribute set to "en" or another appropriate language code — it is not missing or empty' },
    ],
    test,
    expect,
  });
});

// ─── 3. Login button has descriptive text ────────────────────────────────────
test('Login button has descriptive accessible text', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Button accessibility check',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
    ],
    assertions: [
      { assertion: 'The login or sign-in button has visible text or an aria-label that describes its action — it is not an empty button or icon-only button without alternative text' },
    ],
    test,
    expect,
  });
});

// ─── 4. Color contrast readability ───────────────────────────────────────────
test('Auth page text is readable with sufficient contrast', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Color contrast readability check',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
    ],
    assertions: [
      { assertion: 'The text on the auth page — including labels, headings, and form field text — is readable against its background and does not appear as very light text on a light background or very dark text on a dark background' },
    ],
    test,
    expect,
  });
});

// ─── 5. Focus management on auth form ────────────────────────────────────────
test('Auth form has proper focus management and visible focus indicators', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Focus management accessibility',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
      { description: 'Click on the email input field to focus it' },
    ],
    assertions: [
      { assertion: 'The email input field shows a visible focus indicator such as a border highlight, outline, or glow effect' },
    ],
    test,
    expect,
  });
});
