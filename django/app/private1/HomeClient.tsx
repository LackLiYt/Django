"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PDFUploadZone from "@/components/PDFUploadZone1";
import TextOutputArea from "@/components/TextOutputArea";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import GridBackground from "@/components/GridBackground"
import Header from "@/components/Header";
import ConversionHistory from "@/components/ConversionHistory";

interface ConversionRecord {
  id: string;
  fileName: string;
  date: string;
  textPreview: string;
  fullText: string;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [conversionHistory, setConversionHistory] = useState<ConversionRecord[]>([]);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    console.log('Converting PDF:', selectedFile.name);

    // TODO: remove mock functionality - simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: remove mock functionality - mock extracted text
    const mockText = `Document: ${selectedFile.name}

This is a demonstration of the PDF to Text Converter. In the full application, this area will display the actual text content extracted from your PDF file.

The converter will:
• Extract all readable text from the PDF
• Maintain paragraph structure and formatting where possible
• Handle multi-page documents
• Process files up to 10MB in size

Key Features:
- Fast extraction using pdf-parse library
- Copy text to clipboard with one click
- Download extracted text as a .txt file
- Clean, easy-to-read output
- Responsive design for all devices

Once the backend is implemented, you'll be able to upload any PDF document and see its text content extracted here instantly.`;

    setExtractedText(mockText);
    
    // Add to history
    const newRecord: ConversionRecord = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      date: new Date().toLocaleString(),
      textPreview: mockText.substring(0, 100) + '...',
      fullText: mockText,
    };
    setConversionHistory(prev => [newRecord, ...prev]);
    
    setIsProcessing(false);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText("");
    console.log('Reset converter');
  };

  const handleDeleteHistory = (id: string) => {
    setConversionHistory(prev => prev.filter(record => record.id !== id));
    console.log('Deleted history record:', id);
  };

  const handleRestoreFromHistory = (record: ConversionRecord) => {
    setExtractedText(record.fullText);
    setShowHistory(false);
    console.log('Restored from history:', record.fileName);
  };
  
  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <Header onShowHistory={() => setShowHistory(true)} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Convert PDF to Text
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract text from PDF files instantly with AI-powered precision
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {!extractedText ? (
            <>
              <PDFUploadZone
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                isProcessing={isProcessing}
              />

              {selectedFile && !isProcessing && (
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
              <TextOutputArea extractedText={extractedText} />
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                data-testid="button-convert-another"
              >
                Convert Another PDF
              </Button>
            </>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Fast Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>No Installation</span>
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
