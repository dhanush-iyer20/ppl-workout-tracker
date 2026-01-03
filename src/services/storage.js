// API endpoint - change this to your deployed server URL
const API_URL = import.meta.env.VITE_API_URL || 'https://ppl-workout-tracker-groe.onrender.com/api'

// Cache to reduce API calls
const CACHE_DURATION = 30000 // 30 seconds cache
let workoutsCache = null
let cacheTimestamp = null

// Generate a simple user ID (in production, use authentication)
const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', userId)
  }
  return userId
}

// Check if cache is still valid
const isCacheValid = () => {
  if (!workoutsCache || !cacheTimestamp) return false
  return Date.now() - cacheTimestamp < CACHE_DURATION
}

export const storageService = {
  async getWorkouts(forceRefresh = false) {
    try {
      // Return cached data if still valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && workoutsCache) {
        console.log('📦 Using cached workouts data')
        return workoutsCache
      }

      // Get all workouts (no user filtering for multi-device sync)
      // Add timeout to prevent hanging
      let controller
      let timeoutId
      
      try {
        // Check if AbortController is available
        if (typeof AbortController !== 'undefined') {
          controller = new AbortController()
          timeoutId = setTimeout(() => {
            if (controller) {
              controller.abort()
            }
          }, 10000) // 10 second timeout
        }
        
        const fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
        
        if (controller) {
          fetchOptions.signal = controller.signal
        }
        
        const response = await fetch(`${API_URL}/workouts`, fetchOptions)
        
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      
        if (!response.ok) {
          throw new Error(`Failed to fetch workouts: ${response.status}`)
        }
        
        const allWorkouts = await response.json()
      
      // Ensure we have an array
      if (!Array.isArray(allWorkouts)) {
        console.warn('API returned non-array data, using empty array')
        return []
      }
      
        // Ensure we have an array
        if (!Array.isArray(allWorkouts)) {
          console.warn('API returned non-array data, using empty array')
          return []
        }
        
        // Sort by date (newest first)
        const sortedWorkouts = allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        // Update cache
        workoutsCache = sortedWorkouts
        cacheTimestamp = Date.now()
        
        return sortedWorkouts
      } finally {
        // Always clear timeout
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
      
      // Handle abort/timeout specifically
      if (error.name === 'AbortError') {
        console.warn('⚠️ Request timed out')
      }
      
      // Return cached data if available, even if expired, as fallback
      if (workoutsCache && Array.isArray(workoutsCache)) {
        console.log('⚠️ Server error, using cached data as fallback')
        return workoutsCache
      }
      // Fallback to empty array if server is down and no cache
      console.log('⚠️ No cache available, returning empty array')
      return []
    }
  },

  async saveWorkout(workout) {
    try {
      // Save workout without user_id filtering (for multi-device sync)
      const payload = {
        ...workout,
        user_id: 'shared' // Use shared user_id so all devices see the same data
      }
      
      console.log('Saving workout to:', `${API_URL}/workouts`)
      console.log('API_URL:', API_URL)
      console.log('Payload:', JSON.stringify(payload, null, 2))
      
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error response:', errorText)
        console.error('Response status:', response.status)
        console.error('Response headers:', [...response.headers.entries()])
        throw new Error(`Failed to save workout: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Workout saved successfully:', result)
      
      // Invalidate cache so next fetch gets fresh data
      workoutsCache = null
      cacheTimestamp = null
      
      return result
    } catch (error) {
      console.error('❌ Error saving workout:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // More user-friendly error message
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please check if the API is running.')
      }
      throw error
    }
  },

  async updateWorkout(workoutId, updates) {
    try {
      const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) throw new Error('Failed to update workout')
      const result = await response.json()
      
      // Invalidate cache
      workoutsCache = null
      cacheTimestamp = null
      
      return result
    } catch (error) {
      console.error('Error updating workout:', error)
      throw error
    }
  },

  async deleteWorkout(workoutId) {
    try {
      const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete workout')
      const result = await response.json()
      
      // Invalidate cache
      workoutsCache = null
      cacheTimestamp = null
      
      return result
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw error
    }
  }
}
