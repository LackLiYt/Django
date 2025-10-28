"use client"
import { Upload, FileText, X, File } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button1";
import { Card } from "@/components/ui/card1";
import { Label } from "@/components/ui/label";

interface DocumentUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export default function DocumentUploadZone({ 
  onFileSelect, 
  selectedFile, 
  isProcessing 
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]); // Accept any file type
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleRemoveFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <Card
        className={`relative overflow-visible transition-all duration-300 ${
          isDragging ? 'border-primary scale-[1.02]' : ''
        } ${selectedFile ? 'p-6' : 'p-8'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="upload-zone"
      >
        {!selectedFile ? (
          <label className="flex flex-col items-center justify-center cursor-pointer min-h-64">
            <input
              type="file"
              onChange={handleFileInput}
              className="hidden"
              disabled={isProcessing}
              data-testid="input-file"
            />
            <div className={`transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop document here</h3>
            <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports any document format (PDF, DOCX, XLSX, PPTX, TXT, MD, HTML, Images, and more)
            </p>
          </label>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium font-mono text-sm truncate" data-testid="text-filename">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1" data-testid="text-filesize">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRemoveFile}
              disabled={isProcessing}
              data-testid="button-remove-file"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

