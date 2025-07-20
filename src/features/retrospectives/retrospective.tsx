'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, FileText, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DialogSelectBoard from './components/dialog-select-board';
import { recentMeetings } from './data';
import { type SprintFormData } from './schemas/validation';

export default function DashboardPage() {
  const router = useRouter();

  const [openDialogSelectBoard, setOpenDialogSelectBoard] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string>('');

  const handleOpenDialogSelectBoard = () => {
    setOpenDialogSelectBoard(true);
  };

  const handleSelectBoard = (board: string) => {
    setSelectedBoard(board);
  };

  const handleNext = (formData: SprintFormData) => {
    console.log('Form data:', formData);
    // TODO: Handle form data before navigation
    router.push(`/dashboard/retrospective/${selectedBoard}`);
  };

  return (
    <div className='h-full w-full p-4'>
      <div>
        <div className='grid grid-cols-1 items-stretch gap-6 md:grid-cols-2'>
          <Card
            className='flex h-full cursor-pointer flex-col justify-center transition-shadow hover:shadow-md'
            onClick={handleOpenDialogSelectBoard}
          >
            <CardContent className='flex h-full flex-col justify-center py-6'>
              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                  <FileText className='h-5 w-5 text-blue-600' />
                </div>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-lg font-semibold'>Retrospective</h3>
                  <p className='text-sm text-gray-600'>
                    Start a new Retrospective meeting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='flex h-full cursor-pointer flex-col justify-center transition-shadow hover:shadow-md'>
            <CardContent className='flex h-full flex-col justify-center py-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                  <Zap className='h-5 w-5 text-purple-600' />
                </div>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-lg font-semibold'>Planning Poker</h3>
                  <p className='text-sm text-gray-600'>
                    Start a new Planning Poker meeting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Meetings */}
      <div>
        <div className='mt-8 mb-4 flex items-start justify-between'>
          <div className='mx-2 flex flex-col items-start'>
            <h2 className='text-xl font-semibold'>Your Recent Meetings</h2>
            <p className='text-sm text-gray-600'>
              Meetings that you have either created or joined recently
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {recentMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className='flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={
                          meeting.participants[0]?.avatar || '/placeholder.svg'
                        }
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>{meeting.title}</span>
                  </div>
                  <Button variant='ghost' size='sm'>
                    <Star className='h-4 w-4' />
                  </Button>
                </div>
                <p className='text-xs text-gray-500'>{meeting.date}</p>
              </CardHeader>
              <CardContent className='flex flex-1 flex-col justify-between pt-0'>
                <div className='mb-3 flex items-center justify-between'>
                  <Badge variant='secondary' className='text-xs'>
                    <FileText className='mr-1 h-3 w-3' />
                    {meeting.type}
                  </Badge>
                  <span className='text-xs text-gray-500'>
                    {meeting.items} items
                  </span>
                </div>
                <div className='mt-auto flex items-center gap-1'>
                  {meeting.participants.map((participant, index) => (
                    <Avatar key={index} className='h-6 w-6'>
                      <AvatarImage
                        src={participant.avatar || '/placeholder.svg'}
                      />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty state card */}
          <Card className='flex h-full flex-col justify-center border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'>
            <CardContent className='flex h-full flex-col items-center justify-center p-6 text-center'>
              <div className='mb-2 text-gray-400'>
                <Calendar className='mx-auto h-8 w-8' />
              </div>
              <p className='mb-2 text-sm text-gray-500'>Kollabe</p>
              <p className='text-xs text-gray-400'>Wed Jul 09 2025</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <DialogSelectBoard
        open={openDialogSelectBoard}
        onOpenChange={setOpenDialogSelectBoard}
        selectedBoard={selectedBoard}
        onSelect={handleSelectBoard}
        onNext={handleNext}
      />
    </div>
  );
}
