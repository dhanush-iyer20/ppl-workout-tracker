import { useState, useEffect } from 'react'
import { exercises } from '../data/exercises'

function WorkoutSession({ selectedDate, onSave, onCancel, existingWorkout }) {
  const [workoutType, setWorkoutType] = useState(existingWorkout?.type || null)
  const [exerciseData, setExerciseData] = useState({})
  
  useEffect(() => {
    if (existingWorkout) {
      setWorkoutType(existingWorkout.type)
      const data = {}
      existingWorkout.exercises.forEach(ex => {
        data[ex.id] = {
          sets: ex.sets || '',
          reps: ex.reps || '',
          weight: ex.weight || ''
        }
      })
      setExerciseData(data)
    }
  }, [existingWorkout])

  useEffect(() => {
    // Set default placeholders when workout type is selected (for new workouts only)
    if (workoutType && !existingWorkout) {
      const defaultData = {}
      exercises[workoutType]?.forEach(ex => {
        defaultData[ex.id] = {
          sets: '3',
          reps: '12',
          weight: ''
        }
      })
      setExerciseData(defaultData)
    }
  }, [workoutType, existingWorkout])
  
  const handleExerciseChange = (exerciseId, field, value) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }))
  }
  
  const handleSave = () => {
    const workoutExercises = exercises[workoutType]
      .map(ex => ({
        id: ex.id,
        name: ex.name,
        sets: parseInt(exerciseData[ex.id]?.sets) || 0,
        reps: parseInt(exerciseData[ex.id]?.reps) || 0,
        weight: parseFloat(exerciseData[ex.id]?.weight) || 0,
        unit: ex.unit
      }))
      .filter(ex => ex.sets > 0 || ex.reps > 0 || ex.weight > 0)
    
    if (workoutExercises.length === 0) {
      alert('Please enter at least one exercise with sets, reps, or weight')
      return
    }
    
    const workout = {
      date: selectedDate.toISOString().split('T')[0],
      type: workoutType,
      exercises: workoutExercises
    }
    
    onSave(workout, existingWorkout?.id)
  }
  
  if (!workoutType) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/50 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Select Workout Type
        </h2>
        <p className="text-gray-600 mb-6">
          Date: {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setWorkoutType('push')}
            className="p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <div className="text-4xl mb-2">💪</div>
            <div className="text-xl font-semibold text-red-700">Push</div>
            <div className="text-sm text-red-600 mt-1">
              {exercises.push.length} exercises
            </div>
          </button>
          <button
            onClick={() => setWorkoutType('pull')}
            className="p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <div className="text-4xl mb-2">🏋️</div>
            <div className="text-xl font-semibold text-blue-700">Pull</div>
            <div className="text-sm text-blue-600 mt-1">
              {exercises.pull.length} exercises
            </div>
          </button>
          <button
            onClick={() => setWorkoutType('legs')}
            className="p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <div className="text-4xl mb-2">🦵</div>
            <div className="text-xl font-semibold text-green-700">Legs</div>
            <div className="text-sm text-green-600 mt-1">
              {exercises.legs.length} exercises
            </div>
          </button>
        </div>
        <button
          onClick={onCancel}
          className="mt-6 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }
  
  const workoutExercises = exercises[workoutType]
  const typeColors = {
    push: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    pull: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    legs: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' }
  }
  const colors = typeColors[workoutType]
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 capitalize">
            {workoutType} Workout
          </h2>
          <p className="text-gray-600 mt-1">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={() => setWorkoutType(null)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Change Type
        </button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6">
        {workoutExercises.map(exercise => (
          <div
            key={exercise.id}
            className={`p-4 ${colors.bg} border ${colors.border} rounded-2xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                <p className="text-sm text-gray-600">
                  PR: {exercise.pr} {exercise.unit}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sets
                </label>
                <input
                  type="number"
                  min="0"
                  value={exerciseData[exercise.id]?.sets || ''}
                  onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  min="0"
                  value={exerciseData[exercise.id]?.reps || ''}
                  onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Weight ({exercise.unit === 'Body Weight' ? 'BW' : 'kg/lbs'})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={exerciseData[exercise.id]?.weight || ''}
                  onChange={(e) => handleExerciseChange(exercise.id, 'weight', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  placeholder="3"
                  disabled={exercise.unit === 'Body Weight'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`flex-1 px-6 py-3 ${colors.bg} ${colors.text} border-2 ${colors.border} rounded-xl font-medium transition-all duration-200 hover:scale-105`}
        >
          Save Workout
        </button>
      </div>
    </div>
  )
}

export default WorkoutSession

