import { config } from 'dotenv';
config();

import '@/ai/flows/generate-illusion.ts';
import '@/ai/flows/detect-hidden-symbols.ts';
import '@/ai/flows/classify-symbol.ts';