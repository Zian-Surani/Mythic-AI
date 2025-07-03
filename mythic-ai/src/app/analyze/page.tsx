import { SymbolDetector } from '@/components/features/symbol-detector';

export default function AnalyzePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Hidden Symbol Detector</h1>
        <p className="text-foreground/80 mt-2">Upload artwork to reveal its hidden secrets.</p>
      </div>
      <SymbolDetector />
    </div>
  );
}
