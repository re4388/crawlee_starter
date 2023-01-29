import { PlaywrightCrawler, Dataset, log } from "crawlee";

// TODO: This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
log.setLevel(log.LEVELS.DEBUG);

log.debug("Setting up crawler.");
const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, request, enqueueLinks }) => {
    console.log(`Processing: ${request.url}`);
    const cardSelector = ".sc-4d418bf-0";
    const nextPageSelector = ".ActorStorePagination a";

    if (request.label === "DETAIL") {
      const urlParts = request.url.split("/").slice(-2);
      const modifiedTimestamp = await page
        .locator("time[datetime]")
        .getAttribute("datetime");
      const runsRow = page
        .locator("ul.ActorHeader-stats > li")
        .filter({ hasText: "Runs" });
      const runCountString = await runsRow.locator("span").last().textContent();
      const results = {
        url: request.url,
        uniqueIdentifier: urlParts.join("/"),
        owner: urlParts[0],
        title: await page.locator("h1").textContent(),
        description: await page.locator("span.actor-description").textContent(),
        modifiedDate: new Date(Number(modifiedTimestamp)),
        runCount: Number(runCountString!.replaceAll(",", "")),
      };

      // console.log(results);
      await Dataset.pushData(results);
    } else {
      // This means we're either on the start page, with no label,
      // or on a list page, with LIST label.
      await page.waitForSelector(nextPageSelector);
      await enqueueLinks({
        selector: nextPageSelector,
        label: "LIST",
      });

      // In addition to adding the listing URLs, we now also
      // add the detail URLs from all the listing pages.
      await page.waitForSelector(cardSelector);
      await enqueueLinks({
        selector: cardSelector,
        label: "DETAIL",
      });
    }
  },
});

log.debug("Adding requests to the queue.");
await crawler.run(["https://apify.com/store"]);
