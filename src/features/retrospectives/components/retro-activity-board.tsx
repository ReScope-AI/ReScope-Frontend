'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { useRetrospectiveStore } from '../stores';
import { cn } from '@/lib/utils';

export interface RetroItem {
  id: string;
  category: 'went-well' | 'to-improve' | 'action-items';
  content: string;
  author: string;
  authorAvatar?: string;
  votes: number;
  comments: RetroComment[];
  createdAt: Date;
  isEditing?: boolean;
}

export interface RetroComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

interface RetroActivityBoardProps {
  retroId: string;
}

export default function RetroActivityBoard({
  retroId
}: RetroActivityBoardProps) {
  const [items, setItems] = useState<RetroItem[]>([]);
  const [newItemContent, setNewItemContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'went-well' | 'to-improve' | 'action-items'
  >('went-well');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  const { retroSessions } = useRetrospectiveStore();
  const currentSession = retroSessions.find((s) => s.id === retroId);

  const categories = [
    {
      id: 'went-well',
      title: 'What Went Well',
      color: 'bg-green-100 border-green-200'
    },
    {
      id: 'to-improve',
      title: 'What Could Be Improved',
      color: 'bg-yellow-100 border-yellow-200'
    },
    {
      id: 'action-items',
      title: 'Action Items',
      color: 'bg-blue-100 border-blue-200'
    }
  ] as const;

  const addItem = () => {
    if (!newItemContent.trim()) return;

    const newItem: RetroItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      content: newItemContent,
      author: 'Current User', // Replace with actual user
      authorAvatar: '/placeholder-avatar.png',
      votes: 0,
      comments: [],
      createdAt: new Date()
    };

    setItems([...items, newItem]);
    setNewItemContent('');
  };

  const updateItem = (id: string, content: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, content } : item))
    );
    setEditingItemId(null);
    setEditingContent('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const voteItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const addComment = (itemId: string) => {
    const commentContent = commentInputs[itemId];
    if (!commentContent?.trim()) return;

    const newComment: RetroComment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: commentContent,
      createdAt: new Date()
    };

    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );

    setCommentInputs({ ...commentInputs, [itemId]: '' });
  };

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category === category);
  };

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border bg-white p-4 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold'>Add New Feedback</h3>
        <div className='mb-3 flex gap-2'>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedCategory(cat.id as any)}
            >
              {cat.title}
            </Button>
          ))}
        </div>
        <div className='flex gap-2'>
          <Textarea
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            placeholder={`Share your thoughts about ${categories.find((c) => c.id === selectedCategory)?.title.toLowerCase()}...`}
            className='min-h-[60px]'
          />
          <Button onClick={addItem} className='self-start'>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {categories.map((category) => (
          <Card key={category.id} className={cn('border-2', category.color)}>
            <CardHeader>
              <CardTitle className='text-lg'>{category.title}</CardTitle>
              <Badge variant='secondary' className='ml-auto'>
                {getItemsByCategory(category.id).length}
              </Badge>
            </CardHeader>
            <CardContent className='space-y-3'>
              {getItemsByCategory(category.id).map((item) => (
                <div
                  key={item.id}
                  className='rounded-lg bg-white p-3 shadow-sm'
                >
                  {editingItemId === item.id ? (
                    <div className='space-y-2'>
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className='min-h-[60px]'
                      />
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          onClick={() => updateItem(item.id, editingContent)}
                        >
                          <Check className='h-3 w-3' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => setEditingItemId(null)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className='mb-2 text-sm'>{item.content}</p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Avatar className='h-6 w-6'>
                            <AvatarImage src={item.authorAvatar} />
                            <AvatarFallback>{item.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className='text-xs text-gray-600'>
                            {item.author}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => voteItem(item.id)}
                          >
                            <ThumbsUp className='h-3 w-3' />
                            <span className='ml-1 text-xs'>{item.votes}</span>
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditingContent(item.content);
                            }}
                          >
                            <Edit3 className='h-3 w-3' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>

                      {item.comments.length > 0 && (
                        <div className='mt-2 space-y-1'>
                          {item.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className='rounded bg-gray-50 p-2 text-xs'
                            >
                              <span className='font-medium'>
                                {comment.author}:
                              </span>{' '}
                              {comment.content}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className='mt-2 flex gap-1'>
                        <input
                          type='text'
                          placeholder='Add comment...'
                          value={commentInputs[item.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [item.id]: e.target.value
                            })
                          }
                          className='flex-1 rounded border px-2 py-1 text-xs'
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addComment(item.id)
                          }
                        />
                        <Button size='sm' onClick={() => addComment(item.id)}>
                          <MessageSquare className='h-3 w-3' />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
