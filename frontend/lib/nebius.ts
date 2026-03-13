import OpenAI from 'openai';

export const nebius = new OpenAI({
  baseURL: 'https://api.tokenfactory.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY!,
});

export const MODEL = 'openai/gpt-oss-20b';
