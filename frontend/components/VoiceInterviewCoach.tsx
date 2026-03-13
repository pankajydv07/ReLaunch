'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionStage =
  | 'setup'          // Role entry screen
  | 'fetching'       // Generating question from AI
  | 'speaking'       // ElevenLabs playing question aloud
  | 'listening'      // Waiting — user should press mic
  | 'recording'      // MediaRecorder active
  | 'transcribing'   // AssemblyAI processing audio
  | 'evaluating'     // Gemini scoring the answer
  | 'feedback'       // ElevenLabs playing feedback aloud
  | 'ended';         // Session ended by user

interface TurnEntry {
  id: string;
  side: 'coach' | 'you';
  text: string;
  badge?: string; // e.g. "8/10"
  badgeColor?: string;
}

const API_BASE = 'http://localhost:8000';

// ─── Audio playback ────────────────────────────────────────────────────────────

function playAudioBase64(b64: string, _mimeType = 'audio/mpeg'): Promise<void> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.warn('[Audio] playback error — continuing silently');
        resolve();
      };
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio] autoplay blocked:', err.message);
          resolve(); 
        });
      }
    } catch (err) {
      console.warn('[Audio] unexpected error:', err);
      resolve();
    }
  });
}

/** 
 * Fallback TTS using browser's native speech synthesis.
 * Used if backend ElevenLabs fails.
 */
