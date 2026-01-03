import { useState } from 'react'
import { playClickSound } from '../sounds'

function Calendar({ onDateSelect, workouts }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getWorkoutForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return workouts.find(w => w.date === dateStr)
  }
  
  const getWorkoutTypeColor = (type) => {
    const colors = {
      push: '#ff8800',
      pull: '#0000ff',
      legs: '#00ff00'
    }
    return colors[type] || '#808080'
  }
  
  const handleDateClick = (day) => {
    playClickSound()
    const selectedDate = new Date(year, month, day)
    onDateSelect(selectedDate)
  }
  
  const goToPreviousMonth = () => {
    playClickSound()
    setCurrentDate(new Date(year, month - 1, 1))
  }
  
  const goToNextMonth = () => {
    playClickSound()
    setCurrentDate(new Date(year, month + 1, 1))
  }
  
  const goToToday = () => {
    playClickSound()
    setCurrentDate(new Date())
  }
  
  const today = new Date()
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }
  
  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} style={{ aspectRatio: '1', minHeight: '40px' }}></div>
      )
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const workout = getWorkoutForDate(date)
      const todayStyle = isToday(day) 
        ? { border: '2px solid #000080', background: '#ffff00' }
        : {}
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className="windows-button"
          style={{
            aspectRatio: '1',
            minHeight: '40px',
            minWidth: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            ...todayStyle
          }}
        >
          <span style={{ fontSize: '11px', color: '#000000', fontWeight: isToday(day) ? 'bold' : 'normal' }}>
            {day}
          </span>
          {workout && (
            <div 
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: getWorkoutTypeColor(workout.type),
                marginTop: '2px',
                border: '1px solid #000000'
              }}
            ></div>
          )}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className="windows-window">
      <div className="windows-titlebar">
        <span>📅 Calendar</span>
        <span style={{ fontSize: '10px' }}>{monthNames[month]} {year}</span>
      </div>
      <div style={{ padding: '8px', background: '#c0c0c0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000000' }}>
            {monthNames[month]} {year}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={goToPreviousMonth}
              className="windows-button"
              style={{ minWidth: '30px', padding: '2px' }}
            >
              ◀
            </button>
            <button
              onClick={goToToday}
              className="windows-button windows-button-primary"
              style={{ fontSize: '10px' }}
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="windows-button"
              style={{ minWidth: '30px', padding: '2px' }}
            >
              ▶
            </button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
          {dayNames.map(day => (
            <div 
              key={day} 
              style={{ 
                textAlign: 'center', 
                fontSize: '10px', 
                fontWeight: 'bold', 
                color: '#000000',
                padding: '4px',
                background: '#c0c0c0'
              }}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {renderCalendarDays()}
        </div>
        
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ff8800', border: '1px solid #000000' }}></div>
            <span style={{ color: '#000000' }}>Push</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#0000ff', border: '1px solid #000000' }}></div>
            <span style={{ color: '#000000' }}>Pull</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#00ff00', border: '1px solid #000000' }}></div>
            <span style={{ color: '#000000' }}>Legs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
