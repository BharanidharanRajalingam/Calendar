import React, { useState, useEffect, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarEventPopup from './CalendarEventPopup';
import CalendarEventList from './CalendarEventList';
import { 
  getPreviousPeriod, 
  getNextPeriod, 
  getEventsForDate 
} from './utils/dateUtils';
import { 
  fetchEventsForDateRange, 
  fetchEventById 
} from './utils/apiUtils';
import './styles/Calendar.css';

/**
 * Main Calendar Component
 * Integrates all calendar sub-components and manages state
 */
const Calendar = ({ title, initialView = 'month', initialDate = new Date(), onViewChange }) => {
  // State for calendar
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState(initialView);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Update view when initialView changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);
  
  // State for popups
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showEventList, setShowEventList] = useState(false);

  // Fetch events based on date range
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Calculate date range based on view
      let startDate, endDate;
      
      switch (view) {
        case 'day':
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          // Start from Sunday of the week
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          
          // End on Saturday of the week
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'month':
          // Start from the first day of the month
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          startDate.setHours(0, 0, 0, 0);
          
          // End on the last day of the month
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'year':
          // Start from January 1st of the year
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          startDate.setHours(0, 0, 0, 0);
          
          // End on December 31st of the year
          endDate = new Date(currentDate.getFullYear(), 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setHours(23, 59, 59, 999);
      }
      
      console.log('Fetching events from', startDate, 'to', endDate);
      const fetchedEvents = await fetchEventsForDateRange(startDate, endDate);
      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentDate, view]);

  // Fetch events when date or view changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle navigation
  const handlePrevious = () => {
    setCurrentDate(getPreviousPeriod(currentDate, view));
  };

  const handleNext = () => {
    setCurrentDate(getNextPeriod(currentDate, view));
  };

  // Handle view change
  const handleViewChange = (newView) => {
    console.log('View changed to:', newView);
    setView(newView);
    
    // Call the onViewChange prop if it exists
    if (onViewChange) {
      onViewChange(newView);
    }
    
    // Force re-render by updating the current date slightly
    const newDate = new Date(currentDate);
    newDate.setSeconds(newDate.getSeconds() + 1);
    setCurrentDate(newDate);
    
    // Refetch events for the new view
    setTimeout(() => {
      fetchEvents();
    }, 100);
  };

  // Handle event click
  const handleEventClick = async (event) => {
    try {
      // In a real app, we would fetch the full event details here
      // For now, we'll just use the event from the list
      // const fullEvent = await fetchEventById(event.id);
      setSelectedEvent(event);
      setShowEventPopup(true);
      setShowEventList(false);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again later.');
    }
  };

  // Handle date click
  const handleDateClick = (date, hour = null, showMonthEvents = false) => {
    const eventsForDate = getEventsForDate(events, date);
    
    // Special case for showing all events in a month from year view
    if (showMonthEvents) {
      setSelectedDate(date);
      setShowEventList(true);
      setShowEventPopup(false);
      
      // Mark all events for this month to be displayed in the list
      setEvents(prevEvents => {
        return prevEvents.map(event => {
          const eventDate = new Date(event.start);
          if (eventDate.getMonth() === date.getMonth() && 
              eventDate.getFullYear() === date.getFullYear()) {
            return { ...event, _filtered: true };
          }
          return { ...event, _filtered: false };
        });
      });
      return;
    }
    
    // If an hour is specified (for day/week view time slot clicks)
    if (hour !== null) {
      // Filter events for this specific hour
      const eventsForHour = eventsForDate.filter(event => {
        const eventHour = new Date(event.start).getHours();
        return eventHour === hour;
      });
      
      if (eventsForHour.length === 1) {
        // If there's exactly one event, show the popup directly
        handleEventClick(eventsForHour[0]);
      } else if (eventsForHour.length > 1) {
        // If there are multiple events, show the list
        setSelectedDate(date);
        setShowEventList(true);
        setShowEventPopup(false);
        
        // Mark the events for this hour to be displayed in the list
        setEvents(prevEvents => {
          return prevEvents.map(event => {
            const eventHour = new Date(event.start).getHours();
            if (getEventsForDate([event], date).length > 0 && eventHour === hour) {
              return { ...event, _filtered: true };
            }
            return { ...event, _filtered: false };
          });
        });
      }
    } else {
      // For month/year view date clicks
      if (eventsForDate.length === 1) {
        // If there's exactly one event, show the popup directly
        handleEventClick(eventsForDate[0]);
      } else if (eventsForDate.length > 1) {
        // If there are multiple events, show the list
        setSelectedDate(date);
        setShowEventList(true);
        setShowEventPopup(false);
        
        // Check if this is a month view from year view (first day of month)
        if (view === 'year' && date.getDate() === 1) {
          // Mark all events for this month to be displayed in the list
          setEvents(prevEvents => {
            return prevEvents.map(event => {
              const eventDate = new Date(event.start);
              if (eventDate.getMonth() === date.getMonth() && 
                  eventDate.getFullYear() === date.getFullYear()) {
                return { ...event, _filtered: true };
              }
              return { ...event, _filtered: false };
            });
          });
        } else {
          // Reset any filtering to show all events for this date
          setEvents(prevEvents => {
            return prevEvents.map(event => {
              if (getEventsForDate([event], date).length > 0) {
                return { ...event, _filtered: true };
              }
              return { ...event, _filtered: false };
            });
          });
        }
      } else {
        // If there are no events, update the current date
        setCurrentDate(date);
        
        // If in year view, switch to month view
        if (view === 'year') {
          setView('month');
        }
        // If in month view, switch to day view
        else if (view === 'month') {
          setView('day');
        }
      }
    }
  };

  // Close popups
  const handleClosePopup = () => {
    setShowEventPopup(false);
    setSelectedEvent(null);
  };

  const handleCloseEventList = () => {
    setShowEventList(false);
    setSelectedDate(null);
  };

  return (
    <div className="calendar-container">
      <CalendarHeader 
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={handleViewChange}
        title={title}
      />
      
      <div className="calendar-content">
        {loading ? (
          <div className="calendar-loading">Loading events...</div>
        ) : error ? (
          <div className="calendar-error">{error}</div>
        ) : (
          <CalendarGrid 
            view={view}
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>
      
      {showEventPopup && (
        <CalendarEventPopup 
          event={selectedEvent} 
          onClose={handleClosePopup} 
        />
      )}
      
      {showEventList && selectedDate && (
        <CalendarEventList 
          date={selectedDate}
          events={events.filter(event => {
            // If the event has the _filtered flag, use that
            if (event._filtered !== undefined) {
              return event._filtered;
            }
            // Otherwise, get all events for the selected date
            return getEventsForDate([event], selectedDate).length > 0;
          })}
          onEventClick={handleEventClick}
          onClose={handleCloseEventList}
        />
      )}
    </div>
  );
};

export default Calendar;
