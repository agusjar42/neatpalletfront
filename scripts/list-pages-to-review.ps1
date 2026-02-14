$ErrorActionPreference = 'Stop'

$publicPrefixes = @(
  '/auth/login',
  '/auth/register',
  '/auth/forgotpassword',
  '/auth/verification',
  '/auth/newpassword',
  '/auth/access',
  '/auth/error',
  '/auth/lockscreen',
  '/landing',
  '/pages/notfound',
  '/not-found'
)

function Convert-PagePathToRoute {
  param(
    [Parameter(Mandatory = $true)][string]$AppRoot,
    [Parameter(Mandatory = $true)][string]$FullPath
  )

  $rel = $FullPath.Substring($AppRoot.Length).TrimStart('\')
  $parts = $rel -split '[\\/]+'

  $partsNoGroups = New-Object System.Collections.Generic.List[string]
  foreach ($seg in $parts) {
    if ($seg -match '^\(.*\)$') { continue }
    $partsNoGroups.Add($seg)
  }

  if ($partsNoGroups.Count -lt 1) { return $null }
  if ($partsNoGroups[$partsNoGroups.Count - 1] -notmatch '^page\.') { return $null }

  $routeParts = @()
  if ($partsNoGroups.Count -gt 1) {
    $routeParts = $partsNoGroups.GetRange(0, $partsNoGroups.Count - 1)
  }

  $pretty = foreach ($seg in $routeParts) {
    if ($seg -match '^\[\.\.\.(.+)\]$') { ':' + $Matches[1] + '*' }
    elseif ($seg -match '^\[(.+)\]$') { ':' + $Matches[1] }
    else { $seg }
  }

  if ($pretty.Count -eq 0) { return '/' }
  return '/' + ($pretty -join '/')
}

function Is-PublicRoute {
  param([Parameter(Mandatory = $true)][string]$Route)
  foreach ($prefix in $publicPrefixes) {
    if ($Route -like ($prefix + '*')) { return $true }
  }
  return $false
}

$appRoot = (Resolve-Path 'app').Path
$pages = Get-ChildItem -Path app -Recurse -File -Include page.tsx,page.ts,page.jsx,page.js

$items = foreach ($p in $pages) {
  $route = Convert-PagePathToRoute -AppRoot $appRoot -FullPath $p.FullName
  if (-not $route) { continue }
  if (Is-PublicRoute -Route $route) { continue }

  $rel = $p.FullName.Substring($appRoot.Length).TrimStart('\') -replace '\\', '/'
  [PSCustomObject]@{
    route = $route
    file  = "app/$rel"
  }
}

$items = $items | Sort-Object route

$generatedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')

Write-Output "# Pages to review (non-public)"
Write-Output ""
Write-Output "Generated: $generatedAt"
Write-Output ""
Write-Output "Excluded public prefixes:"
foreach ($p in $publicPrefixes) { Write-Output ('- ' + $p) }
Write-Output ""

$groups = $items | Group-Object -Property { 
  if ($_.route -eq '/') { 'root' } else { ($_.route.TrimStart('/') -split '/')[0] }
}

foreach ($g in ($groups | Sort-Object Name)) {
  Write-Output "## $($g.Name)"
  foreach ($it in $g.Group) {
    Write-Output ('- [ ] ' + $it.route + ' (' + $it.file + ')')
  }
  Write-Output ""
}
