import { Hono } from 'hono';
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

const userRoute = new Hono();

userRoute.get('/', (c) => {
  console.log('userRoute');

  return c.json({
    message: 'users',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

userRoute.post('/', zValidator('json', schema), (c) => {
  console.log('userRoute');

  return c.json({
    message: 'users post',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

export default userRoute;
