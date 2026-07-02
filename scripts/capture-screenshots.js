const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../screenshots');
const BASE_URL = 'http://localhost:9002';

const credentials = {
  email: 'admin@citymotion.com',
  password: '123456'
};

const credentialsDev = {
  email: 'dev@dev.com',
  password: '123456789'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeSlow(page, selector, text) {
  try {
    const el = await page.$(selector);
    if (el) {
      await el.click();
      await el.type(text, { delay: 20 });
      return true;
    }
  } catch (e) {}
  return false;
}

async function captureScreenshots() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. Login page screenshot
    console.log('[1/13] Capturing Login page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01-login.png'), fullPage: true });
    console.log('  ✓ Login page');

    // 2. Login as Dev (root access)
    console.log('[2/13] Logging in as dev@dev.com...');
    
    // Try to find and fill login form
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await sleep(1500);

    // Find all input fields
    const inputs = await page.$$('input');
    if (inputs.length >= 2) {
      await inputs[0].click();
      await inputs[0].type(credentialsDev.email, { delay: 10 });
      await sleep(500);
      await inputs[1].click();
      await inputs[1].type(credentialsDev.password, { delay: 10 });
      await sleep(300);
      
      // Click first button (submit)
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent.toLowerCase(), btn);
        if (text.includes('entrar') || text.includes('acessar') || text.includes('login') || text.includes('submit')) {
          await btn.click();
          break;
        }
      }
      // If no matching button, click the last button
      await sleep(3000);
    }

    // Wait for redirect / dashboard
    await sleep(3000);
    console.log(`  Current URL: ${page.url()}`);

    // Try clicking sidebar links to navigate if direct URL doesn't work
    async function navigateTo(url, screenshotName, label) {
      console.log(`[?] Capturing ${label}...`);
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        await sleep(2000);
        await page.screenshot({ path: path.join(OUTPUT_DIR, screenshotName), fullPage: true });
        console.log(`  ✓ ${label}`);
        return true;
      } catch (e) {
        console.log(`  ✗ Could not load ${url}: ${e.message}`);
        return false;
      }
    }

    // Capture dashboard
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02-dashboard.png'), fullPage: true });
    console.log('  ✓ Dashboard');

    // Capture other pages
    const pages = [
      { url: `${BASE_URL}/veiculos`, file: '03-veiculos.png', name: 'Vehicles' },
      { url: `${BASE_URL}/funcionarios`, file: '04-funcionarios.png', name: 'Employees' },
      { url: `${BASE_URL}/viagens`, file: '05-viagens.png', name: 'Trips' },
      { url: `${BASE_URL}/manutencao`, file: '06-manutencao.png', name: 'Maintenance' },
      { url: `${BASE_URL}/abastecimento`, file: '07-abastecimento.png', name: 'Fueling' },
      { url: `${BASE_URL}/settings`, file: '08-settings.png', name: 'Settings' },
      { url: `${BASE_URL}/relatorios`, file: '09-relatorios.png', name: 'Reports' },
      { url: `${BASE_URL}/setores`, file: '10-setores.png', name: 'Sectors' },
      { url: `${BASE_URL}/escalas`, file: '11-escalas.png', name: 'Schedules' },
      { url: `${BASE_URL}/perfil`, file: '12-perfil.png', name: 'Profile' },
    ];

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      console.log(`[${i+3}/13] Capturing ${p.name}...`);
      await navigateTo(p.url, p.file, p.name);
    }

    console.log('\n✅ All screenshots captured!');
    console.log(`📁 Directory: ${OUTPUT_DIR}`);

    // List files
    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(f => console.log(`  - ${f}`));

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
