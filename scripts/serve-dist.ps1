param(
  [string]$Root = "dist",
  [int]$Port = 5173
)

Add-Type -AssemblyName System.Net
$rootPath = Resolve-Path $Root
$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Preview URL: $prefix"

function Get-ContentType([string]$path) {
  $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  switch ($ext) {
    ".html" { return "text/html" }
    ".htm"  { return "text/html" }
    ".js"   { return "application/javascript" }
    ".css"  { return "text/css" }
    ".json" { return "application/json" }
    ".jpg"  { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".png"  { return "image/png" }
    ".gif"  { return "image/gif" }
    ".svg"  { return "image/svg+xml" }
    ".ico"  { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

Start-Job -ScriptBlock {
  param($listener,$rootPath)
  while ($listener.IsListening) {
    try {
      $ctx = $listener.GetContext()
      $urlPath = $ctx.Request.Url.AbsolutePath.TrimStart('/')
      if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = 'index.html' }
      $fsPath = Join-Path $rootPath $urlPath
      if (-not (Test-Path $fsPath)) {
        $fsPath = Join-Path $rootPath 'index.html'
      }
      $bytes = [System.IO.File]::ReadAllBytes($fsPath)
      $ctx.Response.ContentType = Get-ContentType $fsPath
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $ctx.Response.Close()
    } catch {
      # ignore
    }
  }
} -ArgumentList $listener,$rootPath | Out-Null

while ($true) { Start-Sleep -Seconds 3600 }