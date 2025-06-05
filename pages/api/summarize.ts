// pages/api/summarize.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in request body' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const truncatedHtml = html.slice(0, 10000); // Limiter la taille pour éviter les dépassements de tokens

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: `Voici le code HTML d'une page web. Ignore les menus, scripts et publicités. Résume uniquement le contenu principal de l'article :

${truncatedHtml}`,
        },
      ],
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
