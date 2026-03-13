'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface QuestionPlayerProps {
  text: string;
  onFinished: () => void;
  onError: (err: string) => void;
}

/** Speak text using browser-native SpeechSynthesis as a fallback */
function speakWithBrowser(text: string, onEnd: () => void) {
  window.speechSynthesis.cancel(); // clear queue
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';
  // Prefer a natural-sounding voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural')
  );
  if (preferred) utterance.voice = preferred;
  utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export default function QuestionPlayer({ text, onFinished, onError }: QuestionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);

  const handleEnd = useCallback(() => {
    if (mountedRef.current) {
      setIsPlaying(false);
      onFinished();
    }
  }, [onFinished]);

  const playWithBrowserFallback = useCallback(() => {
    setUsedFallback(true);
    setLoading(false);
    setIsPlaying(true);
    speakWithBrowser(text, handleEnd);
  }, [text, handleEnd]);

  useEffect(() => {
    mountedRef.current = true;

    const fetchAndPlay = async () => {
      setLoading(true);
      setUsedFallback(false);
      try {
        const res = await fetch('/api/generate-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          // ElevenLabs failed — silently fall back to browser TTS
          console.warn('[QuestionPlayer] ElevenLabs failed, using browser TTS');
          if (mountedRef.current) playWithBrowserFallback();
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (mountedRef.current && audioRef.current) {
          audioRef.current.src = url;
          audioRef.current
            .play()
            .then(() => {
              if (mountedRef.current) {
                setIsPlaying(true);
                setLoading(false);
              }
            })
            .catch(() => {
              // Auto-play blocked — fall back to browser TTS
              if (mountedRef.current) playWithBrowserFallback();
            });
        }
      } catch {
        // Network error or any other failure — fall back silently
        if (mountedRef.current) playWithBrowserFallback();
      }
    };

    fetchAndPlay();

    return () => {
      mountedRef.current = false;
      window.speechSynthesis?.cancel();
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [text, playWithBrowserFallback]);

  const replay = () => {
    if (usedFallback) {
      setIsPlaying(true);
      speakWithBrowser(text, handleEnd);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
      {/* Avatar with pulse animation */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {isPlaying && (
          <div className="absolute w-full h-full rounded-full bg-teal-brand/20 animate-ping" />
        )}
        <div className="relative z-10 w-16 h-16 rounded-full bg-teal-brand flex items-center justify-center text-white text-3xl shadow-md">
          🤖
        </div>
      </div>

      {/* Status */}
      <div className="text-center space-y-1">
        {loading ? (
          <p className="text-slate-500 font-medium animate-pulse">Preparing question...</p>
        ) : isPlaying ? (
          <p className="text-teal-brand font-bold text-lg">AI is speaking...</p>
        ) : (
          <p className="text-slate-400 text-sm">Question finished</p>
        )}
        {usedFallback && !loading && (
          <p className="text-xs text-slate-400">Using browser voice</p>
        )}
      </div>

      {/* Question text */}
      <p className="text-slate-800 font-medium text-center text-lg max-w-xl leading-relaxed">
        "{text}"
      </p>

      {/* Hidden audio element for ElevenLabs */}
      <audio
        ref={audioRef}
        onEnded={handleEnd}
        className="hidden"
      />

      {/* Replay button after finished */}
      {!isPlaying && !loading && (
        <Button variant="outline" onClick={replay} className="mt-2">
          🔁 Replay Question
        </Button>
      )}
    </div>
  );
}
