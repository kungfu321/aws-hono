import { Hono } from 'hono';

const userRoute = new Hono();

userRoute.get('/', (c) => {
  console.log('userRoute');

  return c.json({
    message: 'users',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

userRoute.post('/', (c) => {
  console.log('userRoute');

  return c.json({
    message: 'users post',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

export default userRoute;
