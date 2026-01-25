import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({ multiples: true })

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err)
          resolve([fields, files])
        })
      }
    )

    const imageFiles = files.images
    const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt

    if (!imageFiles || (Array.isArray(imageFiles) && imageFiles.length === 0)) {
      return res.status(400).json({ error: 'Изображения не найдены' })
    }

    const images = Array.isArray(imageFiles) ? imageFiles : [imageFiles]

    if (images.length > 4) {
      return res.status(400).json({ error: 'Максимум 4 изображения' })
    }

    // Convert images to base64
    const base64Images = await Promise.all(
      images.map(async (image) => {
        const buffer = fs.readFileSync(image.filepath)
        return buffer.toString('base64')
      })
    )

    // Create messages array with system prompt and image inputs
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: prompt || '',
      },
      ...base64Images.map((base64Image) => ({
        role: 'user' as const,
        content: [
          {
            type: 'image_url' as const,
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      })),
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    })

    const content = response.choices[0]?.message.content
    if (!content) {
      throw new Error('Не удалось извлечь данные из изображений')
    }

    try {
      const cleanContent = content.replace(/^```json\n/, '').replace(/\n```$/, '')
      const products = JSON.parse(cleanContent)
      return res.status(200).json(Array.isArray(products) ? products : [products])
    } catch {
      throw new Error('Неверный формат данных от OpenAI')
    }
  } catch (error) {
    console.error('Error processing images:', error)
    return res.status(500).json({
      error: 'Ошибка при обработке изображений',
      msg: JSON.stringify(error),
    })
  }
}
