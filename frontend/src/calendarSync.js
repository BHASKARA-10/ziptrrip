export const syncTaskToGoogleCalendar = async (task, token) => {
  if (!token) {
    console.log("No Google Access Token found, skipping calendar sync.");
    return false;
  }

  try {
    const event = {
      summary: task.title,
      description: task.description || "Task from ziptrrip",
      start: {
        dateTime: new Date().toISOString(), // In a real app, use the task's start date
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (response.ok) {
      console.log('Event created successfully in Google Calendar');
      return true;
    } else {
      console.error('Failed to create event in Google Calendar', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    return false;
  }
};
