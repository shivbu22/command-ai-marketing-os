export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

export async function searchSerper(query: string, num: number = 10): Promise<SerperResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn('[Serper] API Key missing. Returning mock search results.');
    return [
      { title: 'Mock Search Result 1', link: 'https://example.com', snippet: 'Snippet for ' + query },
      { title: 'Mock Search Result 2', link: 'https://example.com', snippet: 'Another snippet for ' + query }
    ];
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num })
    });

    const data = await response.json();
    return (data.organic || []).map((item: SerperResult) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date
    }));
  } catch (error) {
    console.error('[Serper Error]:', error);
    return [];
  }
}
