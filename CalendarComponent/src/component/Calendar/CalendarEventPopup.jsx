import React from 'react';
import { formatDate, formatTime } from './utils/dateUtils';

/**
 * Calendar Event Popup Component
 * Displays detailed information about an event in a popup
 */
const CalendarEventPopup = ({ event, onClose }) => {
  if (!event) return null;

  // Get candidate name if available
  const candidateName = event.user_det && event.user_det.candidate ? 
    `${event.user_det.candidate.candidate_firstName} ${event.user_det.candidate.candidate_lastName}` : '';
  
  // Get position if available
  const position = event.job_id ? event.job_id.jobRequest_Title : '';
  
  // Get interviewer if available
  const interviewer = event.user_det && event.user_det.handled_by ? 
    `${event.user_det.handled_by.firstName}` : '';
  
  // Format date
  const eventDate = new Date(event.start);
  const formattedDate = `${eventDate.getDate()} Aug ${eventDate.getFullYear()}`;
  
  // Format time
  const formattedTime = `${formatTime(event.start)} - ${formatTime(event.end)}`;

  return (
    <div className="event-popup-overlay" onClick={onClose}>
      <div className="event-list" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <button 
              className="event-list-close" 
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute', top: '0', right: '0', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
            
            <h3 style={{ marginTop: '0', color: '#333', fontSize: '18px', marginBottom: '5px' }}>{event.summary}</h3>
            {event.desc && <p style={{ color: '#666', margin: '5px 0' }}>{event.desc}</p>}
          </div>
          
          <div style={{ display: 'flex' }}>
            {/* Left side - Event details */}
            <div style={{ flex: '1', fontSize: '14px', color: '#555' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Interview With:</strong> {candidateName || 'mohan'}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Position:</strong> {position || 'django developer'}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Created By:</strong> -
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Interview Date:</strong> {formattedDate}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Interview Time:</strong> {formattedTime}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Interview Via:</strong> Google Meet
              </div>
              
              {/* Document links */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  border: '1px solid #007bff', 
                  borderRadius: '4px',
                  marginBottom: '10px',
                  color: '#007bff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>👁️</span>
                    <span>Resume.docx</span>
                  </div>
                  <span>⬇️</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  border: '1px solid #007bff', 
                  borderRadius: '4px',
                  color: '#007bff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>👁️</span>
                    <span>Aadharcard</span>
                  </div>
                  <span>⬇️</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Google Meet icon and join button */}
            <div style={{ width: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/gmeeticon.png" 
                alt="Google Meet" 
                style={{ width: '80px', height: '80px', marginBottom: '20px' }}
              />
              
              {event.link && (
                <a 
                  href={event.link} 
                  className="join-button" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    padding: '8px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '80%'
                  }}
                >
                  JOIN
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventPopup;
