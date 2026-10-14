const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const views = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "laptop", width: 1280, height: 800 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ];
  const url = "http://127.0.0.1:51857/";
  for (const view of views) {
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    const out = path.join(__dirname, "..", "images", `${view.name}-home.png`);
    await page.screenshot({ path: out, fullPage: false });
    if (view.name === "desktop") {
      await page.click('a[href="#booking"]');
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(__dirname, "..", "images", "desktop-booking.png"),
      });
      await page.click('a[href="#gallery"]');
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(__dirname, "..", "images", "desktop-gallery.png"),
      });
    }
    if (view.name === "mobile") {
      await page.click(".nav-toggle");
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(__dirname, "..", "images", "mobile-menu.png"),
      });
    }
    await page.close();
  }
  await browser.close();
  console.log("screenshots saved");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
