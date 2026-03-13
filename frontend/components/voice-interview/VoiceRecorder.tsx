'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onStop: (blob: Blob) => void;
  onFallbackToText: () => void;
}

export default function VoiceRecorder({ onStop, onFallbackToText }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onStop(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Mic access error:', err);
      toast.error('Microphone access denied. Please allow mic access or type your answer.');
      onFallbackToText();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Your Turn to Answer
        </h3>
        <p className="text-slate-500 text-sm">Speak clearly into your microphone.</p>
      </div>

      {isRecording ? (
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center mb-4">
            <div className="absolute w-full h-full rounded-full bg-rose-brand/20 animate-ping" />
            <div className="absolute w-3/4 h-3/4 rounded-full bg-rose-brand/40 animate-pulse" />
            <div className="relative z-10 w-16 h-16 rounded-full bg-rose-brand flex items-center justify-center text-white text-3xl">
              🎙️
            </div>
          </div>
          <p className="text-xl font-mono text-rose-brand font-bold">{formatTime(recordingTime)}</p>
          
          <Button 
            onClick={stopRecording}
            className="mt-6 bg-slate-900 hover:bg-slate-800 text-white w-48 h-12 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            ⏹ Finish Answer
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button 
            onClick={startRecording}
            className="bg-rose-brand hover:bg-rose-700 text-white h-12 px-8 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            ⏺ Start Recording
          </Button>
          <Button 
            onClick={onFallbackToText}
            variant="outline"
            className="h-12 px-6 rounded-full font-semibold border-slate-200 text-slate-600"
          >
            ⌨️ Type Instead
          </Button>
        </div>
      )}
    </div>
  );
}
