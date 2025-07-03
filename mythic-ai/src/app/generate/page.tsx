'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Download, AlertCircle } from 'lucide-react';
import { generateIllusion, type GenerateIllusionOutput } from '@/ai/flows/generate-illusion';

export default function GeneratePage() {
  const [illusion, setIllusion] = useState<GenerateIllusionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIllusion(null);
    try {
      const result = await generateIllusion();
      setIllusion(result);
    } catch (e) {
      setError('Failed to generate illusion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Illusion Generator</h1>
        <p className="text-foreground/80 mt-2">Create a unique optical illusion with a click.</p>
      </div>
      <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
        <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="rounded-2xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50 active:scale-95">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="mr-2 h-5 w-5" /> Generate New Illusion</>
          )}
        </Button>
        
        {isLoading && (
          <div className="text-center mt-6 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Conjuring a visual paradox...</p>
          </div>
        )}

        {error && (
          <div className="w-full flex items-center justify-center p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg">
            <AlertCircle className="h-5 w-5 mr-3" />
            <p>{error}</p>
          </div>
        )}

        {illusion?.media && (
          <Card className="w-full overflow-hidden shadow-2xl shadow-primary/20">
            <CardContent className="p-4 space-y-4">
              <div className="relative aspect-square w-full">
                <Image
                  src={illusion.media}
                  alt="Generated optical illusion"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  data-ai-hint="optical illusion"
                />
              </div>
              <div className="flex justify-center">
                <a href={illusion.media} download="mythicode-illusion.png">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
