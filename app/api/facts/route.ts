import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Generate 5 interesting short facts about EPAM Systems',
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const facts = data.choices[0].message.content.split('\n').filter(Boolean);

    return NextResponse.json({ facts });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch EPAM facts: ${error}` }, { status: 500 });
  }
}
