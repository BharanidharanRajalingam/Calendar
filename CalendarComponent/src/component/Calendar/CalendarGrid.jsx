import React from 'react';
import CalendarEvent from './CalendarEvent';
import {
  getDatesInMonth,
  getDatesInWeek,
  getHoursInDay,
  isToday,
  isSameDay,
  getEventCountForDate,
  getEventsForDate
} from './utils/dateUtils';

/**
 * Calendar Grid Component
 * Renders the appropriate calendar view based on the current view mode
 */
const CalendarGrid = ({ 
  view, 
  currentDate, 
  events, 
  onDateClick, 
  onEventClick 
}) => {
  // Render different views based on the current view mode
  const renderView = () => {
    console.log('Rendering view:', view);
    switch (view) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return renderMonthView();
    }
  };

  // Render the day view
  const renderDayView = () => {
    const hours = getHoursInDay();
    const eventsForDay = getEventsForDate(events, currentDate);

    return (
      <div className="calendar-day-grid">
        <div className="calendar-time-column">
          {hours.map((hour, index) => (
            <div key={index} className="calendar-time-slot">
              {hour}
            </div>
          ))}
        </div>
        <div className="calendar-day-column">
          {hours.map((hour, index) => {
            // Filter events that occur during this hour
            const hourEvents = eventsForDay.filter(event => {
              const eventHour = new Date(event.start).getHours();
              return eventHour === index;
            });

            // Check if there are multiple events at this time
            const hasMultipleEvents = hourEvents.length > 1;

            return (
              <div 
                key={index} 
                className="calendar-day-cell"
                onClick={() => onDateClick(currentDate, index)}
                style={{ 
                  backgroundColor: hourEvents.length > 0 && hourEvents.length <= 1 ? 'rgba(26, 115, 232, 0.1)' : 'transparent',
                  position: 'relative'
                }}
              >
                {hourEvents.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    {/* Display first event */}
                    {hourEvents.slice(0, 1).map(event => (
                      <div key={event.id} style={{ marginLeft: '20px' }}>
                        <CalendarEvent 
                          event={event} 
                          onClick={onEventClick} 
                        />
                      </div>
                    ))}
                    
                    {/* Display count for multiple events */}
                    {hasMultipleEvents && (
                      <div 
                        className="calendar-event-count"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateClick(currentDate, index);
                        }}
                      >
                        {hourEvents.length}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the week view
  const renderWeekView = () => {
    const weekDays = getDatesInWeek(currentDate);
    const hours = getHoursInDay();
    
    // Format the date range for the header
    const startDate = weekDays[0];
    const endDate = weekDays[weekDays.length - 1];
    const formattedStartDate = startDate.getDate();
    const formattedEndDate = endDate.getDate();
    const formattedMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
    const formattedYear = startDate.getFullYear();

    return (
      <div className="calendar-week-container">
        <div className="calendar-week-grid">
          {/* Empty cell for the time column header */}
          <div className="calendar-week-header"></div>
          
          {/* Day headers */}
          {weekDays.map((day, index) => {
            const dayNum = day.getDate();
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
            const monthName = day.toLocaleDateString('en-US', { month: 'short' });
            
            return (
              <div 
                key={index} 
                className={`calendar-week-header ${isToday(day) ? 'today' : ''}`}
                onClick={() => onDateClick(day)}
              >
                <div style={{ fontWeight: 'bold' }}>{dayNum} {monthName}</div>
                <div>{dayName}</div>
              </div>
            );
          })}
          
          {/* Time slots */}
          {hours.map((hour, hourIndex) => (
            <React.Fragment key={hourIndex}>
              <div className="calendar-time-slot">
                {hour}
              </div>
              
              {weekDays.map((day, dayIndex) => {
                // Filter events for this day and hour
                const dayEvents = getEventsForDate(events, day);
                const hourEvents = dayEvents.filter(event => {
                  const eventHour = new Date(event.start).getHours();
                  return eventHour === hourIndex;
                });
                
                // Check if there are multiple events at this time
                const hasMultipleEvents = hourEvents.length > 1;

                return (
                  <div 
                    key={dayIndex} 
                    className="calendar-week-cell"
                    onClick={() => onDateClick(day, hourIndex)}
                    style={{ 
                      backgroundColor: hourEvents.length > 0 && hourEvents.length <= 1 ? 'rgba(26, 115, 232, 0.1)' : 'transparent',
                      position: 'relative'
                    }}
                  >
                    {hourEvents.length > 0 && (
                      <div style={{ position: 'relative' }}>
                        {/* Display first event */}
                        {hourEvents.slice(0, 1).map(event => (
                          <CalendarEvent 
                            key={event.id} 
                            event={event} 
                            onClick={onEventClick} 
                          />
                        ))}
                        
                        {/* Display count for multiple events */}
                        {hasMultipleEvents && (
                          <div className="calendar-event-count">
                            {hourEvents.length}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render the month view
  const renderMonthView = () => {
    const daysInMonth = getDatesInMonth(currentDate);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <div className="calendar-month-container">
        <div className="calendar-month-grid">
          {/* Weekday headers */}
          {weekdays.map((day, index) => (
            <div key={index} className="calendar-weekday-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {daysInMonth.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const dayEvents = getEventsForDate(events, date);
            const eventCount = dayEvents.length;

            return (
              <div 
                key={index} 
                className={`calendar-day ${isToday(date) ? 'today' : ''} ${isCurrentMonth ? '' : 'other-month'}`}
                onClick={() => onDateClick(date)}
              >
                <div className="calendar-day-number">
                  {date.getDate()}
                </div>
                
                {/* Display events or event count */}
                {eventCount > 0 && (
                  <div>
                    {/* Always show the first event if there is one */}
                    {dayEvents.length > 0 && (
                      <CalendarEvent 
                        key={dayEvents[0].id} 
                        event={dayEvents[0]} 
                        onClick={onEventClick} 
                      />
                    )}
                    
                    {/* If there are multiple events, show a count */}
                    {eventCount > 1 && (
                      <div 
                        className="calendar-event-count"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateClick(date);
                        }}
                      >
                        {eventCount}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the year view
  const renderYearView = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(currentDate.getFullYear(), i, 1));
    }

    return (
      <div className="calendar-year-container">
        <div className="calendar-year-grid">
          {months.map((month, index) => {
            // Get the first day of the next month and subtract one day to get the last day of the current month
            const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            
            // Count events for this month
            let monthEventCount = 0;
            for (let day = 1; day <= lastDay.getDate(); day++) {
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              monthEventCount += getEventCountForDate(events, date);
            }

            // Get events for this month to display
            let monthEvents = [];
            for (let day = 1; day <= lastDay.getDate(); day++) {
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const eventsForDay = getEventsForDate(events, date);
              if (eventsForDay.length > 0) {
                monthEvents = [...monthEvents, ...eventsForDay];
              }
            }
            
            // Get up to 3 events to display
            const displayEvents = monthEvents.slice(0, 3);

            return (
              <div 
                key={index} 
                className="calendar-month-card"
                onClick={() => {
                  // Set the current date to this month
                  const newDate = new Date(currentDate);
                  newDate.setMonth(month.getMonth());
                  onDateClick(newDate);
                }}
                style={{ 
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div className="calendar-month-name" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '10px', color: '#1a73e8' }}>
                  {month.toLocaleDateString('en-US', { month: 'long' })}
                </div>
                
                <div style={{ flex: 1 }}>
                  {displayEvents.map((event, eventIndex) => (
                    <div 
                      key={`${event.id}-${eventIndex}`}
                      style={{ 
                        backgroundColor: '#1a73e8',
                        color: 'white',
                        padding: '4px 8px',
                        marginBottom: '5px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {event.summary}
                    </div>
                  ))}
                </div>
                
                {monthEventCount > displayEvents.length && (
                  <div style={{ textAlign: 'center', marginTop: '5px', color: '#666', fontSize: '0.9rem' }}>
                    +{monthEventCount - displayEvents.length} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-grid">
      {renderView()}
    </div>
  );
};

export default CalendarGrid;
