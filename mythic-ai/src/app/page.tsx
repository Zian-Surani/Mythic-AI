import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanSearch, Sparkles, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/70">
                  MythiCode AI
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl font-body">
                  Unveil the mysteries of symbols, illusions, and secrets with AI.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/upload">
                  <Button
                    size="lg"
                    className="rounded-2xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50 active:scale-95"
                  >
                    Try The Classifier
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background/50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<ScanSearch className="w-10 h-10 text-primary" />}
                title="Symbol Classifier"
                description="Upload an image of a magical symbol, rune, or tarot card to discover its identity and meaning."
                href="/upload"
                actionText="Classify a Symbol"
              />
              <FeatureCard
                icon={<Sparkles className="w-10 h-10 text-primary" />}
                title="Illusion Generator"
                description="Generate mind-bending optical illusions with a single click. A new visual puzzle every time."
                href="/generate"
                actionText="Generate an Illusion"
              />
              <FeatureCard
                icon={<Search className="w-10 h-10 text-primary" />}
                title="Hidden Symbol Detector"
                description="Analyze historical artwork and uncover hidden symbols and meanings embedded by the artists."
                href="/analyze"
                actionText="Analyze Artwork"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-foreground/60">
          &copy; {new Date().getFullYear()} MythiCode AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs text-foreground/60">
            Built with Next.js and Genkit.
          </p>
        </nav>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  actionText: string;
}

function FeatureCard({ icon, title, description, href, actionText }: FeatureCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10 transform transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
      <CardHeader className="flex flex-col items-center text-center p-6">
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-6 pt-0">
        <Link href={href}>
          <Button variant="outline" className="rounded-2xl">
            {actionText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
