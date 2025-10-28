import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: { task_id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { task_id } = params;
    if (!task_id) return NextResponse.json({ error: 'Missing task_id' }, { status: 400 });

    const base = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    const endpoint = base.includes('/v1') ? `${base}/result/${task_id}` : `${base}/v1/result/${task_id}`;

    const response = await fetch(endpoint, {
      headers: { ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }) },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: 'Failed to fetch result', details: errorText }, { status: response.status || 500 });
    }

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
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${user.id}/${Date.now()}-docling.zip`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filename, buffer, { contentType: 'application/zip', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = await supabase.storage.from('user-files').getPublicUrl(uploadData.path);
      const zipUrl = publicData.publicUrl;

      doclingResult = {
        text_content: `File processed. Download from: ${zipUrl}`,
        md_content: '',
        zip_file_url: zipUrl,
      };
    }

    const { data: fileRecord, error: insertError } = await supabase
      .from('user_files')
      .insert({
        user_id: user.id,
        file_name: 'remote-source',
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
