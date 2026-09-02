let cachedExchangeRates: { rates: Record<string, number>; timestamp: number; provider: string } | null = null;

export async function getExchangeRates(force: boolean = false) {
  const NOW = Date.now();
  if (cachedExchangeRates && (NOW - cachedExchangeRates.timestamp < 3600000) && !force) {
    return cachedExchangeRates;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY?.trim();
  let rates: Record<string, number> | null = null;
  let provider = 'ExchangeRate-API Open';

  if (apiKey && apiKey !== 'MY_EXCHANGE_RATE_API_KEY') {
    try {
      const keyUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
      const apiRes = await fetch(keyUrl);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.rates || data.conversion_rates) {
          rates = data.rates || data.conversion_rates;
          provider = 'ExchangeRate-API Pro (Key Configured)';
        }
      }
    } catch (e) {
      console.warn('Failed fetching with custom ExchangeRate API key, falling back to open endpoint:', e);
    }
  }

  // Fallback to open ExchangeRate-API endpoint if no key or key fetch failed
  if (!rates) {
    try {
      const openRes = await fetch('https://open.er-api.com/v6/latest/USD');
      if (openRes.ok) {
        const openData = await openRes.json();
        if (openData.rates) {
          rates = openData.rates;
          provider = 'ExchangeRate-API Live (Open)';
        }
      }
    } catch (e) {
      console.warn('Failed fetching open ExchangeRate API:', e);
    }
  }

  // Hardcoded fallback if everything fails
  if (!rates) {
    rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, CAD: 1.35, AUD: 1.52, INR: 83.50 };
    provider = 'Fallback Fixed Rates';
  }

  cachedExchangeRates = { rates, timestamp: NOW, provider };
  return cachedExchangeRates;
}
