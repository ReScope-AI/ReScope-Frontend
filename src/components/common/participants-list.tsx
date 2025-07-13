import React from 'react';
import { useRetrospectiveStore } from '../../stores/retrospective-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users } from 'lucide-react';

export const ParticipantsList: React.FC = () => {
  const { connectedUsers, currentUser } = useRetrospectiveStore();

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg border p-3 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>{connectedUsers.length} participants</span>
      </div>

      <div className="flex -space-x-2">
        {connectedUsers.map((user, index) => (
          <div key={user.id} className="relative" style={{ zIndex: connectedUsers.length - index }}>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            {user.id === currentUser?.id && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
