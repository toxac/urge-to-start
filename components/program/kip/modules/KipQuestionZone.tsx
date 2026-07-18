// components/program/kip/modules/KipQuestionZone.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Flag, CheckCircle2 } from 'lucide-react';
import { askQuestion, flagQuestionForAdmin, getQuestionForItem } from '@/actions/questions';
import { toast } from 'sonner';

interface Props {
  itemType: 'task' | 'quest' | 'mission';
  itemId: string;
  onQuestionAnswered?: () => void;
}

export function KipQuestionZone({ itemType, itemId, onQuestionAnswered }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [existingQuestion, setExistingQuestion] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      getQuestionForItem(itemType, itemId).then(q => {
        setExistingQuestion(q);
      }).catch(console.error);
    }
  }, [open, itemType, itemId]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await askQuestion({
        itemType,
        itemId,
        question: question.trim(),
      });
      if (result.success) {
        setExistingQuestion(result.data);
        setQuestion('');
        if (result.isNew) {
          toast.success('Question answered by Kip!');
        } else {
          toast.info('Existing question found.');
        }
        onQuestionAnswered?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to ask question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlagForAdmin = async () => {
    if (!existingQuestion) return;
    try {
      await flagQuestionForAdmin(existingQuestion.id);
      setExistingQuestion({ ...existingQuestion, flagged_for_admin: true, status: 'flagged_for_admin' });
      toast.success('Question shared with admin for further help.');
    } catch (error: any) {
      toast.error('Failed to flag question');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isQuestionAnswered = existingQuestion && (existingQuestion.ai_answer || existingQuestion.admin_answer);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-[11px] font-medium gap-1.5"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="w-3.5 h-3.5" /> Ask a Question
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ask Kip a Question</DialogTitle>
            <DialogDescription>
              Get an answer based on the program structure. If you need more detail, share with admin.
            </DialogDescription>
          </DialogHeader>

          {isQuestionAnswered ? (
            <div className="space-y-3 py-2">
              <div className="p-3 bg-muted/20 rounded-lg text-sm leading-relaxed">
                <p className="text-xs font-medium text-muted-foreground">Your question:</p>
                <p className="mt-1">{existingQuestion.question}</p>
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground">Kip's answer:</p>
                  <p className="mt-1 whitespace-pre-wrap">{existingQuestion.ai_answer}</p>
                </div>
                {existingQuestion.admin_answer && (
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-xs font-medium text-emerald-600">Admin's response:</p>
                    <p className="mt-1 whitespace-pre-wrap">{existingQuestion.admin_answer}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!existingQuestion.flagged_for_admin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={handleFlagForAdmin}
                    disabled={isSubmitting}
                  >
                    <Flag className="w-3.5 h-3.5 mr-1" />
                    Ask Admin for more
                  </Button>
                )}
                {existingQuestion.flagged_for_admin && (
                  <div className="flex-1 text-[10px] text-amber-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Admin notified
                  </div>
                )}
                <Button size="sm" variant="default" className="flex-1" onClick={handleClose}>
                  Got it
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Textarea
                placeholder="Type your question here (max 500 chars)..."
                className="min-h-[100px] text-sm"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isSubmitting}
                maxLength={500}
              />
              <DialogFooter>
                <Button
                  size="sm"
                  variant="default"
                  disabled={isSubmitting || !question.trim()}
                  onClick={handleSubmit}
                  className="gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ask Kip'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}