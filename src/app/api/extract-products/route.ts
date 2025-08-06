import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Cookies from 'js-cookie';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    const prompt = formData.get('prompt') as string;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Изображения не найдены' },
        { status: 400 }
      );
    }

    if (images.length > 4) {
      return NextResponse.json(
        { error: 'Максимум 4 изображения' },
        { status: 400 }
      );
    }

    // Convert images to base64
    const base64Images = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return buffer.toString('base64');
      })
    );

    // Create messages array with system prompt and image inputs
    const messages = [
      {
        role: 'system',
        content: prompt
      },
      ...base64Images.map((base64Image) => ({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Не удалось извлечь данные из изображений');
    }

    try {
      const cleanContent = content
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '');
      const products = JSON.parse(cleanContent);
      return NextResponse.json(Array.isArray(products) ? products : [products]);
    } catch (error) {
      console.log(error);
      throw new Error('Неверный формат данных от OpenAI');
    }
  } catch (error) {
    console.log(error);
    console.error('Error processing images:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке изображений', msg: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
