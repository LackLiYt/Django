import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => null);
    if (!body || (!body.http_sources && !body.file_sources)) {
      return NextResponse.json({ error: 'Provide http_sources or file_sources' }, { status: 400 });
    }

    const forward: any = {};
    if (body.http_sources) forward.http_sources = body.http_sources;
    if (body.file_sources) forward.file_sources = body.file_sources;
    if (body.options && Object.keys(body.options).length > 0) forward.options = body.options;

    const doclingBaseUrl = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    const endpoint = doclingBaseUrl.includes('/v1')
      ? `${doclingBaseUrl}/convert/source/async`
      : `${doclingBaseUrl}/v1/convert/source/async`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }),
      },
      body: JSON.stringify(forward),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: 'Failed to start async task', details: errorText }, { status: response.status || 500 });
    }

    const task = await response.json();
    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
