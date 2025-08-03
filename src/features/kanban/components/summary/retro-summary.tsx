'use client';

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  PieChart,
  Share2,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRetroSessionStore } from '@/stores/retroSessionStore';

export default function RetroSummary() {
  const [selectedPriority, setSelectedPriority] = useState('all');

  const { retroSession } = useRetroSessionStore();

  const summaryData = {
    teamSentiment: 72,
    totalItems: 24,
    actionItems: 8,
    completionRate: 85,
    sprintRating: 4.2
  };

  const actionItems = [
    {
      id: 1,
      title: 'Refine sprint estimation accuracy',
      category: 'Improve',
      priority: 'high',
      impact: 'high',
      effort: 'medium',
      votes: 12,
      assignee: 'Team Lead',
      dueDate: 'Next Sprint'
    },
    {
      id: 2,
      title: 'Continue pair programming for complex tasks',
      category: 'Keep',
      priority: 'high',
      impact: 'high',
      effort: 'low',
      votes: 15,
      assignee: 'Development Team',
      dueDate: 'Ongoing'
    },
    {
      id: 3,
      title: 'Enhance code review practices',
      category: 'Improve',
      priority: 'medium',
      impact: 'medium',
      effort: 'medium',
      votes: 8,
      assignee: 'Senior Developers',
      dueDate: 'Week 2'
    },
    {
      id: 4,
      title: 'Discontinue individual task assignments',
      category: 'Drop',
      priority: 'medium',
      impact: 'medium',
      effort: 'low',
      votes: 10,
      assignee: 'Scrum Master',
      dueDate: 'Immediate'
    }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Strong Team Collaboration',
      description:
        'Pair programming received highest votes (15) in Keep category',
      icon: Users,
      color: 'text-green-600'
    },
    {
      type: 'concern',
      title: 'Estimation Accuracy',
      description: 'Multiple items mentioned estimation challenges',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      type: 'opportunity',
      title: 'Code Quality Focus',
      description: 'Team prioritizes improving review processes',
      icon: CheckCircle,
      color: 'text-blue-600'
    }
  ];

  const performanceMetrics = [
    { label: 'Communication', value: 85, change: +5 },
    { label: 'Estimation', value: 65, change: -10 },
    { label: 'Quality', value: 90, change: +8 },
    { label: 'Timebound', value: 78, change: +2 },
    { label: 'Process', value: 82, change: +12 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className='h-4 w-4 text-green-600' />;
      case 'medium':
        return <Activity className='h-4 w-4 text-yellow-600' />;
      case 'low':
        return <TrendingDown className='h-4 w-4 text-gray-600' />;
      default:
        return null;
    }
  };

  const filteredActionItems =
    selectedPriority === 'all'
      ? actionItems
      : actionItems.filter((item) => item.priority === selectedPriority);

  return (
    <div className='min-h-screen p-6'>
      {/* Header */}
      <div className='mb-8'>
        {/* Key Metrics */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-5'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Team Sentiment</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {summaryData.teamSentiment}%
                  </p>
                </div>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Star className='h-5 w-5 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Total Items</p>
                  <p className='text-2xl font-bold'>{summaryData.totalItems}</p>
                </div>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <BarChart3 className='h-5 w-5 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Action Items</p>
                  <p className='text-2xl font-bold text-orange-600'>
                    {summaryData.actionItems}
                  </p>
                </div>
                <div className='rounded-lg bg-orange-100 p-2'>
                  <Target className='h-5 w-5 text-orange-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Sprint Rating</p>
                  <p className='text-2xl font-bold'>
                    {summaryData.sprintRating}/5
                  </p>
                </div>
                <div className='rounded-lg bg-purple-100 p-2'>
                  <Star className='h-5 w-5 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Completion</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {summaryData.completionRate}%
                  </p>
                </div>
                <div className='rounded-lg bg-green-100 p-2'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='actions'>Action Items</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='insights'>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Category Breakdown */}
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
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                      <span className='text-sm text-gray-600'>6 items</span>
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
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                      <span className='text-sm text-gray-600'>8 items</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Drop (Stop doing)
                    </span>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-20 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-red-500'
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                      <span className='text-sm text-gray-600'>4 items</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Add (New practices)
                    </span>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-20 rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-purple-500'
                          style={{ width: '35%' }}
                        ></div>
                      </div>
                      <span className='text-sm text-gray-600'>6 items</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Insights */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5' />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {insights.map((insight, index) => {
                    const IconComponent = insight.icon;
                    return (
                      <div
                        key={index}
                        className='flex items-start gap-3 rounded-lg bg-gray-50 p-3'
                      >
                        <div
                          className={`rounded-lg p-2 ${insight.type === 'positive' ? 'bg-green-100' : insight.type === 'concern' ? 'bg-orange-100' : 'bg-blue-100'}`}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${insight.color}`}
                          />
                        </div>
                        <div className='flex-1'>
                          <h4 className='text-sm font-medium'>
                            {insight.title}
                          </h4>
                          <p className='mt-1 text-xs text-gray-600'>
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Sentiment Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Progress & Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Overall Team Satisfaction</span>
                  <span className='font-medium'>
                    {summaryData.teamSentiment}%
                  </span>
                </div>
                <Progress value={summaryData.teamSentiment} className='h-3' />
                <div className='grid grid-cols-4 gap-4 text-xs text-gray-600'>
                  <div className='text-center'>
                    <div className='font-medium'>Week 1</div>
                    <div>65%</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>Week 2</div>
                    <div>72%</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>Week 3</div>
                    <div>78%</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>Final</div>
                    <div className='font-medium text-green-600'>72%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='actions' className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>
              Action Items ({actionItems.length})
            </h2>
            <div className='flex gap-2'>
              <Button
                variant={selectedPriority === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPriority('all')}
              >
                All
              </Button>
              <Button
                variant={selectedPriority === 'high' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPriority('high')}
              >
                High Priority
              </Button>
              <Button
                variant={selectedPriority === 'medium' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPriority('medium')}
              >
                Medium
              </Button>
              <Button
                variant={selectedPriority === 'low' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPriority('low')}
              >
                Low
              </Button>
            </div>
          </div>

          <div className='grid gap-4'>
            {filteredActionItems.map((item) => (
              <Card key={item.id} className='transition-shadow hover:shadow-md'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-3'>
                        <h3 className='font-medium'>{item.title}</h3>
                        <Badge
                          variant='outline'
                          className={getPriorityColor(item.priority)}
                        >
                          {item.priority}
                        </Badge>
                        <Badge variant='secondary'>{item.category}</Badge>
                      </div>

                      <div className='mb-3 flex items-center gap-6 text-sm text-gray-600'>
                        <div className='flex items-center gap-1'>
                          {getImpactIcon(item.impact)}
                          <span>Impact: {item.impact}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-4 w-4' />
                          <span>Effort: {item.effort}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='h-4 w-4' />
                          <span>{item.votes} votes</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='text-sm'>
                          <span className='text-gray-600'>Assigned to: </span>
                          <span className='font-medium'>{item.assignee}</span>
                        </div>
                        <div className='text-sm'>
                          <span className='text-gray-600'>Due: </span>
                          <span className='font-medium'>{item.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant='ghost' size='sm'>
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='performance' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>{metric.label}</span>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          {metric.value}%
                        </span>
                        <div
                          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            metric.change > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {metric.change > 0 ? (
                            <TrendingUp className='h-3 w-3' />
                          ) : (
                            <TrendingDown className='h-3 w-3' />
                          )}
                          {Math.abs(metric.change)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={metric.value} className='h-2' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='insights' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-green-600'>
                  What&apos;s Working Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-2'>
                    <CheckCircle className='mt-0.5 h-4 w-4 text-green-600' />
                    <span className='text-sm'>
                      Pair programming is highly effective for knowledge sharing
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle className='mt-0.5 h-4 w-4 text-green-600' />
                    <span className='text-sm'>
                      Open feedback culture promotes continuous improvement
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckCircle className='mt-0.5 h-4 w-4 text-green-600' />
                    <span className='text-sm'>
                      Code quality has improved significantly
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-orange-600'>
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-2'>
                    <AlertTriangle className='mt-0.5 h-4 w-4 text-orange-600' />
                    <span className='text-sm'>
                      Sprint estimation accuracy needs refinement
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <AlertTriangle className='mt-0.5 h-4 w-4 text-orange-600' />
                    <span className='text-sm'>
                      Communication could be more structured
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <AlertTriangle className='mt-0.5 h-4 w-4 text-orange-600' />
                    <span className='text-sm'>
                      Code review process needs enhancement
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations for Next Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <h4 className='mb-2 font-medium text-blue-900'>
                    Immediate Actions
                  </h4>
                  <ul className='space-y-1 text-sm text-blue-800'>
                    <li>
                      • Implement historical data analysis for better estimation
                    </li>
                    <li>• Establish structured code review checklist</li>
                    <li>• Continue pair programming practices</li>
                  </ul>
                </div>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <h4 className='mb-2 font-medium text-green-900'>
                    Long-term Goals
                  </h4>
                  <ul className='space-y-1 text-sm text-green-800'>
                    <li>• Develop team estimation accuracy metrics</li>
                    <li>• Create knowledge sharing documentation</li>
                    <li>• Establish regular feedback loops</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
