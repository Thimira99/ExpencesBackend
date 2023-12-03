// Helper function to get day name from day of week (1 = Sunday, 2 = Monday, etc.)
export function getDayName(dayOfWeek: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayOfWeek - 1];
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Adjust monthIndex to be zero-based
  const adjustedIndex = monthIndex - 1;

  return months[adjustedIndex];
}
