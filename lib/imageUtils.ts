import { createCanvas, loadImage } from 'canvas';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';

export async function addLogo(
  baseImage: string,
  logoPath: string,
  name: string,
  socialHandle?: string
): Promise<string> {
  const { showError } = useErrorStore.getState();

  try {
    const [baseImg, logo] = await Promise.all([loadImage(baseImage), loadImage(logoPath)]);

    // Define Polaroid dimensions
    const polaroidWidth = baseImg.width;
    const polaroidHeight = baseImg.height + 100; // Extra space for the white bottom

    const canvas = createCanvas(polaroidWidth, polaroidHeight);
    const ctx = canvas.getContext('2d');

    // Draw the white background for the Polaroid
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, polaroidWidth, polaroidHeight);

    ctx.drawImage(baseImg, 0, 0);
    // Draw the logo inside the image
    const logoSize = Math.min(baseImg.width, baseImg.height) * 0.1; // 10% of the smaller dimension
    ctx.drawImage(
      logo,
      baseImg.width - logoSize - 10,
      baseImg.height - logoSize - 10,
      logoSize,
      logoSize
    );

    // Set text properties for the name
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    // Draw the name in the white bottom area
    ctx.fillText(name, polaroidWidth / 2, baseImg.height + 40);

    if (socialHandle) {
      // Set text properties for the social handle
      ctx.font = 'italic 20px Arial';
      ctx.fillStyle = 'black';

      // Draw the social handle inside the image
      ctx.fillText(`@${socialHandle}`, polaroidWidth / 2, baseImg.height + 60);
    }
    return canvas.toDataURL('image/jpeg');
  } catch (error) {
    if (error instanceof Error) {
      showError({
        code: 'image-utils/add-logo-error',
        message: 'Failed to add logo',
        context: { stack: error.stack },
      });
      AppLogger.logError({
        code: 'image-utils/add-logo-error',
        message: error.message,
        context: { stack: error.stack },
        timestamp: new Date(),
      });
    }
    throw error;
  }
}

export async function optimizeImage(imageSrc: string): Promise<string> {
  const { showError } = useErrorStore.getState();
  try {
    const img = await loadImage(imageSrc);
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, 800, 600);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    if (error instanceof Error) {
      showError({
        code: 'image-utils/optimize-image-error',
        message: 'Failed to optimize image',
        context: { stack: error.stack },
      });
      AppLogger.logError({
        code: 'image-utils/optimize-image-error',
        message: error.message,
        context: { stack: error.stack },
        timestamp: new Date(),
      });
    }
    throw error;
  }
}
