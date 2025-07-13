import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Plus, X } from 'lucide-react';
import { useRetrospectiveStore } from '../../stores/retrospective-store';

interface AddCardFormProps {
  columnId: string;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ columnId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const { addCard } = useRetrospectiveStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addCard(columnId, content.trim());
      setContent('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border-2 border-gray-300 p-4 space-y-3"
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What would you like to add?"
        className="min-h-[80px] resize-none"
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Add Card
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
