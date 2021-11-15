let eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
    backgroundColor: 'red',
    allDay: true,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    allDay: false,
    start: todayStr + 'T12:00:00',
  },
]

export function createEventId() {
  return String(eventGuid++)
}
