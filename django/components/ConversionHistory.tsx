import { FileText, Download, X, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card1";
import { Button } from "@/components/ui/button1";
import { ScrollArea } from "@/components/ui/scroll-area1";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface ConversionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversionRecord[];
  onDelete: (id: string) => void;
  onRestore: (record: ConversionRecord) => void;
}

export default function ConversionHistory({
  isOpen,
  onClose,
  history,
  onDelete,
  onRestore,
}: ConversionHistoryProps) {
  const handleDownload = (record: ConversionRecord, format: 'txt' | 'md' = 'txt') => {
    const content = format === 'md' && record.markdownText ? record.markdownText : record.fullText;
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.fileName.replace(/\.(pdf|docx?|pptx?|xlsx?|txt|md|html|csv)$/i, '')}-extracted.${format === 'md' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conversion History</DialogTitle>
        </DialogHeader>
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No conversion history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your converted PDFs will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {history.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium font-mono text-sm truncate">
                          {record.fileName}
                        </h4>
                        {record.status === 'processing' && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        )}
                        {record.status === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                        {record.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {record.date}
                        {record.processingTime && (
                          <span className="ml-2">
                            • {record.processingTime.toFixed(2)}s
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {record.textPreview}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRestore(record)}
                        disabled={record.status === 'processing' || record.status === 'error'}
                        data-testid={`button-restore-${record.id}`}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDownload(record, 'txt')}
                          disabled={record.status === 'processing' || record.status === 'error'}
                          data-testid={`button-download-${record.id}-txt`}
                          title="Download as TXT"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {record.markdownText && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(record, 'md')}
                            disabled={record.status === 'processing' || record.status === 'error'}
                            data-testid={`button-download-${record.id}-md`}
                            title="Download as Markdown"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(record.id)}
                        data-testid={`button-delete-${record.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
