/**
 * Date utility functions for the Calendar component
 */

/**
 * Format a date to display in the calendar header
 * @param {Date} date - The date to format
 * @param {string} view - The current view (day, week, month, year)
 * @returns {string} Formatted date string
 */
export const formatHeaderDate = (date, view) => {
  const options = { timeZone: 'UTC' };
  
  switch (view) {
    case 'day':
      return date.toLocaleDateString('en-US', { 
        ...options,
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    case 'week':
      const startOfWeek = getStartOfWeek(date);
      const endOfWeek = getEndOfWeek(date);
      
      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const startMonth = startOfWeek.toLocaleDateString('en-US', { ...options, month: 'long' });
      const endMonth = endOfWeek.toLocaleDateString('en-US', { ...options, month: 'long' });
      const year = date.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startDay} to ${endDay} ${startMonth}, ${year}`;
      } else {
        return `${startDay} ${startMonth} to ${endDay} ${endMonth}, ${year}`;
      }
    case 'month':
      return date.toLocaleDateString('en-US', { ...options, month: 'long', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Get the start date of the week containing the given date
 * @param {Date} date - The date
 * @returns {Date} The start date of the week
 */
export const getStartOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(newDate.setDate(diff));
};

/**
 * Get the end date of the week containing the given date
 * @param {Date} date - The date
 * @returns {Date} The end date of the week
 */
export const getEndOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() + (7 - day) % 7; // Adjust for Sunday
  return new Date(newDate.setDate(diff));
};

/**
 * Get the start date of the month containing the given date
 * @param {Date} date - The date
 * @returns {Date} The start date of the month
 */
export const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get the end date of the month containing the given date
 * @param {Date} date - The date
 * @returns {Date} The end date of the month
 */
export const getEndOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Get all dates in a month as an array of Date objects
 * @param {Date} date - Any date in the month
 * @returns {Date[]} Array of dates
 */
export const getDatesInMonth = (date) => {
  const startDate = getStartOfMonth(date);
  const endDate = getEndOfMonth(date);
  const datesArray = [];
  
  // Get the first day of the month
  const firstDay = startDate.getDay();
  
  // Get the previous month's dates to fill in the first week
  const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  
  // Add previous month's dates
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, prevMonthEnd - i);
    datesArray.push(prevDate);
  }
  
  // Add current month's dates
  for (let i = 1; i <= endDate.getDate(); i++) {
    datesArray.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  
  // Add next month's dates to complete the grid (6 rows x 7 columns = 42 cells)
  const remainingDays = 42 - datesArray.length;
  for (let i = 1; i <= remainingDays; i++) {
    datesArray.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
  }
  
  return datesArray;
};

/**
 * Get all dates in a week as an array of Date objects
 * @param {Date} date - Any date in the week
 * @returns {Date[]} Array of dates
 */
export const getDatesInWeek = (date) => {
  const startDate = getStartOfWeek(date);
  const datesArray = [];
  
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    datesArray.push(newDate);
  }
  
  return datesArray;
};

/**
 * Get all hours in a day as an array of formatted strings
 * @returns {string[]} Array of formatted hour strings
 */
export const getHoursInDay = () => {
  const hours = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12; // Convert 0 to 12 for 12 AM
    const ampm = i < 12 ? 'AM' : 'PM';
    hours.push(`${hour} ${ampm}`);
  }
  
  return hours;
};

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  // Handle string dates by converting to Date objects
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Format a date to display in the calendar
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Format a time to display in the calendar
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};


/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return isSameDay(date, today);
};

/**
 * Group events by date
 * @param {Array} events - Array of event objects
 * @returns {Object} Events grouped by date
 */
export const groupEventsByDate = (events) => {
  const grouped = {};
  
  events.forEach(event => {
    const eventDate = new Date(event.start);
    const dateKey = eventDate.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(event);
  });
  
  return grouped;
};

/**
 * Get the number of events on a specific date
 * @param {Array} events - Array of event objects
 * @param {Date} date - The date to check
 * @returns {number} Number of events on the date
 */
export const getEventCountForDate = (events, date) => {
  const dateKey = date.toISOString().split('T')[0];
  const groupedEvents = groupEventsByDate(events);
  
  return groupedEvents[dateKey] ? groupedEvents[dateKey].length : 0;
};

/**
 * Get events for a specific date
 * @param {Array} events - Array of event objects
 * @param {Date} date - The date to check
 * @returns {Array} Events on the date
 */
export const getEventsForDate = (events, date) => {
  const dateKey = date.toISOString().split('T')[0];
  const groupedEvents = groupEventsByDate(events);
  
  return groupedEvents[dateKey] || [];
};

/**
 * Navigate to the previous period based on the current view
 * @param {Date} currentDate - The current date
 * @param {string} view - The current view (day, week, month, year)
 * @returns {Date} The new date
 */
export const getPreviousPeriod = (currentDate, view) => {
  const newDate = new Date(currentDate);
  
  switch (view) {
    case 'day':
      newDate.setDate(newDate.getDate() - 1);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() - 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() - 1);
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() - 1);
      break;
  }
  
  return newDate;
};

/**
 * Navigate to the next period based on the current view
 * @param {Date} currentDate - The current date
 * @param {string} view - The current view (day, week, month, year)
 * @returns {Date} The new date
 */
export const getNextPeriod = (currentDate, view) => {
  const newDate = new Date(currentDate);
  
  switch (view) {
    case 'day':
      newDate.setDate(newDate.getDate() + 1);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }
  
  return newDate;
};
