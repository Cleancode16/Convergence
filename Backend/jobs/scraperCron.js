import cron from 'node-cron';
import { scrapeArtFunders } from '../services/artFunderScraper.js';

/**
 * Schedule scraper to run every week (Sunday at 2 AM)
 */
export const scheduleArtFunderScraper = () => {
  // Run every Sunday at 2:00 AM
  cron.schedule('0 2 * * 0', async () => {
    console.log('🔄 Running weekly art-funder scraper...');
    try {
      await scrapeArtFunders();
      console.log('✅ Weekly scrape completed successfully');
    } catch (error) {
      console.error('❌ Weekly scrape failed:', error.message);
    }
  });

  console.log('⏰ Art-funder scraper scheduled to run every Sunday at 2:00 AM');
};
