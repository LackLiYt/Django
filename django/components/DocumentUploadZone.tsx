"use client"
import { Upload, FileText, X, Link as LinkIcon, File } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button1";
import { Card } from "@/components/ui/card1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DocumentUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  selectedFile: File | null;
  url: string;
  isProcessing: boolean;
}

export default function DocumentUploadZone({ 
  onFileSelect, 
  onUrlChange, 
  selectedFile, 
  url,
  isProcessing 
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);

  const handleToggleMode = useCallback((checked: boolean) => {
    setIsUrlMode(checked);
    if (checked) {
      onFileSelect(null);
    } else {
      onUrlChange("");
    }
  }, [onFileSelect, onUrlChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isUrlMode) {
      setIsDragging(true);
    }
  }, [isUrlMode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isUrlMode) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]); // Accept any file type
    }
  }, [isUrlMode, onFileSelect]);

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
      {/* Mode Switch */}
      <div className="flex items-center justify-center gap-3">
        <Label htmlFor="mode-switch" className="flex items-center gap-2 cursor-pointer">
          <File className="w-5 h-5" />
          <span>File</span>
        </Label>
        <Switch 
          id="mode-switch"
          checked={isUrlMode}
          onCheckedChange={handleToggleMode}
          disabled={isProcessing}
        />
        <Label htmlFor="mode-switch" className="flex items-center gap-2 cursor-pointer">
          <LinkIcon className="w-5 h-5" />
          <span>URL</span>
        </Label>
      </div>

      {/* Upload Zone or URL Input */}
      {!isUrlMode ? (
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
      ) : (
        <Card className="p-6 transition-all duration-300">
          <div className="space-y-3">
            <Label htmlFor="url-input">Document URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com/document.pdf"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={isProcessing}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to a document (PDF, Word, Excel, etc.)
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

