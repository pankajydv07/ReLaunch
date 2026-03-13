'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import QuestionPlayer from '@/components/voice-interview/QuestionPlayer';
import VoiceRecorder from '@/components/voice-interview/VoiceRecorder';
import TranscriptDisplay from '@/components/voice-interview/TranscriptDisplay';
import FeedbackPanel, { EvalResult } from '@/components/voice-interview/FeedbackPanel';

type InterviewState = 'idle' | 'generating-q' | 'ai-speaking' | 'listening' | 'transcribing' | 'evaluating' | 'feedback' | 'finished';

const TOTAL_QUESTIONS = 5;

export default function VoiceInterviewPage() {
  const [role, setRole] = useState('');
  const [currentState, setCurrentState] = useState<InterviewState>('idle');
  const [questionCount, setQuestionCount] = useState(0);
  
  const [history, setHistory] = useState<string[]>([]); // previous questions
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<EvalResult | null>(null);

  const startSession = () => {
    if (!role.trim()) {
      toast.error('Please enter a target role to begin.');
      return;
    }
    setQuestionCount(0);
    setHistory([]);
    fetchNextQuestion([]);
  };

  const fetchNextQuestion = async (passedHistory: string[]) => {
    setCurrentState('generating-q');
    setCurrentQuestion('');
    setAudioBlob(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, previous_questions: passedHistory }),
      });
      
      if (!res.ok) throw new Error('Failed to generate question');
      
      const data = await res.json();
      setCurrentQuestion(data.question);
      setHistory([...passedHistory, data.question]);
      setQuestionCount(prev => prev + 1);
      setCurrentState('ai-speaking');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error generating question');
      setCurrentState('idle');
    }
  };

  const handleAIFinishedSpeaking = () => {
    if (currentState === 'ai-speaking') {
      setCurrentState('listening');
    }
  };

  const handleStopRecording = (blob: Blob) => {
    setAudioBlob(blob);
    setCurrentState('transcribing');
  };

  const handleFallbackToText = () => {
    setAudioBlob(null);
    setCurrentState('transcribing'); // This enables the text input mode in TranscriptDisplay
  };

  const handleSubmitAnswer = async (transcriptText: string) => {
    setCurrentState('evaluating');
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: transcriptText, role }),
      });
      
      if (!res.ok) throw new Error('Failed to evaluate answer');
      
      const data = await res.json();
      setFeedback(data);
      setCurrentState('feedback');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error evaluating answer');
      setCurrentState('transcribing'); // go back so they can try again
    }
  };

  const handleNextAction = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setCurrentState('finished');
    } else {
      fetchNextQuestion(history);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Voice Interview Simulation
          </h1>
          <p className="text-slate-500 mt-1">Practice responding verbally to realistic AI interview questions.</p>
        </div>
        
        {currentState !== 'idle' && currentState !== 'finished' && (
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">Question {questionCount} of {TOTAL_QUESTIONS}</span>
            <Progress value={(questionCount / TOTAL_QUESTIONS) * 100} className="w-24 h-2" />
          </div>
        )}
      </div>

      {/* Intro Form */}
      {currentState === 'idle' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="voice-role" className="font-semibold text-lg">What role are you applying for?</Label>
            <Input 
              id="voice-role"
              placeholder="e.g. Senior Software Engineer" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
          <Button 
            onClick={startSession}
            disabled={!role.trim()}
            className="w-full sm:w-auto h-12 px-8 text-base bg-teal-brand hover:bg-teal-700 font-bold"
          >
            Start Voice Interview →
          </Button>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">How it works:</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li>🔊 The AI will automatically speak the question out loud.</li>
              <li>🎙️ You will record your answer using your microphone.</li>
              <li>📝 We generate a transcript of your answer for you to review.</li>
              <li>📊 You get real-time feedback and an ideal answer example.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Interview Flow */}
      {currentState !== 'idle' && currentState !== 'finished' && (
        <div className="space-y-6">
          
          {/* Top Status Banner */}
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-3 font-medium animate-fade-in-up">
            {currentState === 'generating-q' && <><span className="animate-spin text-xl">⏳</span> Preparing question...</>}
            {currentState === 'ai-speaking' && <><span className="animate-pulse text-teal-400 text-xl">🔊</span> AI is speaking...</>}
            {currentState === 'listening' && <><span className="text-rose-400 text-xl">🎙️</span> Standing by for your answer</>}
            {currentState === 'transcribing' && <><span className="text-xl">📝</span> Reviewing answer transcript</>}
            {currentState === 'evaluating' && <><span className="animate-spin text-xl">⏳</span> AI is evaluating your response...</>}
            {currentState === 'feedback' && <><span className="text-xl">✅</span> Feedback ready</>}
          </div>

          {/* AI Question Phase */}
          {(currentState === 'generating-q' || currentState === 'ai-speaking') && (
            <div className="min-h-[200px] flex items-center justify-center">
              {currentState === 'generating-q' ? (
                 <div className="animate-pulse flex flex-col items-center gap-2">
                   <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                 </div>
              ) : (
                <div className="w-full">
                  <QuestionPlayer 
                    text={currentQuestion}
                    onFinished={handleAIFinishedSpeaking}
                    onError={(err) => toast.error(`TTS Error: ${err}`)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Listening / Recording Phase */}
          {currentState === 'listening' && (
            <div className="w-full">
              <div className="rounded-2xl border-l-4 border-rose-brand bg-white p-5 shadow-sm mb-6">
                <p className="text-xs font-bold text-rose-brand uppercase tracking-wider mb-2">Current Question</p>
                <p className="text-slate-800 font-medium text-lg">{currentQuestion}</p>
              </div>
              <VoiceRecorder 
                onStop={handleStopRecording} 
                onFallbackToText={handleFallbackToText}
              />
            </div>
          )}

          {/* Transcribing / Submitting Phase */}
          {currentState === 'transcribing' && (
            <div className="w-full">
              <div className="rounded-2xl border-l-4 border-slate-300 bg-white p-5 shadow-sm mb-6 opacity-75">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question</p>
                <p className="text-slate-600 font-medium">{currentQuestion}</p>
              </div>
              <TranscriptDisplay 
                audioBlob={audioBlob} 
                onConfirmed={handleSubmitAnswer}
              />
            </div>
          )}

          {/* Evaluating State */}
          {currentState === 'evaluating' && (
             <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-100 bg-white p-8">
                <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-brand rounded-full animate-spin" />
                <p className="text-lg font-medium text-slate-600">Analyzing your response...</p>
             </div>
          )}

          {/* Feedback Phase */}
          {currentState === 'feedback' && feedback && (
            <div className="w-full">
               <div className="rounded-2xl border-l-4 border-teal-brand bg-white p-5 shadow-sm mb-6">
                <p className="text-xs font-bold text-teal-brand uppercase tracking-wider mb-2">Question</p>
                <p className="text-slate-800 font-medium">{currentQuestion}</p>
              </div>
              <FeedbackPanel 
                result={feedback} 
                onNextQuestion={handleNextAction}
                isLastQuestion={questionCount >= TOTAL_QUESTIONS}
              />
            </div>
          )}
        </div>
      )}

      {/* Finished State */}
      {currentState === 'finished' && (
        <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-200 text-center space-y-6 animate-pop-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-slate-900">Interview Complete!</h2>
          <p className="text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">
            Great job! You completed all {TOTAL_QUESTIONS} questions for the {role} role. Review your feedback above and keep practicing.
          </p>
          <div className="pt-6">
            <Button 
              onClick={() => setCurrentState('idle')}
              className="bg-teal-brand hover:bg-teal-700 h-12 px-8 text-lg font-bold"
            >
              Start Another Session
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
