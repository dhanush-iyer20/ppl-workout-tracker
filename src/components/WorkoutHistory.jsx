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
      push: 'bg-red-100 text-red-700 border-red-200',
      pull: 'bg-blue-100 text-blue-700 border-blue-200',
      legs: 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200'
  }
  
  if (workouts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/50 p-12 text-center">
        <svg
          className="w-20 h-20 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xl text-gray-500 mb-2">No workouts yet</p>
        <p className="text-gray-400">Click on a date in the calendar to add your first workout!</p>
      </div>
    )
  }
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/50 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Workout History ({workouts.length})
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {workouts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((workout) => (
            <div
              key={workout.id}
              className="group p-4 bg-gray-50/30 rounded-2xl hover:bg-gray-50/50 transition-all duration-200 border border-transparent hover:border-gray-200/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border capitalize ${getTypeColor(workout.type)}`}>
                      {workout.type}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(workout.date)}</span>
                  </div>
                  <div className="space-y-1">
                    {workout.exercises.map((ex, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <span className="font-medium">{ex.name}:</span>{' '}
                        {ex.sets > 0 && <span>{ex.sets} sets × </span>}
                        {ex.reps > 0 && <span>{ex.reps} reps</span>}
                        {ex.weight > 0 && ex.unit !== 'Body Weight' && <span> @ {ex.weight} {ex.unit || 'kg/lbs'}</span>}
                        {ex.weight > 0 && ex.unit === 'Body Weight' && <span> @ BW</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(workout)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all duration-200"
                    title="Edit workout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(workout.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                    title="Delete workout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default WorkoutHistory

