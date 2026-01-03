// API endpoint - change this to your deployed server URL
const API_URL = import.meta.env.VITE_API_URL || 'https://ppl-workout-tracker-groe.onrender.com/api'

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
      
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to save workout: ${response.status} - ${errorText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error saving workout:', error)
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
