/**
 * API utility functions for the Calendar component
 */

/**
 * Fetch events for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Promise resolving to an array of events
 */
export const fetchEventsForDateRange = async (startDate, endDate) => {
  try {
    // In a real app, this would be a fetch to an actual API endpoint with query parameters
    // For now, we'll use the local JSON file
    const response = await fetch('/json/calendarfromtoenddate.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter events within the date range
    // Convert ISO strings to Date objects for comparison
    const filteredEvents = data.filter(event => {
      const eventStart = new Date(event.start);
      // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
      const eventDate = new Date(eventStart);
      eventDate.setHours(0, 0, 0, 0);
      
      const startDateCopy = new Date(startDate);
      startDateCopy.setHours(0, 0, 0, 0);
      
      const endDateCopy = new Date(endDate);
      endDateCopy.setHours(23, 59, 59, 999);
      
      return eventDate >= startDateCopy && eventDate <= endDateCopy;
    });
    
    console.log('Filtered events:', filteredEvents);
    
    return filteredEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch a specific event by ID
 * @param {number} eventId - The event ID
 * @returns {Promise<Object>} Promise resolving to the event object
 */
export const fetchEventById = async (eventId) => {
  try {
    // In a real app, this would be a fetch to an actual API endpoint with the event ID
    // For now, we'll use the local JSON file
    const response = await fetch('/json/calendar_meeting.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const event = await response.json();
    
    // In a real API, we would filter by ID on the server
    // Here we're just returning the single event from the JSON file
    // If we needed to actually filter, we would do:
    // return event.id === eventId ? event : null;
    
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Fetch all events (for testing)
 * @returns {Promise<Array>} Promise resolving to an array of all events
 */
export const fetchAllEvents = async () => {
  try {
    const response = await fetch('/json/calendarfromtoenddate.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};
