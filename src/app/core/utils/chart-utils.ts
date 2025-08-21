// chart-utils.ts
export function getDayOfWeek(dayNumber: number): string {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return daysOfWeek[dayNumber];
}

export function getRandomColor(dayNumber: number): string {
  const colorsOfWeek = [
    '#008ffb',
    '#00e396',
    '#feb019',
    '#ff4560',
    '#775dd0',
    'rgba(0,143,251,0.85)',
    'rgba(0,227,150,0.85)',
  ];
  return colorsOfWeek[dayNumber];
}

export interface ChartData {
  x: string;
  y: number;
  fillColor: string;
}
export function mapToElectricityData(item: any, index: number): ChartData {
  const day = item.Day;
  const month = item.DateMonth - 1; // JavaScript months are 0-based
  const year = item.GetYear;
  const date = new Date(year, month, day);
  const dayOfWeek = getDayOfWeek(date.getDay());
  const formattedDate = date.toLocaleDateString('default', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return {
    x: `${dayOfWeek}, ${formattedDate}`, // Combine day of the week and formatted date
    y: item.Value,
    fillColor: getRandomColor(index),
    date: date.toDateString(), // Convert date to string
    unit: item.Unit, // Add unit to the data
  };
}
export interface ChartData {
  x: string;
  y: number;
  fillColor: string;
  date: string; // Add this line
  unit: string; // Unit for the data point
}
