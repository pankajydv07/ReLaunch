import VoiceInterviewPage from '@/components/voice-interview/VoiceInterviewPage';

export const metadata = {
  title: 'Voice Interview | ReLaunchAI',
  description: 'Practice real-time voice interviews with AI.',
};

export default function VoiceInterviewRoute() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 py-10 px-6">
      <VoiceInterviewPage />
    </main>
  );
}
