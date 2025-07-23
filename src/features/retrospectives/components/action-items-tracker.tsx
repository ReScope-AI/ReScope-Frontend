'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  retroItemId?: string;
  createdAt: Date;
}

interface ActionItemsTrackerProps {
  retroId: string;
  retroItems?: any[];
}

export default function ActionItemsTracker({
  retroId,
  retroItems = []
}: ActionItemsTrackerProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActionItem, setNewActionItem] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const,
    retroItemId: ''
  });

  const addActionItem = () => {
    if (!newActionItem.title.trim()) return;

    const actionItem: ActionItem = {
      id: Date.now().toString(),
      title: newActionItem.title,
      description: newActionItem.description,
      assignee: newActionItem.assignee,
      dueDate: new Date(newActionItem.dueDate),
      priority: newActionItem.priority,
      status: 'todo',
      retroItemId: newActionItem.retroItemId,
      createdAt: new Date()
    };

    setActionItems([...actionItems, actionItem]);
    setNewActionItem({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      retroItemId: ''
    });
    setShowAddForm(false);
  };

  const updateActionItem = (id: string, updates: Partial<ActionItem>) => {
    setActionItems(
      actionItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteActionItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'in-progress':
        return <Clock className='h-4 w-4 text-blue-600' />;
      default:
        return <Circle className='h-4 w-4 text-gray-400' />;
    }
  };

  const getOverdueItems = () => {
    return actionItems.filter(
      (item) =>
        item.status !== 'completed' && new Date(item.dueDate) < new Date()
    );
  };

  const getCompletionRate = () => {
    if (actionItems.length === 0) return 0;
    return (
      (actionItems.filter((item) => item.status === 'completed').length /
        actionItems.length) *
      100
    );
  };

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Actions</p>
                <p className='text-2xl font-bold'>{actionItems.length}</p>
              </div>
              <AlertCircle className='h-8 w-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Completed</p>
                <p className='text-2xl font-bold'>
                  {actionItems.filter((i) => i.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Overdue</p>
                <p className='text-2xl font-bold text-red-600'>
                  {getOverdueItems().length}
                </p>
              </div>
              <Clock className='h-8 w-8 text-red-500' />
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Action Item */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className='w-full'>
              Add New Action Item
            </Button>
          ) : (
            <div className='space-y-4'>
              <Input
                placeholder='Action item title'
                value={newActionItem.title}
                onChange={(e) =>
                  setNewActionItem({ ...newActionItem, title: e.target.value })
                }
              />
              <Input
                placeholder='Description'
                value={newActionItem.description}
                onChange={(e) =>
                  setNewActionItem({
                    ...newActionItem,
                    description: e.target.value
                  })
                }
              />
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  type='date'
                  value={newActionItem.dueDate}
                  onChange={(e) =>
                    setNewActionItem({
                      ...newActionItem,
                      dueDate: e.target.value
                    })
                  }
                />
                <Input
                  placeholder='Assignee'
                  value={newActionItem.assignee}
                  onChange={(e) =>
                    setNewActionItem({
                      ...newActionItem,
                      assignee: e.target.value
                    })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <Select
                  value={newActionItem.priority}
                  onValueChange={(value) =>
                    setNewActionItem({
                      ...newActionItem,
                      priority: value as any
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Priority' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newActionItem.retroItemId}
                  onValueChange={(value) =>
                    setNewActionItem({ ...newActionItem, retroItemId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Linked to...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>No link</SelectItem>
                    {retroItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.content.substring(0, 50)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex gap-2'>
                <Button onClick={addActionItem}>Add</Button>
                <Button variant='outline' onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items List */}
      <div className='space-y-4'>
        {actionItems.map((item) => (
          <Card key={item.id} className='transition-shadow hover:shadow-md'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start gap-3'>
                  <Checkbox
                    checked={item.status === 'completed'}
                    onCheckedChange={(checked) =>
                      updateActionItem(item.id, {
                        status: checked ? 'completed' : 'todo'
                      })
                    }
                  />
                  <div>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-medium'>{item.title}</h4>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className='mt-1 text-sm text-gray-600'>
                      {item.description}
                    </p>
                    <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <User className='h-3 w-3' />
                        <span>{item.assignee}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        <span>{format(item.dueDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getStatusIcon(item.status)}
                        <span className='capitalize'>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => deleteActionItem(item.id)}
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
