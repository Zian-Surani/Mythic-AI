// This file holds the Genkit flow for generating optical illusions.

'use server';

/**
 * @fileOverview An optical illusion generator AI agent.
 *
 * - generateIllusion - A function that handles the optical illusion generation process.
 * - GenerateIllusionOutput - The return type for the generateIllusion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateIllusionOutputSchema = z.object({
  media: z.string().describe('The generated optical illusion as a data URI.'),
});
export type GenerateIllusionOutput = z.infer<typeof GenerateIllusionOutputSchema>;

export async function generateIllusion(): Promise<GenerateIllusionOutput> {
  return generateIllusionFlow();
}

const generateIllusionFlow = ai.defineFlow(
  {
    name: 'generateIllusionFlow',
    outputSchema: GenerateIllusionOutputSchema,
  },
  async () => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: 'Generate an abstract optical illusion.',
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media) {
      throw new Error('No media returned');
    }
    return {media: media.url};
  }
);
