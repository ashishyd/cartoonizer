import { test, expect } from '@playwright/test';

test.describe('Photo Booth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('complete photo capture and processing', async ({ page }) => {
    // Mock camera access
    await page.addInitScript(() => {
      navigator.mediaDevices = {
        getUserMedia: () => Promise.resolve(new MediaStream())
      };
    });

    // Mock face detection
    await page.route('**/detectFaces', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ box: { x: 600, y: 300, width: 200, height: 200 } }])
    }));

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
      page.click('text="Share to Instagram"')
    ]);
    await expect(newPage).toHaveURL(/instagram\.com/);
  });
});