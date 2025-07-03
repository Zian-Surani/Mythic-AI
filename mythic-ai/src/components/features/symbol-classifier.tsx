'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, UploadCloud, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { classifySymbol, type ClassifySymbolOutput } from '@/ai/flows/classify-symbol';

export function SymbolClassifier() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifySymbolOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
        setError("Please upload a valid image file (PNG, JPG).");
        return;
    }

    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      }
    };
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setUploadProgress(100);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleClassify = async () => {
    if (!preview) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const classificationResult = await classifySymbol({ imageDataUri: preview });
      setResult(classificationResult);
    } catch (e) {
      setError('Failed to classify the symbol. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearUpload = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
    if(inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors border-border hover:border-primary/50 bg-background/20"
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <UploadCloud className="mx-auto h-12 w-12 text-foreground/50" />
          <p className="mt-4 text-foreground/80">Drag & drop an image here, or click to select</p>
          <p className="text-xs text-foreground/60 mt-1">PNG, JPG, JPEG</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="relative w-full aspect-square max-h-[400px] mx-auto">
              <Image src={preview} alt="Uploaded symbol preview" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="magical symbol"/>
            </div>
            {uploadProgress < 100 && <Progress value={uploadProgress} className="h-2" />}
            <div className="flex gap-4 justify-center">
              <Button onClick={handleClassify} disabled={isLoading || result !== null}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : result ? 'Analyzed' : 'Classify Symbol'}
              </Button>
              <Button variant="outline" onClick={clearUpload}>
                <X className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
         <div className="text-center mt-6 flex items-center justify-center space-x-2">
           <Loader2 className="h-6 w-6 animate-spin text-primary" />
           <p className="text-lg">AI is contemplating the cosmos...</p>
         </div>
      )}

      {error && (
        <div className="mt-6 flex items-center justify-center p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg">
          <AlertCircle className="h-5 w-5 mr-3" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-center">Classification Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div>
              <p className="font-bold text-3xl text-primary font-headline">{result.symbol}</p>
              <p className="text-sm text-foreground/70">
                Confidence: <span className="font-bold">{Math.round(result.confidence * 100)}%</span>
              </p>
            </div>
            <Button asChild variant="link">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(result.symbol + ' symbol meaning')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about this symbol
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
