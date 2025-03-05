import React from 'react';
import { formatTime } from './utils/dateUtils';

/**
 * Calendar Event List Component
 * Displays a list of events for a specific date
 */
const CalendarEventList = ({ date, events, onEventClick, onClose }) => {
  if (!events || events.length === 0) return null;

  // Format the date for the header
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Filter events if they have the _filtered flag
  const filteredEvents = events.filter(event => event._filtered === undefined || event._filtered === true);
  
  // Get the time of the first filtered event to display in the header
  let timeHeader = '';
  if (filteredEvents.length > 0 && filteredEvents[0]._filtered) {
    const firstEvent = filteredEvents[0];
    timeHeader = ` at ${formatTime(firstEvent.start)}`;
  }

  return (
    <div className="event-popup-overlay" onClick={onClose}>
      <div className="event-list" onClick={(e) => e.stopPropagation()}>
        <div className="event-list-header">
          <h3>Events for {formattedDate}{timeHeader}</h3>
          <button 
            className="event-list-close" 
            onClick={onClose}
            aria-label="Close"
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
              event.user_det.handled_by.firstName : '';
            
            // Get round or test info if available
            const roundInfo = event.desc || '';
            
            // Format date
            const eventDate = new Date(event.start);
            const formattedEventDate = `${eventDate.getDate()} Aug ${eventDate.getFullYear()}`;
            
            return (
              <div 
                key={event.id} 
                className="event-list-item"
                onClick={() => onEventClick(event)}
                style={{ 
                  borderLeft: '4px solid ' + backgroundColor,
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  position: 'relative'
                }}
              >
                <div className="event-list-title" style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                  {event.summary}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  {roundInfo && (
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {roundInfo}
                    </div>
                  )}
                  
                  {interviewer && (
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      Interviewer: {interviewer}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="event-list-time" style={{ fontSize: '0.85rem', color: '#666' }}>
                    Date: {formattedEventDate}
                  </div>
                  
                  <div className="event-list-time" style={{ fontSize: '0.85rem', color: '#666' }}>
                    Time: {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
                
                {/* Edit and delete icons as shown in screenshots */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '10px' }}>
                  <span style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#666' }}>✎</span>
                  <span style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#666' }}>🗑</span>
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
