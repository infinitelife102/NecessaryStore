import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { reviews, productName } = await request.json();

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Reviews array is required' },
        { status: 400 }
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing customer reviews and extracting key insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to summarize reviews' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // If not valid JSON, return as text
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
