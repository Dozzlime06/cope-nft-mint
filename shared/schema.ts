import { z } from 'zod';

export const mintRequestSchema = z.object({
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  quantity: z.number().min(1).max(10),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address').optional(),
});

export type MintRequest = z.infer<typeof mintRequestSchema>;

export const mintResponseSchema = z.object({
  success: z.boolean(),
  transactionHash: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type MintResponse = z.infer<typeof mintResponseSchema>;
