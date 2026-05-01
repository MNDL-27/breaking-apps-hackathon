import { test, expect } from '@playwright/test';
import { runSteps } from 'passmark';

// ─── 1. Homepage loads correctly ────────────────────────────────────────────
test('Homepage loads and displays portfolio content', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Homepage verification',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
      { description: 'Wait for the page to fully load' },
    ],
    assertions: [
      { assertion: 'The page displays content related to a portfolio or personal website — such as a name, about section, or projects' },
      { assertion: 'A navigation bar or header is visible at the top of the page' },
    ],
    test,
    expect,
  });
});

// ─── 2. Navigation menu works ───────────────────────────────────────────────
test('Navigation menu links are present and functional', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Navigation menu traversal',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
      { description: 'Click the first visible navigation link that is not the current page or section' },
    ],
    assertions: [
      { assertion: 'The page content changes after clicking the navigation link, showing a different section or page' },
    ],
    test,
    expect,
  });
});

// ─── 3. Auth portal loads and shows login form ──────────────────────────────
test('Auth portal displays a login form with email and password fields', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Auth portal form verification',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if it appears' },
    ],
    assertions: [
      { assertion: 'An email input field is visible on the page' },
      { assertion: 'A password input field is visible on the page' },
      { assertion: 'A login or sign-in button is visible' },
    ],
    test,
    expect,
  });
});

// ─── 4. Failed login — invalid email format ─────────────────────────────────
test('Failed login with invalid email format shows validation error', async ({ page }) => {
  test.setTimeout(120_000);

  await runSteps({
    page,
    userFlow: 'Invalid email format login attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
      { description: 'Type "not-an-email" into the email input field' },
      { description: 'Type "anypassword" into the password input field' },
      { description: 'Click the Sign In button' },
    ],
    assertions: [
      { assertion: 'The page displays a validation error or error message — the user is not redirected to a dashboard and remains on the auth page' },
    ],
    test,
    expect,
  });
});

// ─── 5. Failed login — wrong credentials ─────────────────────────────────────
test('Failed login with wrong credentials shows error', async ({ page }) => {
  test.setTimeout(120_000);

  await runSteps({
    page,
    userFlow: 'Wrong credentials login attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
      { description: 'Type "me@protik.eu.org" into the email input field' },
      { description: 'Type "wrongpassword123" into the password input field' },
      { description: 'Click the Sign In button' },
    ],
    assertions: [
      { assertion: 'The page displays an error message indicating login failure or invalid credentials — the user stays on the auth page' },
    ],
    test,
    expect,
  });
});

// ─── 6. Failed login — empty fields ─────────────────────────────────────────
test('Failed login with empty fields shows required field errors', async ({ page }) => {
  test.setTimeout(120_000);

  await runSteps({
    page,
    userFlow: 'Empty fields login attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
      { description: 'Click the Sign In button without entering any data' },
    ],
    assertions: [
      { assertion: 'The page displays an error or validation message, and the user is not logged in or redirected away from the auth page' },
    ],
    test,
    expect,
  });
});

// ─── 7. Failed login — empty password only ───────────────────────────────────
test('Failed login with email but empty password shows password required error', async ({ page }) => {
  test.setTimeout(120_000);

  await runSteps({
    page,
    userFlow: 'Missing password login attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
      { description: 'Type "test@example.com" into the email input field' },
      { description: 'Click the Sign In button without entering a password' },
    ],
    assertions: [
      { assertion: 'The page shows an error message and the user remains on the auth page — they are not logged in' },
    ],
    test,
    expect,
  });
});

// ─── 8. Auth portal UI elements ──────────────────────────────────────────────
test('Auth portal has expected UI elements and branding', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Auth portal UI element check',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Dismiss any cookie consent or notification banner if visible' },
    ],
    assertions: [
      { assertion: 'The page has a heading or title related to login, sign in, or admin authentication' },
      { assertion: 'The email input field has a visible label or placeholder text such as "Email" or "admin@example.com"' },
      { assertion: 'The password input field has a visible label or placeholder indicating it is for a password' },
    ],
    test,
    expect,
  });
});

// ─── 9. 404 / invalid route handling ─────────────────────────────────────────
test('Navigating to a nonexistent route shows appropriate page', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Invalid route handling',
    steps: [
      { description: 'Navigate to https://protik.eu.org/this-route-does-not-exist-at-all' },
    ],
    assertions: [
      { assertion: 'The page shows a 404 error message, a "page not found" indicator, or redirects to the homepage — it does NOT show a broken or blank white page' },
    ],
    test,
    expect,
  });
});

// ─── 10. Cookie consent banner ───────────────────────────────────────────────
test('Cookie consent banner is dismissible', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Cookie consent interaction',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
      { description: 'If a cookie consent banner, popup, or notification is visible, click the Accept, Agree, or OK button to dismiss it' },
    ],
    assertions: [
      { assertion: 'After interacting with the consent banner (or if no banner is present), the page content is visible and usable' },
    ],
    test,
    expect,
  });
});

// ─── 11. Dashboard redirect when not authenticated ──────────────────────────
test('Dashboard page redirects or blocks unauthenticated access', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Unauthenticated dashboard access attempt',
    steps: [
      { description: 'Navigate to https://protik.eu.org/dashboard' },
    ],
    assertions: [
      { assertion: 'The user is NOT shown a full dashboard with data management features without being logged in — either they are redirected to the auth page, shown a login prompt, or the dashboard content is hidden or gated' },
    ],
    test,
    expect,
  });
});

// ─── 12. Back to home link from auth ─────────────────────────────────────────
test('Back to home link from auth page works', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Back to home navigation',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Click the "Back to home" link or the logo/home link in the header' },
    ],
    assertions: [
      { assertion: 'The user is navigated back to the homepage — the page content changes to show the main portfolio or landing page' },
    ],
    test,
    expect,
  });
});
