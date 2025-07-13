import { useEffect } from 'react';
import { useRetrospectiveStore, initializeDefaultBoard } from '@/stores/retrospective-store';
import { RetroBoard } from '@/components/common/retro-board';
import { UserSetup } from '@/components/common/user-setup';

export default function RetroPage() {
  const { currentUser } = useRetrospectiveStore();

  useEffect(() => {
    // Initialize the default board when the app starts
    initializeDefaultBoard();
  }, []);

  // Show user setup if no current user
  if (!currentUser) {
    return (
      <div className="w-full">
        <UserSetup />
      </div>
    );
  }

  // Show board once user is set up
  return (
    <div className="w-full">
      <RetroBoard />
    </div>
  );
}
