export interface RetroCard {
  id: string;
  content: string;
  author: string;
  votes: number;
  voters: string[];
  createdAt: Date;
  columnId: string;
}

export interface RetroColumn {
  id: string;
  title: string;
  description: string;
  color: string;
  cards: RetroCard[];
}

export interface RetroBoard {
  id: string;
  title: string;
  columns: RetroColumn[];
  participants: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
