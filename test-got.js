import { gotScraping } from 'got-scraping';
async function test() {
  try {
    const res = await gotScraping('https://www.psacard.com/cert/69225215');
    console.log(res.statusCode);
    console.log(res.body.substring(0, 500));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
