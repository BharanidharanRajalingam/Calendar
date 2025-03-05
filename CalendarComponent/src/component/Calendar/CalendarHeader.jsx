import React from 'react';
import { formatHeaderDate } from './utils/dateUtils';

/**
 * Calendar Header Component
 * Displays the current date/period and navigation controls
 */
const CalendarHeader = ({ 
  currentDate, 
  view, 
  onPrevious, 
  onNext, 
  onViewChange,
  title
}) => {
  // Format the date for display
  const formattedDate = formatHeaderDate(currentDate, view);
  
  // Get the current day number for the "25" display in the screenshots
  const dayNumber = currentDate.getDate();
  
  // Handle direct button clicks
  const handleDayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('day');
  };
  
  const handleWeekClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('week');
  };
  
  const handleMonthClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('month');
  };
  
  const handleYearClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('year');
  };

  return (
    <div className="calendar-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="calendar-navigation" style={{ marginRight: '10px' }}>
          <button 
            className="calendar-nav-button" 
            onClick={onPrevious}
            aria-label="Previous"
          >
            &lt;
          </button>
          <button 
            className="calendar-nav-button" 
            onClick={onNext}
            aria-label="Next"
          >
            &gt;
          </button>
        </div>
        
        {/* Day number display as shown in screenshots */}
        <div style={{ 
          padding: '5px 15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          marginRight: '15px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontWeight: 'bold',
          color: '#1a73e8'
        }}>
          {dayNumber}
        </div>
        
        <div className="calendar-title-container">
          {title && <h2 className="calendar-title">{title}</h2>}
          {!title && <h3 className="calendar-subtitle">{formattedDate}</h3>}
        </div>
      </div>
      
      <div className="calendar-controls">
        <div className="calendar-view-selector">
          <button 
            className={`calendar-view-button ${view === 'day' ? 'active' : ''}`}
            onClick={handleDayClick}
            style={{ zIndex: 10 }}
          >
            Day
          </button>
          <button 
            className={`calendar-view-button ${view === 'week' ? 'active' : ''}`}
            onClick={handleWeekClick}
            style={{ zIndex: 10 }}
          >
            Week
          </button>
          <button 
            className={`calendar-view-button ${view === 'month' ? 'active' : ''}`}
            onClick={handleMonthClick}
            style={{ zIndex: 10 }}
          >
            Month
          </button>
          <button 
            className={`calendar-view-button ${view === 'year' ? 'active' : ''}`}
            onClick={handleYearClick}
            style={{ zIndex: 10 }}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
