import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSummarize = async () => {
  console.log(`[Client] Demande de résumé pour l’URL : ${url}`);

  setLoading(true);
  setError('');
  setSummary('');

  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Client] Erreur renvoyée par l’API :', data.error);
      throw new Error(data.error || 'Une erreur est survenue.');
    }

    console.log('[Client] Résumé reçu.');
    setSummary(data.summary);
  } catch (err: any) {
    console.error('[Client] Erreur lors du résumé :', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Résumé d'article</h1>
      <input
        type="text"
        placeholder="Collez une URL ici"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button onClick={handleSummarize} disabled={loading || !url}>
        {loading ? 'Résumé en cours...' : 'Obtenir un résumé'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Résumé :</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
