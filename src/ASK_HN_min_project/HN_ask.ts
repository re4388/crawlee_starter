// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import { PlaywrightCrawler, Dataset, log } from "crawlee";
// import { zip } from "ramda";
log.setLevel(log.LEVELS.DEBUG);

interface TitleInfo {
  title: string;
  commentCount: number;
}

const crawler = new PlaywrightCrawler({
  // maxRequestsPerCrawl: 10,
  requestHandler: async ({ page, parseWithCheerio }) => {
    // inspect dev tool and try and error to get these stuff right...
    const itemSelector = ".Story_title > a";
    const commentSelector = ".Story_meta span:nth-of-type(7)";

    // Wait for the selector to render.
    await page.waitForSelector(itemSelector);
    // $ represent the whole parsed html page
    const $ = await parseWithCheerio();

    const titles: string[] = [];
    $(itemSelector).each((_idx, el) => {
      const title = $(el).text();
      titles.push(title);
    });

    const commentsCount: number[] = [];
    $(commentSelector).each((_idx, el) => {
      let comment = $(el).text();
      commentsCount.push(Number(comment.split(" ")[0]));
    });

    let allTitle: TitleInfo[] = [];
    for (let i = 0; i < commentsCount.length; i++) {
      let titleInfo: TitleInfo = {
        title: titles[i],
        commentCount: commentsCount[i],
      };
      allTitle.push(titleInfo);
    }
    // console.log("allTitle", allTitle);
    await Dataset.pushData(allTitle);
  },
});

// manually get all of the pagination
const allUrls: string[] = [];
for (let i = 0; i < 34; i++) {
  allUrls.push(
    `https://hn.algolia.com/?dateRange=all&page=${i}&prefix=false&query=ask%20HN&sort=byPopularity&type=all`
  );
}

await crawler.run(allUrls);
