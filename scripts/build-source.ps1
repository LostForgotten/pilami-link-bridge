$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $root
$target = Join-Path $root 'dist\Pilami-Link-Sources-v0.1.0-beta.1'
if (Test-Path $target) { Remove-Item $target -Recurse -Force }
New-Item -ItemType Directory -Path $target -Force | Out-Null

# Full source and build instructions for the distributed bridge, including the
# exact npm package content used when compiling the GPL Ableton Link addon.
$files = @('server.cjs','sea-entry.cjs','sea-config.json','package.json',
  'package-lock.json','corriger-cpp.ps1','01-installer-windows.cmd',
  '02-demarrer-windows.cmd','README.md','README-PORTABLE.md',
  'LICENSE.md','COPYING.GPLv2.md','SECURITY.md','CHANGELOG.md')
foreach ($item in $files) {
  $p=Join-Path $root $item
  if (Test-Path $p) {Copy-Item $p $target -Force}
}
Copy-Item (Join-Path $root 'scripts') (Join-Path $target 'scripts') -Recurse -Force
New-Item -ItemType Directory -Path (Join-Path $target 'vendor\node_modules\@ktamas77') -Force | Out-Null

$packages = @(
  '@ktamas77\abletonlink','ws','bindings','file-uri-to-path','node-addon-api'
)
foreach ($name in $packages) {
  $src=Join-Path $root ("node_modules\" + $name)
  if (Test-Path $src) {
    $dst=Join-Path $target ("vendor\node_modules\" + $name)
    Copy-Item $src $dst -Recurse -Force
  }
}
$buildFolder=Join-Path $target 'vendor\node_modules\@ktamas77\abletonlink\build'
if (Test-Path $buildFolder) {Remove-Item $buildFolder -Recurse -Force}
$nativeLink=Join-Path $target 'vendor\node_modules\@ktamas77\abletonlink\link'
if (-not (Test-Path $nativeLink)) {throw 'Missing bundled Ableton Link SDK source in npm package.'}
$notes=@'
# Corresponding source code — Pilami Link Bridge v0.1.0-beta.1

This archive contains Pilami source files and build scripts, as well as the
bundled source distribution of the exact @ktamas77/abletonlink npm package
used to build the Windows native addon, including the Ableton Link SDK source.

Use Node.js 24 on Windows with Python, Visual Studio Build Tools (C++ and SDK).
The build workflow is published in the GitHub repository at
.github/workflows/windows-portable.yml. The native module's source
is patched at build time by corriger-cpp.ps1 before npm rebuild.

Node.js runtime is distributed under its own license. Node.js source:
https://github.com/nodejs/node/releases
Ableton Link upstream: https://github.com/Ableton/link
Pilami repository: https://github.com/LostForgotten/pilami-link-bridge

GNU GPL version 2 text: COPYING.GPLv2.md
Original Pilami code license: LICENSE.md
'@
Set-Content -Path (Join-Path $target 'SOURCE-README.md') -Value $notes -Encoding utf8
$zip=Join-Path $root 'dist\Pilami-Link-Sources-v0.1.0-beta.1.zip'
if(Test-Path $zip){Remove-Item $zip -Force}
Compress-Archive -Path $target -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Corresponding source archive created: $zip"
