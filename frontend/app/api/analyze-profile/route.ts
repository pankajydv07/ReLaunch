import { NextRequest, NextResponse } from 'next/server';
import { nebius, MODEL } from '@/lib/nebius';
import { SKILL_GAP_SYSTEM, skillGapPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { previous_role, years_experience, break_duration, skills, target_role } = body;

    if (!previous_role || !target_role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await nebius.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SKILL_GAP_SYSTEM },
        {
          role: 'user',
          content: [{ type: 'text', text: skillGapPrompt({ previous_role, years_experience, break_duration, skills, target_role }) }],
        },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0]?.message?.content ?? '{}';

    // Strip markdown fences if present
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[analyze-profile]', error);
    return NextResponse.json({ error: 'Failed to analyze profile. Please try again.' }, { status: 500 });
  }
}
