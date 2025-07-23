'use client';

import { useSocket } from '@/hooks/use-socket';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ConnectedUsersProps {
  boardId: string;
}

export function ConnectedUsers({ boardId }: ConnectedUsersProps) {
  const { connectedUsers, isConnected } = useSocket(boardId);

  if (!isConnected) {
    return (
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <Users className='h-4 w-4' />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-2'>
        <Users className='text-muted-foreground h-4 w-4' />
        <span className='text-muted-foreground text-sm'>
          {connectedUsers.length} online
        </span>
      </div>

      <div className='flex -space-x-2'>
        {connectedUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className='border-background h-6 w-6 border-2'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {connectedUsers.length > 3 && (
          <Badge variant='secondary' className='h-6 px-1 text-xs'>
            +{connectedUsers.length - 3}
          </Badge>
        )}
      </div>
    </div>
  );
}
