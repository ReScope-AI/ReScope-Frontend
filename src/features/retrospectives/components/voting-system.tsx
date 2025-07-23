'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, Clock, Users, Trophy } from 'lucide-react';
import { RetroItem } from './retro-activity-board';

interface VotingSystemProps {
  items: RetroItem[];
  onVote: (itemId: string, userId: string) => void;
  maxVotes?: number;
  timeLimit?: number;
}

export default function VotingSystem({
  items,
  onVote,
  maxVotes = 5,
  timeLimit = 300
}: VotingSystemProps) {
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [userId] = useState('current-user'); // Replace with actual user ID

  // Timer countdown
  useEffect(() => {
    if (timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLimit]);

  const handleVote = (itemId: string) => {
    const currentVotes = userVotes[itemId] || 0;
    if (currentVotes < maxVotes) {
      const newVotes = { ...userVotes, [itemId]: currentVotes + 1 };
      setUserVotes(newVotes);
      onVote(itemId, userId);
    }
  };

  const getRankedItems = () => {
    return [...items].sort((a, b) => b.votes - a.votes);
  };

  const getProgressPercentage = (votes: number) => {
    const maxPossible = Math.max(...items.map((i) => i.votes), 1);
    return (votes / maxPossible) * 100;
  };

  return (
    <div className='space-y-6'>
      {/* Timer Display */}
      {timeLimit > 0 && (
        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-blue-600' />
                <span className='text-sm font-medium'>
                  Voting Time Remaining
                </span>
              </div>
              <span className='text-lg font-bold text-blue-600'>
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Progress
              value={((timeLimit - timeRemaining) / timeLimit) * 100}
              className='mt-2'
            />
          </CardContent>
        </Card>
      )}

      {/* Voting Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Items</p>
                <p className='text-2xl font-bold'>{items.length}</p>
              </div>
              <Trophy className='h-8 w-8 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Votes</p>
                <p className='text-2xl font-bold'>
                  {items.reduce((sum, item) => sum + item.votes, 0)}
                </p>
              </div>
              <ThumbsUp className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Your Votes</p>
                <p className='text-2xl font-bold'>
                  {Object.values(userVotes).reduce(
                    (sum, count) => sum + count,
                    0
                  )}
                  /{maxVotes}
                </p>
              </div>
              <Users className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranked Items */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Ranked by Votes</h3>
        {getRankedItems().map((item, index) => (
          <Card key={item.id} className='transition-shadow hover:shadow-md'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Badge variant='outline' className='text-lg'>
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className='font-medium'>{item.content}</p>
                    <p className='text-sm text-gray-600'>By {item.author}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleVote(item.id)}
                      disabled={(userVotes[item.id] || 0) >= maxVotes}
                    >
                      <ThumbsUp className='h-4 w-4' />
                    </Button>
                    <span className='font-bold'>{item.votes}</span>
                  </div>
                  <Progress
                    value={getProgressPercentage(item.votes)}
                    className='w-20'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Vote Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Vote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {items.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
              >
                <div className='flex-1'>
                  <p className='text-sm'>{item.content}</p>
                  <p className='text-xs text-gray-600'>By {item.author}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    onClick={() => handleVote(item.id)}
                    disabled={(userVotes[item.id] || 0) >= maxVotes}
                    className='px-2'
                  >
                    <ThumbsUp className='h-4 w-4' />
                  </Button>
                  <span className='font-bold'>{item.votes}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
