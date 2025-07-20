import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronRight, Copy, FileText, Workflow } from 'lucide-react';

const boardTypes = {
  retrospective: [
    {
      id: 'standard',
      title: 'Standard',
      description:
        'A standard retrospective board with no predefined flow. This board is perfect for teams that want to run a free-form retrospective.',
      icon: FileText,
      selected: true
    },
    {
      id: 'guided',
      title: 'Guided',
      description:
        "A guided retrospective that follows a step-by-step process. You can customize the flow to fit your team's needs.",
      icon: Workflow,
      selected: false
    }
  ],
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

type DialogSelectBoardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBoard: string;
  onSelect: (board: string) => void;
  onNext: () => void;
};

const DialogSelectBoard = ({
  open,
  onOpenChange,
  selectedBoard,
  onSelect,
  onNext
}: DialogSelectBoardProps) => {
  const boards = boardTypes.retrospective;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className='min-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Select Board</DialogTitle>
        </DialogHeader>
        <div className='h-full w-full'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label>Retro Name</Label>
              <Input placeholder='Retro Name' className='w-full' />
            </div>

            <div className='flex flex-col gap-2'>
              <Label>Select Templates</Label>
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a timezone' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Common Templates</SelectLabel>
                    <SelectItem value='est'>Start-Stop-Continue</SelectItem>
                    <SelectItem value='cst'>Glad, Sad, Mad</SelectItem>
                    <SelectItem value='mst'>
                      DAKI - Drop, Add, Keep, Improve
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
            {boards.map((board) => (
              <Card
                key={board.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBoard === board.id
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : 'border-gray-200'
                }`}
                onClick={() => onSelect(board.id)}
              >
                <CardContent className='p-6'>
                  {/* Preview Image Area */}
                  <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                    <div className='text-gray-400'>
                      <board.icon className='h-12 w-12' />
                    </div>
                  </div>

                  {/* Board Type Info */}
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <board.icon className='h-5 w-5 text-blue-600' />
                      <h3 className='text-lg font-semibold'>{board.title}</h3>
                    </div>
                    <p className='text-sm leading-relaxed text-gray-600'>
                      {board.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <div className='mt-8 flex justify-end'>
            <Button
              onClick={onNext}
              className='bg-blue-600 px-8 hover:bg-blue-700'
            >
              Next
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSelectBoard;
