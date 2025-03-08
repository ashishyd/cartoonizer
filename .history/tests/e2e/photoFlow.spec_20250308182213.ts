test('manual crop confirmation', async ({ page }) => {
    await page.goto('/');
    
    // Capture photo
    await page.getByRole('button', { name: 'Take photo' }).click();
    
    // Verify cropper UI
    await page.waitForSelector('[data-testid="cropper-ui"]');
    await expect(page.getByRole('button', { name: 'Apply Crop' })).toBeDisabled();
    
    // Simulate crop selection
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Confirm crop
    await page.getByRole('button', { name: 'Apply Crop' }).click();
    await expect(page).toHaveSelector('[data-testid="processing-screen"]');
  });