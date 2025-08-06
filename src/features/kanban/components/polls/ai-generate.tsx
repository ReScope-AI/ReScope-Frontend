'use client';

import { useMutation } from '@tanstack/react-query';
import { Brain, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

import { showNotification } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { generateAIPolls } from '@/config/api/poll-question';
import { cn } from '@/lib/utils';

import { promptTemplates } from './constant';

interface AIGeneratedPoll {
  text: string;
  criterion: string;
  options: { text: string }[];
  created_at: string;
  updated_at: string;
}

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (poll: {
    question: string;
    options: string[];
    criterion?: string;
  }) => void;
}

const AIGeneratorModal = ({
  isOpen,
  onClose,
  onGenerate
}: AIGeneratorModalProps) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: (typeof promptTemplates)[0]) => {
    setSelectedTemplate(template.id);
    setAiPrompt(template.prompt);
  };

  const generateAIPollsMutation = useMutation({
    mutationFn: (prompt: string) => generateAIPolls(prompt),
    onSuccess: (response) => {
      if (response.code === 201 && response.data && response.data.length > 0) {
        const firstPoll = response.data[0];
        onGenerate({
          question: firstPoll.text,
          options: firstPoll.options.map((opt: { text: string }) => opt.text),
          criterion: firstPoll.criterion
        });
        onClose();
        resetForm();
        showNotification(
          'success',
          'AI poll generated and applied successfully!'
        );
      } else {
        showNotification('error', 'No polls were generated. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Error generating polls:', error);
      showNotification('error', 'Failed to generate polls. Please try again.');
    }
  });

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      await generateAIPollsMutation.mutateAsync(aiPrompt);
    } catch (error) {
      console.error('Error generating polls:', error);
      showNotification('error', 'Failed to generate polls. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setAiPrompt('');
    setSelectedTemplate(null);
    setIsGenerating(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl bg-white p-0 dark:bg-gray-900'>
        <div className='flex h-[500px] flex-col'>
          {/* Fixed Header */}
          <div className='flex-shrink-0 border-b border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-800/50'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700 shadow-lg'>
                <Sparkles className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  AI Poll Generator
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Generate polls using artificial intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className='flex-1 overflow-y-auto p-6'>
            <div className='space-y-6'>
              {/* Template Buttons */}
              <div>
                <h4 className='mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                  Quick Templates
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  {promptTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={
                        selectedTemplate === template.id ? 'default' : 'outline'
                      }
                      size='sm'
                      className={cn(
                        'h-auto justify-start p-3 text-left',
                        selectedTemplate === template.id
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg hover:from-blue-700 hover:to-green-700'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      )}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <template.icon className='mr-2 h-4 w-4' />
                      <div>
                        <div className='font-medium'>{template.title}</div>
                        <div className='text-xs opacity-70'>
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <h4 className='mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                  Custom Prompt
                </h4>
                <div className='space-y-3'>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the poll you want to create... (e.g., 'Create a fun poll about team preferences' or 'Generate a poll about project satisfaction')"
                    className='min-h-[100px] resize-none border-gray-300 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  />
                  <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20'>
                    <div className='flex gap-3'>
                      <Brain className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400' />
                      <div>
                        <h5 className='mb-1 font-medium text-blue-900 dark:text-blue-100'>
                          AI Tips
                        </h5>
                        <p className='text-sm text-blue-800 dark:text-blue-200'>
                          Be specific about the topic, tone, and type of
                          responses you want. Examples: &quot;team
                          collaboration&quot;, &quot;funny icebreaker&quot;,
                          &quot;project feedback&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isGenerating && (
                <div className='py-8 text-center text-gray-500 dark:text-gray-400'>
                  <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-purple-500 border-t-transparent' />
                  <p>Generating poll...</p>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className='flex-shrink-0 border-t border-gray-200 p-6 dark:border-gray-700'>
            <div className='flex gap-3'>
              <Button
                onClick={handleGenerate}
                disabled={!aiPrompt.trim() || isGenerating}
                className='flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg hover:from-blue-700 hover:to-green-700'
              >
                {isGenerating ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className='mr-2 h-4 w-4' />
                    Generate Poll
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGeneratorModal;
