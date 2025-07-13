import React from 'react';
import { useRetrospectiveStore } from '../../stores/retrospective-store';
import { RetroColumn } from './retro-column';
import { ParticipantsList } from './participants-list';
import { useSocket } from '../../hooks/use-socket';
import { Clock, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

export const RetroBoard: React.FC = () => {
  const { board, currentUser } = useRetrospectiveStore();
  const boardId = board?.id || 'default';

  useSocket(boardId);

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading retrospective board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">{board.title}</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Started {board.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ParticipantsList />
            <Button variant="outline" size="sm">
              Export Results
            </Button>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {board.columns.map((column) => (
            <RetroColumn key={column.id} column={column} />
          ))}
        </div>
      </main>

      {/* Current user indicator */}
      {currentUser && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
          Logged in as {currentUser.name}
        </div>
      )}
    </div>
  );
};
