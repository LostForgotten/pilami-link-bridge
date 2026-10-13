'use strict';
// Node 24 SEA bootstrap. Load the deployed bridge and native addon from the
// folder containing Pilami-Link.exe. No system Node.js installation required.
const path = require('node:path');
const { createRequire } = require('node:module');
const requireFromDisk = createRequire(path.join(path.dirname(process.execPath), 'server.cjs'));
requireFromDisk('./server.cjs');
