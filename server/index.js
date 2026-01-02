import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const DATA_FILE = path.join(__dirname, 'data', 'workouts.json')

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  
  // Initialize file if it doesn't exist
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8')
  }
}

// Read workouts from file
async function readWorkouts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading workouts:', error)
    return []
  }
}

// Write workouts to file
async function writeWorkouts(workouts) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(workouts, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing workouts:', error)
    return false
  }
}

// API Routes

// GET all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await readWorkouts()
    res.json(workouts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' })
  }
})

// GET workouts by user_id (optional filtering)
app.get('/api/workouts/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const workouts = await readWorkouts()
    const userWorkouts = workouts.filter(w => w.user_id === userId)
    res.json(userWorkouts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' })
  }
})

// POST create new workout
app.post('/api/workouts', async (req, res) => {
  try {
    const workout = req.body
    console.log('Received workout:', workout)
    
    if (!workout.date || !workout.type || !workout.exercises) {
      return res.status(400).json({ error: 'Missing required fields: date, type, or exercises' })
    }
    
    const workouts = await readWorkouts()
    
    const newWorkout = {
      id: Date.now().toString(),
      user_id: workout.user_id || 'default',
      date: workout.date,
      type: workout.type,
      exercises: workout.exercises,
      created_at: new Date().toISOString()
    }
    
    workouts.push(newWorkout)
    const success = await writeWorkouts(workouts)
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save workout to file' })
    }
    
    res.status(201).json(newWorkout)
  } catch (error) {
    console.error('Error creating workout:', error)
    res.status(500).json({ error: 'Failed to create workout', details: error.message })
  }
})

// PUT update workout
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const workouts = await readWorkouts()
    
    const index = workouts.findIndex(w => w.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'Workout not found' })
    }
    
    workouts[index] = { ...workouts[index], ...updates }
    await writeWorkouts(workouts)
    
    res.json(workouts[index])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' })
  }
})

// DELETE workout
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const workouts = await readWorkouts()
    
    const filtered = workouts.filter(w => w.id !== id)
    if (filtered.length === workouts.length) {
      return res.status(404).json({ error: 'Workout not found' })
    }
    
    await writeWorkouts(filtered)
    res.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' })
  }
})

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Workout Tracker API is running',
    endpoints: {
      health: '/api/health',
      workouts: '/api/workouts',
      workoutsByUser: '/api/workouts/:userId'
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Workout Tracker API is running' })
})

// Start server
async function startServer() {
  try {
    console.log('Starting server...')
    console.log('PORT:', PORT)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    await ensureDataDir()
    console.log('✅ Data directory ensured')
    console.log('📁 Data file:', DATA_FILE)
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('✅ Server started successfully!')
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📁 Data stored in: ${DATA_FILE}`)
      console.log(`🌐 Server accessible at http://0.0.0.0:${PORT}`)
      console.log(`🔗 Health check: http://0.0.0.0:${PORT}/api/health`)
    })
    
    server.on('error', (error) => {
      console.error('❌ Server error:', error)
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`)
      }
      process.exit(1)
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    console.error('Error stack:', error.stack)
    process.exit(1)
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

startServer()

