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
  
  // Get score if available
  const score = event.score ? Object.entries(event.score).map(([key, value]) => `${key}: ${value}`).join(', ') : '';

  return (
    <div className="event-popup-overlay" onClick={onClose}>
      <div className="event-popup" onClick={(e) => e.stopPropagation()}>
        <div className="event-popup-header">
          <h3>{event.summary}</h3>
          <button 
            className="event-popup-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="event-popup-content">
          {event.desc && (
            <p style={{ margin: '0 0 15px 0', color: '#555' }}>{event.desc}</p>
          )}
          
          <div className="event-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: '0' }}><strong>Position:</strong> {position}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: '0' }}><strong>Created By:</strong> -</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: '0' }}><strong>Interview Date:</strong> {formattedDate}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: '0' }}><strong>Interview Time:</strong> {formattedTime}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: '0' }}><strong>Interview Via:</strong> Google Meet</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    marginRight: '10px',
                    backgroundColor: '#00832d',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div 
                    style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderLeft: '10px solid white',
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {candidateName && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: '0' }}><strong>Interview With:</strong> {candidateName}</p>
              </div>
            )}
            
            {event.user_det && event.user_det.candidate && event.user_det.candidate.candidate_email && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: '0' }}><strong>Email:</strong> {event.user_det.candidate.candidate_email}</p>
              </div>
            )}
            
            {interviewer && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: '0' }}><strong>Interviewer:</strong> {interviewer}</p>
              </div>
            )}
            
            {score && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: '0' }}><strong>Score:</strong> {score}</p>
              </div>
            )}
          </div>
          
          {event.link && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <a 
                href={event.link} 
                className="join-button" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  padding: '8px 20px', 
                  backgroundColor: '#1a73e8', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                JOIN
              </a>
            </div>
          )}
          
          {/* Document links */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1a73e8', marginRight: '8px' }}>👁️</span>
                <span>Resume.docx</span>
              </div>
              <span style={{ color: '#1a73e8' }}>⬇️</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#1a73e8', marginRight: '8px' }}>👁️</span>
                <span>Aadharcard</span>
              </div>
              <span style={{ color: '#1a73e8' }}>⬇️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventPopup;
