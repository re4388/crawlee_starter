// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import { PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 10,
  requestHandler: async ({ page, parseWithCheerio }) => {
    const cardSelector = ".sc-4d418bf-0";
    // Wait for the actor cards to render.
    await page.waitForSelector(cardSelector);
    // Extract the page's HTML from browser
    // and parse it with Cheerio.
    const $ = await parseWithCheerio();
    // Use familiar Cheerio syntax to
    // select all the actor cards.
    $(cardSelector).each((i, el) => {
      const text = $(el).text();
      console.log(`ACTOR_${i + 1}: ${text}\n`);
    });
  },
});

await crawler.run(["https://apify.com/store"]);
