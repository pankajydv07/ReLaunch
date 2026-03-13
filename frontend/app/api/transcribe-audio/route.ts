import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'Missing audio file' }, { status: 400 });
    }

    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AssemblyAI API key not configured' }, { status: 500 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload audio file to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: apiKey },
      body: buffer,
    });
    
    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(`AssemblyAI Upload Error: ${err.error || uploadRes.statusText}`);
    }
    const uploadData = await uploadRes.json();
    const uploadUrl = uploadData.upload_url;

    // 2. Start transcription job
    const transcriptReq = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: uploadUrl, speech_models: ['universal-2'] }),
    });

    if (!transcriptReq.ok) {
      const err = await transcriptReq.json();
      throw new Error(`AssemblyAI Transcript Error: ${err.error || transcriptReq.statusText}`);
    }
    const transcriptData = await transcriptReq.json();
    const transcriptId = transcriptData.id;

    // 3. Poll for completion
    let status = transcriptData.status;
    let finalTranscript = '';

    while (status !== 'completed' && status !== 'error') {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Poll every 1s
      
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        method: 'GET',
        headers: { authorization: apiKey },
      });
      
      const pollData = await pollRes.json();
      status = pollData.status;
      
      if (status === 'completed') {
        finalTranscript = pollData.text;
      } else if (status === 'error') {
        throw new Error(pollData.error || 'Transcription failed');
      }
    }

    return NextResponse.json({ text: finalTranscript });
  } catch (error) {
    console.error('[transcribe-audio]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
