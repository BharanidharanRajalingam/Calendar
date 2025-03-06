import React from 'react';
import { formatTime } from './utils/dateUtils';

/**
 * Calendar Event Component
 * Displays a single event in the calendar
 * Updated to support dynamic positioning and sizing based on event time
 */
const CalendarEvent = ({ 
  event, 
  onClick, 
  eventCount, 
  style = {},
  isTimeBasedPositioning = false,
  width = '100%',
  left = '0%'
}) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    onClick(e);
  };
  
  // Get interviewer name if available
  const interviewer = event.user_det && event.user_det.handled_by ? 
    event.user_det.handled_by.firstName : 'Vinodhini';
  
  // Get date and time
  const formattedTime = formatTime(event.start);
  const formattedEndTime = formatTime(event.end);

  // Combine default styles with passed styles
  const combinedStyles = {
    borderLeft: '15px solid #1a73e8',
    padding: '10px 12px',
    marginBottom: isTimeBasedPositioning ? '0' : '4px',
    maxWidth: '100%',
    width: width,
    left: left,
    boxSizing: 'border-box',
    backgroundColor: '#e6f7ff',
    position: isTimeBasedPositioning ? 'absolute' : 'relative',
    borderRadius: '4px',
    zIndex: 5,
    overflow: 'hidden',
    ...style
  };

  return (
    <div 
      className="calendar-event" 
      onClick={handleClick}
      style={combinedStyles}
    >
      <div className="calendar-event-title" 
        style={{ 
          fontSize: '12px', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          maxWidth: '100%',
          color: '#333'
        }}
      >
        {event.summary}
      </div>
      
      <div style={{ marginTop: '4px', maxWidth: '100%' }}>
        <div className="calendar-event-interviewer" 
          style={{ 
            fontSize: '12px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            maxWidth: '100%',
            color: '#444'
          }}
        >
          Interviewer: {interviewer}
        </div>
      </div>
      
      <div style={{ marginTop: '4px', maxWidth: '100%' }}>
        <div className="calendar-event-time" 
          style={{ 
            fontSize: '10px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            maxWidth: '100%',
            color: '#444'
          }}
        >
          Time: {formattedTime} - {formattedEndTime}
        </div>
      </div>
      
      {/* Event count indicator - only show if count is more than 1 */}
      {eventCount && eventCount > 1 && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '0px', 
            right: '0px', 
            backgroundColor: '#ffd700', 
            color: '#333',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          {eventCount}
        </div>
      )}
    </div>
  );
};

export default CalendarEvent;
