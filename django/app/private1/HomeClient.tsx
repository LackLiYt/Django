  "use client";

  import { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button1";
  import DocumentUploadZone from "@/components/DocumentUploadZone";
  import TextOutputArea from "@/components/TextOutputArea";
  import ProcessingIndicator from "@/components/ProcessingIndicator";
  import GridBackground from "@/components/GridBackground";
  import Header from "@/components/Header";
  import ConversionHistory from "@/components/ConversionHistory";
  import { useToast } from "@/app/hooks/use-toast";
  import { createClient } from "@/utils/supabase/client"; // Make sure you have a client for browser

  interface ConversionRecord {
    id: string;
    fileName: string;
    date: string;
    textPreview: string;
    fullText: string;
    markdownText?: string;
    status?: 'processing' | 'success' | 'error';
    processingTime?: number;
  }

  export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState<string>("");
    const [markdownText, setMarkdownText] = useState<string>("");
    const [showHistory, setShowHistory] = useState(false);
    const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);
    const { toast } = useToast();

    const supabase = createClient();

    // -------------------------------
    // Load conversion history on mount
    // -------------------------------
    useEffect(() => {
      const loadHistory = async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) return;

          const { data, error } = await supabase
            .from('user_files')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const history: ConversionRecord[] = data.map((row: any) => ({
              id: row.id,
              fileName: row.file_name,
              date: new Date(row.created_at).toLocaleString(),
              textPreview: row.docling_result?.text_content?.substring(0, 100) || 'No preview',
              fullText: row.docling_result?.text_content || '',
              markdownText: row.docling_result?.md_content || undefined,
              status: 'success',
            }));
            setConversionHistory(history);
          }
        } catch (err) {
          console.error('Failed to load history:', err);
        }
      };

      loadHistory();
    }, []);

    // -------------------------------
    // Conversion function (unchanged)
    // -------------------------------
    const handleConvert = async () => {
      if (!selectedFile && !url) return;

      setIsProcessing(true);
      const startTime = Date.now();
      const sourceName = selectedFile?.name || url.split('/').pop() || 'document';
      const recordId = Date.now().toString();

      const processingRecord: ConversionRecord = {
        id: recordId,
        fileName: sourceName,
        date: new Date().toLocaleString(),
        textPreview: 'Processing...',
        fullText: '',
        status: 'processing',
        processingTime: 0,
      };
      setConversionHistory(prev => [processingRecord, ...prev]);

      try {
        let response: Response;
        if (selectedFile) {
          const fd = new FormData();
          fd.append('file', selectedFile);
          response = await fetch('/api/docling/convert', { method: 'POST', body: fd });
        } else {
          const payload = {
            options: {
              to_formats: ['md', 'text'],
            },
            http_sources: [{ url }],
          };
          response = await fetch('/api/docling/convert/source', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          let serverMessage = '';
          try {
            const errJson = await response.json();
            serverMessage = errJson?.error || errJson?.details || '';
          } catch (_) {
            try { serverMessage = await response.text(); } catch (_) {}
          }
          throw new Error(serverMessage || 'Failed to convert document');
        }
        const result = await response.json();

        const doc = result.data?.docling_result;
        const fileUrl = result.data?.file_url || '';
        const processingTime = (Date.now() - startTime) / 1000;

        let textContent = '';
        let mdContent = '';

        if (doc) {
          textContent = doc.text_content || '';
          mdContent = doc.md_content || '';
        } else if (fileUrl) {
          textContent = `File processed. Download from: ${fileUrl}`;
          mdContent = '';
        } else {
          throw new Error('Invalid response format');
        }

        setExtractedText(textContent);
        setMarkdownText(mdContent);

        const successRecord: ConversionRecord = {
          id: recordId,
          fileName: sourceName,
          date: new Date().toLocaleString(),
          textPreview: textContent.substring(0, 100) + '...',
          fullText: textContent,
          markdownText: mdContent || undefined,
          status: 'success',
          processingTime,
        };

        setConversionHistory(prev =>
          prev.map(record => record.id === recordId ? successRecord : record)
        );

        toast({
          title: "Conversion successful",
          description: `Processed in ${processingTime.toFixed(2)}s`,
        });

      } catch (error: any) {
        const processingTime = (Date.now() - startTime) / 1000;
        console.error('Conversion error:', error);

        setExtractedText(`Error: ${error.message}`);
        setMarkdownText('');

        const errorRecord: ConversionRecord = {
          id: recordId,
          fileName: sourceName,
          date: new Date().toLocaleString(),
          textPreview: `Error: ${error.message}`,
          fullText: `Error: ${error.message}`,
          status: 'error',
          processingTime,
        };

        setConversionHistory(prev =>
          prev.map(record => record.id === recordId ? errorRecord : record)
        );

        toast({
          title: "Conversion failed",
          description: error.message || 'An error occurred while converting the document',
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    // -------------------------------
    // Other handlers (unchanged)
    // -------------------------------
    const handleReset = () => {
      setSelectedFile(null);
      setUrl("");
      setExtractedText("");
      setMarkdownText("");
    };

    const handleDeleteHistory = async (id: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from('user_files').delete().eq('id', id).eq('user_id', user.id);
        setConversionHistory(prev => prev.filter(record => record.id !== id));
      } catch (e) {
        console.error('Failed to delete history item', e);
      }
    };

    const handleRestoreFromHistory = (record: ConversionRecord) => {
      setExtractedText(record.fullText);
      setMarkdownText(record.markdownText || '');
      setShowHistory(false);
    };

    const canConvert = (selectedFile || url) && !isProcessing;
    const sourceName = selectedFile?.name || url.split('/').pop() || 'document';

    const currentExt = (() => {
      const name = selectedFile?.name || url;
      if (!name) return '';
      const last = name.split('?')[0].split('#')[0].split('/').pop() || '';
      const parts = last.split('.');
      if (parts.length < 2) return '';
      return parts.pop() || '';
    })();

    const processingMessage = currentExt
      ? `Extracting text from ${currentExt.toUpperCase()}...`
      : 'Extracting text...';

    return (
      <div className="min-h-screen relative">
        <GridBackground />
        <Header onShowHistory={() => setShowHistory(true)} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
          {/* ... your conversion UI unchanged ... */}
          <div className="max-w-2xl mx-auto space-y-8">
            {!extractedText ? (
              <>
                <DocumentUploadZone
                  onFileSelect={setSelectedFile}
                  onUrlChange={setUrl}
                  selectedFile={selectedFile}
                  url={url}
                  isProcessing={isProcessing}
                />

                {canConvert && (
                  <Button
                    onClick={handleConvert}
                    className="w-full h-12 text-base"
                    size="lg"
                    data-testid="button-convert"
                  >
                    Convert to Text
                  </Button>
                )}

                {isProcessing && <ProcessingIndicator message={processingMessage} />}
              </>
            ) : (
              <>
                <TextOutputArea 
                  extractedText={extractedText} 
                  markdownText={markdownText}
                  sourceName={sourceName}
                />
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  data-testid="button-convert-another"
                >
                  Convert Another Document
                </Button>
              </>
            )}
          </div>
        </div>

        <ConversionHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={conversionHistory}
          onDelete={handleDeleteHistory}
          onRestore={handleRestoreFromHistory}
        />
      </div>
    );
  }
