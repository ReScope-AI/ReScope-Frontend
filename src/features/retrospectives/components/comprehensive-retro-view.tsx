'use client';

import { useState } from 'react';
import RetroActivityBoard from './retro-activity-board';
import VotingSystem from './voting-system';
import ActionItemsTracker from './action-items-tracker';
import ParticipantManager from './participant-manager';
import RetroAnalytics from './retro-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Share2 } from 'lucide-react';

interface ComprehensiveRetroViewProps {
  retroId: string;
}

export default function ComprehensiveRetroView({
  retroId
}: ComprehensiveRetroViewProps) {
  const [retroItems, setRetroItems] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [votingItems, setVotingItems] = useState<any[]>([]);

  const handleVote = (itemId: string, userId: string) => {
    setVotingItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, votes: (item.votes || 0) + 1 } : item
      )
    );
  };

  const handleRetroItemUpdate = (items: any[]) => {
    setRetroItems(items);
    setVotingItems(items);
  };

  return (
    <div className='space-y-6'>
      {/* Header Controls */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Retrospective Session</h2>
              <p className='text-sm text-gray-600'>
                Collaborate and improve together
              </p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={isVotingActive ? 'destructive' : 'default'}
                onClick={() => setIsVotingActive(!isVotingActive)}
              >
                {isVotingActive ? (
                  <Pause className='mr-2 h-4 w-4' />
                ) : (
                  <Play className='mr-2 h-4 w-4' />
                )}
                {isVotingActive ? 'End Voting' : 'Start Voting'}
              </Button>
              <Button variant='outline'>
                <Share2 className='mr-2 h-4 w-4' />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue='activity' className='w-full'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
          <TabsTrigger value='voting'>Voting</TabsTrigger>
          <TabsTrigger value='actions'>Action Items</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value='activity' className='space-y-4'>
          <RetroActivityBoard
            retroId={retroId}
            // onItemsUpdate={handleRetroItemUpdate}
          />
        </TabsContent>

        <TabsContent value='voting' className='space-y-4'>
          <VotingSystem
            items={votingItems}
            onVote={handleVote}
            maxVotes={5}
            timeLimit={300}
          />
        </TabsContent>

        <TabsContent value='actions' className='space-y-4'>
          <ActionItemsTracker retroId={retroId} retroItems={retroItems} />
        </TabsContent>

        <TabsContent value='participants' className='space-y-4'>
          <ParticipantManager retroId={retroId} />
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <RetroAnalytics
            retroId={retroId}
            retroItems={retroItems}
            actionItems={actionItems}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
