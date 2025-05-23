export interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export const dummyEntries: Entry[] = [
  {
    id: "1",
    date: "2025-04-01",
    title: "First Day of April",
    content: "Started the month with a fresh perspective..."
  },
  {
    id: "2",
    date: "2025-04-11",
    title: "Mid-April Thoughts",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
  },
  {
    id: "3",
    date: "2025-04-25",
    title: "End of April Approaching",
    content: "Reflecting on the month's progress..."
  }
]; 