import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { errorHandler } from './middleware/error'
import { rootHandler } from './routes/root'
import userRoute from './routes/user'

const app = new Hono().basePath('/api');

// Apply global middleware
app.use('*', errorHandler)

// Register routes
app.get('/', rootHandler)
app.route('/users', userRoute)

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }))

export const handler = handle(app)
