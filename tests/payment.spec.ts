import { test, expect } from '@playwright/test';

test.describe('Payment Use-Case', () => {
  test.beforeEach(async ({ page }) => {
    // Given the payment page is loaded
    await page.goto('http://localhost:3000');
  });

  test('Submit valid payment information and expect redirection', async ({ page }) => {
    // When the user fills out the form with valid payment information
    await page.locator('#name-on-card').fill('Hassan Alnajjar');
    await page.locator('#card-number').fill('4111111111111111');
    await page.locator('#expiration-date').fill('12/25');
    await page.locator('#cvc').fill('123');
    expect(await page.locator('#name-on-card').textContent()).toEqual('Hassan Alnajjar');

    // And submits the form
    await Promise.all([
      page.waitForURL(u => u.host.includes('api.moyasar.com')),
      page.locator('button[type="submit"]').click(),
    ]);


    // Then the user should be redirected to the transaction_url
    expect(page.url()).toContain('api.moyasar.com');
  });

  test('Submit invalid payment information and expect client-side validation error', async ({ page }) => {
    // When the user fills out the form with invalid payment information
    await page.locator('#name-on-card').fill('John Doe');
    await page.locator('#card-number').fill('1234567890123456');
    await page.locator('#expiration-date').fill('12/25');
    await page.locator('#cvc').fill('123');

    // And tries to submit the form
    await page.click('button[type="submit"]');

    // Then the submission should be prevented due to client-side validation error
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('api.moyasar.com');
  });
});