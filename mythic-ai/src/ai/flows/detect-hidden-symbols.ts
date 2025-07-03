'use server';

/**
 * @fileOverview A hidden symbol detection AI agent.
 *
 * - detectHiddenSymbols - A function that handles the detection of hidden symbols in an image.
 * - DetectHiddenSymbolsInput - The input type for the detectHiddenSymbols function.
 * - DetectHiddenSymbolsOutput - The return type for the detectHiddenSymbols function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectHiddenSymbolsInputSchema = z.object({
  artworkDataUri: z
    .string()
    .describe(
      "A photo of an artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectHiddenSymbolsInput = z.infer<typeof DetectHiddenSymbolsInputSchema>;

const DetectHiddenSymbolsOutputSchema = z.object({
  symbolsDetected: z.array(z.string()).describe('List of detected symbols in the artwork.'),
  analysis: z.string().describe('An analysis of the artwork and the detected symbols.'),
});
export type DetectHiddenSymbolsOutput = z.infer<typeof DetectHiddenSymbolsOutputSchema>;

export async function detectHiddenSymbols(input: DetectHiddenSymbolsInput): Promise<DetectHiddenSymbolsOutput> {
  return detectHiddenSymbolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectHiddenSymbolsPrompt',
  input: {schema: DetectHiddenSymbolsInputSchema},
  output: {schema: DetectHiddenSymbolsOutputSchema},
  prompt: `You are an art historian specializing in detecting hidden symbols in artwork.

You will analyze the artwork and identify any hidden symbols present. Provide a list of the detected symbols and an analysis of their potential meanings within the context of the artwork.

Use the following as the primary source of information about the artwork.

Artwork: {{media url=artworkDataUri}}
`,
});

const detectHiddenSymbolsFlow = ai.defineFlow(
  {
    name: 'detectHiddenSymbolsFlow',
    inputSchema: DetectHiddenSymbolsInputSchema,
    outputSchema: DetectHiddenSymbolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
