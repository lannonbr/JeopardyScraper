const puppeteer = require("puppeteer");
const moment = require("moment");
const matchAll = require("string.prototype.matchall");

require("dotenv").config();

const client = require("twilio")(process.env.SID, process.env.AUTH_TOKEN);

(async () => {
  let time = moment();
  let year = time.format("YYYY");
  let month = time.format("MM");
  let date = time.format("M-D-YYYY");

  // Skip on weekends
  if (time.day() === 0 || time.day() === 6) return;

  // URL for the blog post for today
  let url = `https://thejeopardyfan.com/${year}/${month}/final-jeopardy-${date}.html`;

  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage"
    ]
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(1000);

  const content = await page.evaluate(() => {
    let content = [...document.querySelectorAll(".entry-content span")]
      .map(span => span.innerText)
      .filter(text => text.includes("James"))[0];
    return content;
  });

  // Stop if it doesn't find any content
  if (content === undefined) return;

  // Grab the two monetary values of today and the total winnings from the string.
  let [today, total] = [...matchAll(content, /(\$[\d,]*)/gm)]
    .slice(2)
    .map(match => match[0]);

  // Grab streak number. Takes a string like "41-day" and converts it to the number 41.
  let streak = +[...matchAll(content, /(\d*-day)/gm)][0][0].slice(0, -4);

  let todayStr = time.format("ll");

  let msg = `Today, ${todayStr}, James Holzhauer has made ${today} to a ${streak} day total of ${total}`;

  client.messages
    .create({
      body: msg,
      from: process.env.FROM_NUM,
      to: process.env.TO_NUM
    })
    .then(msg => console.log(msg.sid))
    .done();

  browser.close();
})();
