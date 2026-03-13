'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TranscriptDisplayProps {
  audioBlob: Blob | null; // Null means we're in fallback manual typing mode
  onConfirmed: (text: string) => void;
}

export default function TranscriptDisplay({ audioBlob, onConfirmed }: TranscriptDisplayProps) {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(!!audioBlob);

  useEffect(() => {
    if (!audioBlob) {
      setIsTranscribing(false);
      return;
    }

    const transcribe = async () => {
      try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'answer.webm');

        const res = await fetch('/api/transcribe-audio', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Transcription failed');
        }

        const data = await res.json();
        setTranscript(data.text);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to transcribe audio. Please type your answer.');
      } finally {
        setIsTranscribing(false);
      }
    };

    transcribe();
  }, [audioBlob]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {audioBlob ? 'Your Transcribed Answer' : 'Type Your Answer'}
        </h3>
        {isTranscribing && <span className="badge-teal animate-pulse">Transcribing...</span>}
      </div>

      <Textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        disabled={isTranscribing}
        placeholder={isTranscribing ? "Transcribing your voice..." : "Type or edit your answer here..."}
        className="min-h-[120px] resize-none text-base"
      />

      <div className="flex justify-end pt-2">
        <Button 
          onClick={() => onConfirmed(transcript)}
          disabled={isTranscribing || !transcript.trim()}
          className="bg-teal-brand hover:bg-teal-700 text-white font-semibold flex items-center gap-2"
        >
          {isTranscribing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing...
            </>
          ) : (
            'Submit Answer →'
          )}
        </Button>
      </div>
    </div>
  );
}
