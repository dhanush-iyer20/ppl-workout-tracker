import { useState, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { playClickSound } from '../sounds'

function Stats({ workouts }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Get workouts for selected month
  const monthlyWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate.getMonth() === selectedMonth && workoutDate.getFullYear() === selectedYear
    })
  }, [workouts, selectedMonth, selectedYear])

  // Workouts by type for the month
  const workoutsByType = useMemo(() => {
    return monthlyWorkouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    }, {})
  }, [monthlyWorkouts])

  // Total volume for the month
  const monthlyVolume = useMemo(() => {
    return monthlyWorkouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((sum, ex) => {
        return sum + (ex.sets * ex.reps * ex.weight)
      }, 0)
    }, 0)
  }, [monthlyWorkouts])

  // Workouts per week in the month
  const weeklyData = useMemo(() => {
    const weeks = []
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    for (let d = new Date(startDate); d <= lastDay; d.setDate(d.getDate() + 7)) {
      const weekEnd = new Date(d)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const weekStartStr = d.toISOString().split('T')[0]
      const weekEndStr = weekEnd.toISOString().split('T')[0]
      
      const weekWorkouts = monthlyWorkouts.filter(w => {
        return w.date >= weekStartStr && w.date <= weekEndStr
      })
      
      weeks.push({
        week: `Week ${weeks.length + 1}`,
        workouts: weekWorkouts.length,
        volume: weekWorkouts.reduce((sum, w) => {
          return sum + w.exercises.reduce((s, ex) => s + (ex.sets * ex.reps * ex.weight), 0)
        }, 0)
      })
    }
    
    return weeks
  }, [monthlyWorkouts, selectedMonth, selectedYear])

  // Personal Records
  const personalRecords = useMemo(() => {
    const prs = {}
    
    monthlyWorkouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        const exerciseId = ex.id
        const exerciseName = ex.name
        const volume = ex.sets * ex.reps * ex.weight
        const maxWeight = ex.weight
        
        if (!prs[exerciseId]) {
          prs[exerciseId] = {
            name: exerciseName,
            maxWeight: 0,
            maxVolume: 0,
            bestWeightDate: '',
            bestVolumeDate: '',
            unit: ex.unit || 'kg/lbs'
          }
        }
        
        if (maxWeight > prs[exerciseId].maxWeight) {
          prs[exerciseId].maxWeight = maxWeight
          prs[exerciseId].bestWeightDate = workout.date
        }
        
        if (volume > prs[exerciseId].maxVolume) {
          prs[exerciseId].maxVolume = volume
          prs[exerciseId].bestVolumeDate = workout.date
        }
      })
    })
    
    return Object.values(prs).filter(pr => pr.maxWeight > 0 || pr.maxVolume > 0)
  }, [monthlyWorkouts])

  // Volume progression over time (last 12 workouts)
  const volumeProgression = useMemo(() => {
    const sortedWorkouts = [...workouts]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-12)
    
    return sortedWorkouts.map(workout => {
      const volume = workout.exercises.reduce((sum, ex) => {
        return sum + (ex.sets * ex.reps * ex.weight)
      }, 0)
      
      const date = new Date(workout.date)
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: volume,
        type: workout.type
      }
    })
  }, [workouts])

  // Pie chart data for workout types
  const pieData = [
    { name: 'Push', value: workoutsByType.push || 0, color: '#ff8800' },
    { name: 'Pull', value: workoutsByType.pull || 0, color: '#0000ff' },
    { name: 'Legs', value: workoutsByType.legs || 0, color: '#00ff00' }
  ].filter(item => item.value > 0)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  const COLORS = ['#ff8800', '#0000ff', '#00ff00']

  return (
    <div style={{ marginBottom: '8px' }}>
      {/* Month/Year Selector */}
      <div className="windows-window" style={{ marginBottom: '8px' }}>
        <div className="windows-titlebar">
          <span>Statistics</span>
        </div>
        <div style={{ padding: '8px', background: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#000000' }}>Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => { playClickSound(); setSelectedMonth(parseInt(e.target.value)) }}
              className="windows-select"
              style={{ fontSize: '11px' }}
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#000000' }}>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => { playClickSound(); setSelectedYear(parseInt(e.target.value)) }}
              className="windows-select"
              style={{ fontSize: '11px' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: '11px', color: '#000000' }}>
            <span style={{ fontWeight: 'bold' }}>{monthlyWorkouts.length}</span> workouts this month
          </div>
        </div>
      </div>

      {/* Monthly Stats Cards */}
      <div className="stats-cards-grid" style={{ marginBottom: '8px' }}>
        <div className="windows-window">
          <div style={{ padding: '12px', background: '#c0c0c0', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>💪</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000080', marginBottom: '2px' }}>
              {monthlyWorkouts.length}
            </div>
            <div style={{ fontSize: '10px', color: '#000000' }}>Workouts</div>
          </div>
        </div>
        <div className="windows-window">
          <div style={{ padding: '12px', background: '#c0c0c0', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff8800', marginBottom: '2px' }}>
              {monthlyVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#000000' }}>Total Volume</div>
          </div>
        </div>
        <div className="windows-window">
          <div style={{ padding: '12px', background: '#c0c0c0', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📊</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#800080', marginBottom: '2px' }}>
              {monthlyWorkouts.length > 0 ? (monthlyVolume / monthlyWorkouts.length).toFixed(0) : 0}
            </div>
            <div style={{ fontSize: '10px', color: '#000000' }}>Avg Volume</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="stats-charts-grid" style={{ marginBottom: '8px' }}>
        {/* Workout Type Distribution */}
        <div className="windows-window">
          <div className="windows-titlebar">
            <span>Workout Type Distribution</span>
          </div>
          <div style={{ padding: '12px', background: '#c0c0c0' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808080', fontSize: '11px' }}>
                No data for this month
              </div>
            )}
          </div>
        </div>

        {/* Weekly Workouts */}
        <div className="windows-window">
          <div className="windows-titlebar">
            <span>Workouts Per Week</span>
          </div>
          <div style={{ padding: '12px', background: '#c0c0c0' }}>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#808080" />
                  <XAxis dataKey="week" stroke="#000000" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#000000" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#c0c0c0', 
                      border: '2px inset #c0c0c0',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="workouts" fill="#000080" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808080', fontSize: '11px' }}>
                No data for this month
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Volume Progression Chart */}
      <div className="windows-window" style={{ marginBottom: '8px' }}>
        <div className="windows-titlebar">
          <span>Volume Progression (Last 12 Workouts)</span>
        </div>
        <div style={{ padding: '12px', background: '#c0c0c0' }}>
          {volumeProgression.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={volumeProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#808080" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} stroke="#000000" style={{ fontSize: '9px' }} />
                <YAxis stroke="#000000" style={{ fontSize: '10px' }} />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} kg/lbs`, 'Volume']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ 
                    background: '#c0c0c0', 
                    border: '2px inset #c0c0c0',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#000080" 
                  strokeWidth={2} 
                  name="Total Volume"
                  dot={{ fill: '#000080', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808080', fontSize: '11px' }}>
              Add workouts to see your progression
            </div>
          )}
        </div>
      </div>

      {/* Personal Records */}
      <div className="windows-window">
        <div className="windows-titlebar">
          <span>🏆 Personal Records This Month</span>
        </div>
        <div style={{ padding: '8px', background: '#c0c0c0' }}>
          {personalRecords.length > 0 ? (
            <div className="windows-window-inset" style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }} className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {personalRecords.map((pr, index) => (
                  <div 
                    key={index}
                    className="windows-window"
                    style={{ padding: '6px', background: '#ffffff' }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000000', marginBottom: '4px' }}>
                      {pr.name}
                    </div>
                    {pr.maxWeight > 0 && (
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ fontSize: '9px', color: '#000000', marginBottom: '1px' }}>Max Weight</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000080' }}>
                          {pr.maxWeight} {pr.unit === 'Body Weight' ? 'BW' : pr.unit}
                        </div>
                        {pr.bestWeightDate && (
                          <div style={{ fontSize: '8px', color: '#808080', marginTop: '1px' }}>
                            {new Date(pr.bestWeightDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    )}
                    {pr.maxVolume > 0 && (
                      <div>
                        <div style={{ fontSize: '9px', color: '#000000', marginBottom: '1px' }}>Best Volume</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#800080' }}>
                          {pr.maxVolume.toLocaleString()} {pr.unit === 'Body Weight' ? 'BW' : pr.unit}
                        </div>
                        {pr.bestVolumeDate && (
                          <div style={{ fontSize: '8px', color: '#808080', marginTop: '1px' }}>
                            {new Date(pr.bestVolumeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808080', fontSize: '11px' }}>
              Complete workouts to see your personal records
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stats
