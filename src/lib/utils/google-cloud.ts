import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'),
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

export async function getSearchConsoleData(siteUrl: string, startDate: string, endDate: string) {
  try {
    const searchconsole = google.searchconsole({ version: 'v1', auth });
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query', 'page'],
      },
    });
    return response.data;
  } catch (error) {
    console.error('[Google Search Console Error] Failed to fetch data:', error);
    return null;
  }
}

export async function getAnalyticsData(propertyId: string, startDate: string, endDate: string) {
  try {
    // Note: Analytics Data API is separate from GA3, we use it for GA4
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });
    const response = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'activeUsers' }],
      },
    });
    return response.data;
  } catch (error) {
    console.error('[Google Analytics Error] Failed to fetch data:', error);
    return null;
  }
}
