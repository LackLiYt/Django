import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1️⃣ Authenticate user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    if (!file && !url) {
      return NextResponse.json({ error: 'No file or URL provided' }, { status: 400 });
    }

    let fileUrl: string | null = null;

    // Helper: sanitize filename for safe uploads
    const sanitizeFileName = (name: string): string => {
      const normalized = name.normalize('NFC');
      return normalized
        .replace(/[^\w.\-]+/g, '_') // replace non-latin/special chars
        .replace(/_+/g, '_')        // collapse underscores
        .trim();
    };

    // 2️⃣ Upload original file to Supabase bucket
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const originalName = file.name;
      const safeName = sanitizeFileName(originalName);
      const filename = `${user.id}/${Date.now()}-${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filename, buffer, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('user-files').getPublicUrl(uploadData.path);
      fileUrl = publicData.publicUrl;
    }

    // 3️⃣ Call Docling API
    const doclingUrl = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    let response: Response;

    if (file) {
      const buffer = await file.arrayBuffer();
      const originalName = file.name;
      const safeName = sanitizeFileName(originalName);

      const doclingFormData = new FormData();
      doclingFormData.append('files', new Blob([buffer]), safeName);
      doclingFormData.append('to_formats', 'md');
      doclingFormData.append('to_formats', 'text');
      doclingFormData.append('image_export_mode', 'placeholder');
      doclingFormData.append('do_ocr', 'true');
      doclingFormData.append('do_table_structure', 'true');
      doclingFormData.append('include_images', 'true');
      doclingFormData.append('ocr_engine', 'tesserocr');
      doclingFormData.append('pdf_backend', 'dlparse_v4');
      doclingFormData.append('ocr_lang', 'eng');
      doclingFormData.append('ocr_lang', 'ukr');

      const endpoint = doclingUrl.includes('/v1')
        ? `${doclingUrl}/convert/file`
        : `${doclingUrl}/v1/convert/file`;

      response = await fetch(endpoint, {
        method: 'POST',
        headers: { ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }) },
        body: doclingFormData,
      });
    } else {
      const payload = {
        options: {
          to_formats: ['md', 'text'],
          image_export_mode: 'placeholder',
          do_ocr: true,
          do_table_structure: true,
          include_images: true,
          ocr_engine: 'tesserocr',
          pdf_backend: 'dlparse_v4',
          ocr_lang: ['eng', 'ukr'],
        },
        http_sources: [{ url }],
      };

      const endpoint = doclingUrl.includes('/v1')
        ? `${doclingUrl}/convert/source`
        : `${doclingUrl}/v1/convert/source`;

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.DOCLING_API_KEY && { 'X-Api-Key': process.env.DOCLING_API_KEY }),
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Docling API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process document', details: errorText },
        { status: response.status || 500 }
      );
    }

    // 4️⃣ Normalize Docling result
    let doclingResult: any = null;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      doclingResult = {
        text_content: data.document?.text_content || data.document?.text || '',
        md_content: data.document?.md_content || data.document?.md || '',
      };
    } else {
      // ZIP/binary from Docling
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

    // 5️⃣ Insert record into user_files table
    const { data: fileRecord, error: insertError } = await supabase
      .from('user_files')
      .insert({
        user_id: user.id,
        file_name: file?.name || url || 'document', // keep original name for UI
        file_url: fileUrl || '',
        docling_result: doclingResult,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, data: fileRecord });

  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
