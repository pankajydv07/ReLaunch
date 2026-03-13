import { NextRequest, NextResponse } from 'next/server';
import { nebius, MODEL } from '@/lib/nebius';
import { INTERVIEW_SYSTEM, interviewQuestionPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: 'Missing role' }, { status: 400 });
    }

    const response = await nebius.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: INTERVIEW_SYSTEM },
        {
          role: 'user',
          content: [{ type: 'text', text: interviewQuestionPrompt(role) }],
        },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[interview-question]', error);
    return NextResponse.json({ error: 'Failed to generate question. Please try again.' }, { status: 500 });
  }
}
