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

  // Helper function to calculate event position and height
  const calculateEventStyles = (event) => {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    
    // Calculate position from top (minutes from the start of the hour)
    const hourHeight = 86; // Height of each hour cell in pixels
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const topPosition = (startMinutes / 60) * hourHeight;
    
    // Calculate height based on duration
    const durationMs = endTime - startTime;
    const durationMinutes = durationMs / (1000 * 60);
    const height = (durationMinutes / 60) * hourHeight;
    
    // Calculate if event spans multiple hours
    const endHour = endTime.getHours();
    const isMultiHour = endHour > startHour || 
                        (endHour === startHour && endTime.getMinutes() > startTime.getMinutes() + 45);
    
    return {
      top: topPosition,
      height: Math.max(height, 25), // Minimum height of 25px
      isMultiHour,
      startHour,
      endHour
    };
  };

  // Helper function to handle overlapping events
  const handleOverlappingEvents = (events) => {
    if (!events || events.length <= 1) return events.map(e => ({ ...e, width: '95%', left: '0%' }));
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Group overlapping events
    const overlappingGroups = [];
    let currentGroup = [sortedEvents[0]];
    
    for (let i = 1; i < sortedEvents.length; i++) {
      const currentEvent = sortedEvents[i];
      const previousEvent = sortedEvents[i - 1];
      
      const currentStart = new Date(currentEvent.start);
      const previousEnd = new Date(previousEvent.end);
      
      if (currentStart < previousEnd) {
        // Events overlap, add to current group
        currentGroup.push(currentEvent);
      } else {
        // No overlap, start a new group
        overlappingGroups.push([...currentGroup]);
        currentGroup = [currentEvent];
      }
    }
    
    // Add the last group
    if (currentGroup.length > 0) {
      overlappingGroups.push(currentGroup);
    }
    
    // Calculate width and position for each event in each group
    const processedEvents = [];
    
    overlappingGroups.forEach(group => {
      const groupSize = group.length;
      const eventWidth = 95 / groupSize; // 95% divided by number of events
      
      group.forEach((event, index) => {
        processedEvents.push({
          ...event,
          width: `${eventWidth}%`,
          left: `${index * eventWidth}%`
        });
      });
    });
    
    return processedEvents;
  };

  // Render the day view
  const renderDayView = () => {
    const hours = getHoursInDay();
    const eventsForDay = getEventsForDate(events, currentDate);
    
    // Process events for time-based positioning
    const processedEvents = handleOverlappingEvents(eventsForDay);

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
            // Filter events that start or span this hour
            const hourEvents = processedEvents.filter(event => {
              const startTime = new Date(event.start);
              const endTime = new Date(event.end);
              const startHour = startTime.getHours();
              const endHour = endTime.getHours();
              
              // Include events that start in this hour or span across this hour
              return startHour === index || 
                     (startHour < index && endHour > index) ||
                     (startHour === index && endTime.getMinutes() > 0);
            });

            return (
              <div 
                key={index} 
                className="calendar-day-cell"
                onClick={() => onDateClick(currentDate, index)}
                style={{ 
                  backgroundColor: 'transparent',
                  position: 'relative'
                }}
              >
                {/* Container for time-based positioned events */}
                <div className="time-based-event-container">
                  {hourEvents.length > 0 && (() => {
                    // Only display the first event that starts in this hour
                    const firstEvent = hourEvents.find(event => {
                      const { startHour } = calculateEventStyles(event);
                      return startHour === index;
                    });
                    
                    if (!firstEvent) return null;
                    
                    const { top, height, startHour } = calculateEventStyles(firstEvent);
                    
                    // Get the count of events for this hour
                    const eventsInThisHour = hourEvents.length;
                    
                    return (
                      <CalendarEvent 
                        key={firstEvent.id}
                        event={firstEvent} 
                        onClick={() => {
                          onDateClick(currentDate, index);
                        }}
                        eventCount={eventsInThisHour > 1 ? eventsInThisHour : null}
                        isTimeBasedPositioning={true}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          padding: '4px 8px'
                        }}
                            width="95%"
                            left="0%"
                      />
                    );
                  })()}
                </div>
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
    
    // Process events for each day
    const processedEventsByDay = {};
    weekDays.forEach(day => {
      const dayEvents = getEventsForDate(events, day);
      processedEventsByDay[day.toISOString()] = handleOverlappingEvents(dayEvents);
    });

    return (
      <div className="calendar-week-container">
        <div className="calendar-week-grid">
          {/* Empty cell for the time column header */}
          <div className="calendar-week-header"></div>
          
          {/* Day headers */}
          {weekDays.map((day, index) => {
            const dayNum = day.getDate();
            const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
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
                const dayKey = day.toISOString();
                const dayEvents = processedEventsByDay[dayKey] || [];
                
                // Filter events that start or span this hour
                const hourEvents = dayEvents.filter(event => {
                  const startTime = new Date(event.start);
                  const endTime = new Date(event.end);
                  const startHour = startTime.getHours();
                  const endHour = endTime.getHours();
                  
                  // Include events that start in this hour or span across this hour
                  return startHour === hourIndex || 
                         (startHour < hourIndex && endHour > hourIndex) ||
                         (startHour === hourIndex && endTime.getMinutes() > 0);
                });

                return (
                  <div 
                    key={dayIndex} 
                    className="calendar-week-cell"
                    onClick={() => onDateClick(day, hourIndex)}
                    style={{ 
                      backgroundColor: 'transparent',
                      position: 'relative'
                    }}
                  >
                    {/* Container for time-based positioned events */}
                    <div className="time-based-event-container">
                      {hourEvents.length > 0 && (() => {
                        // Only display the first event that starts in this hour
                        const firstEvent = hourEvents.find(event => {
                          const { startHour } = calculateEventStyles(event);
                          return startHour === hourIndex;
                        });
                        
                        if (!firstEvent) return null;
                        
                        const { top, height, startHour } = calculateEventStyles(firstEvent);
                        
                        // Get the count of events for this hour
                        const eventsInThisHour = hourEvents.length;
                        
                        return (
                          <CalendarEvent 
                            key={firstEvent.id}
                            event={firstEvent} 
                            onClick={() => {
                              onDateClick(day, hourIndex);
                            }}
                            eventCount={eventsInThisHour > 1 ? eventsInThisHour : null}
                            isTimeBasedPositioning={true}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              padding: '4px 8px'
                            }}
                            width="95%"
                            left="0%"
                          />
                        );
                      })()}
                    </div>
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
                  <div style={{ position: 'relative' }}>
                    {/* Always show the first event if there is one */}
                    {dayEvents.length > 0 && (
                      <CalendarEvent 
                        key={dayEvents[0].id} 
                        event={dayEvents[0]} 
                        onClick={() => {
                          // Always show the list of events when clicking on an event
                          onDateClick(date);
                        }}
                        eventCount={eventCount}
                      />
                    )}
                    
                    {/* Removed duplicate count display */}
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
            
            // Get up to 2 events to display as requested
            const displayEvents = monthEvents.slice(0, 2);
            
            // Check if this is the current month
            const isCurrentMonth = new Date().getMonth() === month.getMonth() && 
                                  new Date().getFullYear() === month.getFullYear();

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
                  padding: '10px',
                  border: isCurrentMonth ? '2px solid #1a73e8' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  backgroundColor: isCurrentMonth ? '#f8fbff' : '#fff'
                }}
              >
                <div className="calendar-month-name" style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  marginBottom: '5px', 
                  color: isCurrentMonth ? '#1a73e8' : '#333',
                  padding: '5px 0'
                }}>
                  {month.toLocaleDateString('en-US', { month: 'long' })}
                </div>
                
                <div style={{ flex: 1 }}>
                  {displayEvents.map((event, eventIndex) => (
                    <div 
                      key={`${event.id}-${eventIndex}`}
                      style={{ 
                        backgroundColor: '#1a73e8',
                        color: 'white',
                        padding: '6px 10px',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Create a date for this event
                        const eventDate = new Date(event.start);
                        // Set the current date to this event's date
                        const newDate = new Date(currentDate);
                        newDate.setMonth(month.getMonth());
                        newDate.setDate(eventDate.getDate());
                        // Show the list of events for this date
                        onDateClick(newDate);
                      }}
                    >
                      {event.summary}
                    </div>
                  ))}
                </div>
                
                {monthEventCount > displayEvents.length && (
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      marginTop: '10px', 
                      color: '#1a73e8', 
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      padding: '5px',
                      borderTop: '1px solid #e0e0e0'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // Create a date for the first day of the month
                      const firstDayOfMonth = new Date(currentDate.getFullYear(), month.getMonth(), 1);
                      
                      // Show the event list for this month with the showMonthEvents flag
                      onDateClick(firstDayOfMonth, null, true);
                    }}
                  >
                    +{monthEventCount - displayEvents.length} more events
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