function speakTextFallback(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to pick a natural female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Natural'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

// ─── Stage label ──────────────────────────────────────────────────────────────

const STAGE_INFO: Record<SessionStage, { label: string; color: string }> = {
  setup:       { label: 'Ready',                      color: 'var(--border)' },
  fetching:    { label: 'Generating question…',        color: 'var(--rose)' },
  speaking:    { label: 'Coach is speaking…',          color: 'var(--rose)' },
  listening:   { label: 'Your turn — press the mic',  color: '#4ade80' },
  recording:   { label: 'Recording… tap to stop',     color: '#f87171' },
  transcribing:{ label: 'Transcribing your answer…',  color: '#fbbf24' },
  evaluating:  { label: 'Evaluating your response…',  color: '#fbbf24' },
  feedback:    { label: 'Coach is responding…',        color: 'var(--rose)' },
  ended:       { label: 'Session ended',              color: 'var(--border)' },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VoiceInterviewCoach() {
  const [role, setRole]           = useState('');
  const [stage, setStage]         = useState<SessionStage>('setup');
  const [turns, setTurns]         = useState<TurnEntry[]>([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [currentQ, setCurrentQ]   = useState('');
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);
  const [hasTts, setHasTts]       = useState(true); // whether TTS is available

  const mediaRecRef  = useRef<MediaRecorder | null>(null);
  const chunksRef    = useRef<Blob[]>([]);
  const streamRef    = useRef<MediaStream | null>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  // ─── Add turn to transcript ─────────────────────────────────────────────────

  const addTurn = useCallback(
    (side: 'coach' | 'you', text: string, badge?: string, badgeColor?: string) => {
      setTurns((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, side, text, badge, badgeColor },
      ]);
    },
    []
  );

  // ─── Step 1: fetch question + speak it ─────────────────────────────────────

  const fetchAndSpeakQuestion = useCallback(async (targetRole: string) => {
    setStage('fetching');
    setErrorMsg(null);

    try {
      const { data } = await axios.post<{
        question: string;
        audio_base64: string | null;
        content_type: string | null;
      }>(`${API_BASE}/voice/question`, { role: targetRole });

      const { question, audio_base64, content_type } = data;
      setCurrentQ(question);
      setQuestionNum((n) => n + 1);
      addTurn('coach', question);

      // Play audio if TTS is configured, otherwise fallback to browser TTS
      if (audio_base64) {
        setStage('speaking');
        await playAudioBase64(audio_base64, content_type ?? 'audio/mpeg');
      } else {
        setStage('speaking');
        await speakTextFallback(question);
      }

      setStage('listening'); // mic is now ready for user
    } catch (err: unknown) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail ?? err.message
        : 'Failed to generate question.';
      setErrorMsg(detail);
      setStage('listening');
    }
  }, [addTurn]);

  // ─── Start session ─────────────────────────────────────────────────────────

  async function handleStartSession(e: React.FormEvent) {
    e.preventDefault();
    if (!role.trim()) return;
    setTurns([]);
    setQuestionNum(0);
    await fetchAndSpeakQuestion(role);
  }

  // ─── Toggle mic recording ──────────────────────────────────────────────────

  async function toggleMic() {
    if (stage === 'recording') {
      // Stop recording → triggers onstop
      mediaRecRef.current?.stop();
      return;
    }

    if (stage !== 'listening') return;

    setErrorMsg(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType =
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
          ? 'audio/ogg;codecs=opus'
          : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await transcribeAndEvaluate(blob, mimeType);
      };

      recorder.start(200);
      setStage('recording');
    } catch {
      setErrorMsg('Microphone access denied. Please allow mic permission in your browser.');
    }
  }

  // ─── Step 2: transcribe ────────────────────────────────────────────────────

  async function transcribeAndEvaluate(audioBlob: Blob, mimeType: string) {
    // Transcribe
    setStage('transcribing');
    let transcript = '';

    try {
      const suffix  = mimeType.includes('ogg') ? '.ogg' : '.webm';
      const form    = new FormData();
      form.append('file', new File([audioBlob], `answer${suffix}`, { type: mimeType }));

      const { data } = await axios.post<{ transcript: string }>(
        `${API_BASE}/voice/transcribe`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      transcript = data.transcript?.trim() ?? '';
    } catch (err: unknown) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail ?? err.message
        : 'Transcription failed.';
      setErrorMsg(detail);
      setStage('listening');
      return;
    }

    if (!transcript) {
      setErrorMsg("Couldn't catch that — please try again.");
      setStage('listening');
      return;
    }

    addTurn('you', transcript);

    // ─── Step 3: evaluate + feedback ──────────────────────────────────────────
    setStage('evaluating');

    try {
      const { data } = await axios.post<{
        score: number;
        feedback: string;
        audio_base64: string | null;
        content_type: string | null;
      }>(`${API_BASE}/voice/evaluate`, {
        question:   currentQ,
        transcript,
        role,
      });

      const { score, feedback, audio_base64, content_type } = data;

      const badgeColor =
        score >= 8 ? '#4ade80' : score >= 5 ? '#fbbf24' : '#f87171';

      addTurn('coach', feedback, `${score}/10`, badgeColor);

      // Speak feedback
      if (audio_base64) {
        setStage('feedback');
        await playAudioBase64(audio_base64, content_type ?? 'audio/mpeg');
      } else {
        setStage('feedback');
        await speakTextFallback(feedback);
      }

      // Auto-fetch next question after a short pause
      setStage('fetching');
      await new Promise((r) => setTimeout(r, 1200));
      await fetchAndSpeakQuestion(role);
    } catch (err: unknown) {
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail ?? err.message
        : 'Evaluation failed.';
      setErrorMsg(detail);
      setStage('listening');
    }
  }

  // ─── End session ──────────────────────────────────────────────────────────

  function endSession() {
    mediaRecRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStage('ended');
  }

  // ─── Setup screen ──────────────────────────────────────────────────────────

  if (stage === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: '2.5rem', maxWidth: '460px', width: '100%' }}
      >
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>Conversational AI</p>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Voice Interview Coach
        </h2>
        <p style={{ color: 'var(--cream-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '2rem' }}>
          The AI coach asks questions aloud using <strong style={{ color: 'var(--rose)' }}>ElevenLabs</strong> voice.
          You speak your answer — <strong style={{ color: 'var(--rose)' }}>AssemblyAI</strong> transcribes it.
          The AI scores you and immediately asks the next question.
          A full <strong style={{ color: 'var(--rose)' }}>transcript</strong> is shown throughout.
        </p>

        <form onSubmit={handleStartSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Your Target Role *</label>
            <input
              className="input"
              placeholder="e.g. QA Automation Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.85rem 1rem', fontSize: '0.77rem', color: 'var(--cream-muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--rose)', display: 'block', marginBottom: '0.25rem' }}>Before you start</strong>
            Allow microphone access · Add AssemblyAI + ElevenLabs keys to <code style={{ color: 'var(--cream)' }}>backend/.env</code>
          </div>
          <button className="btn-primary" type="submit" style={{ justifyContent: 'center', fontSize: '0.875rem' }}>
            Begin Session →
          </button>
        </form>
      </motion.div>
    );
  }

  // ─── Session ended ─────────────────────────────────────────────────────────

  if (stage === 'ended') {
    const coachTurns = turns.filter((t) => t.side === 'coach' && t.badge);
    const avgScore = coachTurns.length
      ? Math.round(coachTurns.reduce((s, t) => s + parseInt(t.badge!), 0) / coachTurns.length)
      : null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: '560px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            Session Complete
          </h2>
          {avgScore !== null && (
            <p style={{ color: 'var(--cream-muted)', fontSize: '0.9rem' }}>
              Average score: <strong style={{ color: avgScore >= 7 ? '#4ade80' : avgScore >= 5 ? '#fbbf24' : '#f87171', fontSize: '1.1rem' }}>
                {avgScore}/10
              </strong> across {coachTurns.length} question{coachTurns.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Full transcript */}
        <div className="card" style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          <p className="section-label" style={{ marginBottom: '1rem' }}>Full Transcript</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {turns.map((t) => (
              <TranscriptBubble key={t.id} entry={t} />
            ))}
          </div>
        </div>

        <button className="btn-primary" onClick={() => { setStage('setup'); setTurns([]); setQuestionNum(0); }} style={{ alignSelf: 'flex-start' }}>
          Start New Session →
        </button>
      </motion.div>
    );
  }

  // ─── Active session ────────────────────────────────────────────────────────

  const info       = STAGE_INFO[stage];
  const canPressMic = stage === 'listening' || stage === 'recording';
  const isRecording = stage === 'recording';
  const isBusy     = ['fetching', 'speaking', 'transcribing', 'evaluating', 'feedback'].includes(stage);

  return (
    <div style={{
      maxWidth: '900px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: '1.5rem',
      alignItems: 'start',
    }}>

      {/* ── Left: controls ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Status pill */}
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
          style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}
        >
          <span style={{
            width: 10, height: 10, flexShrink: 0, borderRadius: '50%',
            background: info.color,
            boxShadow: `0 0 0 ${isBusy || isRecording ? '4px' : '0'} ${info.color}33`,
            transition: 'box-shadow 0.3s',
          }} />
          <div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
              {info.label}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--cream-muted)', marginTop: '0.1rem' }}>
              {role} · Q{questionNum}
              {!hasTts && ' · Text-only (no ElevenLabs key)'}
            </p>
          </div>
        </motion.div>

        {/* Mic button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            {/* Outer pulsing ring — recording */}
            {isRecording && [0, 0.35, 0.7].map((d) => (
              <div key={d} style={{
                position: 'absolute', inset: -(18 + d * 14),
                border: '1px solid #f87171', opacity: 0,
                animation: `voicePulse 1.6s ease-out ${d}s infinite`,
              }} />
            ))}

            {/* Outer ring — speaking */}
            {(stage === 'speaking' || stage === 'feedback') && (
              <div style={{
                position: 'absolute', inset: -16,
                border: '1px solid var(--rose)',
                animation: 'voiceSpeakPulse 1.4s ease-in-out infinite',
              }} />
            )}

            <button
              id="mic-button"
              onClick={toggleMic}
              disabled={!canPressMic}
              aria-label={isRecording ? 'Stop recording' : 'Start recording your answer'}
              style={{
                position: 'relative', zIndex: 1,
                width: 108, height: 108,
                borderRadius: '0',
                border: `3px solid ${
                  isRecording ? '#f87171' :
                  stage === 'listening' ? '#4ade80' :
                  'var(--border)'
                }`,
                background:
                  isRecording ? 'rgba(248,113,113,0.12)' :
                  stage === 'listening' ? 'rgba(74,222,128,0.08)' :
                  'var(--bg-card)',
                cursor: canPressMic ? 'pointer' : 'not-allowed',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 0.25s',
              }}
            >
              {/* Mic SVG */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke={isRecording ? '#f87171' : stage === 'listening' ? '#4ade80' : 'var(--cream-muted)'}
                strokeWidth="1.6" strokeLinecap="square"
              >
                <rect x="9" y="2" width="6" height="11" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="21" x2="12" y2="17" />
                <line x1="9" y1="21" x2="15" y2="21" />
              </svg>
              <span style={{
                fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isRecording ? '#f87171' : stage === 'listening' ? '#4ade80' : 'var(--cream-muted)',
              }}>
                {isRecording ? 'STOP' : 'SPEAK'}
              </span>
            </button>
          </div>

          {/* Inline hint */}
          <p style={{ fontSize: '0.78rem', color: 'var(--cream-muted)', textAlign: 'center', maxWidth: '220px', lineHeight: 1.6 }}>
            {stage === 'listening'
              ? 'Press the mic, answer the question, then press again to stop'
              : stage === 'recording'
              ? 'Listening… press again when you are done'
              : isBusy
              ? 'Please wait…'
              : ''}
          </p>

          {/* Error */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                borderLeft: '3px solid #f87171',
                padding: '0.6rem 1rem',
                background: 'rgba(248,113,113,0.08)',
                fontSize: '0.78rem',
                color: '#fca5a5',
                maxWidth: '280px',
                lineHeight: 1.6,
              }}
            >
              ⚠ {errorMsg}
            </motion.div>
          )}
        </div>

        {/* End session */}
        <button
          className="btn-ghost"
          onClick={endSession}
          style={{ alignSelf: 'flex-start', fontSize: '0.78rem' }}
        >
          End Session
        </button>

        {/* CSS keyframes */}
        <style>{`
          @keyframes voicePulse {
            0%   { opacity: 0.5; transform: scale(0.92); }
            100% { opacity: 0;   transform: scale(1.25); }
          }
          @keyframes voiceSpeakPulse {
            0%,100% { opacity: 0.6; transform: scale(1.0); }
            50%     { opacity: 0.2; transform: scale(1.08); }
          }
        `}</style>
      </div>

      {/* ── Right: transcript ── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '560px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="section-label">Live Transcript</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--cream-muted)', marginTop: '0.15rem' }}>
              {turns.length === 0 ? 'Transcript will appear here…' : `${turns.length} exchange${turns.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {isBusy && <MiniSpinner />}
        </div>

        {/* Scroll body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <AnimatePresence>
            {turns.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TranscriptBubble entry={t} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator when AI is generating */}
          {(stage === 'fetching' || stage === 'evaluating') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '0.3rem' }}>
                🤖 AI Coach
              </p>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-secondary)', borderLeft: '2px solid var(--rose)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d) => (
                  <span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--rose)', opacity: 0.6, animation: `bounce 0.8s ${d}s ease-in-out infinite` }} />
                ))}
                <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Reusable transcript bubble ───────────────────────────────────────────────

