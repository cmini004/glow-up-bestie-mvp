import { test, expect } from '@playwright/test'

test('demo home → complete commitment → completion', async ({ page }) => {
  // open deterministic demo home
  await page.goto('/?demo=1&start=home')

  // Ensure Home loaded
  await expect(page.getByText(/Here\'s what matters today/i)).toBeVisible()

  // Start commitment: click "I'm on it"
  await page.getByRole('button', { name: /I\'m on it/i }).first().click()
  // On Checkin screen, confirm again
  await page.getByRole('button', { name: /I\'m on it/i }).first().click()

  // Completion: See updated progress or completion screen (heading)
  await expect(page.getByRole('heading', { name: /YOU SHOWED UP/i })).toBeVisible()
})
