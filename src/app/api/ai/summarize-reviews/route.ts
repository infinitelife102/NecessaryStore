import { NextRequest, NextResponse } from 'next/server';

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { reviews, productName } = await request.json();

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Reviews array is required' },
        { status: 400 }
      );
    }

    if (!GROK_API_KEY) {
      return NextResponse.json(
        { error: 'Grok API key not configured' },
        { status: 500 }
      );
    }

    // Format reviews for the prompt
    const reviewsText = reviews
      .map(
        (review, index) =>
          `Review ${index + 1} (Rating: ${review.rating}/5): ${review.content}`
      )
      .join('\n\n');

    const prompt = `Analyze and summarize the following customer reviews for "${productName}".

Reviews:
${reviewsText}

Please provide:
1. An overall summary (2-3 sentences) of what customers are saying
2. Key positive points mentioned (bullet points)
3. Key negative points or concerns mentioned (bullet points)
4. Average sentiment (positive, mixed, or negative)
5. Most mentioned features or aspects

Format the response as JSON with keys: summary, positives, negatives, sentiment, keyAspects`;

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing customer reviews and extracting key insights. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Grok API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to summarize reviews' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to summarize reviews' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch {
      result = {
        summary: content.slice(0, 300),
        positives: [],
        negatives: [],
        sentiment: 'mixed',
        keyAspects: [],
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize reviews' },
      { status: 500 }
    );
  }
}
