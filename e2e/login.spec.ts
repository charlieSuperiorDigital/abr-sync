import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en/login')
  await expect(page.getByRole('img', { name: 'Logo' })).toBeVisible()
  await page.getByRole('heading', { name: 'Sign In' }).click()
  await page.getByRole('textbox', { name: 'Email' }).click()
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com')
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
    'test@test.com'
  )
  await page.getByRole('textbox', { name: 'Password' }).click()
  await page.getByRole('textbox', { name: 'Password' }).fill('123')
  await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue(
    '123'
  )
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign In' }).click()
  const loader = page.locator('svg.animate-spin') // Selects the spinning loader
  await expect(loader).toBeVisible()
})
