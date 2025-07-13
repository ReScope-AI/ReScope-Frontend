import React, { useState } from 'react';
import { useRetrospectiveStore } from '@/stores/retrospective-store';
import { Button } from '../ui/button';
import { User, RotateCcw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const UserSetup: React.FC = () => {
  const [name, setName] = useState('');
  const { setCurrentUser } = useRetrospectiveStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user = {
        id: uuidv4(),
        name: name.trim(),
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      };
      setCurrentUser(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RotateCcw className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Retrospective Board</h1>
          </div>
          <p className="text-gray-600">Join the retrospective session to start collaborating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your name"
                required
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700">
            Join Retrospective
          </Button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">DAKI Method</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium text-red-600">Drop:</span> Unproductive practices
            </div>
            <div>
              <span className="font-medium text-green-600">Add:</span> New ideas to implement
            </div>
            <div>
              <span className="font-medium text-blue-600">Keep:</span> Successful current practices
            </div>
            <div>
              <span className="font-medium text-orange-600">Improve:</span> Areas for enhancement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
