// This file uses server-side code.
'use server';

/**
 * @fileOverview Classifies an image of a magical symbol and returns the predicted symbol and confidence level.
 *
 * - classifySymbol - A function that classifies the image of a magical symbol.
 * - ClassifySymbolInput - The input type for the classifySymbol function.
 * - ClassifySymbolOutput - The return type for the classifySymbol function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifySymbolInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a magical symbol, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifySymbolInput = z.infer<typeof ClassifySymbolInputSchema>;

const ClassifySymbolOutputSchema = z.object({
  symbol: z.string().describe('The predicted magical symbol.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
});
export type ClassifySymbolOutput = z.infer<typeof ClassifySymbolOutputSchema>;

export async function classifySymbol(input: ClassifySymbolInput): Promise<ClassifySymbolOutput> {
  return classifySymbolFlow(input);
}

const classifySymbolPrompt = ai.definePrompt({
  name: 'classifySymbolPrompt',
  input: {schema: ClassifySymbolInputSchema},
  output: {schema: ClassifySymbolOutputSchema},
  prompt: `You are an expert in identifying magical symbols. Analyze the provided image and identify the symbol. Return the symbol name and your confidence level.

Image: {{media url=imageDataUri}}

Respond with JSON format.
`,
});

const classifySymbolFlow = ai.defineFlow(
  {
    name: 'classifySymbolFlow',
    inputSchema: ClassifySymbolInputSchema,
    outputSchema: ClassifySymbolOutputSchema,
  },
  async input => {
    const {output} = await classifySymbolPrompt(input);
    return output!;
  }
);
