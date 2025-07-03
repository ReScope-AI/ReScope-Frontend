export interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: 'communicate' | 'process' | 'estimate' | 'timebound' | 'quality';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Question {
  id: string;
  text: string;
  category: 'communicate' | 'process' | 'estimate' | 'timebound' | 'quality';
  answers: Array<{
    id: string;
    text: string;
    type: 'enhancement' | 'continues';
  }>;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  questions: Question[];
  enhancementTodos: TodoItem[];
  continuesTodos: TodoItem[];
}
