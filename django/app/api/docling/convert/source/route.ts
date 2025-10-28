import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Expect JSON body aligned with usage.md
    const body = await request.json().catch(() => null);
    if (!body || (!body.http_sources && !body.file_sources)) {
      return NextResponse.json({ error: 'Provide http_sources or file_sources' }, { status: 400 });
    }

    const options = body.options || {};
    const http_sources = body.http_sources || undefined;
    const file_sources = body.file_sources || undefined; // base64 strings with filename

    const doclingBaseUrl = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    const endpoint = doclingBaseUrl.includes('/v1')
      ? `${doclingBaseUrl}/convert/source`
      : `${doclingBaseUrl}/v1/convert/source`;

    const payload: any = {};
    if (options && Object.keys(options).length > 0) payload.options = options;
    if (http_sources) payload.http_sources = http_sources;
    if (file_sources) payload.file_sources = file_sources;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: 'Failed to process document', details: errorText }, { status: response.status || 500 });
    }

    // Normalize Docling result
    let doclingResult: any = null;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      doclingResult = {
        text_content: data.document?.text_content || data.document?.text || '',
        md_content: data.document?.md_content || data.document?.md || '',
        html_content: data.document?.html_content || '',
        json_content: data.document?.json_content || {},
        doctags_content: data.document?.doctags_content || '',
        status: data.status,
        processing_time: data.processing_time,
        timings: data.timings,
        errors: data.errors,
      };
    } else {
      // ZIP/binary from Docling (e.g., multiple outputs)
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${user.id}/${Date.now()}-docling.zip`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filename, buffer, { contentType: 'application/zip', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('user-files').getPublicUrl(uploadData.path);
      const zipUrl = publicData.publicUrl;

      doclingResult = {
        text_content: `File processed. Download from: ${zipUrl}`,
        md_content: '',
        zip_file_url: zipUrl,
      };
    }

    // Persist record
    const displayName = http_sources?.[0]?.url || file_sources?.[0]?.filename || 'document';
    const { data: fileRecord, error: insertError } = await supabase
      .from('user_files')
      .insert({
        user_id: user.id,
        file_name: displayName,
        file_url: '',
        docling_result: doclingResult,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, data: fileRecord });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}


