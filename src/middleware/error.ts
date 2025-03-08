import { MiddlewareHandler } from 'hono'

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (error) {
    console.error('Error:', error)

    if (error instanceof Error) {
      return c.json(
        {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        500
      )
    }

    return c.json({ message: 'Internal Server Error' }, 500)
  }
}