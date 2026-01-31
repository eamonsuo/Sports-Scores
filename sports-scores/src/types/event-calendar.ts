export type EventType = "major" | "regular-season";

export interface SportEvent {
  id: string;
  name: string;
  sport: string;
  type: EventType;
  startDate: Date;
  endDate?: Date;
  dateDisplay?: string; // Optional custom date display (e.g., "Jan 2027 - Feb 2027")
  imageUrl?: string;
  link?: string; // Internal link (e.g., "/sports/cricket/world-cup")
  description?: string;
  location?: string;
  tags?: string[]; // Emojis or text tags (e.g., ["♂️", "🏆", "🌍"])
  notes?: string; // Additional notes (e.g., "Finals start: Oct 1", "Grand Final: Oct 4")
}

export interface MonthEvents {
  month: string;
  year: number;
  events: SportEvent[];
}

export type EventFilter = "all" | "major" | "regular-season";
