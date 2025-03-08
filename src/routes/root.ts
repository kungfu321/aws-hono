import { Context } from 'hono'

export const rootHandler = async (c: Context) => {
  try {
    console.log('rootHandler');
    
    return c.json({
      message: 'Welcome to Hono Lambda API',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  } catch (error) {
    throw error
  }
}