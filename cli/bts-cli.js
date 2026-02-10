#!/usr/bin/env node

const https = require('https');
const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let API_URL = process.env.BTS_API_URL || 'http://localhost:5000';
let API_KEY = process.env.BTS_API_KEY || '';

function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function apiRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const mod = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET',
      headers: { 'X-API-Key': API_KEY, 'Accept': 'application/json' }
    };

    const req = mod.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid response')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timeout')); });
    req.end();
  });
}

function printLine() { console.log('='.repeat(60)); }
function printHeader(text) { printLine(); console.log(`  ${text}`); printLine(); }

async function msisdnLookup() {
  const msisdn = await prompt('\n  Masukkan MSISDN (contoh: 08123456789): ');
  if (!msisdn) return;

  console.log('\n  Mencari data...\n');
  try {
    const result = await apiRequest(`/api/v1/msisdn/${msisdn}`);
    if (!result.success) {
      console.log(`  Error: ${result.error}`);
      return;
    }
    const d = result.data;
    printHeader('MSISDN LOOKUP RESULT');
    console.log(`  MSISDN          : ${d.msisdn}`);
    console.log(`  International   : ${d.msisdn_international}`);
    console.log(`  Operator        : ${d.operator.brand} (${d.operator.name})`);
    console.log(`  MCC             : ${d.operator.mcc}`);
    console.log(`  MNC             : ${d.operator.mnc}`);
    printLine();
    console.log('  DEVICE INFO');
    console.log(`  IMEI            : ${d.device.imei}`);
    console.log(`  IMSI            : ${d.device.imsi}`);
    console.log(`  ICCID           : ${d.device.iccid}`);
    printLine();
    console.log('  SERVING CELL (BTS TOWER)');
    console.log(`  Cell ID         : ${d.serving_cell.cell_id}`);
    console.log(`  LAC             : ${d.serving_cell.lac}`);
    console.log(`  Tower Type      : ${d.serving_cell.tower_type}`);
    console.log(`  Band            : ${d.serving_cell.band}`);
    console.log(`  Latitude        : ${d.serving_cell.latitude}`);
    console.log(`  Longitude       : ${d.serving_cell.longitude}`);
    console.log(`  Azimuth         : ${d.serving_cell.azimuth}`);
    console.log(`  Height          : ${d.serving_cell.height_m} m`);
    console.log(`  Power           : ${d.serving_cell.power_dbm} dBm`);
    printLine();
    console.log('  LOCATION');
    console.log(`  Provinsi        : ${d.location.province}`);
    console.log(`  Kota/Kabupaten  : ${d.location.city}`);
    console.log(`  Address         : ${d.location.address}`);
    if (d.neighboring_cells && d.neighboring_cells.length > 0) {
      printLine();
      console.log('  NEIGHBORING CELLS');
      d.neighboring_cells.forEach((c, i) => {
        console.log(`  [${i + 1}] CID: ${c.cell_id} | LAC: ${c.lac} | ${c.tower_type} | ${c.latitude}, ${c.longitude} | ${c.city}`);
      });
    }
    printLine();
    console.log(`  Response Time   : ${result.meta.response_time_ms}ms`);
    console.log(`  Timestamp       : ${result.meta.timestamp}`);
    printLine();
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
}

async function listTowers() {
  const province = await prompt('\n  Province code (kosongkan untuk semua): ');
  const type = await prompt('  Tower type (2G/3G/4G/5G, kosongkan untuk semua): ');
  let path = '/api/v1/towers?limit=20';
  if (province) path += `&province=${province}`;
  if (type) path += `&type=${type}`;

  try {
    const result = await apiRequest(path);
    if (!result.success) { console.log(`  Error: ${result.error}`); return; }
    printHeader(`BTS TOWERS (${result.pagination.total} total, showing ${result.data.length})`);
    result.data.forEach(t => {
      console.log(`  [${t.id}] CID:${t.cell_id} LAC:${t.lac} | ${t.operator_brand} | ${t.tower_type} | ${t.latitude},${t.longitude} | ${t.province_name} - ${t.city_name}`);
    });
    printLine();
  } catch (err) { console.log(`  Error: ${err.message}`); }
}

async function listProvinces() {
  try {
    const result = await apiRequest('/api/v1/provinces');
    if (!result.success) { console.log(`  Error: ${result.error}`); return; }
    printHeader('PROVINSI INDONESIA');
    result.data.forEach(p => console.log(`  [${p.code}] ${p.name}`));
    printLine();
  } catch (err) { console.log(`  Error: ${err.message}`); }
}

async function listCities() {
  const province = await prompt('\n  Province code: ');
  try {
    const result = await apiRequest(`/api/v1/cities?province=${province}`);
    if (!result.success) { console.log(`  Error: ${result.error}`); return; }
    printHeader(`KOTA/KABUPATEN (${result.data.length} records)`);
    result.data.forEach(c => console.log(`  [${c.code}] ${c.name} (${c.type}) - ${c.province_name}`));
    printLine();
  } catch (err) { console.log(`  Error: ${err.message}`); }
}

async function listOperators() {
  try {
    const result = await apiRequest('/api/v1/operators');
    if (!result.success) { console.log(`  Error: ${result.error}`); return; }
    printHeader('OPERATOR INDONESIA');
    result.data.forEach(o => console.log(`  [MNC:${o.mnc}] ${o.brand} - ${o.name} | Prefix: ${o.prefix}`));
    printLine();
  } catch (err) { console.log(`  Error: ${err.message}`); }
}

async function getStats() {
  try {
    const result = await apiRequest('/api/v1/stats');
    if (!result.success) { console.log(`  Error: ${result.error}`); return; }
    printHeader('DATABASE STATISTICS');
    console.log(`  Total BTS Towers   : ${result.data.total_towers.toLocaleString()}`);
    console.log(`  Total Provinsi     : ${result.data.total_provinces}`);
    console.log(`  Total Kab/Kota     : ${result.data.total_cities}`);
    console.log(`  Total Operator     : ${result.data.total_operators}`);
    printLine();
  } catch (err) { console.log(`  Error: ${err.message}`); }
}

async function configure() {
  const url = await prompt(`\n  API URL [${API_URL}]: `);
  if (url) API_URL = url;
  const key = await prompt(`  API Key [${API_KEY ? API_KEY.substring(0, 20) + '...' : 'not set'}]: `);
  if (key) API_KEY = key;
  console.log('\n  Configuration updated.');
}

async function main() {
  console.clear();
  printHeader('BTS INDONESIA - CLI Client');
  console.log('  Database Tower BTS Seluruh Indonesia');
  console.log('  Version 1.0.0\n');

  if (!API_KEY) {
    console.log('  API Key belum diset.');
    console.log('  Set via environment: BTS_API_KEY=your_key');
    console.log('  Atau gunakan menu Configure.\n');
  }

  while (true) {
    console.log('\n  MENU:');
    console.log('  [1] MSISDN Lookup');
    console.log('  [2] List BTS Towers');
    console.log('  [3] List Provinsi');
    console.log('  [4] List Kota/Kabupaten');
    console.log('  [5] List Operator');
    console.log('  [6] Database Stats');
    console.log('  [7] Configure');
    console.log('  [0] Exit\n');

    const choice = await prompt('  Pilih menu: ');

    switch (choice.trim()) {
      case '1': await msisdnLookup(); break;
      case '2': await listTowers(); break;
      case '3': await listProvinces(); break;
      case '4': await listCities(); break;
      case '5': await listOperators(); break;
      case '6': await getStats(); break;
      case '7': await configure(); break;
      case '0':
        console.log('\n  Terima kasih. Sampai jumpa!\n');
        rl.close();
        process.exit(0);
      default:
        console.log('  Menu tidak valid.');
    }
  }
}

main();
