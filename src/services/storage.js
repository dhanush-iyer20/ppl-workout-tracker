// API endpoint - change this to your deployed server URL
const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-b2c90.up.railway.app/api'

// Generate a simple user ID (in production, use authentication)
const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', userId)
  }
  return userId
}

export const storageService = {
  async getWorkouts() {
    try {
      // Get all workouts (no user filtering for multi-device sync)
      const response = await fetch(`${API_URL}/workouts`)
      if (!response.ok) {
        throw new Error('Failed to fetch workouts')
      }
      const allWorkouts = await response.json()
      // Sort by date (newest first)
      return allWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error fetching workouts:', error)
      // Fallback to empty array if server is down
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
      return await response.json()
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
      return await response.json()
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw error
    }
  }
}
