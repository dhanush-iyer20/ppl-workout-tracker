import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import WorkoutSession from './components/WorkoutSession'
import WorkoutHistory from './components/WorkoutHistory'
import Stats from './components/Stats'
import { storageService } from './services/storage'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    try {
      setLoading(true)
      const data = await storageService.getWorkouts()
      setWorkouts(data)
    } catch (error) {
      console.error('Error loading workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    const existing = workouts.find(w => w.date === dateStr)
    if (existing) {
      setEditingWorkout(existing)
    } else {
      setEditingWorkout(null)
    }
    setSelectedDate(date)
  }

  const handleSaveWorkout = async (workout, workoutId) => {
    try {
      if (workoutId) {
        await storageService.updateWorkout(workoutId, workout)
      } else {
        await storageService.saveWorkout(workout)
      }
      await loadWorkouts()
      setSelectedDate(null)
      setEditingWorkout(null)
    } catch (error) {
      console.error('Error saving workout:', error)
      alert('Error saving workout. Please try again.')
    }
  }

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await storageService.deleteWorkout(workoutId)
        await loadWorkouts()
      } catch (error) {
        console.error('Error deleting workout:', error)
        alert('Error deleting workout. Please try again.')
      }
    }
  }

  const handleEditWorkout = (workout) => {
    const date = new Date(workout.date)
    setSelectedDate(date)
    setEditingWorkout(workout)
  }

  const handleCancel = () => {
    setSelectedDate(null)
    setEditingWorkout(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💪</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            💪 PPL Workout Tracker
          </h1>
          <p className="text-gray-600 text-lg">Push • Pull • Legs Routine</p>
        </header>

        <Stats workouts={workouts} />

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Calendar 
            onDateSelect={handleDateSelect} 
            workouts={workouts}
          />
          
          {selectedDate && (
            <WorkoutSession
              selectedDate={selectedDate}
              onSave={handleSaveWorkout}
              onCancel={handleCancel}
              existingWorkout={editingWorkout}
            />
          )}
        </div>

        <WorkoutHistory
          workouts={workouts}
          onEdit={handleEditWorkout}
          onDelete={handleDeleteWorkout}
        />
      </div>
    </div>
  )
}

export default App