function TranscriptBubble({ entry }: { entry: TurnEntry }) {
  const isCoach = entry.side === 'coach';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {/* Speaker row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isCoach ? 'var(--rose)' : '#4ade80',
        }}>
          {isCoach ? '🤖 AI Coach' : '🎙 You'}
        </span>
        {entry.badge && (
          <span style={{
            fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.45rem',
            letterSpacing: '0.08em',
            background: `${entry.badgeColor}20`,
            color: entry.badgeColor,
            border: `1px solid ${entry.badgeColor}50`,
          }}>
            {entry.badge}
          </span>
        )}
      </div>
      {/* Bubble */}
      <div style={{
        padding: '0.65rem 0.9rem',
        background: isCoach ? 'var(--bg-secondary)' : 'rgba(74,222,128,0.06)',
        borderLeft: `2px solid ${isCoach ? 'var(--rose)' : '#4ade80'}`,
        fontSize: '0.82rem', lineHeight: 1.65,
        color: 'var(--cream)',
      }}>
        {entry.text}
      </div>
    </div>
  );
}

function MiniSpinner() {
  return (
    <>
      <div style={{ width: 14, height: 14, border: '2px solid var(--border)', borderTop: '2px solid var(--rose)', borderRadius: '50%', animation: 'spinMini 0.7s linear infinite', flexShrink: 0 }} />
      <style>{`@keyframes spinMini{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
