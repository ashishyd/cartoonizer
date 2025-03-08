import { createCanvas, loadImage } from 'canvas';

export async function addLogo(
  baseImage: string,
  logoPath: string
): Promise<string> {
  try {
    const [baseImg, logo] = await Promise.all([
      loadImage(baseImage),
      loadImage(logoPath),
    ]);

    const canvas = createCanvas(baseImg.width, baseImg.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(baseImg, 0, 0);
    ctx.drawImage(logo, baseImg.width - 150, baseImg.height - 50, 100, 30);

    return canvas.toDataURL('image/jpeg');
  } catch (error) {
    throw new Error('Failed to add logo');
  }
}

export async function optimizeImage(imageSrc: string): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, 800, 600);
  return canvas.toDataURL('image/jpeg', 0.8);
}
