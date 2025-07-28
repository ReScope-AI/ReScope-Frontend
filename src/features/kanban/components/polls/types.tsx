export interface PollOption {
  id: string;
  text: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  date?: string;
}
