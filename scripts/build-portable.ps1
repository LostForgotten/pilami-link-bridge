$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $root
$folder = Join-Path $root 'dist\Pilami-Link-Windows-x64'
New-Item -ItemType Directory -Path $folder -Force | Out-Null
Write-Host 'Creating Node 24 SEA bootstrap...'
node --experimental-sea-config sea-config.json
if ($LASTEXITCODE -ne 0) { throw 'SEA blob generation failed.' }
$nodeexe = (Get-Command node.exe).Source
$exe = Join-Path $folder 'Pilami-Link.exe'
Copy-Item $nodeexe $exe -Force
Write-Host 'Injecting SEA blob...'
& (Join-Path $root 'node_modules\.bin\postject.cmd') $exe NODE_SEA_BLOB (Join-Path $root 'sea-prep.blob') --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
if ($LASTEXITCODE -ne 0) { throw 'Postject failed.' }

Copy-Item (Join-Path $root 'server.cjs') (Join-Path $folder 'server.cjs')
$modules = Join-Path $folder 'node_modules'
New-Item -ItemType Directory -Path $modules -Force | Out-Null
$nativeDest = Join-Path $modules '@ktamas77'
New-Item -ItemType Directory -Path $nativeDest -Force | Out-Null
Copy-Item (Join-Path $root 'node_modules\@ktamas77\abletonlink') $nativeDest -Recurse -Force
foreach ($pkg in @('ws','bindings','file-uri-to-path','node-addon-api')) {
  $src=Join-Path $root ("node_modules\" + $pkg)
  if (Test-Path $src) { Copy-Item $src $modules -Recurse -Force }
}
$addon = Join-Path $nativeDest 'abletonlink\build\Release\abletonlink.node'
if (-not (Test-Path $addon)) { throw "Missing compiled native addon: $addon" }

Copy-Item (Join-Path $root 'README-PORTABLE.md') (Join-Path $folder 'LISEZ-MOI.md')
Copy-Item (Join-Path $root 'LICENSE.md') (Join-Path $folder 'LICENSE.md')
Copy-Item (Join-Path $root 'COPYING.GPLv2.md') (Join-Path $folder 'COPYING.GPLv2.md')
$licenseDir = Join-Path $folder 'licenses'
New-Item -ItemType Directory -Path $licenseDir -Force | Out-Null
$nodeLicense = Join-Path (Split-Path $nodeexe -Parent) 'LICENSE'
if (Test-Path $nodeLicense) {
  Copy-Item $nodeLicense (Join-Path $licenseDir 'NODE-LICENSE.txt')
} else {
  # LICENSE accompanies the official Node.js distribution used on the runner.
  throw "Node.js LICENSE missing near node.exe: $nodeLicense"
}
$linkLicense = Join-Path $root 'node_modules\@ktamas77\abletonlink\link\LICENSE.md'
if (Test-Path $linkLicense) {
  Copy-Item $linkLicense (Join-Path $licenseDir 'ABLETON-LINK-LICENSE.md')
}
$licenses = @{
  'abletonlink'='node_modules\@ktamas77\abletonlink'
  'ws'='node_modules\ws'
  'bindings'='node_modules\bindings'
  'file-uri-to-path'='node_modules\file-uri-to-path'
  'node-addon-api'='node_modules\node-addon-api'
}
foreach ($key in $licenses.Keys) {
  $dir=Join-Path $root $licenses[$key]
  foreach($n in @('LICENSE','LICENSE.md','LICENSE.txt','LICENCE')) {
    $file=Join-Path $dir $n
    if (Test-Path $file) { Copy-Item $file (Join-Path $licenseDir ($key+'-'+$n)); break }
  }
}
$zip = Join-Path $root 'dist\Pilami-Link-Windows-x64-preview.zip'
if(Test-Path $zip){Remove-Item $zip -Force}
Compress-Archive -Path $folder -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Created $zip"
