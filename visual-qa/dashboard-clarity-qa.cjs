const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:3000';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'visual-qa/dashboard-clarity';
const remotePort = 9335;
fs.mkdirSync(outDir, { recursive: true });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (error) { reject(error); }
      });
    }).on('error', reject);
  });
}

async function waitForJson(url, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try { return await getJson(url); } catch { await delay(250); }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result || {});
      }
    };
  }
  async open() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async eval(expression) {
    const result = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async navigate(path) {
    await this.send('Page.navigate', { url: `${baseUrl}${path}` });
    await this.waitFor('document.readyState === "complete"', 45000);
    await delay(1500);
  }
  async waitFor(expression, timeout = 30000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      try { if (await this.eval(`Boolean(${expression})`)) return true; } catch {}
      await delay(250);
    }
    throw new Error(`Timed out waiting for ${expression}`);
  }
  async screenshot(name) {
    const shot = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const file = `${outDir}/${name}.png`;
    fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
    return file;
  }
}

async function main() {
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${process.cwd()}\\.chrome-profile-dashboard-clarity`,
    '--window-size=1440,1200',
    `${baseUrl}/platform/coach/squad`,
  ], { stdio: 'ignore' });

  try {
    await waitForJson(`http://localhost:${remotePort}/json/version`);
    const targets = await waitForJson(`http://localhost:${remotePort}/json`);
    const pageTarget = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
    const cdp = new Cdp(pageTarget.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.navigate('/platform/coach');
    await cdp.eval('localStorage.clear()');
    await cdp.navigate('/platform/coach/squad');
    await cdp.waitFor(`document.body.innerText.includes('Selected Focus Summary')`);

    const shots = [];
    const captureAt = async (name, text) => {
      await cdp.eval(`(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        let node;
        while ((node = walker.nextNode())) {
          if ((node.innerText || '').includes(${JSON.stringify(text)})) {
            node.scrollIntoView({ block: 'start' });
            break;
          }
        }
      })()`);
      await delay(500);
      shots.push(await cdp.screenshot(name));
    };

    await captureAt('01-control-bar', 'Session Type');
    await captureAt('02-selected-focus-summary', 'Selected Focus Summary');
    await captureAt('03-squad-system-status', 'Squad and System Status');
    await captureAt('04-target-achievement-graph', 'Target achievement by player');
    await captureAt('05-actual-vs-target-graph', 'Actual vs target by player');
    await captureAt('06-high-speed-efforts-graph', 'High-speed efforts above SSP-configured threshold');
    await captureAt('07-workload-vs-planned-load-graph', 'Workload vs planned load');
    await captureAt('08-training-exposure-vs-match-demand-graph', 'Training exposure vs match demand');

    await cdp.eval(`(() => {
      const select = [...document.querySelectorAll('select')].find((item) => [...item.options].some((option) => option.value === '1'));
      if (select) {
        select.value = '1';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      window.scrollTo(0, 0);
    })()`);
    await delay(800);
    shots.push(await cdp.screenshot('09-selected-player-state'));

    await cdp.eval(`(() => {
      const select = [...document.querySelectorAll('select')].find((item) => [...item.options].some((option) => option.value === 'all' && option.textContent.includes('All Players')));
      if (select) {
        select.value = 'all';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      window.scrollTo(0, 0);
    })()`);
    await delay(800);
    shots.push(await cdp.screenshot('10-all-players-state'));

    const checks = await cdp.eval(`(() => {
      const t = document.body.innerText;
      const required = [
        'Selected Focus Summary',
        'Based on the selected session, player filter, metric, and exact time window.',
        'Current view:',
        'Squad and System Status',
        'General squad/system indicators. These are not filtered by the selected time window unless stated.',
        'Target achievement by player',
        'X-axis: Player',
        'Y-axis: % of target achieved',
        'Actual vs target by player',
        'High-speed efforts above SSP-configured threshold',
        'Threshold: SSP-configured 5.5 m/s',
        'Workload vs planned load',
        'Training exposure vs match demand'
      ];
      const banned = ['Squad Target Progress', 'Workload Review Trend', 'Training vs Match Load Trend'];
      return { pass: required.every((item) => t.includes(item)) && !banned.some((item) => t.includes(item)), missing: required.filter((item) => !t.includes(item)), banned: banned.filter((item) => t.includes(item)) };
    })()`);
    fs.writeFileSync(`${outDir}/results.json`, JSON.stringify({ checks, shots }, null, 2));
    console.log(JSON.stringify({ checks, shots }, null, 2));
    cdp.ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
