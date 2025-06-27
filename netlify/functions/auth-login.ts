import { Handler } from '@netlify/functions'

// Server-side password (you can change this)
const CORRECT_PASSWORD = 'mike2025'

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { password } = JSON.parse(event.body || '{}')

    if (!password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Password is required' }),
      }
    }

    // Validate password
    if (password !== CORRECT_PASSWORD) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid password' }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Authentication successful',
      }),
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
