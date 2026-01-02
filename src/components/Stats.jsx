import { useState, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
    startDate.setDate(startDate.getDate() - startDate.getDay()) // Start from Sunday
    
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

  // Daily workout count for the month
  const dailyData = useMemo(() => {
    const days = []
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    
    for (let day = 1; day <= lastDay; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayWorkouts = monthlyWorkouts.filter(w => w.date === dateStr)
      days.push({
        day: day,
        workouts: dayWorkouts.length,
        date: dateStr
      })
    }
    
    return days
  }, [monthlyWorkouts, selectedMonth, selectedYear])

  // Pie chart data for workout types
  const pieData = [
    { name: 'Push', value: workoutsByType.push || 0, color: '#ef4444' },
    { name: 'Pull', value: workoutsByType.pull || 0, color: '#3b82f6' },
    { name: 'Legs', value: workoutsByType.legs || 0, color: '#22c55e' }
  ].filter(item => item.value > 0)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  const COLORS = ['#ef4444', '#3b82f6', '#22c55e']

  return (
    <div className="mb-8">
      {/* Month/Year Selector */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
            >
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{monthlyWorkouts.length}</span> workouts this month
          </div>
        </div>
      </div>

      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-4 text-center">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">
            {monthlyWorkouts.length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Workouts</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-4 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-1">
            {monthlyVolume.toLocaleString()}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Total Volume</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-1">
            {monthlyWorkouts.length > 0 ? (monthlyVolume / monthlyWorkouts.length).toFixed(0) : 0}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Avg Volume</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Workout Type Distribution */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Type Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
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
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No data for this month
            </div>
          )}
        </div>

        {/* Weekly Workouts */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workouts Per Week</h3>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No data for this month
            </div>
          )}
        </div>
      </div>

      {/* Daily Workout Chart */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Workout Frequency</h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="workouts" stroke="#ef4444" strokeWidth={2} name="Workouts" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No data for this month
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats
