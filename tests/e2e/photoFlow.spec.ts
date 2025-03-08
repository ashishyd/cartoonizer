import { test, expect } from '@playwright/test';

test.describe('Main User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should complete photo capture to result flow', async ({ page }) => {
    // Mock camera API
    await page.addInitScript(() => {
      navigator.mediaDevices = {
        getUserMedia: () => Promise.resolve(new MediaStream()),
      };
    });

    // Mock face detection
    await page.route('**/detectFaces', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            box: { x: 100, y: 100, width: 200, height: 200 },
            videoWidth: 1280,
            videoHeight: 720,
          },
        ]),
      })
    );

    // Capture photo
    await page.getByRole('button', { name: /capture/i }).click();

    // Verify cropper UI
    await expect(page.getByText('Drag to adjust crop')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply Crop' })).toBeDisabled();

    // Simulate crop selection
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    // Apply crop
    await page.getByRole('button', { name: 'Apply Crop' }).click();

    // Verify processing
    await expect(page.getByText('Creating Your Cartoon')).toBeVisible();

    // Verify result
    await expect(page.getByAltText('Result')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Scan to download your photo')).toBeVisible();
  });

  test('should handle face detection failure', async ({ page }) => {
    // Mock failed face detection
    await page.route('**/detectFaces', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Detection failed' }),
      })
    );

    await page.getByRole('button', { name: /capture/i }).click();
    await expect(page.getByText(/failed to detect face/i)).toBeVisible();
  });

  test('should handle mobile responsive layout', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(page.locator('.camera-container')).toHaveCSS('padding', '16px');
      await expect(page.getByRole('button', { name: /capture/i })).toHaveCSS('width', '64px');
    }
  });

  test('should show error boundary on processing failure', async ({ page }) => {
    // Mock API failure
    await page.route('**/cartoonify', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Processing failed' }),
      })
    );

    await page.getByRole('button', { name: /capture/i }).click();
    await page.getByRole('button', { name: 'Apply Crop' }).click();

    await expect(page.getByText('Something Went Wrong')).toBeVisible();
    await page.getByRole('button', { name: 'Try Again' }).click();
    await expect(page.getByRole('button', { name: 'capture' })).toBeVisible();
  });

  test('should generate valid QR code', async ({ page }) => {
    // Complete capture flow
    await page.getByRole('button', { name: 'capture' }).click();
    await page.getByRole('button', { name: 'Apply Crop' }).click();
    await page.waitForSelector('[data-testid="result-screen"]');

    // Verify QR code
    const qrCode = page.locator('svg[role="img"]');
    await expect(qrCode).toBeVisible();
    await expect(qrCode).toHaveAttribute('aria-label', 'QR code');
  });
});
