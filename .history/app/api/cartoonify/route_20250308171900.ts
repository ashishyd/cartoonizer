import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    const response = await fetch('https://api.deepai.org/api/toonify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.DEEPAI_KEY || ''
      },
      body: JSON.stringify({ image })
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