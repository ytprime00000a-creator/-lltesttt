// ============================================================
// 🛡️ BRONX OSINT V300 ULTRA OP — FULLY FIXED
// ✅ Export/Import Complete
// ✅ DDoS Config Persistent
// ✅ Custom Developer Mode
// ✅ Hide Words Feature
// ✅ Response Format Mode (JSON/Styled/OP_LOOK)
// ✅ Ultra Rainbow 3D/4D Effects
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();

// ============================================================
// ⚙️ CONFIG
// ============================================================
const REAL_API_BASE = 'https://ft-osint-api.duckdns.org/api';
const REAL_API_KEYS = ['bronx-bot-9999', 'bronx-ultra-king-ft-bro-op'];
let currentKeyIndex = 0;
const getNextKey = () => { const k = REAL_API_KEYS[currentKeyIndex]; currentKeyIndex = (currentKeyIndex + 1) % REAL_API_KEYS.length; return k; };

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'bronx';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '85095613';
const MASTER_API_KEY = process.env.MASTER_API_KEY || 'BRONX_MASTER_' + crypto.randomBytes(4).toString('hex').toUpperCase();
const ADMIN_PATH = '/bronx-admin-panel';

const DATA_DIR = process.env.RENDER_DATA_DIR || '/tmp';
const F = (n) => path.join(DATA_DIR, n);
const DATA_FILE = F('bronx_v300_data.json');
const LOGS_FILE = F('bronx_v300_logs.json');
const ADMIN_LOGS_FILE = F('bronx_v300_admin_logs.json');

// ============================================================
// 🗄️ STATE
// ============================================================
let keyStorage = {};
let customAPIs = [];
let requestLogs = [];
let adminSessions = {};
let permanentTokens = {};
let cooldownTimers = {};
let protectedData = {};
let dailyLimits = {};
let perSecondLimits = {};
let adminLogs = [];
let keyMonitorLogs = [];
let endpointResponses = {};
let auditLog = [];
let announcement = { enabled: false, text: '', type: 'info' };
let maintenance = { enabled: false, message: 'System under maintenance' };
let statsCache = { data: null, expiresAt: 0 };

// ✅ NEW: Developer & Hide Words
let developerConfig = {
  globalName: '@BRONX_ULTRA',
  perKeyNames: {},          // { key: "@custom_name" }
  hiddenWords: ['Developer', 'Owner', 'Channel', 'Src', 'By', 'credit', 'api_by', 'api_by_name', 'powered_by']
};

// ============================================================
// 🎨 LIVE THEME — ULTRA RAINBOW ENHANCED
// ============================================================
let theme = {
  preset: 'ultra-rainbow',
  colors: {
    bgPrimary: '#0a0505', bgSecondary: '#140808', bgCard: 'rgba(30,10,10,0.85)',
    borderColor: 'rgba(255,50,50,0.15)',
    textPrimary: '#ffffff', textSecondary: '#e0c0c0', textMuted: '#a08080',
    accent: '#ff2d2d', accent2: '#ff9500', success: '#00ff88', warning: '#ff9500',
    danger: '#ff2d2d', info: '#00e5ff', pink: '#ff2d95', purple: '#bf00ff', yellow: '#ffe600'
  },
  effects: { snowfall: true, snowCount: 120, glow: true, rainbowAnim: true, gridBg: true, scanLines: false, particles: true, threeD: true },
  fonts: { heading: 'Orbitron', body: 'Inter' },
  radius: 16,
  version: 1
};

const PRESETS = {
  'ultra-rainbow': { accent: '#ff2d2d', accent2: '#ffe600', bgPrimary: '#0a0510', bgSecondary: '#150a1f' },
  'neon-red':      { accent: '#ff2d2d', accent2: '#ff9500', bgPrimary: '#0a0505', bgSecondary: '#140808' },
  'neon-green':    { accent: '#00ff88', accent2: '#00e5ff', bgPrimary: '#020a06', bgSecondary: '#08140c' },
  'neon-blue':     { accent: '#00b3ff', accent2: '#00e5ff', bgPrimary: '#020608', bgSecondary: '#0a1018' },
  'neon-purple':   { accent: '#bf00ff', accent2: '#ff2d95', bgPrimary: '#08020a', bgSecondary: '#120814' },
  'neon-pink':     { accent: '#ff2d95', accent2: '#bf00ff', bgPrimary: '#0a0508', bgSecondary: '#14080f' },
  'neon-orange':   { accent: '#ff9500', accent2: '#ffe600', bgPrimary: '#0a0702', bgSecondary: '#140e08' },
  'cyberpunk':     { accent: '#ff0066', accent2: '#00ffcc', bgPrimary: '#0a0510', bgSecondary: '#150a1f' },
  'matrix':        { accent: '#00ff00', accent2: '#00aa00', bgPrimary: '#000000', bgSecondary: '#0a0a0a' },
  'sunset':        { accent: '#ff6b35', accent2: '#f7b801', bgPrimary: '#1a0e0a', bgSecondary: '#26140e' },
  'ocean':         { accent: '#00b8d4', accent2: '#0055aa', bgPrimary: '#020810', bgSecondary: '#0a1424' },
  'midnight':      { accent: '#5b21b6', accent2: '#8b5cf6', bgPrimary: '#0a0a14', bgSecondary: '#141428' },
  'gold':          { accent: '#ffd700', accent2: '#ff9500', bgPrimary: '#0a0800', bgSecondary: '#141008' },
  'blood':         { accent: '#8b0000', accent2: '#ff2d2d', bgPrimary: '#0a0000', bgSecondary: '#1a0505' },
  'mint':          { accent: '#00ffb3', accent2: '#00e5ff', bgPrimary: '#020a08', bgSecondary: '#081410' },
  'vaporwave':     { accent: '#ff71ce', accent2: '#01cdfe', bgPrimary: '#1a0a24', bgSecondary: '#26103a' },
  'rainbow-pro':   { accent: '#ff0000', accent2: '#00ffff', bgPrimary: '#0a0a14', bgSecondary: '#1a1a2e' },
  'cyber-neon':    { accent: '#00ff9d', accent2: '#ff00ff', bgPrimary: '#050510', bgSecondary: '#0f0f20' },
  'galaxy':        { accent: '#7b2ff7', accent2: '#f107a3', bgPrimary: '#0a0514', bgSecondary: '#140a1f' },
  'fire-ice':      { accent: '#ff4500', accent2: '#00d4ff', bgPrimary: '#0a0505', bgSecondary: '#140a14' },
  'toxic':         { accent: '#adff2f', accent2: '#ff1493', bgPrimary: '#0a0a05', bgSecondary: '#141408' }
};

function hexToRgb(hex){
  const h = String(hex).replace('#','');
  const n = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
function hexToRgbStr(hex, alpha = 1){
  return `rgba(${hexToRgb(hex)},${alpha})`;
}
function applyPreset(name){
  const p = PRESETS[name];
  if(!p) return false;
  theme.preset = name;
  theme.colors.accent = p.accent;
  theme.colors.accent2 = p.accent2;
  theme.colors.bgPrimary = p.bgPrimary;
  theme.colors.bgSecondary = p.bgSecondary;
  theme.colors.bgCard = `rgba(${hexToRgb(p.bgSecondary)}, 0.85)`;
  theme.colors.borderColor = `rgba(${hexToRgb(p.accent)}, 0.15)`;
  theme.version++;
  return true;
}

// ============================================================
// 🔐 SECURITY
// ============================================================
let bans = { ip: {}, device: {}, key: {} };
let abuseTracker = { ip: {}, device: {}, key: {} };
let deviceFingerprints = {};
let ipRequestCounts = {};
let behaviorTracker = {};
let blocklist = { userAgents: [], paths: [], patterns: [] };
let whitelist = { ips: [], keys: [] };

let ddosConfig = {
  enabled: true, mode: 'smart',
  ip: { burst10s: 60, perMinute: 200, perHour: 1500, perDay: 15000 },
  device: { burst10s: 80, perMinute: 250, perHour: 2000 },
  key: { burst10s: 100, perMinute: 400, perHour: 3000 },
  strikes: { warnAt: 1, throttleAt: 2, tempBanAt: 3, longBanAt: 5, permanentAt: 10 },
  tempBanMs: 5 * 60 * 1000,
  longBanMs: 60 * 60 * 1000,
  login: { maxAttempts: 5, banMs: 30 * 60 * 1000 }
};

// ============================================================
// 💾 SAVE/LOAD — COMPLETE FIX
// ============================================================
function saveToDisk(){
  try{
    const ks = {};
    Object.entries(keyStorage).forEach(([k,v]) => { if(!v._hardcoded) ks[k] = v; });
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      keys: ks, apis: customAPIs, tokens: permanentTokens,
      logs: requestLogs.slice(-2000), protected: protectedData,
      endpointResponses, theme, bans, abuseTracker,
      deviceFingerprints, ddosConfig, blocklist, whitelist,
      announcement, maintenance, auditLog: auditLog.slice(-500),
      developerConfig,  // ✅ NEW
      _version: 'V300_ULTRA_OP'
    }, null, 2));
    fs.writeFileSync(LOGS_FILE, JSON.stringify(keyMonitorLogs.slice(-1000), null, 2));
    fs.writeFileSync(ADMIN_LOGS_FILE, JSON.stringify(adminLogs.slice(-500), null, 2));
  }catch(e){ console.log('Save err:', e.message); }
}

function loadFromDisk(){
  try{
    if(fs.existsSync(DATA_FILE)){
      const d = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
      if(d.keys) Object.entries(d.keys).forEach(([k,v]) => keyStorage[k] = v);
      if(d.apis?.length) customAPIs = d.apis;
      if(d.tokens){ permanentTokens = d.tokens; Object.keys(permanentTokens).forEach(t => { adminSessions[t] = { expiresAt: Date.now()+(365*24*60*60*1000), permanent: true }; }); }
      if(d.logs) requestLogs = d.logs;
      if(d.protected) protectedData = d.protected;
      if(d.endpointResponses) endpointResponses = d.endpointResponses;
      if(d.theme) theme = { ...theme, ...d.theme, colors: { ...theme.colors, ...(d.theme.colors||{}) }, effects: { ...theme.effects, ...(d.theme.effects||{}) } };
      if(d.bans) bans = { ...bans, ...d.bans };
      if(d.abuseTracker) abuseTracker = { ...abuseTracker, ...d.abuseTracker };
      if(d.deviceFingerprints) deviceFingerprints = d.deviceFingerprints;
      if(d.ddosConfig) ddosConfig = { ...ddosConfig, ...d.ddosConfig };  // ✅ FIXED
      if(d.blocklist) blocklist = d.blocklist;
      if(d.whitelist) whitelist = d.whitelist;
      if(d.announcement) announcement = d.announcement;
      if(d.maintenance) maintenance = d.maintenance;
      if(d.auditLog) auditLog = d.auditLog;
      if(d.developerConfig) developerConfig = { ...developerConfig, ...d.developerConfig };  // ✅ NEW
      return true;
    }
  }catch(e){ console.log('Load err:', e.message); }
  return false;
}
setInterval(saveToDisk, 60 * 1000);  // Save every 60s

// ============================================================
// ⏰ TIME
// ============================================================
const getIndiaTime = () => new Date(Date.now() + 5.5*3600*1000);
const getIndiaDate = () => getIndiaTime().toISOString().split('T')[0];
const getIndiaDateTime = () => getIndiaTime().toISOString().replace('T',' ').substring(0,19);
const isKeyExpired = (d) => d && d !== 'LIFETIME' && getIndiaTime() > new Date(d);
function parseExpiryDate(s){
  if(!s || s === 'LIFETIME') return null;
  const p = String(s).split('-');
  if(p.length === 3) return p[0].length === 4 ? new Date(+p[0], +p[1]-1, +p[2], 23, 59, 59) : new Date(+p[2], +p[1]-1, +p[0], 23, 59, 59);
  const d = new Date(s); return isNaN(d) ? null : d;
}
function logAudit(user, action, details){
  auditLog.push({ user, action, details, timestamp: getIndiaDateTime() });
  if(auditLog.length > 500) auditLog = auditLog.slice(-500);
}

