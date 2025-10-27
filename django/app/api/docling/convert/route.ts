import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    if (!file && !url) {
      return NextResponse.json(
        { error: 'No file or URL provided' },
        { status: 400 }
      );
    }

    // Get Docling API URL from environment
    const doclingUrl = process.env.DOCLING_API_URL || 'https://docling.lackli226.pp.ua/v1';
    
    let response;
    
    if (file) {
      // Convert file to blob and send to Docling
      const buffer = await file.arrayBuffer();
      
      // Create form data for Docling
      const doclingFormData = new FormData();
      doclingFormData.append('files', new Blob([buffer]), file.name);
      
      // Configure for optimal processing with tesseract and dlparse_v4
      doclingFormData.append('to_formats', 'md');
      doclingFormData.append('to_formats', 'text');
      doclingFormData.append('image_export_mode', 'placeholder'); // Use placeholders for images
      doclingFormData.append('do_ocr', 'true');
      doclingFormData.append('do_table_structure', 'true');
      doclingFormData.append('include_images', 'true');
      
      // Use tesseract OCR with dlparse_v4
      doclingFormData.append('ocr_engine', 'tesserocr');
      doclingFormData.append('pdf_backend', 'dlparse_v4');
      doclingFormData.append('ocr_lang', 'eng');
      doclingFormData.append('ocr_lang', 'ukr');
      
      // Make request to Docling - only append /convert/file if not already in URL
      const endpoint = doclingUrl.includes('/v1') 
        ? `${doclingUrl}/convert/file` 
        : `${doclingUrl}/v1/convert/file`;
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(process.env.DOCLING_API_KEY && {
            'X-Api-Key': process.env.DOCLING_API_KEY
          })
        },
        body: doclingFormData,
      });
    } else if (url) {
      // Use source endpoint for URL
      const payload = {
        options: {
          to_formats: ['md', 'text'],
          image_export_mode: 'placeholder', // Use placeholders for images
          do_ocr: true,
          do_table_structure: true,
          include_images: true,
          ocr_engine: 'tesserocr',
          pdf_backend: 'dlparse_v4',
          ocr_lang: ['eng', 'ukr'], // English and Ukrainian languages
        },
        http_sources: [{ url: url }]
      };
      
      // Make request to Docling - only append /convert/source if not already in URL
      const endpoint = doclingUrl.includes('/v1') 
        ? `${doclingUrl}/convert/source` 
        : `${doclingUrl}/v1/convert/source`;
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.DOCLING_API_KEY && {
            'X-Api-Key': process.env.DOCLING_API_KEY
          })
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response || !response.ok) {
      const errorText = await response?.text().catch(() => 'Unknown error');
      console.error('Docling API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process document', details: errorText },
        { status: response?.status || 500 }
      );
    }

    const contentType = response.headers.get('content-type');
    
    // Check if response is JSON or a file
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        data: data
      });
    } else {
      // Handle file response (zip)
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="converted.zip"'
        }
      });
    }
  } catch (error: any) {
    console.error('Docling conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

