import OpenAI from 'openai'

export default async (request: Request) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Parse request body
    const { prompt } = await request.json()

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check for OpenAI API key - use globalThis for Deno env
    const apiKey = (globalThis as any).Deno?.env?.get('OPENAI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: apiKey,
    })

    // Generate image
    const response = await client.images.generate({
      // model: 'gpt-image-1',
      model: 'dall-e-3',
      prompt: prompt.trim(),
    })

    const image_b64 = response.data?.[0]?.b64_json
    const image_url = response.data?.[0]?.url

    if (!image_b64 && !image_url) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate image data' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    return new Response(JSON.stringify({ image_b64, image_url, prompt }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error in image generation:', error)
    const errorMessage =
      error instanceof OpenAI.APIError
        ? error.message
        : 'Failed to generate image'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export const config = {
  path: '/api/generate-image',
}
