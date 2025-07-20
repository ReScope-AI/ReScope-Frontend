import { FileText } from 'lucide-react';

export const boardTypes = {
  'planning-poker': [
    {
      id: 'standard',
      title: 'Standard Planning Poker',
      description:
        'A standard planning poker session for story point estimation with your team.',
      icon: FileText,
      selected: true
    }
  ]
};

export const recentMeetings = [
  {
    id: 1,
    title: 'Tue, Jul 8, 2025',
    date: '7/8/2025',
    type: 'Retrospective',
    items: 4,
    participants: [
      { name: 'User 1', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'User 2', avatar: '/placeholder.svg?height=32&width=32' },
      { name: 'User 3', avatar: '/placeholder.svg?height=32&width=32' }
    ]
  },
  {
    id: 2,
    title: 'Thu, Jun 26, 2025',
    date: '6/26/2025',
    type: 'Retrospective',
    items: 0,
    participants: [
      { name: 'Kane', avatar: '/placeholder.svg?height=32&width=32' }
    ]
  }
];
