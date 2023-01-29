import { CheerioCrawler } from "crawlee";

const crawler = new CheerioCrawler({
  // Let's limit our crawls to make our
  // tests shorter and safer.
  maxRequestsPerCrawl: 30,

  // The `$` argument is the Cheerio object
  // which contains parsed HTML of the website.
  async requestHandler({ $, request, enqueueLinks }) {
    // Extract <title> text with Cheerio.
    // See Cheerio documentation for API docs.
    const title = $("title").text();
    console.log(`The title of "${request.url}" is: ${title}.`);

    // doc: https://crawlee.dev/api/core/interface/EnqueueLinksOptions
    await enqueueLinks({
      strategy: "same-domain",
      //   strategy: "all", // wander the internet
      //   globs: ["http?(s)://github.com/*/*"],

      //   transformRequestFunction(req) {
      //     // ignore all links ending with `.pdf`
      //     if (req.url.endsWith(".pdf")) return false;
      //     return req;
      //   },
    });
  },
});

// Start the crawler with the provided URLs
await crawler.run(["https://crawlee.dev"]);
