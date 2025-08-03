'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

export default function RadarChartComponent() {
  const retroSession = useRetroSessionStore((state) => state.retroSession);

  const data = retroSession?.radar_criteria?.map((criteria) => ({
    criteria: criteria.criteria,
    score: criteria.score
  }));

  return (
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
          formatter={(value: number) => `${value}/10`}
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
  );
}
