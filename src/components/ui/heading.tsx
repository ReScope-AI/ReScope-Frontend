import PollModal from '@/features/kanban/components/poll-modal';

interface HeadingProps {
  title: string;
  description?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className='flex w-full items-center justify-between px-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
      <PollModal />
    </div>
  );
};
