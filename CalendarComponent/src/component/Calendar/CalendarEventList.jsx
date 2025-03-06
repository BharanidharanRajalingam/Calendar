import React from 'react';
import { formatTime } from './utils/dateUtils';

/**
 * Calendar Event List Component
 * Displays a list of events for a specific date
 * Updated to match the design in the second image
 */
const CalendarEventList = ({ date, events, onEventClick, onClose }) => {
  if (!events || events.length === 0) return null;

  // Filter events if they have the _filtered flag
  const filteredEvents = events.filter(event => event._filtered === undefined || event._filtered === true);

  // Check if we're showing events for an entire month (first day of month)
  const isMonthView = date.getDate() === 1 && filteredEvents.some(event => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() !== 1;
  });

  // Format the date for the header
  const formattedDate = isMonthView 
    ? date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
  
  // Get the time of the first filtered event to display in the header
  let timeHeader = '';
  if (!isMonthView && filteredEvents.length > 0 && filteredEvents[0]._filtered) {
    const firstEvent = filteredEvents[0];
    timeHeader = ` at ${formatTime(firstEvent.start)}`;
  }

  return (
    <div className="event-popup-overlay" onClick={onClose}>
      <div className="event-list" onClick={(e) => e.stopPropagation()}>
        <div className="event-list-header">
          <h3>Meetings</h3>
          <button 
            className="event-list-close" 
            onClick={onClose}
            aria-label="Close"
            style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2rem' }}
          >
            ×
          </button>
        </div>
        
        <div className="event-list-content">
          {filteredEvents.map(event => {
            // Determine if this is a Python or Django developer event
            const isPythonDeveloper = event.summary && event.summary.includes('Python');
            const isDjangoDeveloper = event.summary && event.summary.includes('Django');
            
            // Set background color based on event type
            const backgroundColor = isDjangoDeveloper ? '#1a73e8' : (isPythonDeveloper ? '#4285f4' : '#1a73e8');
            
            // Get interviewer name if available
            const interviewer = event.user_det && event.user_det.handled_by ? 
              event.user_det.handled_by.firstName : 'Vinodhini';
            
            // Get round or test info if available
            const roundInfo = event.desc || '1st Round';
            
            // Format date
            const eventDate = new Date(event.start);
            const formattedEventDate = `${eventDate.getDate()} Aug ${eventDate.getFullYear()}`;
            
            // Format time with leading zeros for hours and minutes
            const formatTimeWithLeadingZeros = (dateString) => {
              const date = new Date(dateString);
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
              const formattedMinutes = minutes.toString().padStart(2, '0');
              return `${formattedHours}:${formattedMinutes} ${ampm}`;
            };
            
            const startTime = formatTimeWithLeadingZeros(event.start);
            const endTime = formatTimeWithLeadingZeros(event.end);
            
            return (
              <div 
                key={event.id} 
                className="event-list-item"
                onClick={() => onEventClick(event)}
                style={{ 
                  borderLeft: '5px solid ' + backgroundColor,
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  borderRadius: '0px',
                  boxShadow: 'none',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <div className="event-list-title" style={{ 
                  fontWeight: 'normal', 
                  color: '#333', 
                  marginBottom: '8px',
                  fontSize: '14px',
                  textTransform: 'lowercase'
                }}>
                  {event.summary.toLowerCase()}
                </div>
                
                <div style={{ display: 'flex', marginBottom: '8px' }}>
                  {roundInfo && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      backgroundColor: '#f8f9fa',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      marginRight: '8px',
                      display: 'inline-block'
                    }}>
                      {roundInfo}
                    </div>
                  )}
                  
                  {interviewer && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Interviewer: {interviewer}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="event-list-time" style={{ fontSize: '12px', color: '#666' }}>
                    Date: {formattedEventDate}
                  </div>
                  
                  <div className="event-list-time" style={{ fontSize: '12px', color: '#666' }}>
                    Time: {startTime.replace(':00', '')} - {endTime.replace(':00', '')}
                  </div>
                </div>
                
                {/* Edit and delete icons as shown in screenshots */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '10px' }}>
                  <span style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#444444' }}>✎</span>
                  <span style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#ff6b6b' }}>🗑</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarEventList;
