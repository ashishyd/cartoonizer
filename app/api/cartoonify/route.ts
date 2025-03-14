import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    const response = await fetch('https://api.deepai.org/api/ai-selfie-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.API_KEY || '',
      },
      body: JSON.stringify({
        image,
        text: "Transform the uploaded image into a high-quality cartoon or animated-style version while preserving exact likeness and key details (e.g., facial features, expressions, hairstyle, accessories, and unique identifiers like scars or birthmarks). Use a vivid, vibrant, and playful cartoon aesthetic inspired by modern animated films (e.g., Pixar, Disney, or Studio Ghibli styles). Ensure the following: Accuracy: Maintain precise facial proportions, eye shape, and expression to retain the subject's recognizability. Styling: Apply bold outlines, soft shading, and dynamic lighting to emulate a hand-drawn or 3D-rendered cartoon look. Details: Highlight unique traits (e.g., jewelry, tattoos, clothing patterns) with stylized textures. Artistic Flair: Incorporate smooth textures, exaggerated yet balanced features (e.g., larger eyes, expressive eyebrows), and a colorful palette to enhance the whimsical feel. Background: Match the original image’s setting but render it in a cohesive cartoon style (optional, if the original includes a background). Avoid over-stylization that distorts the subject’s core identity. Prioritize a clean, professional, and visually appealing result. The image should have the face only and should be only 1 face.",
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cartoonify Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image. Please try again.' },
      { status: 500 }
    );
  }
}
