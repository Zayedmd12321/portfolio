import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let targetUrl = searchParams.get('url');

  if (!targetUrl) return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  let browser = null;

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const localExecutablePath = process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

    const executablePath = isProduction 
      ? await chromium.executablePath() 
      : localExecutablePath;

    browser = await puppeteer.launch({
      args: isProduction ? [...chromium.args, '--no-zygote'] : puppeteer.defaultArgs(),
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    } as any);

    const page = await browser.newPage();

    // 1. Stealth Mode (Hide that we are a bot)
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await page.setUserAgent(USER_AGENT);

    // 2. Load the Page (Don't wait for network idle, just load the skeleton)
    try {
      await page.goto(targetUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 15000 
      });
    } catch (e) {
      console.log("Initial load timeout (continuing anyway)...");
    }

    // --- THE FIX: BRUTE FORCE WAITING ---
    
    // 3. Hard Wait: Give the website 4 seconds to build itself (React/Angular hydration)
    // This allows the "skeleton" loaders to disappear and real text to appear.
    await new Promise(r => setTimeout(r, 4000));

    // 4. Scroll to Bottom (Trigger lazy loading)
    try {
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    
                    // Stop if we reached bottom or scrolled too much
                    if (totalHeight >= scrollHeight || totalHeight > 4000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100); // Scroll every 100ms
            });
        });
    } catch (e) {
        console.log("Scroll failed");
    }

    // 5. Final Wait: Give lazy-loaded images/items 2 seconds to render after scrolling
    await new Promise(r => setTimeout(r, 2000));

    // 6. Get the "Whole" Page
    let html = await page.content();
    const baseUrl = new URL(targetUrl).origin;

    // --- Injection (Fix Links) ---
    const clientScript = `
      <script>
        (function() {
          const proxyBase = window.location.origin + '/api/proxy?url=';
          window.parent.postMessage({ type: 'URL_CHANGED', url: '${targetUrl}' }, '*');

          document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href) {
              e.preventDefault();
              if (link.href.includes('#') && link.href.split('#')[0] === window.location.href.split('#')[0]) return;
              
              // --- NEW LINE: Trigger Loader immediately ---
              window.parent.postMessage({ type: 'LOAD_START' }, '*');
              
              window.location.href = proxyBase + encodeURIComponent(link.href);
            }
          });
          
          document.addEventListener('submit', function(e) {
             // Trigger Loader on form submit too
             window.parent.postMessage({ type: 'LOAD_START' }, '*');
          });

        })();
      </script>
    `;

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${baseUrl}/" />`);
    }
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${clientScript}</body>`);
    } else {
      html += clientScript;
    }

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' },
    });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return new NextResponse(`<h2>Error</h2><p>${error.message}</p>`, { status: 500 });
  } finally {
    if (browser) {
      try {
        const pages = await browser.pages();
        await Promise.all(pages.map(p => p.close()));
        await browser.close();
      } catch (e) {
        // Ignore EBUSY errors
      }
    }
  }
}