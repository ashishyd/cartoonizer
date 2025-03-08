import { NextRequest, NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6);

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Validate URL format
    if (!url.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    // Generate short ID and store in KV store (replace with your database)
    const shortId = nanoid();
    // await kv.set(shortId, url);

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/i/${shortId}`
    });

  } catch (error) {
    console.error('URL shortening error:', error);
    return NextResponse.json(
      { error: 'Failed to generate short URL' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const shortId = request.nextUrl.pathname.split('/').pop();
  
  if (!shortId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // const originalUrl = await kv.get(shortId);
  const originalUrl = 'data:image/jpeg;base64,...'; // Replace with actual lookup

  if (!originalUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.redirect(originalUrl);
}