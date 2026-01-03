import { useState, useEffect } from 'react'
import { exercises } from '../data/exercises'
import { playClickSound, playErrorSound } from '../sounds'

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
    playClickSound()
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
      playErrorSound()
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
      <div className="windows-window">
        <div className="windows-titlebar">
          <span>Select Workout Type</span>
        </div>
        <div style={{ padding: '12px', background: '#c0c0c0' }}>
          <div style={{ fontSize: '11px', color: '#000000', marginBottom: '12px' }}>
            Date: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => { playClickSound(); setWorkoutType('push') }}
              className="windows-button"
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>💪</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>Push</div>
              <div style={{ fontSize: '10px', color: '#000000', marginTop: '2px' }}>
                {exercises.push.length} exercises
              </div>
            </button>
            <button
              onClick={() => { playClickSound(); setWorkoutType('pull') }}
              className="windows-button"
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏋️</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>Pull</div>
              <div style={{ fontSize: '10px', color: '#000000', marginTop: '2px' }}>
                {exercises.pull.length} exercises
              </div>
            </button>
            <button
              onClick={() => { playClickSound(); setWorkoutType('legs') }}
              className="windows-button"
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🦵</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>Legs</div>
              <div style={{ fontSize: '10px', color: '#000000', marginTop: '2px' }}>
                {exercises.legs.length} exercises
              </div>
            </button>
          </div>
          <button
            onClick={() => { playClickSound(); onCancel() }}
            className="windows-button"
            style={{ width: '100%' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }
  
  const workoutExercises = exercises[workoutType]
  const typeColors = {
    push: { bg: '#ffe6cc', border: '#ff8800', text: '#000000' },
    pull: { bg: '#ccccff', border: '#0000ff', text: '#000000' },
    legs: { bg: '#ccffcc', border: '#00ff00', text: '#000000' }
  }
  const colors = typeColors[workoutType]
  
  return (
    <div className="windows-window workout-session-container">
      <div className="windows-titlebar">
        <span>{workoutType.toUpperCase()} Workout</span>
        <button
          onClick={() => { playClickSound(); setWorkoutType(null) }}
          className="windows-button"
          style={{ fontSize: '10px', padding: '2px 8px', minHeight: '18px' }}
        >
          Change
        </button>
      </div>
      <div style={{ padding: '8px', background: '#c0c0c0' }}>
        <div style={{ fontSize: '10px', color: '#000000', marginBottom: '8px' }}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div className="windows-window-inset" style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workoutExercises.map(exercise => (
              <div
                key={exercise.id}
                className="windows-window"
                style={{ padding: '8px', background: colors.bg }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.text, marginBottom: '2px' }}>
                    {exercise.name}
                  </div>
                  <div style={{ fontSize: '9px', color: '#000000' }}>
                    PR: {exercise.pr} {exercise.unit}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', color: '#000000', marginBottom: '2px' }}>
                      Sets
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseData[exercise.id]?.sets || ''}
                      onChange={(e) => handleExerciseChange(exercise.id, 'sets', e.target.value)}
                      className="windows-input"
                      placeholder="3"
                      style={{ width: '100%', fontSize: '11px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', color: '#000000', marginBottom: '2px' }}>
                      Reps
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseData[exercise.id]?.reps || ''}
                      onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                      className="windows-input"
                      placeholder="12"
                      style={{ width: '100%', fontSize: '11px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', color: '#000000', marginBottom: '2px' }}>
                      Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={exerciseData[exercise.id]?.weight || ''}
                      onChange={(e) => handleExerciseChange(exercise.id, 'weight', e.target.value)}
                      className="windows-input"
                      placeholder="0"
                      style={{ width: '100%', fontSize: '11px' }}
                      disabled={exercise.unit === 'Body Weight'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => { playClickSound(); onCancel() }}
            className="windows-button"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="windows-button windows-button-primary"
            style={{ flex: 1 }}
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkoutSession
