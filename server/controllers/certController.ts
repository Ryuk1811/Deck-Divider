import { Request, Response } from 'express';
import { resolveCertRecord } from '../services/certResolver.js';
import { matchCardEntity } from '../services/entityMatcher.js';
import { fetchMarketData, generateMarketReport, scrapeGradedCardMarketData } from '../services/marketEngine.js';

export const handleCertLookup = async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = req.query.provider as string;
    const certId = req.query.certId as string;
    
    if (!provider || !certId) {
      res.status(400).json({ error: "Missing required parameters: provider and certId" });
      return;
    }

    // 1. Resolve Cert Record (Live Scraper + Resilient Fallback)
    const certData = await resolveCertRecord(provider, certId);

    if (!certData) {
      res.status(404).json({ error: "Cert record not found on provider registry." });
      return;
    }

    // 2. Local Embedded AI / Entity Match
    const searchString = `${certData.cardName} ${certData.setName}`.trim();
    const normalizedCard = await matchCardEntity(searchString);

    // 3. Pure Algorithmic Market Processing
    const rawSales = await fetchMarketData(normalizedCard, certData.grade);
    const marketReport = generateMarketReport(rawSales);

    // 4. Send Consolidated Response
    res.json({
      success: true,
      cert: certData,
      matchedCard: normalizedCard,
      marketReport: marketReport
    });
  } catch (error: any) {
    console.error("Cert lookup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGradedMarketLookup = async (req: Request, res: Response): Promise<void> => {
  try {
    const cardName = (req.query.cardName as string) || '';
    const setName = (req.query.setName as string) || '';
    const provider = (req.query.provider as string) || 'PSA';
    const grade = (req.query.grade as string) || '10';
    const certId = (req.query.certId as string) || '';
    const rawPrice = parseFloat((req.query.rawPrice as string) || '0');

    const data = await scrapeGradedCardMarketData(cardName, setName, provider, grade, certId, rawPrice);
    res.json(data);
  } catch (error: any) {
    console.error("Graded market scrape error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
