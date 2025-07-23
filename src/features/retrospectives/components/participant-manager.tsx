'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Copy, Mail } from 'lucide-react';
import { useRealtimeStore } from '../stores/retro-realtime-store';

interface Participant {
  id: string;
  name: string;
  email?: string;
  role: 'facilitator' | 'participant' | 'observer';
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  joinedAt: Date;
}

interface ParticipantManagerProps {
  retroId: string;
}

export default function ParticipantManager({
  retroId
}: ParticipantManagerProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'facilitator',
      status: 'online',
      avatar: '/placeholder-avatar.png',
      joinedAt: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'participant',
      status: 'online',
      avatar: '/placeholder-avatar.png',
      joinedAt: new Date()
    }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState(
    `https://rescop.app/retro/${retroId}/join`
  );

  const { participants: realtimeParticipants } = useRealtimeStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'facilitator':
        return 'bg-purple-100 text-purple-800';
      case 'participant':
        return 'bg-blue-100 text-blue-800';
      case 'observer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // toast.success('Invite link copied to clipboard');
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    // Send email invite logic here
    setInviteEmail('');
    // toast.success('Invite sent successfully');
  };

  return (
    <div className='space-y-6'>
      {/* Invite Section */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Participants</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              type='email'
              placeholder='Enter email address'
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button onClick={sendInvite}>
              <Mail className='mr-2 h-4 w-4' />
              Send Invite
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <Input value={inviteLink} readOnly className='flex-1' />
            <Button variant='outline' onClick={copyInviteLink}>
              <Copy className='mr-2 h-4 w-4' />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {participants.map((participant) => (
              <div
                key={participant.id}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-4'
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}
                    />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-medium'>{participant.name}</h4>
                      <Badge className={getRoleColor(participant.role)}>
                        {participant.role}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-600'>{participant.email}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {participant.status}
                  </Badge>
                  <span className='text-xs text-gray-500'>
                    Joined {participant.joinedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Status */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {participants.filter((p) => p.status === 'online').length}
              </div>
              <div className='text-sm text-gray-600'>Online</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-yellow-600'>
                {participants.filter((p) => p.status === 'away').length}
              </div>
              <div className='text-sm text-gray-600'>Away</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-600'>
                {participants.filter((p) => p.status === 'offline').length}
              </div>
              <div className='text-sm text-gray-600'>Offline</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
