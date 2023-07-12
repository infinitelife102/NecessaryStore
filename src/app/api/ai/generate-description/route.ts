import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { productName, category, keywords, tone = 'professional' } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Write a compelling product description for an e-commerce website.

Product Name: ${productName}
Category: ${category || 'General'}
Keywords: ${keywords?.join(', ') || 'quality, reliable, affordable'}
Tone: ${tone}

Please provide:
1. A short description (1-2 sentences) for product cards
2. A detailed description (3-4 paragraphs) for the product page
3. 5 key features/benefits as bullet points
4. SEO title (under 60 characters)
5. SEO meta description (under 160 characters)

Format the response as JSON with keys: shortDescription, description, features, seoTitle, seoDescription`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce copywriter who creates compelling product descriptions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
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
        shortDescription: content.slice(0, 200),
        description: content,
        features: [],
        seoTitle: productName,
        seoDescription: content.slice(0, 160),
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