// ============================================================
// 📱 DEVICE
// ============================================================
function getRealIP(req){
  return (req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.headers['x-real-ip'] || req.headers['cf-connecting-ip'] || req.connection?.remoteAddress || req.socket?.remoteAddress || 'Unknown';
}
function generateDeviceId(req){
  const ua = req.headers['user-agent'] || '';
  const lang = req.headers['accept-language'] || '';
  const enc = req.headers['accept-encoding'] || '';
  const plat = req.headers['sec-ch-ua-platform'] || '';
  return 'DEV_' + crypto.createHash('md5').update(`${ua}|${lang}|${enc}|${plat}`).digest('hex').substring(0, 16).toUpperCase();
}
function detectDeviceType(req){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if(/iphone|ipad|ipod/.test(ua)) return { type:'iPhone/iPad', icon:'📱', os:'iOS' };
  if(/samsung|sm-/.test(ua)) return { type:'Samsung', icon:'📱', os:'Android' };
  if(/infinix/.test(ua)) return { type:'Infinix', icon:'📱', os:'Android' };
  if(/xiaomi|redmi|poco|mi /.test(ua)) return { type:'Xiaomi/Redmi', icon:'📱', os:'Android' };
  if(/oppo|cph/.test(ua)) return { type:'Oppo', icon:'📱', os:'Android' };
  if(/vivo/.test(ua)) return { type:'Vivo', icon:'📱', os:'Android' };
  if(/oneplus/.test(ua)) return { type:'OnePlus', icon:'📱', os:'Android' };
  if(/realme/.test(ua)) return { type:'Realme', icon:'📱', os:'Android' };
  if(/huawei|honor/.test(ua)) return { type:'Huawei/Honor', icon:'📱', os:'Android' };
  if(/android/.test(ua)) return { type:'Android', icon:'📱', os:'Android' };
  if(/windows nt 10/.test(ua)) return { type:'Windows 10/11', icon:'💻', os:'Windows' };
  if(/windows/.test(ua)) return { type:'Windows', icon:'💻', os:'Windows' };
  if(/macintosh|mac os x/.test(ua)) return { type:'MacBook/Mac', icon:'💻', os:'macOS' };
  if(/linux/.test(ua)) return { type:'Linux PC', icon:'💻', os:'Linux' };
  if(/chrome os/.test(ua)) return { type:'Chromebook', icon:'💻', os:'ChromeOS' };
  if(/curl|wget|python|node|axios|java|php|ruby|go-http/.test(ua)) return { type:'Bot/CLI', icon:'🤖', os:'Bot' };
  return { type:'Unknown', icon:'❓', os:'Unknown' };
}
function detectBrowser(req){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if(/edg\//.test(ua)) return 'Edge';
  if(/opr\/|opera/.test(ua)) return 'Opera';
  if(/brave/.test(ua)) return 'Brave';
  if(/vivaldi/.test(ua)) return 'Vivaldi';
  if(/ucbrowser/.test(ua)) return 'UC Browser';
  if(/samsungbrowser/.test(ua)) return 'Samsung Internet';
  if(/chrome|crios/.test(ua)) return 'Chrome';
  if(/firefox|fxios/.test(ua)) return 'Firefox';
  if(/safari/.test(ua)) return 'Safari';
  if(/postman/.test(ua)) return 'Postman';
  if(/insomnia/.test(ua)) return 'Insomnia';
  if(/curl/.test(ua)) return 'cURL';
  if(/python/.test(ua)) return 'Python';
  if(/node|axios/.test(ua)) return 'Node.js';
  return 'Unknown';
}
function detectCountry(req){
  return req.headers['cf-ipcountry'] || req.headers['x-country'] || 'Unknown';
}

// ============================================================
// 🧠 SMART DDOS
// ============================================================
function isBanned(type, id){
  const b = bans[type]?.[id];
  if(!b) return false;
  if(b.permanent) return true;
  if(Date.now() < b.until) return true;
  delete bans[type][id];
  return false;
}
function pushHit(bucket, id, maxWindow = 24*3600000){
  const now = Date.now();
  if(!bucket[id]) bucket[id] = { hits: [], strikes: 0, warned: 0 };
  bucket[id].hits = bucket[id].hits.filter(t => t > now - maxWindow);
  bucket[id].hits.push(now);
}
function countWindow(bucket, id, ms){
  const now = Date.now();
  return (bucket[id]?.hits || []).filter(t => t > now - ms).length;
}
function strike(bucket, id, reason, ctx = {}){
  if(!bucket[id]) bucket[id] = { hits: [], strikes: 0, warned: 0 };
  bucket[id].strikes++;
  const s = bucket[id].strikes;
  const c = ddosConfig.strikes;
  if(s >= c.permanentAt){
    if(!bans[ctx.type]) bans[ctx.type] = {};
    bans[ctx.type][id] = { permanent: true, reason, at: getIndiaDateTime(), strikes: s };
    return { action:'PERMANENT_BAN', message:'🚫 PERMANENT BAN' };
  }
  if(s >= c.longBanAt){
    if(!bans[ctx.type]) bans[ctx.type] = {};
    bans[ctx.type][id] = { until: Date.now() + ddosConfig.longBanMs, reason, at: getIndiaDateTime(), strikes: s };
    return { action:'LONG_BAN', message:'⛔ 1 hour ban' };
  }
  if(s >= c.tempBanAt){
    if(!bans[ctx.type]) bans[ctx.type] = {};
    bans[ctx.type][id] = { until: Date.now() + ddosConfig.tempBanMs, reason, at: getIndiaDateTime(), strikes: s };
    return { action:'TEMP_BAN', message:'⏸️ 5 min ban' };
  }
  if(s >= c.throttleAt) return { action:'THROTTLE', message:'🐢 Slow down' };
  return { action:'WARN', message:'⚠️ Warning #' + s };
}
function smartDDoS(req){
  if(!ddosConfig.enabled || ddosConfig.mode === 'off') return { allowed: true };
  const ip = getRealIP(req);
  const deviceId = generateDeviceId(req);
  const key = req.query.key || req.headers['x-api-key'] || '';
  if(whitelist.ips.includes(ip)) return { allowed: true, action: 'WHITELISTED' };
  if(isBanned('ip', ip)) return { allowed:false, code:403, reason:'IP banned', type:'ip', id:ip, action:'BANNED' };
  if(isBanned('device', deviceId)) return { allowed:false, code:403, reason:'Device banned', type:'device', id:deviceId, action:'BANNED' };
  if(key && isBanned('key', key)) return { allowed:false, code:403, reason:'Key banned', type:'key', id:key, action:'BANNED' };
  pushHit(abuseTracker.ip, ip);
  pushHit(abuseTracker.device, deviceId);
  if(key) pushHit(abuseTracker.key, key);
  const check = (type, id, limits, bucket) => {
    const b10 = countWindow(bucket, id, 10000);
    const b1m = countWindow(bucket, id, 60000);
    const b1h = countWindow(bucket, id, 3600000);
    if(b10 > limits.burst10s) return strike(bucket, id, `Burst ${b10}/10s`, { type });
    if(b1m > limits.perMinute) return strike(bucket, id, `Rate ${b1m}/min`, { type });
    if(b1h > limits.perHour) return strike(bucket, id, `Rate ${b1h}/hour`, { type });
    return null;
  };
  let r = check('ip', ip, ddosConfig.ip, abuseTracker.ip);
  if(r) return { allowed: r.action === 'WARN' || r.action === 'THROTTLE', code: r.action.includes('BAN') ? 403 : 200, reason: r.message, action: r.action, type:'ip', id:ip };
  r = check('device', deviceId, ddosConfig.device, abuseTracker.device);
  if(r) return { allowed: r.action === 'WARN' || r.action === 'THROTTLE', code: r.action.includes('BAN') ? 403 : 200, reason: r.message, action: r.action, type:'device', id:deviceId };
  if(key){
    r = check('key', key, ddosConfig.key, abuseTracker.key);
    if(r) return { allowed: r.action === 'WARN' || r.action === 'THROTTLE', code: r.action.includes('BAN') ? 403 : 200, reason: r.message, action: r.action, type:'key', id:key };
  }
  return { allowed: true, action: 'OK' };
}

// ============================================================
// 🔑 KEY VALIDATION
// ============================================================
function checkCooldown(k){
  const kd = keyStorage[k];
  if(!kd?.cooldown) return { allowed: true };
  const n = Date.now();
  if(cooldownTimers[k] && (n - cooldownTimers[k]) < kd.cooldown*1000)
    return { allowed: false, remaining: Math.ceil((kd.cooldown*1000 - (n - cooldownTimers[k]))/1000) };
  cooldownTimers[k] = n;
  return { allowed: true };
}
function checkPerSecondLimit(k){
  const kd = keyStorage[k];
  if(!kd?.perSecondLimit) return { allowed: true };
  const wk = k + '_ps_' + Math.floor(Date.now()/1000);
  if(!perSecondLimits[wk]) perSecondLimits[wk] = 0;
  if(perSecondLimits[wk] >= kd.perSecondLimit) return { allowed: false, message: `⚡ ${kd.perSecondLimit}/s reached` };
  perSecondLimits[wk]++;
  return { allowed: true };
}
function checkDailyLimit(k){
  const kd = keyStorage[k];
  if(!kd?.dailyLimit) return { allowed: true };
  const dk = k + '_' + getIndiaDate();
  if(!dailyLimits[dk]) dailyLimits[dk] = 0;
  if(dailyLimits[dk] >= kd.dailyLimit) return { allowed: false, message: `🔴 Daily limit reached` };
  return { allowed: true };
}
function isProtected(value){
  for(const key in protectedData){ if(String(value).includes(protectedData[key])) return protectedData[key]; }
  return null;
}
function checkKeyValid(k){
  if(!k) return { valid: false, error: 'Missing key' };
  if(maintenance.enabled && !whitelist.keys.includes(k)) return { valid: false, error: '🔧 ' + maintenance.message };
  const kd = keyStorage[k];
  if(!kd) return { valid: false, error: '🔑 Key not found!\n\n🛒 Purchase: @BRONX_ULTRA' };
  if(kd.stopped) return { valid: false, error: '⛔ Key stopped' };
  if(kd.disabled) return { valid: false, error: '🚫 Key disabled' };
  if(kd.expiry && isKeyExpired(kd.expiry)) return { valid: false, error: '⏰ Expired on ' + kd.expiryStr };
  if(!kd.unlimited && kd.used >= kd.limit) return { valid: false, error: `🔴 Limit reached ${kd.limit}/${kd.limit}` };
  const dl = checkDailyLimit(k); if(!dl.allowed) return { valid: false, error: dl.message };
  const ps = checkPerSecondLimit(k); if(!ps.allowed) return { valid: false, error: ps.message };
  const cd = checkCooldown(k); if(!cd.allowed) return { valid: false, error: '⏱️ Cooldown ' + cd.remaining + 's' };
  return { valid: true, keyData: kd };
}
function incrementKeyUsage(k, ep, req){
  const ip = getRealIP(req);
  const deviceId = generateDeviceId(req);
  const di = detectDeviceType(req);
  const browser = detectBrowser(req);
  const country = detectCountry(req);
  if(keyStorage[k] && !keyStorage[k].unlimited){
    keyStorage[k].used++;
    const dk = k + '_' + getIndiaDate();
    dailyLimits[dk] = (dailyLimits[dk] || 0) + 1;
    if(keyStorage[k].used % 5 === 0) saveToDisk();
  }
  if(!deviceFingerprints[deviceId]){
    deviceFingerprints[deviceId] = { firstSeen: getIndiaDateTime(), lastSeen:'', requests: 0, userAgent: req.headers['user-agent']||'', browser, deviceType: di.type, deviceIcon: di.icon, os: di.os, ips: [], countries: [] };
  }
  const df = deviceFingerprints[deviceId];
  df.lastSeen = getIndiaDateTime(); df.requests++;
  if(!df.ips.includes(ip)){ df.ips.push(ip); if(df.ips.length>10) df.ips = df.ips.slice(-10); }
  if(country !== 'Unknown' && !df.countries.includes(country)) df.countries.push(country);
  if(!ipRequestCounts[ip] || ipRequestCounts[ip].date !== getIndiaDate())
    ipRequestCounts[ip] = { count: 0, date: getIndiaDate() };
  ipRequestCounts[ip].count++;
  keyMonitorLogs.push({ key: k.substring(0,8)+'***', fullKey: k, endpoint: ep, ip, deviceId, deviceIcon: di.icon, deviceType: di.type, browser, clientType: browser, country, timestamp: getIndiaDateTime(), date: getIndiaDate() });
  if(keyMonitorLogs.length > 1000) keyMonitorLogs = keyMonitorLogs.slice(-1000);
}

function checkKeyScope(kd, ep){
  if(!kd?.scopes?.length) return { valid: false, error: 'No scopes assigned' };
  if(kd.scopes.includes('*')) return { valid: true };
  if(kd.scopes.includes(ep)) return { valid: true };
  const cleanEp = ep.startsWith('c/') ? ep.substring(2) : ep;
  const isCustom = customAPIs.some(a => a.endpoint === cleanEp);
  if(isCustom){
    if(kd.scopes.includes('custom')) return { valid: true };
    if(kd.scopes.includes('custom:' + cleanEp)) return { valid: true };
  }
  return { valid: false, error: 'Scope denied: ' + ep + ' (allowed: ' + kd.scopes.join(', ') + ')' };
}

const genToken = () => crypto.randomBytes(24).toString('base64url');
const genRandomKey = (p='BRONX') => `${p}_${crypto.randomBytes(10).toString('hex').toUpperCase()}`;
function isAdminAuth(t){
  if(!t) return false;
  if(adminSessions[t]){
    if(adminSessions[t].permanent) return true;
    if(Date.now() < adminSessions[t].expiresAt) return true;
    delete adminSessions[t]; delete permanentTokens[t];
  }
  return false;
}

// ============================================================
// 🎨 NEW: SANITIZE + DEVELOPER + HIDE WORDS
// ============================================================
function getDeveloperName(key){
  if(!key) return developerConfig.globalName;
  return developerConfig.perKeyNames[key] || developerConfig.globalName;
}

function sanitizeResponse(d, key){
  if(!d) return d;
  try{
    const c = JSON.parse(JSON.stringify(d));
    // Remove internal fields
    ['credit','truecaller_name','cached','cached_at','api_by','by','channel','developer','api_key','real_url','source_url','owner','key_note','response_time_ms','src'].forEach(x => delete c[x]);
    if(c.meta){ delete c.meta.api_by; delete c.meta.response_time_ms; delete c.meta.quota_used; if(!Object.keys(c.meta).length) delete c.meta; }
    
    // ✅ NEW: Apply developer name (from key-specific or global)
    const devName = getDeveloperName(key);
    c.powered_by = devName;
    
    // ✅ NEW: Remove hidden words from string values
    const removeHidden = (obj) => {
      if(typeof obj === 'string'){
        let s = obj;
        developerConfig.hiddenWords.forEach(w => {
          const regex = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
          s = s.replace(regex, '');
        });
        return s.replace(/\s+/g, ' ').trim();
      }
      if(Array.isArray(obj)) return obj.map(removeHidden);
      if(obj && typeof obj === 'object'){
        const out = {};
        Object.entries(obj).forEach(([k,v]) => {
          // Don't remove powered_by
          if(k === 'powered_by') { out[k] = v; return; }
          const lowerK = k.toLowerCase();
          if(developerConfig.hiddenWords.some(w => w.toLowerCase() === lowerK)) return;
          out[k] = removeHidden(v);
        });
        return out;
      }
      return obj;
    };
    return removeHidden(c);
  }catch(e){ return d; }
}

// ✅ NEW: Format response based on key's format mode
function formatResponse(data, formatMode){
  if(!formatMode || formatMode === 'json') return data;
  if(formatMode === 'styled' || formatMode === 'op_look'){
    const lines = [];
    const emoji = formatMode === 'op_look' ? '🔥' : '✨';
    const walk = (obj, prefix = '') => {
      if(obj === null || obj === undefined) return;
      if(typeof obj !== 'object'){
        lines.push(`${prefix} ${obj}`);
        return;
      }
      Object.entries(obj).forEach(([k, v]) => {
        const keyStr = k.replace(/_/g, ' ').toUpperCase();
        if(v && typeof v === 'object' && !Array.isArray(v)){
          lines.push(`${emoji} ${keyStr}:`);
          walk(v, '   ');
        } else if(Array.isArray(v)){
          lines.push(`${emoji} ${keyStr}: ${v.join(', ')}`);
        } else {
          lines.push(`${emoji} ${keyStr}: ${v}`);
        }
      });
    };
    walk(data);
    return { _formatted: lines.join('\n'), _format: formatMode, _raw: data };
  }
  return data;
}

function esc(s){ return s ? String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]) : ''; }

// ============================================================
// 📋 ENDPOINTS
// ============================================================
const endpoints = {
  number:{p:'num',i:'📱',e:'9876543210',d:'Mobile Lookup',c:'phone'},
  aadhar:{p:'num',i:'🆔',e:'393933081942',d:'Aadhaar',c:'phone'},
  leakinfo:{p:'term',i:'🕵️',e:'email@example.com',d:'Leak Info',c:'phone'},
  name:{p:'name',i:'🔍',e:'abhiraaj',d:'Name Search',c:'phone'},
  numv2:{p:'num',i:'📱',e:'6205949840',d:'Number v2',c:'phone'},
  adv:{p:'num',i:'📱',e:'9876543210',d:'Advanced Intel',c:'phone'},
  adharfamily:{p:'num',i:'👨‍👩‍👧‍👦',e:'984154610245',d:'Family',c:'phone'},
  adharration:{p:'num',i:'📋',e:'701984830542',d:'Ration Card',c:'phone'},
  imei:{p:'imei',i:'📱',e:'357817383506298',d:'IMEI',c:'phone'},
  calltracer:{p:'num',i:'📞',e:'9876543210',d:'Call Tracer',c:'phone'},
  challan:{p:'vehicle',i:'📋',e:'UP42BB2572',d:'Challan',c:'vehicle'},
  numleak:{p:'num',i:'🔓',e:'9876543210',d:'Number Leak',c:'phone'},
  bomber:{p:'number',i:'💣',e:'9876543210',d:'SMS Bomber',c:'phone'},
  numtoupi:{p:'num',i:'💳',e:'8945996482',d:'Num to UPI',c:'finance'},
  upi:{p:'upi',i:'💰',e:'example@ybl',d:'UPI',c:'finance'},
  ifsc:{p:'ifsc',i:'🏦',e:'SBIN0001234',d:'IFSC',c:'finance'},
  pan:{p:'pan',i:'📄',e:'AXDPR2606K',d:'PAN',c:'finance'},
  pincode:{p:'pin',i:'📍',e:'110001',d:'Pincode',c:'location'},
  ip:{p:'ip',i:'🌐',e:'8.8.8.8',d:'IP Lookup',c:'location'},
  vehicle:{p:'vehicle',i:'🚗',e:'MH02FZ0555',d:'Vehicle',c:'vehicle'},
  rc:{p:'owner',i:'📋',e:'UP92P2111',d:'veh2num',c:'vehicle'},
  veh2num:{p:'vehicle',i:'🚗',e:'KL41V3504',d:'Veh to Num',c:'vehicle'},
  ff:{p:'uid',i:'🎮',e:'123456789',d:'Free Fire',c:'gaming'},
  bgmi:{p:'uid',i:'🎮',e:'5121439477',d:'BGMI',c:'gaming'},
  insta:{p:'username',i:'📸',e:'cristiano',d:'Instagram',c:'social'},
  git:{p:'username',i:'💻',e:'ftgamer2',d:'GitHub',c:'social'},
  tg:{p:'info',i:'📲',e:'JAUUOWNER',d:'Telegram',c:'social'},
  tgidinfo:{p:'id',i:'📲',e:'7530266953',d:'TG ID Info',c:'social'},
  snap:{p:'username',i:'👻',e:'priyapanchal272',d:'Snapchat',c:'social'},
  pk:{p:'num',i:'🇵🇰',e:'03331234567',d:'Pakistan',c:'pakistan'},
  pkv2:{p:'num',i:'🇵🇰',e:'3359736848',d:'Pakistan v2',c:'pakistan'}
};

// ============================================================
// 🎬 INIT
// ============================================================
function initHardcoded(){
  const now = getIndiaDateTime();
  const hc = [
    ['BRONX_PREMIUM_V100_01','Premium 01',999999,'31-12-2028',['*']],
    ['BRONX_PREMIUM_V100_02','Premium 02',999999,'31-12-2028',['*']],
    ['BRONX_ULTRA_OSINT_01','Ultra 01',888888,'30-06-2029',['number','aadhar','upi','pan']],
    ['BRONX_KING_OP_V100','King OP',999999,'31-12-2030',['*']],
    ['BRONX_GOD_TIER_V100','God Tier',999999,'31-12-2030',['*']]
  ];
  hc.forEach(([k,n,l,e,s]) => {
    if(!keyStorage[k]) keyStorage[k] = { name:n, scopes:s, type:'hardcoded', limit:l, used:0, cooldown:0, dailyLimit:0, perSecondLimit:0, expiry:parseExpiryDate(e), expiryStr:e, created:now, unlimited:true, hidden:true, _hardcoded:true, formatMode:'json' };
  });
}

function initCustomAPIs(){
  customAPIs = [
    { id: Date.now()+1, name:'Number Info', endpoint:'number-advanced', param:'num', example:'9876543210', visible:true, realAPI:'https://num-tg-info-api.vercel.app/info?number={param}', scopeKey:'custom:number-advanced' },
    { id: Date.now()+2, name:'Vehicle RC', endpoint:'rc-details', param:'ca_number', example:'MH02FZ0555', visible:true, realAPI:'https://simple-rc-info.vercel.app/rc?num={param}', scopeKey:'custom:rc-details' },
    { id: Date.now()+3, name:'Aadhar', endpoint:'aadhar-verify', param:'aadhar', example:'393933081942', visible:true, realAPI:'https://bronx-king-vip999.vercel.app/api/aadhaar?num={param}', scopeKey:'custom:aadhar-verify' },
    { id: Date.now()+4, name:'Email', endpoint:'email-lookup', param:'mail', example:'user@gmail.com', visible:true, realAPI:'https://bronx-king-mail-opi.vercel.app/mail={param}', scopeKey:'custom:email-lookup' },
    { id: Date.now()+5, name:'Telegram', endpoint:'telegram-scan', param:'id', example:'7530266953', visible:true, realAPI:'https://bronx-tg-king-bro.vercel.app/tg?key=BRONXop&query={param}', scopeKey:'custom:telegram-scan' },
    { id: Date.now()+6, name:'SMS Bomber', endpoint:'sms-bomber', param:'number', example:'1234567890', visible:true, realAPI:'https://bronx-sms-api-ulimate.vercel.app/api/key-bronx-paid-vip?number={param}&counter=10', scopeKey:'custom:sms-bomber' },
    { id: Date.now()+7, name:'Number Backup', endpoint:'num-op', param:'num', example:'9876543210', visible:true, realAPI:'https://tfqdeadlo-inddataapi.hf.space/search?mobile={param}', scopeKey:'custom:num-op' }
  ];
}

