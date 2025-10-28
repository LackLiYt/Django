import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: { task_id: string } }) {
  try {
    const { task_id } = params;
    if (!task_id) return NextResponse.json({ error: 'Missing task_id' }, { status: 400 });

    const base = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    const endpoint = base.includes('/v1') ? `${base}/status/poll/${task_id}` : `${base}/v1/status/poll/${task_id}`;

    const response = await fetch(endpoint, {
      headers: { ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }) },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: 'Failed to poll status', details: errorText }, { status: response.status || 500 });
    }

    const task = await response.json();
    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
