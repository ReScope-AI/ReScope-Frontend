'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const data = [
  {
    criteria: 'TEAMWORK',
    score: 6.6
  },
  {
    criteria: 'COMMUNICATION',
    score: 5.7
  },
  {
    criteria: 'QUALITY',
    score: 6.3
  },
  {
    criteria: 'TIMEBOUND',
    score: 4.7
  },
  {
    criteria: 'ESTIMATION',
    score: 5.1
  }
];

export default function EvaluationRadarChart() {
  return (
    <Card className='border-border mx-auto w-full max-w-xl border shadow-md'>
      <CardHeader>
        <CardTitle className='text-center text-lg font-semibold'>
          Performance Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className='h-[400px] p-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart data={data} cx='50%' cy='50%' outerRadius='80%'>
            <PolarGrid strokeDasharray='4 4' />
            <PolarAngleAxis
              dataKey='criteria'
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb'
              }}
              formatter={(value: number) => `${value}/5`}
            />
            <Radar
              name='Score'
              dataKey='score'
              stroke='#4F46E5'
              fill='#6366F1'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
