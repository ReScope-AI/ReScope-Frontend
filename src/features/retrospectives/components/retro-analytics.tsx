'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, MessageSquare, CheckCircle } from 'lucide-react';

interface RetroAnalyticsProps {
  retroId: string;
  retroItems?: any[];
  actionItems?: any[];
}

export default function RetroAnalytics({
  retroId,
  retroItems = [],
  actionItems = []
}: RetroAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('current');

  // Mock data for demonstration
  const participationData = [
    { name: 'John', contributions: 12, votes: 8 },
    { name: 'Jane', contributions: 15, votes: 12 },
    { name: 'Mike', contributions: 8, votes: 5 },
    { name: 'Sarah', contributions: 10, votes: 7 }
  ];

  const categoryData = [
    { name: 'Went Well', value: 8, color: '#10B981' },
    { name: 'To Improve', value: 12, color: '#F59E0B' },
    { name: 'Action Items', value: 6, color: '#3B82F6' }
  ];

  const moodData = [
    { week: 'Week 1', mood: 7.5 },
    { week: 'Week 2', mood: 8.2 },
    { week: 'Week 3', mood: 6.8 },
    { week: 'Week 4', mood: 8.5 }
  ];

  const getCompletionRate = () => {
    if (actionItems.length === 0) return 0;
    return (
      (actionItems.filter((item) => item.status === 'completed').length /
        actionItems.length) *
      100
    );
  };

  const getAverageMood = () => {
    return moodData.reduce((sum, item) => sum + item.mood, 0) / moodData.length;
  };

  return (
    <div className='space-y-6'>
      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Items</p>
                <p className='text-2xl font-bold'>{retroItems.length}</p>
              </div>
              <MessageSquare className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Action Items</p>
                <p className='text-2xl font-bold'>{actionItems.length}</p>
              </div>
              <CheckCircle className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Completion Rate</p>
                <p className='text-2xl font-bold'>
                  {getCompletionRate().toFixed(0)}%
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-purple-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Team Mood</p>
                <p className='text-2xl font-bold'>
                  {getAverageMood().toFixed(1)}/10
                </p>
              </div>
              <Users className='h-8 w-8 text-orange-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={participationData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey='contributions'
                fill='#3B82F6'
                name='Contributions'
              />
              <Bar dataKey='votes' fill='#10B981' name='Votes' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Feedback Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='week' />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey='mood' fill='#8B5CF6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Common Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Common Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Communication</span>
              <Progress value={85} className='w-32' />
              <Badge variant='secondary'>12 mentions</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Process</span>
              <Progress value={70} className='w-32' />
              <Badge variant='secondary'>8 mentions</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Tools</span>
              <Progress value={60} className='w-32' />
              <Badge variant='secondary'>6 mentions</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Team Dynamics</span>
              <Progress value={45} className='w-32' />
              <Badge variant='secondary'>4 mentions</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
