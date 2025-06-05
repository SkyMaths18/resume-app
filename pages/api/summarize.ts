// pages/api/summarize.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  console.log(`[API] Reçu une requête de résumé pour : ${url}`);

  if (!url) {
    console.error('[API] URL manquante dans la requête.');
    return res.status(400).json({ error: 'Missing URL in request body' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('[API] Clé API OpenAI manquante.');
    return res.status(500).json({ error: 'Clé API manquante.' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RésumeurBot/1.0)'
      }
    });

    const html = await response.text();
    const truncatedHtml = html.slice(0, 10000);

    console.log(`[API] Contenu HTML récupéré (${truncatedHtml.length} caractères)`);

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

    console.log('[API] Résumé généré avec succès.');
    res.status(200).json({ summary });
  } catch (error: any) {
    console.error('[API] Une erreur est survenue :', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
