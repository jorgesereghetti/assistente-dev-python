Set-Location -Path $PSScriptRoot
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Iniciando o Assistente Coder (FastAPI + Uvicorn)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Diretorio de Execucao: $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""
Write-Host "Liberando porta 8000 se houver processo antigo..." -ForegroundColor Gray

$connections = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
    if ($conn.OwningProcess) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Abrindo aplicativo no navegador..." -ForegroundColor Green
try {
    Start-Process "chrome.exe" "http://localhost:8000"
} catch {
    Start-Process "http://localhost:8000"
}

uvicorn app:app --reload --port 8000

