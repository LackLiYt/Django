"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button1";
import DocumentUploadZone from "@/components/DocumentUploadZone";
import TextOutputArea from "@/components/TextOutputArea";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import GridBackground from "@/components/GridBackground"
import Header from "@/components/Header";
import ConversionHistory from "@/components/ConversionHistory";
import { useToast } from "@/app/hooks/use-toast";

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

  const handleConvert = async () => {
    if (!selectedFile && !url) return;

    setIsProcessing(true);
    const startTime = Date.now();
    
    // Create a record for the history with processing status
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
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (url) {
        formData.append('url', url);
      }

      const response = await fetch('/api/docling/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to convert document';
        try {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            errorMessage = json.error || json.details || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Process Docling response
      if (result.data && result.data.document) {
        const doc = result.data.document;
        const processingTime = (Date.now() - startTime) / 1000;

        // Extract text and markdown
        const textContent = doc.text_content || doc.md_content || '';
        const mdContent = doc.md_content || '';

        setExtractedText(textContent);
        setMarkdownText(mdContent);

        // Update history record
        const successRecord: ConversionRecord = {
          id: recordId,
          fileName: sourceName,
          date: new Date().toLocaleString(),
          textPreview: textContent.substring(0, 100) + '...',
          fullText: textContent,
          markdownText: mdContent || undefined,
          status: 'success',
          processingTime: processingTime,
        };

        setConversionHistory(prev => 
          prev.map(record => record.id === recordId ? successRecord : record)
        );

        toast({
          title: "Conversion successful",
          description: `Document processed in ${processingTime.toFixed(2)}s`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      const processingTime = (Date.now() - startTime) / 1000;
      
      console.error('Conversion error:', error);
      
      setExtractedText(`Error: ${error.message}`);
      setMarkdownText('');

      // Update history record with error
      const errorRecord: ConversionRecord = {
        id: recordId,
        fileName: sourceName,
        date: new Date().toLocaleString(),
        textPreview: `Error: ${error.message}`,
        fullText: `Error: ${error.message}`,
        status: 'error',
        processingTime: processingTime,
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

  const handleReset = () => {
    setSelectedFile(null);
    setUrl("");
    setExtractedText("");
    setMarkdownText("");
    console.log('Reset converter');
  };

  const handleDeleteHistory = (id: string) => {
    setConversionHistory(prev => prev.filter(record => record.id !== id));
    console.log('Deleted history record:', id);
  };

  const handleRestoreFromHistory = (record: ConversionRecord) => {
    setExtractedText(record.fullText);
    setMarkdownText(record.markdownText || '');
    setShowHistory(false);
    console.log('Restored from history:', record.fileName);
  };
  
  const canConvert = (selectedFile || url) && !isProcessing;
  const sourceName = selectedFile?.name || url.split('/').pop() || 'document';

  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <Header onShowHistory={() => setShowHistory(true)} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Convert Documents to Text
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract text from documents instantly with Docling-powered precision
          </p>
        </div>

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

              {isProcessing && <ProcessingIndicator />}
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

        <div className="mt-16 text-center">
          <div className="inline-flex gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Powered by Docling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Multiple Formats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>OCR Enabled</span>
            </div>
          </div>
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
