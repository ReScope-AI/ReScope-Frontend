import React from 'react';
import type { RetroColumn as RetroColumnType } from '@/utils/types/retrospective';
import { RetroCard } from './retro-card';
import { AddCardForm } from './add-card-form';
import { cn } from '../../lib/utils';

interface RetroColumnProps {
  column: RetroColumnType;
}

export const RetroColumn: React.FC<RetroColumnProps> = ({ column }) => {
  return (
    <div className={cn('rounded-xl border-2 p-4 h-fit min-h-[500px]', column.color)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{column.title}</h3>
        <p className="text-sm text-gray-600">{column.description}</p>
        <div className="text-xs text-gray-500 mt-1">
          {column.cards.length} {column.cards.length === 1 ? 'card' : 'cards'}
        </div>
      </div>

      <div className="space-y-3">
        {column.cards
          .sort((a, b) => b.votes - a.votes)
          .map((card) => (
            <RetroCard key={card.id} card={card} columnColor={column.color} />
          ))}

        <AddCardForm columnId={column.id} />
      </div>
    </div>
  );
};
