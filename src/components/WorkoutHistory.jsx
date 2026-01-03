import { playClickSound, playErrorSound } from '../sounds'

function WorkoutHistory({ workouts, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const getTypeColor = (type) => {
    const colors = {
      push: { bg: '#ffcccc', border: '#ff0000', text: '#000000' },
      pull: { bg: '#ccccff', border: '#0000ff', text: '#000000' },
      legs: { bg: '#ccffcc', border: '#00ff00', text: '#000000' },
    }
    return colors[type] || { bg: '#c0c0c0', border: '#808080', text: '#000000' }
  }
  
  if (workouts.length === 0) {
    return (
      <div className="windows-window">
        <div className="windows-titlebar">
          <span>Workout History</span>
        </div>
        <div style={{ padding: '32px', background: '#c0c0c0', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💪</div>
          <div style={{ fontSize: '12px', color: '#000000', marginBottom: '4px', fontWeight: 'bold' }}>
            No workouts yet
          </div>
          <div style={{ fontSize: '10px', color: '#000000' }}>
            Click on a date in the calendar to add your first workout!
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="windows-window">
      <div className="windows-titlebar">
        <span>Workout History ({workouts.length})</span>
      </div>
      <div style={{ padding: '8px', background: '#c0c0c0' }}>
        <div className="windows-window-inset" style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {workouts
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((workout) => {
                const colors = getTypeColor(workout.type)
                return (
                  <div
                    key={workout.id}
                    className="windows-window"
                    style={{ padding: '8px', background: colors.bg }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span 
                            className="windows-button"
                            style={{ 
                              fontSize: '9px', 
                              padding: '2px 6px',
                              minHeight: '16px',
                              background: colors.bg,
                              borderColor: colors.border
                            }}
                          >
                            {workout.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '10px', color: '#000000' }}>
                            {formatDate(workout.date)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {workout.exercises.map((ex, idx) => (
                            <div key={idx} style={{ fontSize: '10px', color: '#000000' }}>
                              <span style={{ fontWeight: 'bold' }}>{ex.name}:</span>{' '}
                              {ex.sets > 0 && <span>{ex.sets} sets × </span>}
                              {ex.reps > 0 && <span>{ex.reps} reps</span>}
                              {ex.weight > 0 && ex.unit !== 'Body Weight' && <span> @ {ex.weight} {ex.unit || 'kg/lbs'}</span>}
                              {ex.weight > 0 && ex.unit === 'Body Weight' && <span> @ BW</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginLeft: '8px' }}>
                        <button
                          onClick={() => { playClickSound(); onEdit(workout) }}
                          className="windows-button"
                          style={{ minWidth: '24px', minHeight: '24px', padding: '2px', fontSize: '10px' }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => { 
                            playClickSound()
                            if (window.confirm('Delete this workout?')) {
                              playErrorSound()
                              onDelete(workout.id)
                            }
                          }}
                          className="windows-button"
                          style={{ minWidth: '24px', minHeight: '24px', padding: '2px', fontSize: '10px' }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutHistory
