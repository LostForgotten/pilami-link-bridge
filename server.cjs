/* Pilami Link bridge 0.39.24 — transport diagnostics + callback-first state.
 * Read-only: no setTempo() or setIsPlaying() calls.
 * Local WebSocket restricted to the Pilami origin.
 */
'use strict';
const { WebSocketServer } = require('ws');
const { AbletonLink } = require('@ktamas77/abletonlink');
const HOST = '127.0.0.1', PORT = 8765;
const link = new AbletonLink(120);
let callbackPlaying = null, callbackSeen = false, transportEvent = 0;
let syncEnabled = false;
let lastReport = '', lastMismatch = '', lastClockError = '', lastTransportError = '';

if (typeof link.setStartStopCallback === 'function') {
  try {
    link.setStartStopCallback(isPlaying => {
      callbackPlaying = Boolean(isPlaying);
      callbackSeen = true;
      transportEvent++;
      console.log('[LINK EVENT #' + transportEvent + '] ' + (callbackPlaying ? 'PLAY' : 'STOP') + ' (callback natif)');
    });
  } catch (e) {
    console.warn('Callback de transport indisponible :', e.message);
  }
}
link.enable(true);
console.log('Link activé. Initialisation de Start/Stop Sync…');
const startStopTimer = setTimeout(() => {
  try {
    link.enableStartStopSync(true);
    syncEnabled = typeof link.isStartStopSyncEnabled === 'function'
      ? Boolean(link.isStartStopSyncEnabled()) : true;
    console.log('Start/Stop Sync du bridge :', syncEnabled ? 'ON' : 'OFF');
  } catch (e) {
    syncEnabled = false;
    console.error('Impossible d’activer Start/Stop Sync :', e.message);
  }
}, 500);

const allowed = origin => {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    return (u.protocol === 'https:' && (u.hostname === 'pilami.fr' || u.hostname === 'www.pilami.fr')) ||
      ((u.hostname === 'localhost' || u.hostname === '127.0.0.1') && ['http:', 'https:'].includes(u.protocol));
  } catch (_) { return false; }
};
const wss = new WebSocketServer({host: HOST, port: PORT, verifyClient: info => allowed(info.origin), maxPayload: 1024});
wss.on('connection', () => console.log('Navigateur Pilami connecté.'));

let lastHeartbeat = 0;
const timer = setInterval(() => {
  let bpm, beat, phase, phase16, phase32, peers;
  try {
    bpm = Number(link.getTempo());
    beat = Number(link.getBeat());
    phase = Number(link.getPhase(4));
    phase16 = Number(link.getPhase(16));
    phase32 = Number(link.getPhase(32));
    peers = Number(link.getNumPeers());
    if (![bpm, beat, phase, phase16, phase32, peers].every(Number.isFinite)) throw new Error('Horloge Link invalide');
    lastClockError = '';
  } catch (e) {
    if (lastClockError !== e.message) {console.error('Horloge Link :', e.message); lastClockError = e.message;}
    return;
  }
  let pollPlaying = null;
  try {
    if (syncEnabled && typeof link.isPlaying === 'function') pollPlaying = Boolean(link.isPlaying());
    lastTransportError = '';
  } catch (e) {
    if (lastTransportError !== e.message) {console.warn('Lecture du transport :', e.message); lastTransportError = e.message;}
  }
  const playing = !syncEnabled || peers <= 0 ? null :
    callbackSeen ? callbackPlaying : pollPlaying;
  const mismatch = callbackSeen && pollPlaying !== null && callbackPlaying !== pollPlaying;
  const mismatchText = mismatch ? `callback=${callbackPlaying ? 'PLAY' : 'STOP'} / poll=${pollPlaying ? 'PLAY' : 'STOP'}` : '';
  if (mismatchText !== lastMismatch) {
    if (mismatch) console.warn('DIAGNOSTIC : désaccord transport — ' + mismatchText + ' (callback prioritaire)');
    else if (lastMismatch) console.log('Transport : callback et poll concordent.');
    lastMismatch = mismatchText;
  }
  const report = `${bpm.toFixed(1)} BPM | ${peers} pair(s) | ${playing === null ? 'INCONNU' : playing ? 'PLAY' : 'STOP'} | sync=${syncEnabled ? 'ON' : 'OFF'} | callback=${callbackSeen ? (callbackPlaying ? 'PLAY' : 'STOP') : 'aucun'} | poll=${pollPlaying === null ? 'indisponible' : pollPlaying ? 'PLAY' : 'STOP'}`;
  if (report !== lastReport || Date.now() - lastHeartbeat > 12000) {
    console.log('LINK : ' + report);
    lastReport = report;
    lastHeartbeat = Date.now();
  }
  const message = JSON.stringify({type:'link-state', bridgeVersion:'0.39.24', bpm, beat, phase, phase16, phase32, peers,
    playing, startStopSync:syncEnabled, transportEvent, callbackPlaying:callbackSeen ? callbackPlaying : null,
    pollPlaying});
  for (const client of wss.clients) if (client.readyState === 1 && client.bufferedAmount < 2048) client.send(message);
}, 100);

wss.on('listening', () => console.log('Pilami Link v0.39.24 : ws://' + HOST + ':' + PORT + '\nDans Live, activer LINK ET Start/Stop Sync.'));
wss.on('error', e => {console.error('WEBSOCKET :', e.message); clearInterval(timer); process.exitCode = 1;});
process.on('SIGINT', () => {
  clearInterval(timer); clearTimeout(startStopTimer);
  wss.close(); try {link.enable(false);} catch (_) {}
  process.exit(0);
});
