'use client';

import { AlertTriangle, PieChart, Target } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

import { useTaskStore } from '../../utils/store';
import RadarChartComponent from '../radar-chart';

const SummaryOverview = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const columns = useTaskStore((state) => state.columns);
  const { retroSession } = useRetroSessionStore();

  // Create a map of category counts
  const categoryCounts = columns.reduce(
    (acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalItems = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Calculate percentages for each category
  const categoryPercentages = columns.reduce(
    (acc, column) => {
      acc[column.id] =
        totalItems > 0 ? (categoryCounts[column.id] / totalItems) * 100 : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <Card className='lg:row-span-2'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5' />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-96 items-center justify-center'>
            <RadarChartComponent />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {retroSession?.keyInsights &&
            retroSession.keyInsights.length > 0 ? (
              retroSession.keyInsights.map((insight, index) => (
                <div
                  key={insight._id || index}
                  className='bg-secondary flex items-start gap-3 rounded-lg p-3'
                >
                  <div className='flex-1'>
                    <h4 className='text-sm font-medium'>{insight.title}</h4>
                    <p className='mt-1 text-xs text-gray-600'>
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-4 text-center text-gray-500'>
                <p className='text-sm'>No key insights available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <PieChart className='h-5 w-5' />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {columns.map((column) => (
              <div
                key={column.id}
                className='flex items-center justify-between'
              >
                <span className='text-sm font-medium'>{column.title}</span>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-20 rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-blue-500'
                      style={{ width: `${categoryPercentages[column.id]}%` }}
                    ></div>
                  </div>
                  <span className='text-sm text-gray-600'>
                    {categoryCounts[column.id]} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryOverview;
