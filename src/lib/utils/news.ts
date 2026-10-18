export interface NewsArticle {
  title: string;
  url: string;
  description: string;
  source: string;
  publishedAt: string;
}

export async function fetchNews(query: string, pageSize: number = 10): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY || process.env.NEWSDATA_API_KEY;
  
  if (!apiKey) {
    console.warn('[NewsAPI] Key missing. Returning mock news.');
    return [
      { 
        title: 'Mock News for ' + query, 
        url: 'https://news.google.com', 
        description: 'Trending news description.', 
        source: 'MockSource', 
        publishedAt: new Date().toISOString() 
      }
    ];
  }

  // Support for newsapi.org
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok') {
      return (data.articles || []).map((a: { title: string; url: string; description: string; source?: { name: string }; publishedAt: string }) => ({
        title: a.title,
        url: a.url,
        description: a.description,
        source: a.source?.name || 'Unknown',
        publishedAt: a.publishedAt
      }));
    }
  } catch (error) {
    console.error('[NewsAPI Error]:', error);
  }

  return [];
}