// ============================================================
// 🌐 MIDDLEWARE
// ============================================================
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true, limit:'50mb'}));
app.set('json spaces', 2);
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,x-api-key,x-admin-token');
  if(req.method === 'OPTIONS') return res.status(200).end();
  next();
});
app.use('/api', (req,res,next) => {
  const r = smartDDoS(req);
  res.setHeader('X-RateLimit-Mode', ddosConfig.mode);
  if(r.action && r.action !== 'OK') res.setHeader('X-Bronx-Warning', r.reason || 'ok');
  if(!r.allowed) return res.status(r.code || 429).json({ error: r.reason || 'Rate limited', type: r.type || 'unknown', action: r.action || 'BLOCKED' });
  if(r.action === 'THROTTLE') return setTimeout(() => next(), 800);
  next();
});

// ============================================================
// 🏠 PUBLIC
// ============================================================
app.get('/', (req,res) => { try { res.send(renderHome()); } catch(e){ res.send('err: ' + e.message); } });
app.get('/test', (req,res) => res.json({
  status:'✅ BRONX V300 ULTRA OP', version:'3.0.0', ddos: ddosConfig.mode,
  keys: Object.keys(keyStorage).length, endpoints: Object.keys(endpoints).length,
  custom: customAPIs.length, bannedIPs: Object.keys(bans.ip).length,
  bannedDevices: Object.keys(bans.device).length, devicesTracked: Object.keys(deviceFingerprints).length,
  theme: theme.preset, maintenance: maintenance.enabled,
  developer: developerConfig.globalName
}));
app.get('/theme', (req,res) => res.json(theme));
app.get('/public-theme', (req,res) => res.json({ theme, announcement, maintenance }));

// ✅ Custom API endpoint with format support
app.get('/api/custom/:ep', async (req,res) => {
  try{
    const api = customAPIs.find(a => a.endpoint === req.params.ep && a.visible);
    if(!api) return res.json({error:'API not found or disabled'});
    const key = req.query.key;
    if(!key) return res.json({error:'Key required'});
    const kc = checkKeyValid(key);
    if(!kc.valid) return res.json({error: kc.error});
    const sc = checkKeyScope(kc.keyData, req.params.ep);
    if(!sc.valid) return res.json({error: sc.error});
    const pv = req.query[api.param] || req.query.number || req.query.num;
    if(!pv) return res.json({error:'Missing param: ' + api.param});
    if(isProtected(pv)) return res.json({error:'🔒 PROTECTED', protected:true});
    const url = api.realAPI.replace(/\{param\}/gi, encodeURIComponent(pv));
    const r = await axios.get(url, { timeout: 30000 });
    incrementKeyUsage(key, 'c/'+req.params.ep, req);
    requestLogs.push({ timestamp: getIndiaDateTime(), key:key.substring(0,8)+'***', endpoint:'c/'+req.params.ep, param:String(pv).substring(0,20), status:'success', ip:getRealIP(req), clientType:detectBrowser(req) });
    if(requestLogs.length > 2000) requestLogs = requestLogs.slice(-2000);
    const cleaned = sanitizeResponse(r.data, key);
    const formatted = formatResponse(cleaned, kc.keyData.formatMode);
    res.json({ ...formatted, api_info: { key_owner: kc.keyData.name, remaining: kc.keyData.unlimited ? '∞' : Math.max(0, kc.keyData.limit - kc.keyData.used), expiry: kc.keyData.expiryStr || 'LIFETIME', format: kc.keyData.formatMode || 'json' } });
  }catch(e){ res.json({error:'API error: ' + e.message}); }
});

// Main endpoint with format support
app.get('/api/key-bronx/:ep', async (req,res) => {
  try{
    const ep = req.params.ep;
    if(!endpoints[ep]) return res.json({error:'Endpoint not found'});
    const key = req.query.key;
    if(!key) return res.json({error:'Key required'});
    const kc = checkKeyValid(key);
    if(!kc.valid) return res.json({error: kc.error});
    const sc = checkKeyScope(kc.keyData, ep);
    if(!sc.valid) return res.json({error: sc.error});
    const pv = req.query[endpoints[ep].p];
    if(!pv) return res.json({error:'Missing ' + endpoints[ep].p});
    if(isProtected(pv)) return res.json({error:'🔒 PROTECTED', protected:true});
    if(endpointResponses[ep]) {
      const cleaned = sanitizeResponse(endpointResponses[ep], key);
      const formatted = formatResponse(cleaned, kc.keyData.formatMode);
      return res.json({ ...formatted, api_info:{key_owner:kc.keyData.name, format: kc.keyData.formatMode || 'json'} });
    }
    const url = `${REAL_API_BASE}/${ep}?key=${getNextKey()}&${endpoints[ep].p}=${encodeURIComponent(pv)}`;
    const r = await axios.get(url, { timeout: 30000 });
    incrementKeyUsage(key, ep, req);
    requestLogs.push({ timestamp: getIndiaDateTime(), key:key.substring(0,8)+'***', endpoint:ep, param:String(pv).substring(0,20), status:'success', ip:getRealIP(req), clientType:detectBrowser(req) });
    if(requestLogs.length > 2000) requestLogs = requestLogs.slice(-2000);
    const cleaned = sanitizeResponse(r.data, key);
    const formatted = formatResponse(cleaned, kc.keyData.formatMode);
    res.json({ ...formatted, api_info: { key_owner: kc.keyData.name, remaining: kc.keyData.unlimited ? '∞' : Math.max(0, kc.keyData.limit - kc.keyData.used), expiry: kc.keyData.expiryStr || 'LIFETIME', format: kc.keyData.formatMode || 'json' } });
  }catch(e){ res.json({error:'API error'}); }
});

app.get('/api/number', async (req,res) => {
  try{
    const key = req.query.key, num = req.query.num;
    if(!key) return res.json({error:'Key required'});
    if(!num) return res.json({error:'Missing num'});
    const kc = checkKeyValid(key);
    if(!kc.valid) return res.json({error: kc.error});
    if(isProtected(num)) return res.json({error:'🔒 PROTECTED', protected:true});
    const r = await axios.get(`${REAL_API_BASE}/number?key=${getNextKey()}&num=${encodeURIComponent(num)}`, { timeout: 30000 });
    incrementKeyUsage(key, 'number', req);
    const cleaned = sanitizeResponse(r.data, key);
    const formatted = formatResponse(cleaned, kc.keyData.formatMode);
    res.json({ ...formatted, api_info:{key_owner:kc.keyData.name, format: kc.keyData.formatMode || 'json'} });
  }catch(e){ res.json({error:'API error'}); }
});

app.get('/api/leakinfo', async (req,res) => {
  try{
    const t = req.query.term || req.query.info;
    if(!t) return res.json({error:'Missing term'});
    if(isProtected(t)) return res.json({error:'🔒 PROTECTED', protected:true});
    const r = await axios.get(`${REAL_API_BASE}/leakinfo?key=${getNextKey()}&info=${encodeURIComponent(t)}`, { timeout: 30000 });
    const key = req.query.key;
    const cleaned = sanitizeResponse(r.data, key);
    res.json({ ...cleaned, api_info:{endpoint:'leakinfo'} });
  }catch(e){ res.json({error:'API error'}); }
});

// ============================================================
// 🔐 ADMIN AUTH
// ============================================================
app.get(ADMIN_PATH, (req,res) => {
  try{
    const token = req.query.token || req.headers['x-admin-token'];
    if(token && isAdminAuth(token)) return res.send(renderAdmin(token));
    res.send(renderLogin());
  }catch(e){ res.send('err: ' + e.message); }
});

app.post(ADMIN_PATH + '/login', (req,res) => {
  const { username, password } = req.body;
  const ip = getRealIP(req);
  const ua = req.headers['user-agent'] || '';
  const di = detectDeviceType(req);
  if(bans.ip['LOGIN_'+ip] && (bans.ip['LOGIN_'+ip].permanent || Date.now() < bans.ip['LOGIN_'+ip].until))
    return res.json({ success:false, error:'🚫 Too many failed attempts.' });
  if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
    const token = genToken();
    adminSessions[token] = { expiresAt: Date.now() + 365*24*3600*1000, permanent: true };
    permanentTokens[token] = { createdAt: getIndiaDateTime() };
    delete abuseTracker.ip['LOGIN_'+ip];
    adminLogs.push({ user:username, action:'LOGIN', ip, browser:ua, device:di.type, timestamp:getIndiaDateTime(), status:'SUCCESS' });
    logAudit(username, 'LOGIN_SUCCESS', { ip });
    saveToDisk();
    res.json({ success:true, token, message:'✅ Access Granted', redirect: ADMIN_PATH + '?token=' + token });
  } else {
    pushHit(abuseTracker.ip, 'LOGIN_'+ip, 3600000);
    const attempts = countWindow(abuseTracker.ip, 'LOGIN_'+ip, 3600000);
    if(attempts >= ddosConfig.login.maxAttempts)
      bans.ip['LOGIN_'+ip] = { until: Date.now() + ddosConfig.login.banMs, reason:'Failed logins', at:getIndiaDateTime(), strikes:attempts };
    adminLogs.push({ user:username, action:'LOGIN_FAILED', ip, browser:ua, device:di.type, attempts, timestamp:getIndiaDateTime(), status:'FAILED' });
    logAudit(username, 'LOGIN_FAILED', { ip, attempts });
    res.json({ success:false, error:`Invalid credentials! ${ddosConfig.login.maxAttempts - attempts} attempts left.` });
  }
});

const adminAuth = (req,res,next) => {
  const t = req.headers['x-admin-token'] || req.query.token;
  if(!isAdminAuth(t)) return res.json({e:'Unauthorized'});
  next();
};

// ============================================================
// 🎛️ ADMIN APIs
// ============================================================

// ✅ UPDATED: Generate key with format mode
app.post(ADMIN_PATH + '/generate-key', adminAuth, (req,res) => {
  const { keyName, keyOwner, scopes, limit, expiryDate, days, cooldown, dailyLimit, perSecondLimit, autoGenerate, notes, formatMode, customDevName } = req.body;
  let fk = keyName; if(autoGenerate || !keyName) fk = genRandomKey();
  if(!fk || !keyOwner) return res.json({e:'Missing fields'});
  if(keyStorage[fk]) return res.json({e:'Key already exists'});
  const ks = scopes || ['number'];
  let exp = null, es = expiryDate || 'LIFETIME';
  if(days && !isNaN(days)){
    const d = new Date(Date.now() + parseInt(days)*24*3600*1000);
    exp = d; es = d.toISOString().split('T')[0].split('-').reverse().join('-');
  } else if(expiryDate && expiryDate !== 'LIFETIME'){ exp = parseExpiryDate(expiryDate); es = expiryDate; }
  
  keyStorage[fk] = { 
    name:keyOwner, scopes:ks, type:'generated', limit:parseInt(limit)||100, used:0, 
    cooldown:parseInt(cooldown)||0, dailyLimit:parseInt(dailyLimit)||0, perSecondLimit:parseInt(perSecondLimit)||0, 
    expiry:exp, expiryStr:es, created:getIndiaDateTime(), unlimited:false, hidden:false, _hardcoded:false, 
    stopped:false, disabled:false, notes:notes||'',
    formatMode: formatMode || 'json',
    customDevName: customDevName || ''
  };
  
  // ✅ NEW: Save per-key developer name
  if(customDevName) developerConfig.perKeyNames[fk] = customDevName;
  
  logAudit('admin', 'GENERATE_KEY', { key:fk, scopes:ks, formatMode: formatMode || 'json' });
  saveToDisk();
  res.json({ success:true, key:fk, message:'🔑 Key Generated!', formatMode: formatMode || 'json' });
});

app.post(ADMIN_PATH + '/edit-key', adminAuth, (req,res) => {
  const { keyName, newName, newOwner, newLimit, newDailyLimit, newPerSecondLimit, newCooldown, newScopes, newNotes, newExpiry, newFormatMode } = req.body;
  if(!keyStorage[keyName]) return res.json({e:'Not found'});
  if(keyStorage[keyName]._hardcoded) return res.json({e:'Hardcoded'});
  const kd = keyStorage[keyName];
  if(newName && newName !== keyName){
    if(keyStorage[newName]) return res.json({e:'New name exists'});
    keyStorage[newName] = { ...kd }; delete keyStorage[keyName];
    if(developerConfig.perKeyNames[keyName]){
      developerConfig.perKeyNames[newName] = developerConfig.perKeyNames[keyName];
      delete developerConfig.perKeyNames[keyName];
    }
  }
  const t = keyStorage[newName || keyName];
  if(newOwner !== undefined) t.name = newOwner;
  if(newLimit !== undefined) t.limit = parseInt(newLimit);
  if(newDailyLimit !== undefined) t.dailyLimit = parseInt(newDailyLimit);
  if(newPerSecondLimit !== undefined) t.perSecondLimit = parseInt(newPerSecondLimit);
  if(newCooldown !== undefined) t.cooldown = parseInt(newCooldown);
  if(newScopes) t.scopes = newScopes;
  if(newNotes !== undefined) t.notes = newNotes;
  if(newFormatMode) t.formatMode = newFormatMode;
  if(newExpiry){ const e = parseExpiryDate(newExpiry); if(e){ t.expiry = e; t.expiryStr = newExpiry; } }
  logAudit('admin', 'EDIT_KEY', { key:keyName });
  saveToDisk(); res.json({ success:true, message:'✅ Updated!' });
});

app.post(ADMIN_PATH + '/clone-key', adminAuth, (req,res) => {
  const { keyName } = req.body;
  if(!keyStorage[keyName]) return res.json({e:'Not found'});
  const kd = keyStorage[keyName];
  const nk = genRandomKey();
  keyStorage[nk] = { ...kd, used:0, created:getIndiaDateTime(), _hardcoded:false, hidden:false, name:(kd.name||'Clone')+' (Copy)' };
  logAudit('admin', 'CLONE_KEY', { from:keyName, to:nk });
  saveToDisk(); res.json({ success:true, key:nk, message:'✅ Cloned!' });
});

app.post(ADMIN_PATH + '/delete-key', adminAuth, (req,res) => {
  if(req.body.keyName === MASTER_API_KEY || keyStorage[req.body.keyName]?._hardcoded) return res.json({e:'Protected'});
  logAudit('admin', 'DELETE_KEY', { key:req.body.keyName });
  delete keyStorage[req.body.keyName]; saveToDisk(); res.json({success:true});
});

app.post(ADMIN_PATH + '/reset-key-usage', adminAuth, (req,res) => {
  if(keyStorage[req.body.keyName]){ keyStorage[req.body.keyName].used = 0; saveToDisk(); res.json({success:true}); }
  else res.json({e:'Not found'});
});

app.post(ADMIN_PATH + '/reset-all', adminAuth, (req,res) => {
  Object.keys(keyStorage).forEach(k => { if(k !== MASTER_API_KEY && !keyStorage[k]._hardcoded) keyStorage[k].used = 0; });
  dailyLimits = {}; perSecondLimits = {};
  saveToDisk(); res.json({success:true});
});

app.post(ADMIN_PATH + '/clear-logs', adminAuth, (req,res) => {
  requestLogs = []; keyMonitorLogs = []; saveToDisk(); res.json({success:true});
});

app.post(ADMIN_PATH + '/push-key', adminAuth, (req,res) => {
  const { keyName, days } = req.body;
  if(!keyStorage[keyName]) return res.json({e:'Not found'});
  if(keyStorage[keyName]._hardcoded) return res.json({e:'Hardcoded'});
  const d = parseInt(days) || 30;
  const ne = new Date(Date.now() + d*24*3600*1000);
  keyStorage[keyName].expiry = ne;
  keyStorage[keyName].expiryStr = ne.toISOString().split('T')[0].split('-').reverse().join('-');
  keyStorage[keyName].used = 0;
  logAudit('admin', 'PUSH_KEY', { key:keyName, days:d });
  saveToDisk(); res.json({success:true, message:`⬆ Pushed ${d} days!`});
});

app.post(ADMIN_PATH + '/push-all', adminAuth, (req,res) => {
  const d = parseInt(req.body.days) || 30;
  const ne = new Date(Date.now() + d*24*3600*1000);
  let count = 0;
  Object.keys(keyStorage).forEach(k => {
    if(!keyStorage[k]._hardcoded){
      keyStorage[k].expiry = ne;
      keyStorage[k].expiryStr = ne.toISOString().split('T')[0].split('-').reverse().join('-');
      count++;
    }
  });
  saveToDisk(); res.json({success:true, count, message:`⬆ Pushed ${d} days to ${count} keys!`});
});

app.post(ADMIN_PATH + '/stop-key', adminAuth, (req,res) => {
  const k = req.body.keyName;
  if(!keyStorage[k]) return res.json({e:'Not found'});
  if(keyStorage[k]._hardcoded) return res.json({e:'Hardcoded'});
  keyStorage[k].stopped = !keyStorage[k].stopped;
  saveToDisk(); res.json({success:true, stopped:keyStorage[k].stopped});
});

app.post(ADMIN_PATH + '/disable-key', adminAuth, (req,res) => {
  const k = req.body.keyName;
  if(!keyStorage[k]) return res.json({e:'Not found'});
  if(keyStorage[k]._hardcoded) return res.json({e:'Hardcoded'});
  keyStorage[k].disabled = !keyStorage[k].disabled;
  saveToDisk(); res.json({success:true, disabled:keyStorage[k].disabled});
});

