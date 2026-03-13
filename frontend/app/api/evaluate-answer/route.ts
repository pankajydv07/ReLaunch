import { NextRequest, NextResponse } from 'next/server';
import { nebius, MODEL } from '@/lib/nebius';
import { EVALUATE_SYSTEM, evaluateAnswerPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }

    const response = await nebius.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: EVALUATE_SYSTEM },
        {
          role: 'user',
          content: [{ type: 'text', text: evaluateAnswerPrompt(question, answer) }],
        },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[evaluate-answer]', error);
    return NextResponse.json({ error: 'Failed to evaluate answer. Please try again.' }, { status: 500 });
  }
}
