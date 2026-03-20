$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..')

$checks = @(
  @{ Route = '/tablas-maestras/empresa'; File = 'app/(main)/tablas-maestras/empresa/page.jsx' },
  @{ Route = '/usuarios'; File = 'app/(main)/usuarios/page.jsx' },
  @{ Route = '/cliente'; File = 'app/(main)/cliente/page.jsx' },
  @{ Route = '/envio'; File = 'app/(main)/envio/page.jsx' },
  @{ Route = '/pallet'; File = 'app/(main)/pallet/page.jsx' },
  @{ Route = '/tipo-sensor'; File = 'app/(main)/tipo-sensor/page.jsx' },
  @{ Route = '/logs-incorrectos'; File = 'app/(main)/logs-incorrectos/page.jsx' }
)

$results = foreach ($c in $checks) {
  $full = Join-Path $repoRoot $c.File
  [PSCustomObject]@{
    Route = $c.Route
    File = $c.File
    Exists = Test-Path $full
  }
}

$results | Format-Table -AutoSize

$missing = $results | Where-Object { -not $_.Exists }
if ($missing.Count -gt 0) {
  throw "Smoke check failed. Missing route files: $($missing.Route -join ', ')"
}

Write-Output 'Smoke check passed.'
