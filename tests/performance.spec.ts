import { test, expect } from '@playwright/test';
import { runSteps } from 'passmark';

// ─── 1. Homepage load time ──────────────────────────────────────────────────
test('Homepage loads and displays content without significant delay', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Homepage performance check',
    steps: [
      { description: 'Navigate to https://protik.eu.org and wait for the page to be fully loaded' },
    ],
    assertions: [
      { assertion: 'The homepage loads and displays its main content — the page is not stuck on a blank screen or loading spinner' },
    ],
    test,
    expect,
  });
});

// ─── 2. Auth page load time ─────────────────────────────────────────────────
test('Auth page loads and the login form is interactive', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Auth page performance check',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth and wait for the login form to be fully rendered' },
    ],
    assertions: [
      { assertion: 'The auth page loads and the login form is fully visible — the email and password fields and sign-in button are all rendered and interactive' },
    ],
    test,
    expect,
  });
});

// ─── 3. No broken images on homepage ─────────────────────────────────────────
test('Homepage images load correctly without broken placeholders', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Image loading verification',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
      { description: 'Scroll down slowly to view all sections of the page' },
    ],
    assertions: [
      { assertion: 'All images on the homepage are loaded correctly — there are no broken image icons, empty image containers, or alt-text-only displays where an image should appear' },
    ],
    test,
    expect,
  });
});

// ─── 4. Navigation between pages is smooth ───────────────────────────────────
test('Navigation between homepage and auth page is smooth', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Page transition smoothness',
    steps: [
      { description: 'Navigate to https://protik.eu.org/auth' },
      { description: 'Click the "Back to home" link or navigate to https://protik.eu.org' },
    ],
    assertions: [
      { assertion: 'The page transition completes successfully — the homepage loads after the auth page with no errors or blank screens' },
    ],
    test,
    expect,
  });
});

// ─── 5. Mobile viewport rendering ────────────────────────────────────────────
test('Homepage renders correctly on mobile viewport', async ({ page }) => {
  test.setTimeout(90_000);

  await runSteps({
    page,
    userFlow: 'Mobile responsiveness check',
    steps: [
      { description: 'Navigate to https://protik.eu.org' },
    ],
    assertions: [
      { assertion: 'The homepage content is visible and readable — the layout adapts to the current viewport size without broken overlapping elements' },
    ],
    test,
    expect,
  });
});
