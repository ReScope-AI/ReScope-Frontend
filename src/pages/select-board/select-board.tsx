import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Copy, FileText, Workflow } from 'lucide-react';
import { useState } from 'react';

const boardTypes = {
  retrospective: [
    {
      id: 'standard',
      title: 'Standard',
      description:
        'A standard retrospective board with no predefined flow. This board is perfect for teams that want to run a free-form retrospective.',
      icon: FileText,
      selected: true,
    },
    {
      id: 'guided',
      title: 'Guided',
      description:
        "A guided retrospective that follows a step-by-step process. You can customize the flow to fit your team's needs.",
      icon: Workflow,
      selected: false,
    },
    {
      id: 'duplicate',
      title: 'Duplicate',
      description:
        'Duplicate an existing meeting, including all polls, columns and settings. Perfect for teams that have fine tuned their retrospective process and want to reuse it.',
      icon: Copy,
      selected: false,
    },
  ],
  'planning-poker': [
    {
      id: 'standard',
      title: 'Standard Planning Poker',
      description: 'A standard planning poker session for story point estimation with your team.',
      icon: FileText,
      selected: true,
    },
  ],
};

const SelectBoard = () => {
  const [selectedBoard, setSelectedBoard] = useState('standard');

  const boards = boardTypes.retrospective;

  const handleNext = () => {
    console.log('Selected board:', selectedBoard);
  };
  return (
    <div className="p-4 w-full h-full px-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Select Board</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {boards.map((board) => (
          <Card
            key={board.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBoard === board.id
                ? 'ring-2 ring-blue-500 border-blue-500'
                : 'border-gray-200'
            }`}
            onClick={() => setSelectedBoard(board.id)}
          >
            <CardContent className="p-6">
              {/* Preview Image Area */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-gray-400">
                  <board.icon className="h-12 w-12" />
                </div>
              </div>

              {/* Board Type Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <board.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{board.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{board.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-8">
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectBoard;
