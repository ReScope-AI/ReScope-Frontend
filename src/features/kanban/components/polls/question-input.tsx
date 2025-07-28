import { Input } from '@/components/ui/input';

export function QuestionInput({
  question,
  setQuestion
}: {
  question: string;
  setQuestion: (value: string) => void;
}) {
  return (
    <div>
      <label className='mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase'>
        QUESTION
      </label>
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder='Enter a question'
        className='border-gray-300 focus:border-purple-500 focus:ring-purple-500'
      />
    </div>
  );
}
