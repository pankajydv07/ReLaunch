import { NextRequest, NextResponse } from 'next/server';
import { nebius, MODEL } from '@/lib/nebius';
import { RESUME_SYSTEM, resumePrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const target_role = formData.get('target_role') as string;
    const resume_text = formData.get('resume_text') as string | null;

    if (!target_role) {
      return NextResponse.json({ error: 'Missing target role' }, { status: 400 });
    }

    let resumeText = '';

    // Option 1: Direct text input (paste)
    if (resume_text && resume_text.trim()) {
      resumeText = resume_text.trim();
    }
    // Option 2: Read text/plain or .txt file
    else if (file) {
      try {
        resumeText = await file.text();
      } catch {
        return NextResponse.json({ error: 'Could not read the file.' }, { status: 400 });
      }
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'No resume content found. Please paste your resume text or upload a .txt file.' }, { status: 400 });
    }

    const response = await nebius.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: RESUME_SYSTEM },
        {
          role: 'user',
          content: [{ type: 'text', text: resumePrompt(resumeText, target_role) }],
        },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[analyze-resume]', error);
    return NextResponse.json({ error: 'Failed to analyze resume. Please try again.' }, { status: 500 });
  }
}
