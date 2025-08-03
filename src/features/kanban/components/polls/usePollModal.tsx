import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { showNotification } from '@/components/common';
import { createPollQuestion } from '@/config/api/poll-question';
import { QUERY_CONSTANTS } from '@/constants/query';
import { useRetroSessionStore } from '@/stores/retroSessionStore';
import { ICreatePollQuestion } from '@/types';

import { PollOption } from './types';

export function usePollModal() {
  const retroSession = useRetroSessionStore((state) => state.retroSession);
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [question, setQuestion] = useState('');
  const [criterion, setCriterion] = useState('COMMUNICATION');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);

  const createPollMutation = useMutation({
    mutationFn: (data: ICreatePollQuestion) => createPollQuestion(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        showNotification('success', 'Poll created successfully');
        setIsOpen(false);
        queryClient.invalidateQueries({
          queryKey: [QUERY_CONSTANTS.RETRO_SESSION.GET_RETRO_SESSION_BY_ID]
        });
      }
    },
    onError: () => {}
  });

  const addOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      text: ''
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleAIGeneratedPoll = (poll: {
    question: string;
    options: string[];
    criterion?: string;
  }) => {
    setQuestion(poll.question);
    setOptions(
      poll.options.map((opt, index) => ({
        id: (index + 1).toString(),
        text: opt
      }))
    );
    if (poll.criterion) {
      // Map the criterion to match the select options
      const criterionMap: Record<string, string> = {
        communication: 'COMMUNICATION',
        quality: 'QUALITY',
        process: 'PROCESS',
        estimate: 'ESTIMATION',
        timebound: 'TIMEBOUND',
        time_bound: 'TIMEBOUND',
        'time bound': 'TIMEBOUND'
      };
      const mappedCriterion =
        criterionMap[poll.criterion.toLowerCase()] || 'COMMUNICATION';
      setCriterion(mappedCriterion);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setCriterion('COMMUNICATION');
    setOptions([
      { id: '1', text: '' },
      { id: '2', text: '' }
    ]);
    setShowAIGenerator(false);
  };

  const handleSave = () => {
    const pollData: ICreatePollQuestion = {
      text: question,
      session_id: retroSession?._id || '',
      criterion: criterion as any,
      options: options
        .map((opt) => opt.text)
        .filter((text) => text.trim() !== '')
    };
    createPollMutation.mutate(pollData);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    showAIGenerator,
    setShowAIGenerator,
    showTemplateSelector,
    setShowTemplateSelector,
    question,
    setQuestion,
    criterion,
    setCriterion,
    options,
    addOption,
    removeOption,
    updateOption,
    handleAIGeneratedPoll,
    resetForm,
    handleSave,
    isLoading: createPollMutation.isPending
  };
}
