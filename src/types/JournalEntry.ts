export interface JournalEntry {
    id: string;
    date: string; // ISO string
    title: string;
    content: string;
    tags?: string[];
  }
  