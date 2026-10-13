'use strict';
// Run on a Windows GitHub Actions runner after constructing the portable app.
const { spawn } = require('node:child_process');
const path = require('node:path');
const { createRequire } = require('node:module');

const root = path.resolve(__dirname, '..', 'dist', 'Pilami-Link-Windows-x64');
const exe = path.join(root, 'Pilami-Link.exe');
const diskRequire = createRequire(path.join(root, 'server.cjs'));
const WebSocket = diskRequire('ws');

const proc = spawn(exe, [], {cwd: root, windowsHide:true, stdio:['ignore','pipe','pipe']});
let output='';
for(const s of [proc.stdout,proc.stderr]) s.on('data', b => {
  const v = String(b); output += v; process.stdout.write(v);
});
async function receive() {
  const deadline=Date.now()+18000;
  while(Date.now()<deadline) {
    if(proc.exitCode!==null) throw Error('Process terminated before WebSocket startup.');
    try {
      const msg = await new Promise((resolve,reject)=>{
        const socket = new WebSocket('ws://127.0.0.1:8765',{origin:'https://pilami.fr',handshakeTimeout:1500});
        const timeout=setTimeout(()=>{socket.terminate();reject(Error('No clock message'))},2500);
        socket.once('message', raw => {clearTimeout(timeout);socket.close();resolve(JSON.parse(String(raw)))});
        socket.once('error', err=>{clearTimeout(timeout);reject(err)});
      });
      if(msg.type!=='link-state' || !Number.isFinite(msg.bpm) ||
         !Number.isFinite(msg.beat) || !Number.isFinite(msg.phase)) {
        throw Error('Unexpected Link payload: '+JSON.stringify(msg));
      }
      console.log('SMOKE TEST OK:', JSON.stringify({bpm:msg.bpm,peers:msg.peers,playing:msg.playing}));
      return;
    } catch(err) {
      if(Date.now()+500>=deadline) throw err;
      await new Promise(r=>setTimeout(r,500));
    }
  }
  throw Error('Timed out starting the bridge. Output:\n'+output);
}
receive().then(()=>{proc.kill();process.exitCode=0;}).catch(err=>{console.error(err);proc.kill();process.exitCode=1;});
