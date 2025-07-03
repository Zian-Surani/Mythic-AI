'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, UploadCloud, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { detectHiddenSymbols, type DetectHiddenSymbolsOutput } from '@/ai/flows/detect-hidden-symbols';

export function SymbolDetector() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectHiddenSymbolsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        setError("Please upload a valid image file (PNG, JPG).");
        return;
    }
    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!preview) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const detectionResult = await detectHiddenSymbols({ artworkDataUri: preview });
      setResult(detectionResult);
    } catch (e) {
      setError('Failed to analyze the artwork. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearUpload = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if(inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors border-border hover:border-primary/50 bg-background/20"
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <UploadCloud className="mx-auto h-12 w-12 text-foreground/50" />
          <p className="mt-4 text-foreground/80">Drag & drop artwork here, or click to select</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="relative w-full">
                  <Image src={preview} alt="Artwork preview" width={500} height={500} className="rounded-md w-full h-auto object-contain max-h-[70vh]" data-ai-hint="historic artwork" />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button onClick={handleAnalyze} disabled={isLoading || result !== null}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : result ? 'Analyzed' : 'Analyze Artwork'}
              </Button>
              <Button variant="outline" onClick={clearUpload}>
                <X className="mr-2 h-4 w-4" /> New Artwork
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg mt-4">Scrutinizing the canvas...</p>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 mr-3" />
                <p>{error}</p>
              </div>
            )}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Detected Symbols</h3>
                    {result.symbolsDetected.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.symbolsDetected.map((symbol, i) => (
                          <Badge key={i} variant="secondary">{symbol}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/70">No distinct symbols were detected by the AI.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{result.analysis}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
