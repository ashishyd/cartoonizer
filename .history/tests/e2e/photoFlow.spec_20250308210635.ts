import { test, expect } from '@playwright/test';

test.describe('Photo Booth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('manual crop confirmation', async ({ page }) => {
    await page.goto('/');

    // Capture photo
    await page.getByRole('button', { name: 'Take photo' }).click();

    // Verify cropper UI
    await page.waitForSelector('[data-testid="cropper-ui"]');
    await expect(
      page.getByRole('button', { name: 'Apply Crop' })
    ).toBeDisabled();

    // Simulate crop selection
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    // Confirm crop
    await page.getByRole('button', { name: 'Apply Crop' }).click();
    await expect(page).toHaveSelector('[data-testid="processing-screen"]');
  });

  test('mobile camera view', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(page.locator('.camera-container')).toHaveCSS('padding', '16px');
      await expect(page.locator('video')).toHaveJSProperty('videoWidth', 720);
    }
  });

  test('complete photo capture and processing', async ({ page }) => {
    // Mock camera access
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
          { box: { x: 600, y: 300, width: 200, height: 200 } },
        ]),
      })
    );

    // Verify auto-capture
    await page.waitForSelector('text="2"');
    await page.waitForSelector('text="1"');

    // Verify processing
    await page.waitForSelector('text="Creating Your Cartoon"');

    // Verify result
    await page.waitForSelector('[data-testid="result-image"]');
    await page.waitForSelector('[data-testid="qr-code"]');

    // Test social share
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('text="Share to Instagram"'),
    ]);
    await expect(newPage).toHaveURL(/instagram\.com/);
  });
});
