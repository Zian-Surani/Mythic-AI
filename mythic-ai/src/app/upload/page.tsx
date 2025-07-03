import { SymbolClassifier } from '@/components/features/symbol-classifier';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Symbol Classifier</h1>
        <p className="text-foreground/80 mt-2">Upload an image to identify a magical symbol.</p>
      </div>
      <SymbolClassifier />
    </div>
  );
}
