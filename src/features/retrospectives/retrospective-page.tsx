'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  useDeleteRetroSession,
  useGetRetroSessions
} from '@/hooks/use-retro-session-api';
import { Calendar, EllipsisVertical, FileText, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import DialogSelectBoard from './components/dialog-select-board';
import { RetroSession, Sprint, Team, useRetrospectiveStore } from './stores';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [openDialogSelectBoard, setOpenDialogSelectBoard] = useState(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState(false);
  const [retroSessionToDelete, setRetroSessionToDelete] =
    useState<RetroSession | null>(null);
  const getAllRetroSessions = useGetRetroSessions();
  const deleteRetroSession = useDeleteRetroSession();
  const { setRetroSessions, retroSessions } = useRetrospectiveStore();
  const retroSessionData = getAllRetroSessions.data?.data;

  const handleOpenDialogSelectBoard = () => {
    setOpenDialogSelectBoard(true);
  };

  useEffect(() => {
    if (retroSessionData) {
      setRetroSessions(
        retroSessionData.map((retroSession) => ({
          ...retroSession,
          team: retroSession.team_id as Team,
          sprint: retroSession.sprint_id as Sprint,
          id: retroSession._id,
          created_at: retroSession.created_at,
          updated_at: retroSession.updated_at
        }))
      );
    }
  }, [retroSessionData, setRetroSessions]);

  const renderDialogConfirmDelete = () => {
    return (
      <Dialog
        open={openDialogConfirmDelete}
        onOpenChange={setOpenDialogConfirmDelete}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meeting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meeting?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setOpenDialogConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                deleteRetroSession.mutate(retroSessionToDelete?.id || '');
                setOpenDialogConfirmDelete(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
          {retroSessions.map((meeting) => (
            <Card
              onClick={() => {
                router.push(`/dashboard/retrospective/${meeting.id}`);
              }}
              key={meeting.id}
              className='flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={meeting?.team?.name || '/placeholder.svg'}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>{meeting.name}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant='ghost' size='sm'>
                        <EllipsisVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-red-500'
                        onClick={() => {
                          setRetroSessionToDelete(meeting);
                          setOpenDialogConfirmDelete(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className='text-xs text-gray-500'>{meeting.end_date}</p>
              </CardHeader>
              <CardContent className='flex flex-1 flex-col justify-between pt-0'>
                <div className='mb-3 flex items-center justify-between'>
                  <Badge variant='secondary' className='text-xs'>
                    <FileText className='mr-1 h-3 w-3' />
                    {meeting.sprint.name}
                  </Badge>
                  <span className='text-xs text-gray-500'>
                    {meeting.sprint.name}
                  </span>
                </div>
                <div className='mt-auto flex items-center gap-1'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={meeting?.team?.name || '/placeholder.svg'}
                    />
                    <AvatarFallback>{meeting?.team?.name[0]}</AvatarFallback>
                  </Avatar>
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
      />

      {renderDialogConfirmDelete()}
    </div>
  );
}