app.post(ADMIN_PATH + '/update-scopes', adminAuth, (req,res) => {
  const { keyName, scopes } = req.body;
  if(!keyStorage[keyName]) return res.json({e:'Not found'});
  if(keyStorage[keyName]._hardcoded) return res.json({e:'Hardcoded'});
  keyStorage[keyName].scopes = scopes; saveToDisk(); res.json({success:true});
});

// ✅ UPDATED: Set key-specific developer name
app.post(ADMIN_PATH + '/set-key-developer', adminAuth, (req,res) => {
  const { keyName, devName } = req.body;
  if(!keyStorage[keyName]) return res.json({e:'Key not found'});
  if(!devName) {
    delete developerConfig.perKeyNames[keyName];
  } else {
    developerConfig.perKeyNames[keyName] = devName;
  }
  saveToDisk();
  res.json({ success:true, message: '✅ Developer name updated', devName: devName || developerConfig.globalName });
});

// ✅ NEW: Global developer name
app.get(ADMIN_PATH + '/developer-config', adminAuth, (req,res) => {
  res.json(developerConfig);
});

app.post(ADMIN_PATH + '/global-developer', adminAuth, (req,res) => {
  const { name } = req.body;
  if(!name) return res.json({e:'Name required'});
  developerConfig.globalName = name;
  logAudit('admin', 'SET_GLOBAL_DEV', { name });
  saveToDisk();
  res.json({ success:true, message: '✅ Global developer name updated', name });
});

app.post(ADMIN_PATH + '/hidden-words/add', adminAuth, (req,res) => {
  const { word } = req.body;
  if(!word) return res.json({e:'Word required'});
  if(!developerConfig.hiddenWords.includes(word)) developerConfig.hiddenWords.push(word);
  saveToDisk();
  res.json({ success:true, hiddenWords: developerConfig.hiddenWords });
});

app.post(ADMIN_PATH + '/hidden-words/remove', adminAuth, (req,res) => {
  const { word } = req.body;
  developerConfig.hiddenWords = developerConfig.hiddenWords.filter(w => w !== word);
  saveToDisk();
  res.json({ success:true, hiddenWords: developerConfig.hiddenWords });
});

// ✅ FIXED: DDoS config — save & persist
app.get(ADMIN_PATH + '/ddos-config', adminAuth, (req,res) => res.json(ddosConfig));
app.post(ADMIN_PATH + '/ddos-config', adminAuth, (req,res) => {
  const c = req.body;
  if(c.enabled !== undefined) ddosConfig.enabled = !!c.enabled;
  if(c.mode) ddosConfig.mode = c.mode;
  ['ip','device','key'].forEach(k => {
    if(c[k]){
      if(c[k].burst10s !== undefined) ddosConfig[k].burst10s = parseInt(c[k].burst10s);
      if(c[k].perMinute !== undefined) ddosConfig[k].perMinute = parseInt(c[k].perMinute);
      if(c[k].perHour !== undefined) ddosConfig[k].perHour = parseInt(c[k].perHour);
    }
  });
  if(c.strikes) Object.keys(c.strikes).forEach(x => { if(c.strikes[x] !== undefined) ddosConfig.strikes[x] = parseInt(c.strikes[x]); });
  if(c.tempBanMs !== undefined) ddosConfig.tempBanMs = parseInt(c.tempBanMs);
  if(c.longBanMs !== undefined) ddosConfig.longBanMs = parseInt(c.longBanMs);
  logAudit('admin', 'UPDATE_DDOS', { mode: ddosConfig.mode, enabled: ddosConfig.enabled });
  saveToDisk();  // ✅ CRITICAL: Save immediately
  res.json({success:true, config:ddosConfig});
});

// ============================================================
// ✅ UPDATED: EXPORT — COMPLETE DATA
// ============================================================
app.get(ADMIN_PATH + '/export-keys', adminAuth, (req,res) => {
  try {
    const out = {};
    Object.entries(keyStorage).forEach(([k,v]) => { 
      if(!v._hardcoded && !v.hidden) out[k] = v; 
    });
    
    const fullExport = {
      success: true,
      version: 'V300_ULTRA_OP',
      exported_at: getIndiaDateTime(),
      total_keys: Object.keys(out).length,
      keys: out,
      customAPIs: customAPIs,           // ✅ COMPLETE Custom APIs
      protectedData: protectedData,
      endpointResponses: endpointResponses,
      developerConfig: developerConfig,
      ddosConfig: ddosConfig,
      theme: theme,
      announcement: announcement,
      maintenance: maintenance,
      blocklist: blocklist,
      whitelist: whitelist
    };
    
    logAudit('admin', 'EXPORT_DATA', { keys: Object.keys(out).length, apis: customAPIs.length });
    res.json(fullExport);
  } catch(e) {
    res.json({ success: false, e: e.message });
  }
});

// ============================================================
// ✅ UPDATED: IMPORT — COMPLETE DATA
// ============================================================
app.post(ADMIN_PATH + '/import-keys', adminAuth, (req,res) => {
  try{
    const body = req.body;
    let imported = 0, skipped = 0, apisImported = 0;
    
    // Import keys
    if(body.keys && typeof body.keys === 'object'){
      Object.entries(body.keys).forEach(([k,d]) => {
        if(!d || typeof d !== 'object') return;
        if(d._hardcoded) { skipped++; return; }
        keyStorage[k] = { ...d, _hardcoded: false, hidden: false, type: d.type || 'generated' };
        imported++;
      });
    }
    
    // ✅ Import Custom APIs
    if(body.customAPIs && Array.isArray(body.customAPIs)){
      body.customAPIs.forEach(api => {
        const existing = customAPIs.find(a => a.id === api.id || a.endpoint === api.endpoint);
        if(existing){
          Object.assign(existing, api);
        } else {
          customAPIs.push(api);
        }
        apisImported++;
      });
    }
    
    // ✅ Import other data
    if(body.protectedData) protectedData = body.protectedData;
    if(body.endpointResponses) endpointResponses = body.endpointResponses;
    if(body.developerConfig) developerConfig = { ...developerConfig, ...body.developerConfig };
    if(body.ddosConfig) ddosConfig = { ...ddosConfig, ...body.ddosConfig };
    if(body.theme) theme = body.theme;
    if(body.announcement) announcement = body.announcement;
    if(body.maintenance) maintenance = body.maintenance;
    if(body.blocklist) blocklist = body.blocklist;
    if(body.whitelist) whitelist = body.whitelist;
    
    logAudit('admin', 'IMPORT_DATA', { imported, skipped, apisImported });
    saveToDisk();
    
    res.json({ 
      success: true, 
      imported, 
      skipped,
      apisImported,
      message:`✅ ${imported} keys + ${apisImported} APIs imported, ${skipped} skipped` 
    });
  }catch(e){ res.json({e:'Error: ' + e.message}); }
});

// ============================================================
// 🎨 DYNAMIC THEME CSS — ULTRA ENHANCED
// ============================================================
function generateCSS(){
  const c = theme.colors;
  const e = theme.effects;
  const r = theme.radius;
  return `
<style id="bronx-theme">
:root{
--bg-primary:${c.bgPrimary}; --bg-secondary:${c.bgSecondary}; --bg-card:${c.bgCard};
--border-color:${c.borderColor}; --text-primary:${c.textPrimary};
--text-secondary:${c.textSecondary}; --text-muted:${c.textMuted};
--accent:${c.accent}; --accent2:${c.accent2};
--neon-red:${c.accent}; --neon-green:${c.success}; --neon-orange:${c.warning};
--neon-cyan:${c.info}; --neon-pink:${c.pink}; --neon-purple:${c.purple};
--neon-yellow:${c.yellow}; --neon-white:#ffffff;
--gradient-primary:linear-gradient(135deg,${c.accent},${c.accent2});
--gradient-rainbow:linear-gradient(90deg,${c.accent},${c.accent2},${c.yellow},${c.success},${c.info},${c.purple},${c.pink},${c.accent});
--gradient-ultra:linear-gradient(135deg,#ff0000,#ff9500,#ffe600,#00ff88,#00e5ff,#bf00ff,#ff2d95,#ff0000);
--glow-red:0 0 20px ${hexToRgbStr(c.accent,.7)},0 0 40px ${hexToRgbStr(c.accent,.3)};
--glow-green:0 0 20px ${hexToRgbStr(c.success,.7)};
--glow-orange:0 0 20px ${hexToRgbStr(c.warning,.7)};
--glow-pink:0 0 20px ${hexToRgbStr(c.pink,.7)};
--glow-cyan:0 0 20px ${hexToRgbStr(c.info,.7)};
--glow-purple:0 0 20px ${hexToRgbStr(c.purple,.7)};
--radius:${r}px; --blur:blur(20px); --tr:all .3s cubic-bezier(.4,0,.2,1);
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg-primary);color:var(--text-primary);font-family:'${theme.fonts.body}',sans-serif;min-height:100vh;overflow-x:hidden;position:relative;transition:background .4s,color .4s}
${e.gridBg ? `.grid-bg{position:fixed;inset:0;background-image:linear-gradient(${hexToRgbStr(c.accent,.04)} 1px,transparent 1px),linear-gradient(90deg,${hexToRgbStr(c.accent,.04)} 1px,transparent 1px);background-size:50px 50px;z-index:0;pointer-events:none}` : `.grid-bg{display:none}`}
${e.scanLines ? `body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.15) 0px,rgba(0,0,0,.15) 1px,transparent 1px,transparent 2px);pointer-events:none;z-index:999;opacity:.3}` : ''}
#snowfall-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;${e.snowfall ? '' : 'display:none'}}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg-primary)}
::-webkit-scrollbar-thumb{background:linear-gradient(${c.accent},${c.accent2});border-radius:10px}

/* ✅ ULTRA ENHANCED ENDPOINT CARDS */
.endpoint-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;perspective:1200px}
.endpoint-card{
background:linear-gradient(135deg,${hexToRgbStr(c.bgSecondary,.9)},${hexToRgbStr(c.bgPrimary,.95)});
border:1px solid ${hexToRgbStr(c.accent,.25)};
border-radius:18px;
padding:20px;
cursor:pointer;
transition:all .45s cubic-bezier(.4,0,.2,1);
position:relative;
overflow:hidden;
transform-style:preserve-3d;
box-shadow:
  0 4px 6px rgba(0,0,0,.3),
  0 8px 25px ${hexToRgbStr(c.accent,.15)},
  inset 0 1px 0 ${hexToRgbStr('#ffffff',.05)};
}
.endpoint-card::before{
content:'';
position:absolute;
top:-50%;left:-50%;width:200%;height:200%;
background:conic-gradient(from 0deg,${c.accent},${c.accent2},${c.yellow},${c.success},${c.info},${c.purple},${c.pink},${c.accent});
opacity:0;
transition:opacity .4s;
animation:rotateBorder 4s linear infinite;
z-index:0;
}
.endpoint-card::after{
content:'';
position:absolute;
inset:2px;
background:${hexToRgbStr(c.bgSecondary,.98)};
border-radius:16px;
z-index:1;
}
.endpoint-card > *{position:relative;z-index:2}
.endpoint-card:hover{
transform:translateY(-8px) rotateX(5deg) rotateY(-3deg) scale(1.03);
border-color:${hexToRgbStr(c.accent,.8)};
box-shadow:
  0 20px 40px ${hexToRgbStr(c.accent,.4)},
  0 0 60px ${hexToRgbStr(c.accent2,.2)},
  inset 0 1px 0 ${hexToRgbStr('#ffffff',.15)};
}
.endpoint-card:hover::before{opacity:.6}
.endpoint-card .ep-icon{
font-size:36px;
margin-bottom:10px;
display:inline-block;
filter:drop-shadow(0 0 15px ${c.accent});
transition:transform .4s;
}
.endpoint-card:hover .ep-icon{transform:scale(1.2) rotate(10deg)}
.endpoint-card .ep-name{
font-size:15px;
font-weight:900;
margin-bottom:8px;
background:var(--gradient-rainbow);
background-size:400% 400%;
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
font-family:'Orbitron',sans-serif;
letter-spacing:1.5px;
animation:rainbowShift 4s linear infinite;
}
.endpoint-card .ep-desc{font-size:11px;color:var(--text-muted);margin-bottom:12px;font-weight:500}
.endpoint-card .ep-url{
font-size:9.5px;
color:${c.success};
background:${hexToRgbStr(c.success,.08)};
padding:8px 10px;
border-radius:8px;
font-family:'Space Grotesk',monospace;
word-break:break-all;
border:1px solid ${hexToRgbStr(c.success,.2)};
transition:var(--tr);
}
.endpoint-card:hover .ep-url{background:${hexToRgbStr(c.success,.15)};border-color:${c.success}}

@keyframes rotateBorder{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}

/* Other styles */
.admin-container{display:flex;min-height:100vh;position:relative;z-index:10}
.sidebar{width:250px;background:${hexToRgbStr(c.bgSecondary,.95)};border-right:2px solid ${hexToRgbStr(c.accent,.2)};padding:14px 10px;position:fixed;height:100vh;overflow-y:auto;backdrop-filter:blur(10px)}
.sidebar::-webkit-scrollbar{width:4px}
.sidebar::-webkit-scrollbar-thumb{background:var(--accent);border-radius:10px}
.main-content{flex:1;margin-left:250px;padding:18px}
.sidebar-header{text-align:center;padding:14px 0;border-bottom:1px solid ${hexToRgbStr(c.accent,.2)};margin-bottom:14px}
.sidebar-logo{font-size:34px;margin-bottom:6px;filter:drop-shadow(0 0 15px ${c.accent})}
.sidebar-title{font-size:14px;font-weight:900;background:var(--gradient-rainbow);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:4px;font-family:'${theme.fonts.heading}',sans-serif;animation:rainbowShift 3s linear infinite}
.sidebar-nav{list-style:none}
.sidebar-nav li{margin-bottom:3px}
.sidebar-nav a{display:flex;align-items:center;gap:9px;padding:9px 12px;color:var(--text-secondary);text-decoration:none;border-radius:9px;transition:var(--tr);font-size:11px;font-weight:500;cursor:pointer;border-left:3px solid transparent}
.sidebar-nav a:hover{background:${hexToRgbStr(c.accent,.08)};color:#fff;border-left-color:var(--accent);transform:translateX(3px)}
.sidebar-nav a.active{background:linear-gradient(90deg,${hexToRgbStr(c.accent,.2)},${hexToRgbStr(c.accent2,.05)});color:#fff;border-left-color:var(--accent)}
.sidebar-nav i{width:16px;text-align:center;font-size:12px}
.glow-card{background:var(--bg-card);backdrop-filter:var(--blur);border:1px solid var(--border-color);border-radius:var(--radius);padding:20px;margin-bottom:18px;transition:var(--tr);position:relative;overflow:hidden}
.glow-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient-rainbow);background-size:500% 500%;animation:rainbowShift 4s linear infinite;opacity:.8}
.glow-card:hover{border-color:${hexToRgbStr(c.accent,.3)};transform:translateY(-2px)}
.glow-card h3{margin-bottom:16px;font-size:15px;font-weight:700;display:flex;align-items:center;gap:9px;color:#fff;font-family:'${theme.fonts.heading}',sans-serif;letter-spacing:1px}
.glow-card h3 i{color:var(--accent)}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:18px}
.stat-card{background:${hexToRgbStr(c.bgSecondary,.9)};border:1px solid ${hexToRgbStr(c.accent,.15)};border-radius:14px;padding:16px 12px;text-align:center;transition:var(--tr)}
.stat-card:hover{transform:translateY(-5px) scale(1.02);border-color:var(--accent)}
.stat-icon{font-size:26px;margin-bottom:6px}
.stat-value{font-size:24px;font-weight:900;font-family:'${theme.fonts.heading}',sans-serif;color:var(--accent);margin-bottom:4px}
.stat-label{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:2px;font-weight:600}
.form-group{margin-bottom:12px}
.form-group label{display:block;margin-bottom:5px;color:var(--accent2);font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px}
.form-input{width:100%;padding:10px 14px;background:${hexToRgbStr(c.bgPrimary,.9)};border:1.5px solid ${hexToRgbStr(c.accent,.25)};border-radius:10px;color:#fff;font-size:12.5px;transition:var(--tr);outline:none;font-family:'${theme.fonts.body}',sans-serif}
.form-input:focus{border-color:var(--accent)}
.form-input option{background:${c.bgSecondary};color:#fff}
.btn-primary{padding:10px 20px;background:var(--gradient-primary);color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:11.5px;letter-spacing:1px;transition:var(--tr);font-family:'${theme.fonts.heading}',sans-serif}
.btn-primary:hover{transform:translateY(-2px);filter:brightness(1.2)}
.btn-success{background:linear-gradient(135deg,${c.success},${c.success}cc)}
.btn-danger{background:linear-gradient(135deg,${c.danger},${c.danger}cc)}
.btn-warning{background:linear-gradient(135deg,${c.warning},${c.warning}cc)}
.btn-info{background:linear-gradient(135deg,${c.info},${c.info}cc)}
.btn-action{padding:5px 8px;border-radius:6px;border:1px solid;cursor:pointer;font-size:10px;transition:var(--tr);background:transparent;margin:2px;font-weight:600}
.btn-reset{color:${c.success};border-color:${hexToRgbStr(c.success,.4)}}
.btn-push{color:${c.warning};border-color:${hexToRgbStr(c.warning,.4)}}
.btn-stop{color:${c.danger};border-color:${hexToRgbStr(c.danger,.4)}}
.btn-delete{color:${c.pink};border-color:${hexToRgbStr(c.pink,.4)}}
.btn-edit{color:${c.info};border-color:${hexToRgbStr(c.info,.4)}}
.btn-disable{color:${c.yellow};border-color:${hexToRgbStr(c.yellow,.4)}}
.btn-clone{color:${c.purple};border-color:${hexToRgbStr(c.purple,.4)}}
.table-container{overflow-x:auto;border-radius:10px;border:1px solid ${hexToRgbStr(c.accent,.1)}}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:${hexToRgbStr(c.accent,.08)};color:${c.accent2};padding:9px 7px;text-align:left;font-weight:700;text-transform:uppercase;font-size:9px;letter-spacing:1px;position:sticky;top:0;z-index:2;border-bottom:1px solid ${hexToRgbStr(c.accent,.2)}}
td{padding:7px;border-bottom:1px solid ${hexToRgbStr(c.accent,.08)};color:var(--text-secondary)}
tr:hover td{background:${hexToRgbStr(c.accent,.05)}}
code{background:${hexToRgbStr(c.accent,.1)};padding:3px 6px;border-radius:5px;color:${c.accent2};font-family:'Space Grotesk',monospace;font-size:10px;border:1px solid ${hexToRgbStr(c.accent2,.15)}
.live-logs{background:${hexToRgbStr(c.bgPrimary,.95)};border:1px solid ${hexToRgbStr(c.accent,.2)};border-radius:14px;padding:10px;max-height:450px;overflow-y:auto;font-family:'Space Grotesk',monospace;font-size:10px}
.log-entry{padding:6px 7px;border-bottom:1px solid ${hexToRgbStr(c.accent,.08)};display:flex;gap:8px;flex-wrap:wrap;transition:var(--tr);border-radius:6px;align-items:center}
.log-entry:hover{background:${hexToRgbStr(c.accent,.08)}}
.log-time{color:var(--text-muted);font-size:9px}
.log-key{color:${c.accent};font-weight:700}
.log-endpoint{color:${c.accent2}}
.log-ip{color:${c.info}}
.log-device{color:${c.pink}}
.log-browser{color:${c.purple}}
.toast{position:fixed;top:18px;right:18px;z-index:99999;padding:13px 20px;border-radius:12px;color:#fff;font-weight:600;font-size:12px;animation:slideIn .4s ease;max-width:400px;backdrop-filter:blur(20px);border:1px solid}
.toast.success{background:${hexToRgbStr(c.success,.15)};border-color:${c.success};color:${c.success}}
.toast.error{background:${hexToRgbStr(c.danger,.15)};border-color:${c.danger};color:${c.danger}}
.toast.warning{background:${hexToRgbStr(c.warning,.15)};border-color:${c.warning};color:${c.warning}}
.toast.info{background:${hexToRgbStr(c.info,.15)};border-color:${c.info};color:${c.info}}
.color-picker-row{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:8px;background:${hexToRgbStr(c.accent,.05)};margin-bottom:6px}
.color-picker-row label{flex:1;font-size:11px;color:var(--text-secondary);text-transform:capitalize}
.color-picker-row input[type=color]{width:40px;height:28px;border:1px solid ${hexToRgbStr(c.accent,.3)};border-radius:6px;cursor:pointer;background:transparent}
.tabs{display:flex;gap:6px;border-bottom:1px solid ${hexToRgbStr(c.accent,.2)};margin-bottom:16px;flex-wrap:wrap}
.tab{padding:9px 16px;cursor:pointer;font-size:11px;font-weight:600;color:var(--text-muted);border-bottom:2px solid transparent;transition:var(--tr);text-transform:uppercase;letter-spacing:1px}
.tab:hover{color:var(--accent)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.preset-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.preset-card{padding:14px;border-radius:12px;cursor:pointer;border:2px solid ${hexToRgbStr(c.accent,.15)};transition:var(--tr);text-align:center;position:relative;overflow:hidden;background:${hexToRgbStr(c.bgSecondary,.6)}}
.preset-card:hover{transform:scale(1.05);border-color:var(--accent)}
.preset-card.active{border-color:var(--accent)}
.preset-name{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;margin-top:6px}
.preset-swatch{height:24px;border-radius:6px;margin-bottom:6px}
.scope-box{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:${hexToRgbStr(c.accent,.05)};border-radius:10px;border:1px solid ${hexToRgbStr(c.accent,.1)};max-height:300px;overflow-y:auto}
.scope-item{cursor:pointer;font-size:10px;display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:6px;background:${hexToRgbStr(c.accent,.08)};border:1px solid ${hexToRgbStr(c.accent,.15)}}
.scope-item.custom{color:${c.info}}
.scope-item.custom input:checked + span{color:${c.success}}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes rainbowShift{0%{background-position:0% 50%}100%{background-position:500% 50%}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@media(max-width:768px){.sidebar{width:52px;padding:8px 4px}.sidebar .sidebar-title,.sidebar-nav a span{display:none}.sidebar-nav a{justify-content:center;padding:9px 6px}.main-content{margin-left:52px;padding:10px}.stats-grid{grid-template-columns:repeat(2,1fr)}.endpoint-grid{grid-template-columns:1fr}}
</style>`;
}

