export type EventType = "major" | "regular-season";

export interface SportEvent {
  id: string;
  name: string;
  sport: string;
  type: EventType;
  startDate: Date;
  endDate?: Date;
  imageUrl?: string;
  link?: string; // Internal link (e.g., "/sports/cricket/world-cup")
  externalLink?: string; // External link
  description?: string;
  location?: string;
  tags?: string[]; // Emojis or text tags (e.g., ["♂️", "🏆", "🌍"])
}

export interface MonthEvents {
  month: string;
  year: number;
  events: SportEvent[];
}

export type EventFilter = "all" | "major" | "regular-season";
