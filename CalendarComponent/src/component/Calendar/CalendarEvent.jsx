import React from 'react';
import { formatTime } from './utils/dateUtils';

/**
 * Calendar Event Component
 * Displays a single event in the calendar
 */
const CalendarEvent = ({ event, onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    onClick(e);
  };

  // Determine if this is a Python or Django developer event
  const isPythonDeveloper = event.summary && event.summary.includes('Python');
  const isDjangoDeveloper = event.summary && event.summary.includes('Django');
  
  // Set background color based on event type
  const backgroundColor = isDjangoDeveloper ? '#1a73e8' : (isPythonDeveloper ? '#4285f4' : '#1a73e8');
  
  // Get interviewer name if available
  const interviewer = event.user_det && event.user_det.handled_by ? 
    event.user_det.handled_by.firstName : '';
    
  // Get round info if available
  const roundInfo = event.desc || '';
  
  // Get date and time
  const eventDate = new Date(event.start);
  const formattedTime = formatTime(event.start);
  const formattedEndTime = formatTime(event.end);

  return (
    <div 
      className="calendar-event" 
      onClick={handleClick}
      style={{ 
        borderLeft: '15px solid ' + (backgroundColor === '#1a73e8' ? '#0d47a1' : '#0063BE'),
        padding: '6px 8px',
        marginBottom: '4px',
      }}
    >
      <div className="calendar-event-title" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{event.summary}</div>
      
      {roundInfo && (
        <div style={{ marginTop: '2px' }}>
          <div className="calendar-event-round" style={{ fontSize: '0.8rem' }}>
            {roundInfo}
          </div>
        </div>
      )}
      
      {interviewer && (
        <div style={{ marginTop: '2px' }}>
          <div className="calendar-event-interviewer" style={{ fontSize: '0.8rem' }}>
            Interviewer: {interviewer}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '2px' }}>
        <div className="calendar-event-time" style={{ fontSize: '0.75rem' }}>
          Time: {formattedTime} - {formattedEndTime}
        </div>
      </div>
      
      <div style={{ marginTop: '2px' }}>
        <div className="calendar-event-date" style={{ fontSize: '0.75rem' }}>
          Date: {eventDate.getDate()} Aug {eventDate.getFullYear()}
        </div>
      </div>
      
      {/* Edit and delete icons as shown in screenshots */}
      {/* <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '5px' }}>
        <span style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>✎</span>
        <span style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>🗑</span>
      </div> */}
    </div>
  );
};

export default CalendarEvent;