// ============================================================
// LOGIN PAGE
// ============================================================
function renderLogin(){
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>BRONX V300 ULTRA | Login</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
${generateCSS()}
<style>
body{display:flex;align-items:center;justify-content:center;overflow:hidden}
.login-container{position:relative;z-index:10;width:400px;max-width:90vw}
.login-card{background:var(--bg-card);backdrop-filter:blur(20px);border:1px solid var(--border-color);border-radius:24px;padding:42px 32px;position:relative;overflow:hidden}
.login-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-rainbow);background-size:400% 400%;animation:rainbowShift 3s linear infinite}
.login-logo{text-align:center;margin-bottom:16px}
.login-logo .icon{font-size:56px;display:inline-block;animation:pulse 2s ease-in-out infinite}
.login-logo .brand{font-family:'Orbitron',sans-serif;font-size:14px;font-weight:900;letter-spacing:7px;background:var(--gradient-rainbow);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rainbowShift 3s linear infinite;margin-top:6px}
.login-title{text-align:center;font-family:'Orbitron',sans-serif;font-size:28px;font-weight:900;color:#fff;margin-bottom:6px;letter-spacing:3px}
.login-subtitle{text-align:center;color:var(--text-muted);font-size:10px;letter-spacing:5px;text-transform:uppercase;margin-bottom:28px}
.input-group{position:relative;margin-bottom:16px}
.input-group .input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--accent);font-size:14px;z-index:2}
.input-group input{width:100%;padding:14px 14px 14px 42px;background:var(--bg-primary);border:1.5px solid var(--border-color);border-radius:14px;color:#fff;font-size:13px;outline:none;transition:.4s}
.input-group input:focus{border-color:var(--accent)}
.login-btn{width:100%;padding:15px;background:var(--gradient-rainbow);background-size:500% 500%;color:#000;border:none;border-radius:14px;cursor:pointer;font-size:13px;font-weight:900;letter-spacing:4px;font-family:'Orbitron',sans-serif;animation:rainbowShift 4s ease infinite;transition:.3s}
.login-btn:hover{transform:translateY(-3px)}
.message{text-align:center;margin-top:14px;font-size:11px;font-weight:600;min-height:20px}
.login-footer{text-align:center;margin-top:20px;font-size:9px;color:var(--text-muted);letter-spacing:2px}
</style></head><body>
<div class="grid-bg"></div><canvas id="snowfall-canvas"></canvas>
<div class="login-container"><div class="login-card">
<div class="login-logo"><span class="icon">🛡️</span><div class="brand">BRONX OSINT</div></div>
<h2 class="login-title">V300 ULTRA</h2>
<p class="login-subtitle">Secure Dashboard Access</p>
<div class="input-group"><i class="fas fa-user input-icon"></i><input type="text" id="username" placeholder="Username" autocomplete="off"></div>
<div class="input-group"><i class="fas fa-lock input-icon"></i><input type="password" id="password" placeholder="Password" autocomplete="off"></div>
<button class="login-btn" onclick="login()"><i class="fas fa-shield-halved"></i> AUTHENTICATE</button>
<div class="message" id="message"></div>
<div class="login-footer">Powered by <span style="background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700">@BRONX_ULTRA</span></div>
</div></div>
<script>
const sc=document.getElementById('snowfall-canvas'),sctx=sc.getContext('2d');sc.width=window.innerWidth;sc.height=window.innerHeight;
const colors=['255,45,45','0,255,136','255,149,0','255,45,149','0,229,255','191,0,255','255,230,0'];
const snow=[];for(let i=0;i<100;i++)snow.push({x:Math.random()*sc.width,y:Math.random()*sc.height,s:Math.random()*3+1,sp:Math.random()*1+.3,w:Math.random()*.5-.25,o:Math.random()*.6+.2,c:colors[Math.floor(Math.random()*colors.length)]});
function as(){sctx.clearRect(0,0,sc.width,sc.height);snow.forEach(s=>{s.y+=s.sp;s.x+=s.w;if(s.y>sc.height){s.y=-5;s.x=Math.random()*sc.width}if(s.x<0)s.x=sc.width;if(s.x>sc.width)s.x=0;sctx.beginPath();sctx.arc(s.x,s.y,s.s,0,Math.PI*2);sctx.fillStyle='rgba('+s.c+','+s.o+')';sctx.shadowBlur=10;sctx.shadowColor='rgba('+s.c+',0.8)';sctx.fill();sctx.shadowBlur=0});requestAnimationFrame(as)}as();
async function login(){
const u=document.getElementById('username').value.trim(),p=document.getElementById('password').value.trim(),m=document.getElementById('message');
if(!u||!p){m.style.color='#ff9500';m.innerHTML='<i class="fas fa-exclamation-triangle"></i> Fill all fields';return}
m.style.color='#ff2d2d';m.innerHTML='<i class="fas fa-spinner fa-spin"></i> Authenticating...';
try{const r=await fetch('${ADMIN_PATH}/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});const d=await r.json();
if(d.success){m.style.color='#00ff88';m.innerHTML='<i class="fas fa-check-circle"></i> '+d.message;setTimeout(()=>location.href=d.redirect,600)}
else{m.style.color='#ff2d2d';m.innerHTML='<i class="fas fa-times-circle"></i> '+d.error}}catch(e){m.style.color='#ff2d2d';m.innerHTML='<i class="fas fa-plug"></i> Connection error'}}
document.addEventListener('keydown',e=>{if(e.key==='Enter')login()});
</script></body></html>`;
}

// ============================================================
// HOME PAGE
// ============================================================
function renderHome(){
  const vapi = customAPIs.filter(a => a.visible);
  let cards = '';
  Object.entries(endpoints).forEach(([n,e]) => {
    cards += `<div class="endpoint-card" onclick="copyEndpoint('${esc(n)}','${esc(e.p)}','${esc(e.e)}')">
      <div class="ep-icon">${e.i}</div><div class="ep-name">/${esc(n)}</div>
      <div class="ep-desc">${e.d}</div>
      <div class="ep-url">GET /api/key-bronx/${n}?key=KEY&${e.p}=${e.e}</div></div>`;
  });
  vapi.forEach(a => {
    cards += `<div class="endpoint-card" onclick="copyCustom('${esc(a.endpoint)}','${esc(a.param)}','${esc(a.example)}')">
      <div class="ep-icon">🔧</div><div class="ep-name">/${esc(a.endpoint)}</div>
      <div class="ep-desc">Custom API</div>
      <div class="ep-url">GET /api/custom/${a.endpoint}?key=KEY&${a.param}=${a.example||'v'}</div></div>`;
  });
  const announcementHTML = announcement.enabled ? `<div style="position:fixed;top:0;left:0;right:0;z-index:9999;padding:10px 20px;text-align:center;font-size:12px;font-weight:600;letter-spacing:1px;background:var(--gradient-primary);color:#fff">📢 ${esc(announcement.text)}</div>` : '';
  const maintenanceHTML = maintenance.enabled ? `<div style="position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;padding:40px;text-align:center"><div style="font-size:80px">🔧</div><h1 style="font-family:Orbitron,sans-serif;color:#ff9500;font-size:32px;letter-spacing:4px">MAINTENANCE MODE</h1><p style="color:#fff;font-size:14px">${esc(maintenance.message)}</p></div>` : '';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>BRONX OSINT V300 ULTRA</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
${generateCSS()}
<style>
.topnav{position:sticky;top:0;z-index:1000;background:${hexToRgbStr(theme.colors.bgSecondary,.95)};backdrop-filter:blur(20px);border-bottom:1px solid ${hexToRgbStr(theme.colors.accent,.2)};padding:14px 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.brand{font-family:'Orbitron',sans-serif;font-size:15px;font-weight:900;letter-spacing:5px;background:var(--gradient-rainbow);background-size:500% 500%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rainbowShift 3s linear infinite;text-decoration:none}
.nav-links{display:flex;gap:10px;align-items:center}
.nav-links a{color:var(--text-secondary);text-decoration:none;font-size:11px;font-weight:600;padding:8px 14px;border-radius:10px;transition:var(--tr);border:1px solid transparent;letter-spacing:1px}
.nav-links a:hover{color:var(--accent);border-color:var(--border-color);background:${hexToRgbStr(theme.colors.accent,.08)}}
.hero{text-align:center;padding:60px 20px 40px;position:relative;z-index:10}
.hero h1{font-size:clamp(34px,7vw,60px);font-weight:900;background:var(--gradient-ultra);background-size:500% 500%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Orbitron',sans-serif;animation:rainbowShift 4s linear infinite;margin-bottom:12px;filter:drop-shadow(0 0 30px ${hexToRgbStr(theme.colors.accent,.5)})}
.hero p{color:var(--text-muted);font-size:11px;letter-spacing:5px;text-transform:uppercase}
.container{max-width:1400px;margin:0 auto;padding:20px;position:relative;z-index:10}
.footer{text-align:center;padding:24px;border-top:1px solid ${hexToRgbStr(theme.colors.accent,.15)};position:relative;z-index:10}
.footer span{font-weight:900;background:var(--gradient-rainbow);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Orbitron',sans-serif;letter-spacing:3px;animation:rainbowShift 4s linear infinite}
</style></head><body>
<div class="grid-bg"></div><canvas id="snowfall-canvas"></canvas>
${announcementHTML}${maintenanceHTML}
<nav class="topnav">
<a href="/" class="brand">🛡️ BRONX V300 ULTRA</a>
<div class="nav-links">
<a href="/test"><i class="fas fa-heartbeat"></i> STATUS</a>
<span style="padding:4px 12px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:2px;background:${hexToRgbStr(theme.colors.success,.1)};color:${theme.colors.success};border:1px solid ${hexToRgbStr(theme.colors.success,.3)}">🟢 ONLINE</span>
</div>
</nav>
<header class="hero"><h1>BRONX OSINT V300</h1><p>Ultra Op · Smart DDoS · Live Theme · Full Fixed</p></header>
<div class="container"><div class="endpoint-grid">${cards}</div></div>
<footer class="footer"><span>BRONX OSINT V300 ULTRA OP 🛡️</span></footer>
<script>
function copyEndpoint(n,p,e){navigator.clipboard.writeText(location.origin+'/api/key-bronx/'+n+'?key=YOUR_KEY&'+p+'='+e).then(()=>showToast('✅ Copied')).catch(()=>showToast('⚠ Failed','error'));}
function copyCustom(n,p,e){navigator.clipboard.writeText(location.origin+'/api/custom/'+n+'?key=YOUR_KEY&'+p+'='+(e||'v')).then(()=>showToast('✅ Copied')).catch(()=>showToast('⚠ Failed','error'));}
function showToast(m,t='success'){const x=document.createElement('div');x.className='toast '+t;x.innerHTML=m;document.body.appendChild(x);setTimeout(()=>x.remove(),3000);}
const sc=document.getElementById('snowfall-canvas'),sctx=sc.getContext('2d');sc.width=window.innerWidth;sc.height=window.innerHeight;
const colors=['255,45,45','0,255,136','255,149,0','255,45,149','0,229,255','191,0,255','255,230,0'];
const snow=[];for(let i=0;i<100;i++)snow.push({x:Math.random()*sc.width,y:Math.random()*sc.height,s:Math.random()*3+1,sp:Math.random()*1+.3,w:Math.random()*.5-.25,o:Math.random()*.6+.2,c:colors[Math.floor(Math.random()*colors.length)]});
function as(){sctx.clearRect(0,0,sc.width,sc.height);snow.forEach(s=>{s.y+=s.sp;s.x+=s.w;if(s.y>sc.height){s.y=-5;s.x=Math.random()*sc.width}if(s.x<0)s.x=sc.width;if(s.x>sc.width)s.x=0;sctx.beginPath();sctx.arc(s.x,s.y,s.s,0,Math.PI*2);sctx.fillStyle='rgba('+s.c+','+s.o+')';sctx.shadowBlur=10;sctx.shadowColor='rgba('+s.c+',0.8)';sctx.fill();sctx.shadowBlur=0});requestAnimationFrame(as)}as();
</script></body></html>`;
}

// ============================================================
// ADMIN PANEL
// ============================================================
function renderAdmin(token){
  try{
    const stoken = esc(token);
    const themesList = Object.keys(PRESETS);
    const allKeys = Object.entries(keyStorage).filter(([k,d]) => !d._hardcoded && !d.hidden).map(([k,d]) => ({
      key:k, name:d.name||'?', limit:d.unlimited?'∞':d.limit, used:d.used||0,
      left:d.unlimited?'∞':Math.max(0,(d.limit||0)-(d.used||0)),
      dailyLimit:d.dailyLimit||0, perSecondLimit:d.perSecondLimit||0,
      expiry:d.expiryStr||'Lifetime', isExpired:d.expiry ? isKeyExpired(d.expiry) : false,
      scopes:d.scopes||[], cooldown:d.cooldown||0, created:d.created||'',
      stopped:d.stopped||false, disabled:d.disabled||false, notes:d.notes||'',
      formatMode:d.formatMode||'json',
      devName: developerConfig.perKeyNames[k] || ''
    }));

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>BRONX V300 ADMIN</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
${generateCSS()}
</head><body>
<div class="grid-bg"></div><canvas id="snowfall-canvas"></canvas>
<div class="admin-container">
<div class="sidebar">
<div class="sidebar-header"><div class="sidebar-logo">🛡️</div><div class="sidebar-title">BRONX V300</div></div>
<ul class="sidebar-nav">
<li><a class="active" onclick="switchSection('dashboard',this)"><i class="fas fa-chart-pie"></i><span>Dashboard</span></a></li>
<li><a onclick="switchSection('generate',this)"><i class="fas fa-plus-circle"></i><span>Generate Key</span></a></li>
<li><a onclick="switchSection('keys',this)"><i class="fas fa-key"></i><span>All Keys</span></a></li>
<li><a onclick="switchSection('endpoints',this)"><i class="fas fa-list"></i><span>Endpoints</span></a></li>
<li><a onclick="switchSection('responses',this)"><i class="fas fa-code"></i><span>Edit Responses</span></a></li>
<li><a onclick="switchSection('monitor',this)"><i class="fas fa-desktop"></i><span>Live Monitor</span></a></li>
<li><a onclick="switchSection('stats',this)"><i class="fas fa-chart-bar"></i><span>Statistics</span></a></li>
<li><a onclick="switchSection('theme',this)"><i class="fas fa-palette"></i><span>🎨 Live Theme</span></a></li>
<li><a onclick="switchSection('developer',this)"><i class="fas fa-user-tag"></i><span>👨‍💻 Developer Mode</span></a></li>
<li><a onclick="switchSection('hidewords',this)"><i class="fas fa-eye-slash"></i><span>🙈 Hide Words</span></a></li>
<li><a onclick="switchSection('import',this)"><i class="fas fa-download"></i><span>Import</span></a></li>
<li><a onclick="switchSection('export',this)"><i class="fas fa-upload"></i><span>Export (Full)</span></a></li>
<li><a onclick="switchSection('scopes',this)"><i class="fas fa-crosshairs"></i><span>Update Scopes</span></a></li>
<li><a onclick="switchSection('protect',this)"><i class="fas fa-shield-alt"></i><span>Protection</span></a></li>
<li><a onclick="switchSection('apis',this)"><i class="fas fa-plug"></i><span>Custom APIs</span></a></li>
<li><a onclick="switchSection('addapi',this)"><i class="fas fa-puzzle-piece"></i><span>Add API</span></a></li>
<li><a onclick="switchSection('ddos',this)"><i class="fas fa-shield-virus"></i><span>Smart DDoS</span></a></li>
<li><a onclick="switchSection('bans',this)"><i class="fas fa-ban"></i><span>Bans Manager</span></a></li>
<li><a onclick="switchSection('devices',this)"><i class="fas fa-laptop"></i><span>Devices</span></a></li>
<li><a onclick="switchSection('announce',this)"><i class="fas fa-bullhorn"></i><span>Announcement</span></a></li>
<li><a onclick="switchSection('maintenance',this)"><i class="fas fa-wrench"></i><span>Maintenance</span></a></li>
<li><a onclick="switchSection('audit',this)"><i class="fas fa-clipboard-list"></i><span>Audit Log</span></a></li>
<li><a onclick="switchSection('adminlogs',this)"><i class="fas fa-history"></i><span>Admin Logs</span></a></li>
<li><a onclick="switchSection('backup',this)"><i class="fas fa-database"></i><span>Backup</span></a></li>
<li><a onclick="switchSection('settings',this)"><i class="fas fa-cog"></i><span>Settings</span></a></li>
</ul>
</div>
<div class="main-content">
<div class="stats-grid">
<div class="stat-card"><div class="stat-icon">🔑</div><div class="stat-value" id="hdKeys">${allKeys.length}</div><div class="stat-label">Keys</div></div>
<div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value" id="statToday">-</div><div class="stat-label">Today</div></div>
<div class="stat-card"><div class="stat-icon">📈</div><div class="stat-value" id="statTotal">-</div><div class="stat-label">Total</div></div>
<div class="stat-card"><div class="stat-icon">🚫</div><div class="stat-value" id="statBans">-</div><div class="stat-label">Bans</div></div>
<div class="stat-card"><div class="stat-icon">📱</div><div class="stat-value" id="statDevices">-</div><div class="stat-label">Devices</div></div>
<div class="stat-card"><div class="stat-icon">🔧</div><div class="stat-value" id="hdAPIs">${customAPIs.length}</div><div class="stat-label">Custom APIs</div></div>
</div>

<!-- DASHBOARD -->
<div class="glow-card" id="section-dashboard">
<h3><i class="fas fa-fire"></i> Overview</h3>
<div class="stats-grid">
<div class="stat-card"><div class="stat-value" id="dashToday">-</div><div class="stat-label">Today</div></div>
<div class="stat-card"><div class="stat-value" id="dashWeek">-</div><div class="stat-label">Week</div></div>
<div class="stat-card"><div class="stat-value" id="dashMonth">-</div><div class="stat-label">Month</div></div>
<div class="stat-card"><div class="stat-value" id="dashTotal">-</div><div class="stat-label">Total</div></div>
</div>
<h3 style="margin-top:18px"><i class="fas fa-trophy"></i> Top Keys</h3>
<div class="table-container"><table><thead><tr><th>Key</th><th>Requests</th></tr></thead><tbody id="topKeysBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-globe"></i> Top IPs</h3>
<div class="table-container"><table><thead><tr><th>IP</th><th>Requests</th></tr></thead><tbody id="topIPsBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-mobile-alt"></i> Top Devices</h3>
<div class="table-container"><table><thead><tr><th>Device</th><th>Requests</th></tr></thead><tbody id="topDevicesBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-chart-line"></i> Top Endpoints</h3>
<div class="table-container"><table><thead><tr><th>Endpoint</th><th>Requests</th></tr></thead><tbody id="topEpDash"></tbody></table></div>
</div>

<!-- GENERATE -->
<div class="glow-card" id="section-generate" style="display:none">
<h3><i class="fas fa-wand-magic-sparkles"></i> Generate New Key</h3>
<div class="form-group"><label>Key ID (empty = random)</label><input class="form-input" id="gk" placeholder="MY_KEY or empty"></div>
<button class="btn-primary btn-warning" onclick="randomKey()" style="margin-bottom:12px;width:100%"><i class="fas fa-dice"></i> 🎲 RANDOM</button>
<div class="form-group"><label>Owner Name</label><input class="form-input" id="go" placeholder="Client Name"></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
<div class="form-group"><label>Total Limit</label><input class="form-input" id="gl" type="number" value="100"></div>
<div class="form-group"><label>Daily (0=∞)</label><input class="form-input" id="gdl" type="number" value="0"></div>
<div class="form-group"><label>Per Sec (0=∞)</label><input class="form-input" id="gpsl" type="number" value="0"></div>
</div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
<div class="form-group"><label>Cooldown (s)</label><input class="form-input" id="gc" type="number" value="0"></div>
<div class="form-group"><label>Days Valid</label><input class="form-input" id="gd" type="number" value="30"></div>
</div>
<div class="form-group"><label>Notes</label><input class="form-input" id="gnotes" placeholder="Optional notes"></div>
<div class="form-group"><label>📋 Response Format</label>
<select class="form-input" id="gformat">
<option value="json">🔷 JSON (Normal)</option>
<option value="styled">✨ Styled (Emoji + Text)</option>
<option value="op_look">🔥 OP Look (Ultra Stylish)</option>
</select></div>
<div class="form-group"><label>👨‍💻 Custom Developer Name (optional)</label>
<input class="form-input" id="gdevname" placeholder="@BRONX_ULTRA (leave empty for global)">
<small style="font-size:10px;color:var(--text-muted)">Only this key's response will show this name</small></div>
<div class="form-group"><label>Scopes</label>
<div class="scope-box" id="scopeBoxGenerate">
<label class="scope-item"><input type="checkbox" value="*" id="scope-all" checked> <span>🌟 ALL ACCESS</span></label>
</div></div>
<button class="btn-primary" onclick="generateKey()" style="width:100%"><i class="fas fa-rocket"></i> GENERATE KEY</button>
</div>

<!-- KEYS -->
<div class="glow-card" id="section-keys" style="display:none">
<h3><i class="fas fa-key"></i> All Keys (<span id="keysCount">${allKeys.length}</span>)</h3>
<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
<input class="form-input" id="keysFilter" placeholder="🔍 Filter by name/key" style="flex:1;min-width:200px" oninput="filterKeys()">
<button class="btn-primary" onclick="location.reload()" style="padding:10px 16px"><i class="fas fa-sync"></i></button>
</div>
<div class="table-container" style="max-height:650px">
<table>
<thead><tr><th>KEY</th><th>OWNER</th><th>LIMIT</th><th>USED</th><th>LEFT</th><th>EXPIRY</th><th>FORMAT</th><th>DEV</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
<tbody id="keysBody"></tbody>
</table>
</div>
</div>

<!-- ENDPOINTS -->
<div class="glow-card" id="section-endpoints" style="display:none">
<h3><i class="fas fa-list"></i> Endpoints (${Object.keys(endpoints).length})</h3>
<div class="endpoint-grid" id="endpointsList"></div>
</div>

<!-- RESPONSES -->
<div class="glow-card" id="section-responses" style="display:none">
<h3><i class="fas fa-code"></i> Edit Endpoint Responses</h3>
<div class="form-group"><label>Endpoint</label>
<select class="form-input" id="responseEndpoint" onchange="loadResponse()">
${Object.keys(endpoints).map(e => `<option value="${e}">${endpoints[e].d} (/${e})</option>`).join('')}
</select></div>
<div class="form-group"><label>Response JSON (empty = default)</label>
<textarea class="form-input" id="responseData" rows="10" style="font-family:'Space Grotesk',monospace;font-size:11px"></textarea></div>
<button class="btn-primary" onclick="updateResponse()" style="width:100%"><i class="fas fa-save"></i> SAVE</button>
</div>

<!-- MONITOR -->
<div class="glow-card" id="section-monitor" style="display:none">
<h3><i class="fas fa-desktop"></i> Live Monitor</h3>
<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
<input class="form-input" id="monitorFilter" placeholder="🔍 Filter" style="flex:1;min-width:200px" oninput="renderMonitor()">
<button class="btn-primary" onclick="loadMonitorLogs()" style="padding:10px 16px"><i class="fas fa-sync"></i></button>
</div>
<div class="live-logs" id="monitorLogs"></div>
</div>

<!-- STATS -->
<div class="glow-card" id="section-stats" style="display:none">
<h3><i class="fas fa-chart-bar"></i> Statistics</h3>
<div class="stats-grid">
<div class="stat-card"><div class="stat-value" id="statTotalReqs">-</div><div class="stat-label">Total</div></div>
<div class="stat-card"><div class="stat-value" id="statTodayReqs">-</div><div class="stat-label">Today</div></div>
<div class="stat-card"><div class="stat-value" id="statWeekReqs">-</div><div class="stat-label">Week</div></div>
<div class="stat-card"><div class="stat-value" id="statMonthReqs">-</div><div class="stat-label">Month</div></div>
</div>
<h3><i class="fas fa-chart-pie"></i> Endpoints</h3>
<div class="table-container"><table><thead><tr><th>Endpoint</th><th>Requests</th></tr></thead><tbody id="topEndpointsBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-laptop"></i> Clients</h3>
<div class="table-container"><table><thead><tr><th>Client</th><th>Requests</th></tr></thead><tbody id="clientStatsBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-globe"></i> Browsers</h3>
<div class="table-container"><table><thead><tr><th>Browser</th><th>Requests</th></tr></thead><tbody id="browserStatsBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-flag"></i> Countries</h3>
<div class="table-container"><table><thead><tr><th>Country</th><th>Requests</th></tr></thead><tbody id="countryStatsBody"></tbody></table></div>
<h3 style="margin-top:18px"><i class="fas fa-microchip"></i> OS</h3>
<div class="table-container"><table><thead><tr><th>OS</th><th>Count</th></tr></thead><tbody id="osStatsBody"></tbody></table></div>
</div>

<!-- THEME -->
<div class="glow-card" id="section-theme" style="display:none">
<h3><i class="fas fa-palette"></i> 🎨 Live Theme Changer</h3>
<div class="tabs">
<div class="tab active" onclick="switchTab('presets',this)">Presets (20+)</div>
<div class="tab" onclick="switchTab('colors',this)">Colors</div>
<div class="tab" onclick="switchTab('effects',this)">Effects</div>
</div>
<div id="themeTab-presets">
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Click any preset — applies LIVE, no reload!</p>
<div class="preset-grid" id="presetsGrid">
${themesList.map(name => `<div class="preset-card" data-preset="${name}" onclick="applyPresetByName('${name}')"><div class="preset-swatch" style="background:linear-gradient(135deg,${PRESETS[name].accent},${PRESETS[name].accent2})"></div><div class="preset-name">${name}</div></div>`).join('')}
</div>
</div>
<div id="themeTab-colors" style="display:none">
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Custom colors — apply live!</p>
<div id="colorPickers"></div>
<button class="btn-primary" onclick="saveCustomColors()" style="width:100%;margin-top:12px"><i class="fas fa-save"></i> SAVE COLORS</button>
</div>
<div id="themeTab-effects" style="display:none">
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Toggle visual effects</p>
<div id="effectsList"></div>
<button class="btn-primary" onclick="saveEffects()" style="width:100%;margin-top:12px"><i class="fas fa-save"></i> SAVE EFFECTS</button>
</div>
<button class="btn-primary btn-warning" onclick="resetTheme()" style="width:100%;margin-top:16px"><i class="fas fa-undo"></i> RESET TO DEFAULT</button>
</div>

<!-- DEVELOPER MODE -->
<div class="glow-card" id="section-developer" style="display:none">
<h3><i class="fas fa-user-tag"></i> 👨‍💻 Custom Developer Mode</h3>
<div class="glow-card" style="background:${hexToRgbStr(theme.colors.info,.05)};border:1px solid ${hexToRgbStr(theme.colors.info,.2)}">
<h4 style="color:${theme.colors.info};margin-bottom:10px"><i class="fas fa-globe"></i> Global Developer Name</h4>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">This name will appear in ALL responses (except key-specific overrides)</p>
<div class="form-group"><label>Global Name</label><input class="form-input" id="globalDevName" placeholder="@BRONX_ULTRA"></div>
<button class="btn-primary" onclick="updateGlobalDev()"><i class="fas fa-save"></i> UPDATE GLOBAL</button>
<p style="margin-top:10px;font-size:11px;color:var(--text-muted)">Current: <strong id="currentGlobalDev" style="color:${theme.colors.success}">${esc(developerConfig.globalName)}</strong></p>
</div>
<div class="glow-card" style="background:${hexToRgbStr(theme.colors.purple,.05)};border:1px solid ${hexToRgbStr(theme.colors.purple,.2)};margin-top:16px">
<h4 style="color:${theme.colors.purple};margin-bottom:10px"><i class="fas fa-key"></i> Per-Key Developer Name</h4>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Override developer name for specific keys. Leave empty to use global.</p>
<div class="form-group"><label>Key</label><input class="form-input" id="keyDevKey" placeholder="Enter key name"></div>
<div class="form-group"><label>Custom Developer Name</label><input class="form-input" id="keyDevName" placeholder="@custom_name (empty = remove)"></div>
<button class="btn-primary" onclick="updateKeyDev()"><i class="fas fa-save"></i> UPDATE KEY DEV</button>
<div style="margin-top:16px">
<h4 style="color:${theme.colors.accent2};margin-bottom:10px;font-size:13px"><i class="fas fa-list"></i> Existing Overrides</h4>
<div class="table-container" style="max-height:300px">
<table><thead><tr><th>Key</th><th>Custom Developer</th><th>Action</th></tr></thead>
<tbody id="keyDevOverrides"></tbody></table>
</div>
</div>
</div>
</div>

<!-- HIDE WORDS -->
<div class="glow-card" id="section-hidewords" style="display:none">
<h3><i class="fas fa-eye-slash"></i> 🙈 Hide Words from Response</h3>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">These words will be REMOVED from all API responses (keys & values). Example: Developer, Owner, Channel, Src, By</p>
<div class="form-group"><label>Add Word</label>
<div style="display:flex;gap:8px">
<input class="form-input" id="hideWordInput" placeholder="e.g. Developer" style="flex:1">
<button class="btn-primary" onclick="addHiddenWord()"><i class="fas fa-plus"></i> ADD</button>
</div>
</div>
<div style="margin-top:16px">
<h4 style="color:${theme.colors.accent2};margin-bottom:10px;font-size:13px"><i class="fas fa-list"></i> Currently Hidden Words</h4>
<div id="hiddenWordsList" style="display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:${hexToRgbStr(theme.colors.accent,.05)};border-radius:10px;min-height:60px"></div>
</div>
</div>

<!-- IMPORT -->
<div class="glow-card" id="section-import" style="display:none">
<h3><i class="fas fa-download"></i> Import (Full Data)</h3>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Paste the FULL export JSON here. This will restore: Keys + Custom APIs + Theme + DDoS + Developer + Hide Words + Protected Data + Everything!</p>
<textarea class="form-input" id="importData" rows="12" placeholder='{"version":"V300_ULTRA_OP","keys":{...},"customAPIs":[...]}' style="font-family:'Space Grotesk',monospace;font-size:11px"></textarea>
<button class="btn-primary" onclick="importKeys()" style="width:100%;margin-top:12px"><i class="fas fa-download"></i> IMPORT EVERYTHING</button>
<p id="importMsg" style="margin-top:10px;text-align:center;font-size:12px"></p>
</div>

<!-- EXPORT -->
<div class="glow-card" id="section-export" style="display:none">
<h3><i class="fas fa-upload"></i> Export (Full Data)</h3>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Exports EVERYTHING: Keys + Custom APIs + Theme + DDoS + Developer + Hide Words + All Settings</p>
<div style="display:flex;gap:12px;margin-bottom:12px">
<button class="btn-primary" onclick="loadExport()" style="flex:1"><i class="fas fa-sync"></i> LOAD FULL DATA</button>
<button class="btn-primary btn-success" onclick="copyExport()" style="flex:1"><i class="fas fa-copy"></i> COPY</button>
<button class="btn-primary btn-info" onclick="downloadExport()" style="flex:1"><i class="fas fa-file-download"></i> DOWNLOAD</button>
</div>
<textarea class="form-input" id="exportData" rows="12" readonly style="color:${theme.colors.success};font-family:'Space Grotesk',monospace;font-size:11px"></textarea>
</div>

<!-- SCOPES -->
<div class="glow-card" id="section-scopes" style="display:none">
<h3><i class="fas fa-crosshairs"></i> Update Key Scopes</h3>
<div class="form-group"><label>Key Name</label><input class="form-input" id="sk" placeholder="Enter key"></div>
<div class="form-group"><label>Scopes</label>
<div class="scope-box" id="scopeBoxUpdate">
<label class="scope-item"><input type="checkbox" value="*" id="scope-all2"> <span>🌟 ALL</span></label>
</div></div>
<button class="btn-primary" onclick="updateScopes()" style="width:100%"><i class="fas fa-save"></i> UPDATE</button>
</div>

<!-- PROTECT -->
<div class="glow-card" id="section-protect" style="display:none">
<h3><i class="fas fa-shield-alt"></i> Data Protection</h3>
<div class="form-group"><label>Value to Protect</label><input class="form-input" id="protVal" placeholder="e.g. 9876543210"></div>
<button class="btn-primary" onclick="addProtection()" style="width:100%"><i class="fas fa-lock"></i> ADD</button>
<div class="table-container" style="margin-top:18px" id="protectList"></div>
</div>

<!-- APIS -->
<div class="glow-card" id="section-apis" style="display:none">
<h3><i class="fas fa-plug"></i> Custom APIs (<span id="apiCount">${customAPIs.length}</span>)</h3>
<div class="table-container" style="max-height:500px">
<table><thead><tr><th>ID</th><th>Name</th><th>Endpoint</th><th>Scope Key</th><th>Param</th><th>Vis</th><th>Actions</th></tr></thead><tbody id="apisBody"></tbody></table>
</div>
</div>

<!-- ADD API -->
<div class="glow-card" id="section-addapi" style="display:none">
<h3><i class="fas fa-puzzle-piece"></i> Add Custom API</h3>
<div class="form-group"><label>Name</label><input class="form-input" id="aname" placeholder="My API"></div>
<div class="form-group"><label>Endpoint (lowercase, no spaces)</label><input class="form-input" id="aep" placeholder="my-api"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div class="form-group"><label>Param</label><input class="form-input" id="aparam" value="num"></div>
<div class="form-group"><label>Example</label><input class="form-input" id="aex" placeholder="9876543210"></div>
</div>
<div class="form-group"><label>Real URL ({param})</label><input class="form-input" id="aurl" placeholder="https://api.com?param={param}"></div>
<button class="btn-primary" onclick="addAPI()" style="width:100%"><i class="fas fa-plus"></i> ADD API</button>
</div>

<!-- DDOS -->
<div class="glow-card" id="section-ddos" style="display:none">
<h3><i class="fas fa-shield-virus"></i> Smart DDoS Config</h3>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">✅ Settings are SAVED to disk — will persist after refresh!</p>
<div class="form-group"><label>Mode</label>
<select class="form-input" id="ddosMode">
<option value="off">🔴 Off</option>
<option value="smart">🟢 Smart (Recommended)</option>
<option value="strict">🟠 Strict</option>
</select></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
<div class="form-group"><label>IP Burst/10s</label><input class="form-input" id="ddosIP10" type="number" value="${ddosConfig.ip.burst10s}"></div>
<div class="form-group"><label>IP/Min</label><input class="form-input" id="ddosIP1M" type="number" value="${ddosConfig.ip.perMinute}"></div>
<div class="form-group"><label>IP/Hour</label><input class="form-input" id="ddosIP1H" type="number" value="${ddosConfig.ip.perHour}"></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
<div class="form-group"><label>Device Burst/10s</label><input class="form-input" id="ddosDEV10" type="number" value="${ddosConfig.device.burst10s}"></div>
<div class="form-group"><label>Device/Min</label><input class="form-input" id="ddosDEV1M" type="number" value="${ddosConfig.device.perMinute}"></div>
<div class="form-group"><label>Device/Hour</label><input class="form-input" id="ddosDEV1H" type="number" value="${ddosConfig.device.perHour}"></div>
</div>
<button class="btn-primary" onclick="saveDDoSConfig()" style="width:100%;margin-top:12px"><i class="fas fa-save"></i> SAVE DDoS CONFIG</button>
</div>

<!-- BANS -->
<div class="glow-card" id="section-bans" style="display:none">
<h3><i class="fas fa-ban"></i> Bans Manager</h3>
<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
<button class="btn-primary btn-danger" onclick="unbanAll()"><i class="fas fa-broom"></i> UNBAN ALL</button>
<button class="btn-primary" onclick="loadBans()"><i class="fas fa-sync"></i> REFRESH</button>
</div>
<h4 style="color:${theme.colors.danger};margin-bottom:10px">IP Bans</h4>
<div class="table-container" style="max-height:300px"><table><thead><tr><th>IP</th><th>Reason</th><th>Time</th><th>Status</th><th>Action</th></tr></thead><tbody id="bansIPBody"></tbody></table></div>
</div>

<!-- DEVICES -->
<div class="glow-card" id="section-devices" style="display:none">
<h3><i class="fas fa-laptop"></i> Tracked Devices</h3>
<button class="btn-primary" onclick="loadDevices()" style="margin-bottom:12px"><i class="fas fa-sync"></i> REFRESH</button>
<div class="table-container" style="max-height:600px">
<table><thead><tr><th>Device ID</th><th>Type</th><th>Browser</th><th>OS</th><th>Requests</th><th>Last Seen</th><th>Action</th></tr></thead><tbody id="devicesBody"></tbody></table>
</div>
</div>

<!-- ANNOUNCEMENT -->
<div class="glow-card" id="section-announce" style="display:none">
<h3><i class="fas fa-bullhorn"></i> Announcement Banner</h3>
<div class="form-group"><label>Enable</label>
<select class="form-input" id="announceEnabled"><option value="true">✅ ON</option><option value="false">❌ OFF</option></select></div>
<div class="form-group"><label>Message</label><input class="form-input" id="announceText" placeholder="Important announcement..."></div>
<div class="form-group"><label>Type</label>
<select class="form-input" id="announceType">
<option value="info">ℹ️ Info</option><option value="warning">⚠️ Warning</option><option value="success">✅ Success</option><option value="danger">🚨 Danger</option>
</select></div>
<button class="btn-primary" onclick="saveAnnouncement()" style="width:100%"><i class="fas fa-save"></i> SAVE</button>
</div>

<!-- MAINTENANCE -->
<div class="glow-card" id="section-maintenance" style="display:none">
<h3><i class="fas fa-wrench"></i> Maintenance Mode</h3>
<div class="form-group"><label>Enable</label>
<select class="form-input" id="maintEnabled"><option value="true">🔴 ON</option><option value="false">🟢 OFF</option></select></div>
<div class="form-group"><label>Message</label><input class="form-input" id="maintMessage" placeholder="System under maintenance"></div>
<button class="btn-primary" onclick="saveMaintenance()" style="width:100%"><i class="fas fa-save"></i> SAVE</button>
</div>

<!-- AUDIT -->
<div class="glow-card" id="section-audit" style="display:none">
<h3><i class="fas fa-clipboard-list"></i> Audit Log</h3>
<button class="btn-primary" onclick="loadAudit()" style="margin-bottom:12px"><i class="fas fa-sync"></i> LOAD</button>
<div class="live-logs" id="auditLogs"></div>
</div>

<!-- ADMIN LOGS -->
<div class="glow-card" id="section-adminlogs" style="display:none">
<h3><i class="fas fa-history"></i> Admin Logs</h3>
<button class="btn-primary" onclick="loadAdminLogs()" style="margin-bottom:12px"><i class="fas fa-sync"></i> LOAD</button>
<div class="live-logs" id="adminLogs"></div>
</div>

<!-- BACKUP -->
<div class="glow-card" id="section-backup" style="display:none">
<h3><i class="fas fa-database"></i> Backup & Restore</h3>
<p style="color:var(--text-muted);font-size:11px;margin-bottom:12px">Full backup of everything — download for safety</p>
<button class="btn-primary" onclick="downloadFullBackup()" style="width:100%"><i class="fas fa-download"></i> DOWNLOAD FULL BACKUP</button>
</div>

<!-- SETTINGS -->
<div class="glow-card" id="section-settings" style="display:none">
<h3><i class="fas fa-cog"></i> System Settings</h3>
<div style="color:var(--text-muted);font-size:12px;line-height:1.8">
<p><strong>Version:</strong> V300 ULTRA OP</p>
<p><strong>Developer:</strong> <span style="color:${theme.colors.success}">${esc(developerConfig.globalName)}</span></p>
<p><strong>Total Keys:</strong> ${allKeys.length}</p>
<p><strong>Custom APIs:</strong> ${customAPIs.length}</p>
<p><strong>DDoS Mode:</strong> <span style="color:${theme.colors.info}">${ddosConfig.mode}</span></p>
<p><strong>Theme:</strong> ${theme.preset}</p>
</div>
</div>

</div></div>
<script>
const TOKEN='${stoken}';
const ADMIN_PATH='${ADMIN_PATH}';
const H='{"Content-Type":"application/json","x-admin-token":"'+TOKEN+'"}';

function api(path,method='GET',body=null){
  const o={method,headers:{'Content-Type':'application/json','x-admin-token':TOKEN}};
  if(body)o.body=JSON.stringify(body);
  return fetch(ADMIN_PATH+path,o).then(r=>r.json());
}

function showToast(m,t='success'){
  const x=document.createElement('div');x.className='toast '+t;x.innerHTML=m;
  document.body.appendChild(x);setTimeout(()=>x.remove(),3500);
}

function switchSection(name,el){
  document.querySelectorAll('[id^="section-"]').forEach(s=>s.style.display='none');
  const s=document.getElementById('section-'+name);
  if(s)s.style.display='block';
  document.querySelectorAll('.sidebar-nav a').forEach(a=>a.classList.remove('active'));
  if(el)el.classList.add('active');
  if(name==='dashboard')loadDashboard();
  if(name==='keys')renderKeys();
  if(name==='monitor')loadMonitorLogs();
  if(name==='stats')loadStats();
  if(name==='theme')initThemeUI();
  if(name==='developer')loadDevOverrides();
  if(name==='hidewords')loadHiddenWords();
  if(name==='bans')loadBans();
  if(name==='devices')loadDevices();
  if(name==='ddos')loadDDoS();
  if(name==='apis')renderAPIs();
  if(name==='protect')renderProtection();
  if(name==='audit')loadAudit();
  if(name==='adminlogs')loadAdminLogs();
}

// Dashboard
function loadDashboard(){
  api('/stats').then(d=>{
    document.getElementById('dashToday').textContent=d.todayRequests||0;
    document.getElementById('dashWeek').textContent=d.weeklyRequests||0;
    document.getElementById('dashMonth').textContent=d.monthlyRequests||0;
    document.getElementById('dashTotal').textContent=d.totalRequests||0;
    document.getElementById('statToday').textContent=d.todayRequests||0;
    document.getElementById('statTotal').textContent=d.totalRequests||0;
    const th=(id,rows)=>{
      const el=document.getElementById(id);if(!el)return;
      el.innerHTML=rows.map(r=>'<tr><td><code>'+r.k+'</code></td><td><strong>'+r.v+'</strong></td></tr>').join('')||'<tr><td colspan="2" style="text-align:center;color:var(--text-muted)">No data</td></tr>';
    };
    th('topKeysBody',d.topKeys||[]);
    th('topIPsBody',d.topIPs||[]);
    th('topDevicesBody',d.topDevices||[]);
    th('topEpDash',d.topEndpoints||[]);
  }).catch(()=>{});
  api('/bans').then(d=>{
    const total=(d.ip?.length||0)+(d.device?.length||0)+(d.key?.length||0);
    document.getElementById('statBans').textContent=total;
  }).catch(()=>{});
  api('/devices').then(d=>{document.getElementById('statDevices').textContent=d.total||0;}).catch(()=>{});
}

// Generate
function randomKey(){document.getElementById('gk').value='';}
function generateKey(){
  const scopes=[...document.querySelectorAll('#scopeBoxGenerate input:checked')].map(c=>c.value);
  const body={
    keyName:document.getElementById('gk').value.trim()||null,
    keyOwner:document.getElementById('go').value.trim(),
    limit:parseInt(document.getElementById('gl').value)||100,
    dailyLimit:parseInt(document.getElementById('gdl').value)||0,
    perSecondLimit:parseInt(document.getElementById('gpsl').value)||0,
    cooldown:parseInt(document.getElementById('gc').value)||0,
    days:parseInt(document.getElementById('gd').value)||30,
    notes:document.getElementById('gnotes').value.trim(),
    formatMode:document.getElementById('gformat').value,
    customDevName:document.getElementById('gdevname').value.trim(),
    scopes:scopes.length?scopes:['*']
  };
  if(!body.keyOwner){showToast('⚠ Owner name required','error');return;}
  api('/generate-key','POST',body).then(d=>{
    if(d.success){
      showToast('✅ Key generated: '+d.key,'success');
      setTimeout(()=>location.reload(),1500);
    } else showToast('❌ '+(d.e||'Error'),'error');
  });
}

// Keys
function renderKeys(filter=''){
  api('/export-keys').then(d=>{
    const keys=d.keys||{};
    const rows=Object.entries(keys).filter(([k,v])=>!v._hardcoded&&!v.hidden).filter(([k,v])=>{
      if(!filter)return true;
      const f=filter.toLowerCase();
      return k.toLowerCase().includes(f)||(v.name||'').toLowerCase().includes(f);
    });
    const body=document.getElementById('keysBody');
    if(!body)return;
    document.getElementById('keysCount').textContent=rows.length;
    body.innerHTML=rows.map(([k,v])=>{
      const devName=v.devName||'';
      return '<tr>'+
        '<td><code style="font-size:9px">'+k.substring(0,20)+'</code></td>'+
        '<td>'+v.name+'</td>'+
        '<td>'+(v.limit||100)+'</td>'+
        '<td>'+(v.used||0)+'</td>'+
        '<td>'+Math.max(0,(v.limit||0)-(v.used||0))+'</td>'+
        '<td>'+(v.expiryStr||'∞')+'</td>'+
        '<td><span style="color:'+(v.formatMode==='op_look'?'#ff9500':v.formatMode==='styled'?'#00e5ff':'#888')+'">'+(v.formatMode||'json')+'</span></td>'+
        '<td style="font-size:9px;color:#bf00ff">'+devName+'</td>'+
        '<td>'+(v.stopped?'⛔':v.disabled?'🚫':'✅')+'</td>'+
        '<td>'+
          '<button class="btn-action btn-edit" onclick="viewKeyDev(\''+k+'\')">👨‍💻</button>'+
          '<button class="btn-action btn-reset" onclick="resetKey(\''+k+'\')">🔄</button>'+
          '<button class="btn-action btn-stop" onclick="stopKey(\''+k+'\')">⏸️</button>'+
          '<button class="btn-action btn-delete" onclick="deleteKey(\''+k+'\')">🗑️</button>'+
        '</td>'+
      '</tr>';
    }).join('')||'<tr><td colspan="10" style="text-align:center;color:var(--text-muted)">No keys</td></tr>';
  }).catch(()=>{});
}
function filterKeys(){renderKeys(document.getElementById('keysFilter').value);}
function viewKeyDev(k){document.getElementById('keyDevKey').value=k;switchSection('developer',null);document.querySelectorAll('.sidebar-nav a').forEach(a=>{if(a.textContent.includes('Developer'))a.classList.add('active');});}
function resetKey(k){api('/reset-key-usage','POST',{keyName:k}).then(()=>{showToast('✅ Reset');renderKeys();});}
function stopKey(k){api('/stop-key','POST',{keyName:k}).then(d=>{showToast('✅ '+(d.stopped?'Stopped':'Resumed'));renderKeys();});}
function deleteKey(k){if(!confirm('Delete key?'))return;api('/delete-key','POST',{keyName:k}).then(()=>{showToast('✅ Deleted');renderKeys();});}

// Developer Mode
function updateGlobalDev(){
  const name=document.getElementById('globalDevName').value.trim();
  if(!name){showToast('⚠ Name required','error');return;}
  api('/global-developer','POST',{name}).then(d=>{
    if(d.success){showToast('✅ Global updated');document.getElementById('currentGlobalDev').textContent=name;}
    else showToast('❌ '+d.e,'error');
  });
}
function updateKeyDev(){
  const keyName=document.getElementById('keyDevKey').value.trim();
  const devName=document.getElementById('keyDevName').value.trim();
  if(!keyName){showToast('⚠ Key required','error');return;}
  api('/set-key-developer','POST',{keyName,devName}).then(d=>{
    if(d.success){showToast('✅ Key dev updated');loadDevOverrides();}
    else showToast('❌ '+d.e,'error');
  });
}
function loadDevOverrides(){
  api('/export-keys').then(d=>{
    const overrides=[];
    Object.entries(d.developerConfig?.perKeyNames||{}).forEach(([k,v])=>overrides.push({k,v}));
    const body=document.getElementById('keyDevOverrides');
    if(body)body.innerHTML=overrides.map(o=>'<tr><td><code style="font-size:9px">'+o.k+'</code></td><td style="color:#bf00ff">'+o.v+'</td><td><button class="btn-action btn-delete" onclick="removeKeyDev(\''+o.k+'\')">🗑️ Remove</button></td></tr>').join('')||'<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">No overrides</td></tr>';
    // Show current dev config
    const inp=document.getElementById('globalDevName');
    if(inp&&!inp.value)inp.placeholder=d.developerConfig?.globalName||'@BRONX_ULTRA';
    const cur=document.getElementById('currentGlobalDev');
    if(cur)cur.textContent=d.developerConfig?.globalName||'@BRONX_ULTRA';
  });
}
function removeKeyDev(k){api('/set-key-developer','POST',{keyName:k,devName:''}).then(()=>{showToast('✅ Removed');loadDevOverrides();});}

// Hide Words
function loadHiddenWords(){
  api('/export-keys').then(d=>{
    const words=d.developerConfig?.hiddenWords||[];
    const list=document.getElementById('hiddenWordsList');
    if(list)list.innerHTML=words.map(w=>'<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(255,45,45,.1);border:1px solid rgba(255,45,45,.3);border-radius:8px;font-size:11px;color:#ff2d2d">'+w+' <button onclick="removeHiddenWord(\''+w+'\')" style="background:transparent;border:none;color:#ff2d2d;cursor:pointer;font-size:14px;line-height:1">×</button></span>').join('')||'<span style="color:var(--text-muted);font-size:11px">No hidden words</span>';
  });
}
function addHiddenWord(){
  const word=document.getElementById('hideWordInput').value.trim();
  if(!word){showToast('⚠ Word required','error');return;}
  api('/hidden-words/add','POST',{word}).then(d=>{
    if(d.success){showToast('✅ Added');document.getElementById('hideWordInput').value='';loadHiddenWords();}
  });
}
function removeHiddenWord(word){api('/hidden-words/remove','POST',{word}).then(()=>{showToast('✅ Removed');loadHiddenWords();});}

// DDoS
function loadDDoS(){
  api('/ddos-config').then(c=>{
    document.getElementById('ddosMode').value=c.mode||'smart';
    document.getElementById('ddosIP10').value=c.ip.burst10s;
    document.getElementById('ddosIP1M').value=c.ip.perMinute;
    document.getElementById('ddosIP1H').value=c.ip.perHour;
    document.getElementById('ddosDEV10').value=c.device.burst10s;
    document.getElementById('ddosDEV1M').value=c.device.perMinute;
    document.getElementById('ddosDEV1H').value=c.device.perHour;
  });
}
function saveDDoSConfig(){
  const body={
    mode:document.getElementById('ddosMode').value,
    enabled:document.getElementById('ddosMode').value!=='off',
    ip:{
      burst10s:parseInt(document.getElementById('ddosIP10').value),
      perMinute:parseInt(document.getElementById('ddosIP1M').value),
      perHour:parseInt(document.getElementById('ddosIP1H').value)
    },
    device:{
      burst10s:parseInt(document.getElementById('ddosDEV10').value),
      perMinute:parseInt(document.getElementById('ddosDEV1M').value),
      perHour:parseInt(document.getElementById('ddosDEV1H').value)
    }
  };
  api('/ddos-config','POST',body).then(d=>{
    if(d.success)showToast('✅ DDoS saved permanently!','success');
    else showToast('❌ Error','error');
  });
}

// Export/Import
function loadExport(){
  api('/export-keys').then(d=>{
    document.getElementById('exportData').value=JSON.stringify(d,null,2);
    showToast('✅ Loaded FULL data','success');
  });
}
function copyExport(){
  const t=document.getElementById('exportData');
  if(!t.value){showToast('⚠ Load first','warning');return;}
  navigator.clipboard.writeText(t.value).then(()=>showToast('✅ Copied!'));
}
function downloadExport(){
  const t=document.getElementById('exportData');
  if(!t.value){showToast('⚠ Load first','warning');return;}
  const blob=new Blob([t.value],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='bronx_v300_full_backup_'+Date.now()+'.json';a.click();
  URL.revokeObjectURL(url);
}
function importKeys(){
  const t=document.getElementById('importData').value.trim();
  if(!t){showToast('⚠ Paste data first','error');return;}
  let data;
  try{data=JSON.parse(t);}catch(e){showToast('❌ Invalid JSON','error');return;}
  api('/import-keys','POST',data).then(d=>{
    const msg=document.getElementById('importMsg');
    if(d.success){
      msg.style.color='#00ff88';
      msg.textContent='✅ '+d.message;
      showToast('✅ Imported! Reload page','success');
      setTimeout(()=>location.reload(),2000);
    } else {
      msg.style.color='#ff2d2d';
      msg.textContent='❌ '+d.e;
    }
  });
}

function downloadFullBackup(){loadExport();setTimeout(downloadExport,500);}

// Theme
function initThemeUI(){
  const grid=document.getElementById('presetsGrid');
  if(grid){
    document.querySelectorAll('.preset-card').forEach(c=>{
      c.classList.toggle('active',c.dataset.preset==='${theme.preset}');
    });
  }
  // Color pickers
  const cp=document.getElementById('colorPickers');
  if(cp&&!cp.innerHTML){
    const colors=['accent','accent2','success','warning','danger','info','pink','purple','yellow'];
    cp.innerHTML=colors.map(c=>'<div class="color-picker-row"><label>'+c+'</label><input type="color" id="color-'+c+'" value="'+getComputedStyle(document.documentElement).getPropertyValue('--'+c).trim()+'"></div>').join('');
  }
}
function applyPresetByName(name){
  api('/theme/preset','POST',{preset:name}).then(d=>{
    if(d.success){showToast('✅ Theme applied LIVE');location.reload();}
  });
}
function resetTheme(){if(confirm('Reset to default?'))api('/theme/reset','POST',{}).then(()=>location.reload());}
function saveCustomColors(){
  const colors={};
  ['accent','accent2','success','warning','danger','info','pink','purple','yellow'].forEach(c=>{
    const el=document.getElementById('color-'+c);
    if(el)colors[c]=el.value;
  });
  api('/theme/colors','POST',{colors}).then(()=>{showToast('✅ Colors saved');location.reload();});
}
function saveEffects(){
  const effects={};
  document.querySelectorAll('#effectsList input[type=checkbox]').forEach(c=>{effects[c.dataset.effect]=c.checked;});
  api('/theme/effects','POST',{effects}).then(()=>{showToast('✅ Effects saved');location.reload();});
}

// Bans
function loadBans(){
  api('/bans').then(d=>{
    const body=document.getElementById('bansIPBody');
    if(body)body.innerHTML=(d.ip||[]).map(b=>'<tr><td><code>'+b.id+'</code></td><td>'+(b.reason||'-')+'</td><td>'+(b.at||'-')+'</td><td>'+(b.permanent?'🚫 Permanent':'⏸️ Temp')+'</td><td><button class="btn-action btn-reset" onclick="unbanIP(\''+b.id+'\')">✅ Unban</button></td></tr>').join('')||'<tr><td colspan="5" style="text-align:center">No bans</td></tr>';
  });
}
function unbanIP(id){api('/unban','POST',{type:'ip',id}).then(()=>{showToast('✅ Unbanned');loadBans();});}
function unbanAll(){if(!confirm('Unban ALL?'))return;api('/unban-all','POST',{}).then(()=>{showToast('✅ All unbanned');loadBans();});}

// Devices
function loadDevices(){
  api('/devices').then(d=>{
    const body=document.getElementById('devicesBody');
    if(body)body.innerHTML=(d.devices||[]).slice(0,100).map(dev=>'<tr><td><code style="font-size:9px">'+dev.id.substring(0,16)+'</code></td><td>'+dev.deviceIcon+' '+dev.deviceType+'</td><td>'+dev.browser+'</td><td>'+dev.os+'</td><td><strong>'+dev.requests+'</strong></td><td style="font-size:9px">'+dev.lastSeen+'</td><td>'+(dev.banned?'🚫':'<button class="btn-action btn-stop" onclick="banDevice(\''+dev.id+'\')">Ban</button>')+'</td></tr>').join('')||'<tr><td colspan="7" style="text-align:center">No devices</td></tr>';
  });
}
function banDevice(id){api('/ban','POST',{type:'device',id,reason:'Manual ban',permanent:false,minutes:60}).then(()=>{showToast('✅ Banned');loadDevices();});}

// APIs
function renderAPIs(){
  api('/export-keys').then(d=>{
    const apis=d.customAPIs||[];
    const body=document.getElementById('apisBody');
    if(body)body.innerHTML=apis.map(a=>'<tr><td>'+a.id+'</td><td>'+a.name+'</td><td><code>'+a.endpoint+'</code></td><td><code style="font-size:9px">'+(a.scopeKey||'')+'</code></td><td>'+a.param+'</td><td>'+(a.visible?'✅':'❌')+'</td><td><button class="btn-action btn-stop" onclick="toggleAPI('+a.id+')">'+(a.visible?'Hide':'Show')+'</button><button class="btn-action btn-delete" onclick="deleteAPI('+a.id+')">🗑️</button></td></tr>').join('');
    document.getElementById('apiCount').textContent=apis.length;
  });
}
function toggleAPI(id){api('/toggle-api','POST',{id}).then(()=>{showToast('✅');renderAPIs();});}
function deleteAPI(id){if(!confirm('Delete?'))return;api('/delete-api','POST',{id}).then(()=>{showToast('✅');renderAPIs();});}
function addAPI(){
  const body={
    name:document.getElementById('aname').value.trim(),
    endpoint:document.getElementById('aep').value.trim(),
    param:document.getElementById('aparam').value.trim(),
    example:document.getElementById('aex').value.trim(),
    realAPI:document.getElementById('aurl').value.trim()
  };
  if(!body.name||!body.endpoint||!body.realAPI){showToast('⚠ Fill all','error');return;}
  api('/add-api','POST',body).then(d=>{
    if(d.success){showToast('✅ API added');document.getElementById('aname').value='';document.getElementById('aep').value='';document.getElementById('aurl').value='';}
    else showToast('❌ '+d.e,'error');
  });
}

// Protection
function renderProtection(){
  api('/export-keys').then(d=>{
    const prots=Object.keys(d.protectedData||{});
    const el=document.getElementById('protectList');
    if(el)el.innerHTML='<table><thead><tr><th>Protected Value</th><th>Action</th></tr></thead><tbody>'+prots.map(p=>'<tr><td><code>'+p+'</code></td><td><button class="btn-action btn-delete" onclick="removeProtection(\''+p+'\')">🗑️</button></td></tr>').join('')+'</tbody></table>';
  });
}
function addProtection(){
  const v=document.getElementById('protVal').value.trim();
  if(!v){showToast('⚠ Required','error');return;}
  api('/add-protection','POST',{value:v}).then(()=>{showToast('✅ Added');document.getElementById('protVal').value='';renderProtection();});
}
function removeProtection(v){api('/remove-protection','POST',{value:v}).then(()=>{showToast('✅');renderProtection();});}

// Stats
function loadStats(){
  api('/stats').then(d=>{
    document.getElementById('statTotalReqs').textContent=d.totalRequests||0;
    document.getElementById('statTodayReqs').textContent=d.todayRequests||0;
    document.getElementById('statWeekReqs').textContent=d.weeklyRequests||0;
    document.getElementById('statMonthReqs').textContent=d.monthlyRequests||0;
    const th=(id,rows)=>{
      const el=document.getElementById(id);if(!el)return;
      el.innerHTML=rows.map(r=>'<tr><td>'+r.k+'</td><td><strong>'+r.v+'</strong></td></tr>').join('')||'<tr><td colspan="2" style="text-align:center;color:var(--text-muted)">No data</td></tr>';
    };
    th('topEndpointsBody',d.topEndpoints||[]);
    th('clientStatsBody',d.clientStats||[]);
    th('browserStatsBody',d.browserStats||[]);
    th('countryStatsBody',d.countryStats||[]);
    th('osStatsBody',d.osStats||[]);
  });
}

// Monitor
function loadMonitorLogs(){
  api('/monitor-logs').then(d=>{
    const el=document.getElementById('monitorLogs');
    if(!el)return;
    el.innerHTML=(d.logs||[]).slice(-100).reverse().map(l=>'<div class="log-entry"><span class="log-time">'+l.timestamp+'</span><span class="log-key">'+l.key+'</span><span class="log-endpoint">/'+l.endpoint+'</span><span class="log-ip">'+l.ip+'</span><span class="log-device">'+l.deviceIcon+' '+l.deviceType+'</span><span class="log-browser">'+l.browser+'</span></div>').join('')||'<div style="text-align:center;color:var(--text-muted);padding:20px">No logs yet</div>';
  });
}
function renderMonitor(){loadMonitorLogs();}

// Announcement/Maintenance
function saveAnnouncement(){
  api('/announcement','POST',{
    enabled:document.getElementById('announceEnabled').value==='true',
    text:document.getElementById('announceText').value,
    type:document.getElementById('announceType').value
  }).then(()=>showToast('✅ Saved'));
}
function saveMaintenance(){
  api('/maintenance','POST',{
    enabled:document.getElementById('maintEnabled').value==='true',
    message:document.getElementById('maintMessage').value
  }).then(()=>showToast('✅ Saved'));
}

// Audit/Admin Logs
function loadAudit(){api('/audit-log').then(d=>{const el=document.getElementById('auditLogs');if(el)el.innerHTML=(d.logs||[]).slice(-100).reverse().map(l=>'<div class="log-entry"><span class="log-time">'+l.timestamp+'</span><span class="log-key">'+l.user+'</span><span class="log-endpoint">'+l.action+'</span><span style="color:#aaa">'+JSON.stringify(l.details||{})+'</span></div>').join('');});}
function loadAdminLogs(){api('/admin-logs').then(d=>{const el=document.getElementById('adminLogs');if(el)el.innerHTML=(d.logs||[]).slice(-100).reverse().map(l=>'<div class="log-entry"><span class="log-time">'+l.timestamp+'</span><span class="log-key">'+l.user+'</span><span class="log-endpoint">'+l.action+'</span><span class="log-ip">'+l.ip+'</span><span class="log-browser">'+l.browser+'</span></div>').join('');});}

function switchTab(name,el){
  document.querySelectorAll('[id^="themeTab-"]').forEach(t=>t.style.display='none');
  const t=document.getElementById('themeTab-'+name);if(t)t.style.display='block';
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  if(el)el.classList.add('active');
}

// Init
loadDashboard();
setInterval(()=>{if(document.getElementById('section-dashboard').style.display!=='none')loadDashboard();},15000);

// Snowfall
const sc=document.getElementById('snowfall-canvas'),sctx=sc.getContext('2d');
function resizeCanvas(){sc.width=window.innerWidth;sc.height=window.innerHeight;}
resizeCanvas();window.addEventListener('resize',resizeCanvas);
const colors=['255,45,45','0,255,136','255,149,0','255,45,149','0,229,255','191,0,255','255,230,0','255,0,0','0,255,255'];
const snow=[];for(let i=0;i<120;i++)snow.push({x:Math.random()*sc.width,y:Math.random()*sc.height,s:Math.random()*3+1,sp:Math.random()*1+.3,w:Math.random()*.5-.25,o:Math.random()*.6+.2,c:colors[Math.floor(Math.random()*colors.length)]});
function as(){sctx.clearRect(0,0,sc.width,sc.height);snow.forEach(s=>{s.y+=s.sp;s.x+=s.w;if(s.y>sc.height){s.y=-5;s.x=Math.random()*sc.width}if(s.x<0)s.x=sc.width;if(s.x>sc.width)s.x=0;sctx.beginPath();sctx.arc(s.x,s.y,s.s,0,Math.PI*2);sctx.fillStyle='rgba('+s.c+','+s.o+')';sctx.shadowBlur=10;sctx.shadowColor='rgba('+s.c+',0.8)';sctx.fill();sctx.shadowBlur=0});requestAnimationFrame(as)}as();
</script></body></html>`;
}

// ============================================================
// 🚀 START
// ============================================================
loadFromDisk();
initHardcoded();
if(!customAPIs.length) initCustomAPIs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  🛡️  BRONX OSINT V300 ULTRA OP                   ║');
  console.log('║  ✅ All Fixes Applied                            ║');
  console.log('║  ✅ Export/Import Full Data                      ║');
  console.log('║  ✅ DDoS Persistent Config                       ║');
  console.log('║  ✅ Developer Mode + Hide Words                  ║');
  console.log('║  ✅ Format Modes (JSON/Styled/OP)                ║');
  console.log('║  ✅ Ultra Rainbow Effects                        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n🌐 Server: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}${ADMIN_PATH}`);
  console.log(`👨‍💻 Developer: ${developerConfig.globalName}\n`);
});
