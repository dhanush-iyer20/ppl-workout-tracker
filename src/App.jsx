import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import WorkoutSession from './components/WorkoutSession'
import WorkoutHistory from './components/WorkoutHistory'
import Stats from './components/Stats'
import { storageService } from './services/storage'
import { playClickSound, playSuccessSound, playErrorSound } from './sounds'

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
    playClickSound()
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
    playClickSound()
    try {
      if (workoutId) {
        await storageService.updateWorkout(workoutId, workout)
      } else {
        await storageService.saveWorkout(workout)
      }
      playSuccessSound()
      await loadWorkouts()
      setSelectedDate(null)
      setEditingWorkout(null)
    } catch (error) {
      playErrorSound()
      console.error('Error saving workout:', error)
      const errorMessage = error.message || 'Unknown error occurred'
      alert(`Error saving workout: ${errorMessage}\n\nCheck browser console (F12) for more details.`)
    }
  }

  const handleDeleteWorkout = async (workoutId) => {
    playClickSound()
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await storageService.deleteWorkout(workoutId)
        playSuccessSound()
        await loadWorkouts()
      } catch (error) {
        playErrorSound()
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
      <div className="min-h-screen" style={{ background: '#c0c0c0', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="windows-window p-8">
            <div className="text-center retro-text">
              <div className="text-4xl mb-4">💪</div>
              <div style={{ color: '#000000', fontSize: '12px' }}>Loading...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#008080', padding: '8px', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)' }}>
      <div className="container mx-auto px-2 py-4 max-w-7xl">
        <div className="windows-window mb-4">
          <div className="windows-titlebar">
            <span>💪 PPL WORKOUT TRACKER v1.0</span>
            <span style={{ fontSize: '10px' }}>Windows 3.1 Style</span>
          </div>
          <div className="p-4" style={{ background: '#c0c0c0' }}>
            <div className="text-center mb-4 retro-text">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#000080', textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>
                PPL WORKOUT TRACKER
              </h1>
              <p style={{ color: '#000000', fontSize: '11px' }}>Push • Pull • Legs Routine</p>
            </div>

            <Stats workouts={workouts} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
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
      </div>
    </div>
  )
}

export default App

