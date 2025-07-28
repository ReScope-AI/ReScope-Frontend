import { Poll } from './types';

// Default Polls Data
export const defaultPolls: Poll[] = [
  {
    id: '1',
    question: 'How are you feeling today?',
    options: ['Fantastic', 'Good', 'Okay', 'Bad', 'Pretty Bad']
  },
  {
    id: '2',
    question:
      'How would you rate our team collaboration and communication in this sprint?',
    options: ['Excellent', 'Good', 'Average', 'Poor']
  },
  {
    id: '3',
    question: 'To what extent did we achieve our sprint goals?',
    options: [
      'Fully achieved',
      'Mostly achieved',
      'Partially achieved',
      'Not achieved'
    ]
  },
  {
    id: '4',
    question: 'What was the biggest obstacle faced during this sprint?',
    options: [
      'Technical challenges',
      'Resource constraints',
      'Communication issues',
      'Scope changes'
    ]
  },
  {
    id: '5',
    question:
      'What should be our primary focus for improvement in the next sprint?',
    options: [
      'Code quality',
      'Team communication',
      'Process efficiency',
      'Technical skills'
    ]
  },
  {
    id: '6',
    question:
      'How do you rate the clarity and understanding of the sprint objectives?',
    options: ['Very clear', 'Mostly clear', 'Somewhat unclear', 'Very unclear']
  }
];
