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

    const formData = await request.formData();

    // Accept multiple files: field name 'files' (can appear multiple times)
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Forward allowed parameters per usage.md if present
    const forwardParams: Record<string, string | string[]> = {};
    const listParams = [
      'from_formats', 'to_formats', 'ocr_lang'
    ];
    const singleParams = [
      'image_export_mode', 'do_ocr', 'force_ocr', 'ocr_engine', 'pdf_backend',
      'table_mode', 'abort_on_error', 'do_table_structure', 'include_images', 'images_scale'
    ];

    for (const key of listParams) {
      const values = formData.getAll(key).map(v => String(v));
      if (values.length > 0) forwardParams[key] = values;
    }

    for (const key of singleParams) {
      const value = formData.get(key);
      if (value !== null) forwardParams[key] = String(value);
    }

    // Build multipart to Docling
    const doclingFormData = new FormData();
    for (const [k, v] of Object.entries(forwardParams)) {
      if (Array.isArray(v)) {
        for (const item of v) doclingFormData.append(k, item);
      } else {
        doclingFormData.append(k, v);
      }
    }

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      doclingFormData.append('files', new Blob([buffer]), file.name);
    }

    const doclingBaseUrl = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    const endpoint = doclingBaseUrl.includes('/v1')
      ? `${doclingBaseUrl}/convert/file`
      : `${doclingBaseUrl}/v1/convert/file`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }) },
      body: doclingFormData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return NextResponse.json({ error: 'Failed to process document', details: errorText }, { status: response.status || 500 });
    }

    // Normalize response
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

      const { data: publicData } = supabase.storage.from('user-files').getPublicUrl(uploadData.path);
      const zipUrl = publicData.publicUrl;

      doclingResult = {
        text_content: `File processed. Download from: ${zipUrl}`,
        md_content: '',
        zip_file_url: zipUrl,
      };
    }

    // Persist one record (aggregate) with last file name shown
    const displayName = (files[files.length - 1] as File).name;
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


