const puppeteer = require('puppeteer');

(async () => {
    const args = puppeteer.defaultArgs().filter(arg => arg !== '--disable-gpu');
    args.push('--ignore-gpu-blacklist');
    args.push('--use-gl=egl');
    console.log(`args: ${args}`);
    const browser = await puppeteer.launch({ headless: true, ignoreDefaultArgs: true, args });

    const page = await browser.newPage();
    await page
        .goto('chrome://gpu', { waitUntil: 'networkidle0', timeout: 20 * 60 * 1000 })
        .catch(e => console.log(e));
    await page.screenshot({
        path: 'gpu_stats.png'
    });

    const page2 = await browser.newPage();
  
    // Test for webgl support
    // e.g. https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
    const webgl = await page2.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const expGl = canvas.getContext('experimental-webgl');
  
      return {
        gl: gl && gl instanceof WebGLRenderingContext,
        expGl: expGl && expGl instanceof WebGLRenderingContext,
      };
    });

    console.log('WebGL Support:', webgl);

    await browser.close();
})();
