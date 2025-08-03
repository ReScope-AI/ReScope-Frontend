'use client';

import { AlertTriangle, PieChart, Target } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

import { useTaskStore } from '../../utils/store';
import RadarChartComponent from '../radar-chart';

const SummaryOverview = () => {
  const tasks = useTaskStore();
  const { retroSession } = useRetroSessionStore();

  const totalAddItems = tasks.tasks.filter(
    (task) => task.status === 'ADD'
  ).length;

  const totalImproveItems = tasks.tasks.filter(
    (task) => task.status === 'IMPROVE'
  ).length;

  const totalKeepItems = tasks.tasks.filter(
    (task) => task.status === 'KEEP'
  ).length;

  const totalDropItems = tasks.tasks.filter(
    (task) => task.status === 'DROP'
  ).length;

  const totalItems =
    totalAddItems + totalImproveItems + totalKeepItems + totalDropItems;

  const keepPercentage =
    totalItems > 0 ? (totalKeepItems / totalItems) * 100 : 0;
  const improvePercentage =
    totalItems > 0 ? (totalImproveItems / totalItems) * 100 : 0;
  const dropPercentage =
    totalItems > 0 ? (totalDropItems / totalItems) * 100 : 0;
  const addPercentage = totalItems > 0 ? (totalAddItems / totalItems) * 100 : 0;

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
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>
                Keep (What&apos;s working)
              </span>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-20 rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-green-500'
                    style={{ width: `${keepPercentage}%` }}
                  ></div>
                </div>
                <span className='text-sm text-gray-600'>
                  {totalKeepItems} items
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>
                Improve (Areas for growth)
              </span>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-20 rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-500'
                    style={{ width: `${improvePercentage}%` }}
                  ></div>
                </div>
                <span className='text-sm text-gray-600'>
                  {totalImproveItems} items
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Drop (Stop doing)</span>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-20 rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-red-500'
                    style={{ width: `${dropPercentage}%` }}
                  ></div>
                </div>
                <span className='text-sm text-gray-600'>
                  {totalDropItems} items
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Add (New practices)</span>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-20 rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-purple-500'
                    style={{ width: `${addPercentage}%` }}
                  ></div>
                </div>
                <span className='text-sm text-gray-600'>
                  {totalAddItems} items
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryOverview;
