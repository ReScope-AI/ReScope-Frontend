import React, { useState } from 'react';
import type { RetroCard as RetroCardType } from '@/utils/types/retrospective';
import { useRetrospectiveStore } from '../../stores/retrospective-store';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Trash2, Edit3, ThumbsUp, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RetroCardProps {
  card: RetroCardType;
  columnColor: string;
}

export const RetroCard: React.FC<RetroCardProps> = ({ card, columnColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const { updateCard, deleteCard, voteCard, currentUser } = useRetrospectiveStore();

  const handleSave = () => {
    if (editContent.trim()) {
      updateCard(card.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(card.content);
    setIsEditing(false);
  };

  const handleVote = () => {
    if (currentUser) {
      voteCard(card.id, currentUser.id);
    }
  };

  const handleDelete = () => {
    deleteCard(card.id);
  };

  const hasUserVoted = currentUser ? card.voters.includes(currentUser.id) : false;
  const canEdit = currentUser?.name === card.author;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move',
        columnColor.replace('bg-', 'border-').replace('-50', '-200')
      )}
      draggable={!isEditing}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px] resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-sm text-gray-800 leading-relaxed">{card.content}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{card.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVote}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full transition-colors',
                  hasUserVoted ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'
                )}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{card.votes}</span>
              </button>
            </div>
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {canEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
            {canEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-red-500 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
